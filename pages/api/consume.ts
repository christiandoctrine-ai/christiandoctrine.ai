import { RecursiveCharacterTextSplitter } from '@langchain/community/text_splitter'; // ✅ moved
import { OpenAIEmbeddings } from '@langchain/openai'; // ✅ stays the same
import { PineconeStore } from '@langchain/community/vectorstores/pinecone'; // ✅ stays the same
import { pinecone } from '@/utils/pinecone-client'; // ✅ your file
import { CustomPDFLoader } from '@/utils/customPDFLoader'; // ✅ your file

// 🔁 Moved from `langchain/...` to `@langchain/community/...`
import { DirectoryLoader } from '@langchain/community/document_loaders/fs/directory';
import { DocxLoader } from '@langchain/community/document_loaders/fs/docx';
import { TextLoader } from '@langchain/community/document_loaders/fs/text';
import { CSVLoader } from '@langchain/community/document_loaders/fs/csv';

import { NextApiRequest, NextApiResponse } from 'next'; // ✅ stays the same
import fs from 'fs'; // ✅ stays the same
import Namespace from '@/models/Namespace'; // ✅ your file
import connectDB from '@/utils/mongoConnection'; // ✅ your file

const filePath = process.env.NODE_ENV === 'production' ? '/tmp' : 'tmp';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { namespaceName, userEmail } = req.query;

  const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME ?? '';

  try {
    await connectDB();

    // Create a new namespace with the given name and user email
    const newNamespace = new Namespace({
      userEmail: userEmail as string,
      name: namespaceName as string,
    });

    await newNamespace.save();

    // Load PDF files from the specified directory
    const directoryLoader = new DirectoryLoader(filePath, {
      '.pdf': (path) => new CustomPDFLoader(path),
      '.docx': (path) => new DocxLoader(path),
      '.txt': (path) => new TextLoader(path),
      '.csv': (path) => new CSVLoader(path),
    });

    const rawDocs = await directoryLoader.load();

    // Split the PDF documents into smaller chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1200,
      chunkOverlap: 200,
      separators: ['”'],
    });

    const docs = await textSplitter.splitDocuments(rawDocs);

    // OpenAI embeddings for the document chunks
    const embeddings = new OpenAIEmbeddings();

    // Get the Pinecone index with the given name
    const index = pinecone.Index(PINECONE_INDEX_NAME);

    // Store the document chunks in Pinecone with their embeddings
    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: index,
      namespace: namespaceName as string,
      textKey: 'text',
    });

    // Delete the PDF, DOCX and TXT files
    const filesToDelete = fs
      .readdirSync(filePath)
      .filter(
        (file) =>
          file.endsWith('.pdf') ||
          file.endsWith('.docx') ||
          file.endsWith('.txt') ||
          file.endsWith('.csv'),
      );
    filesToDelete.forEach((file) => {
      fs.unlinkSync(`${filePath}/${file}`);
    });

    res.status(200).json({ message: 'Data ingestion complete' });
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ error: 'Failed to ingest your data' });
  }
}
