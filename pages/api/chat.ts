import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { makeChain } from '@/utils/makechain';
import { pinecone } from '@/utils/pinecone-client';
import connectDB from '@/utils/mongoConnection';
import Message from '@/models/Message';
import { SourceDoc } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const {
    question,
    history,
    chatId,
    userEmail,
    returnSourceDocuments,
    modelTemperature,
    sourceNumber,
  } = req.body;
  const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME ?? '';

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!question) {
    return res.status(400).json({ message: 'No question in the request' });
  }

  await connectDB();

  const sanitizedQuestion = question.trim().replaceAll('\n', ' ');

  try {
    const index = pinecone.Index(PINECONE_INDEX_NAME);

    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({}),
      {
        pineconeIndex: index,
        textKey: 'text',
        // namespace: 'namespace',
      },
    );

    const userMessage = new Message({
      sender: 'user',
      content: sanitizedQuestion,
      chatId: chatId,
      namespace: 'namespace',
      userEmail: userEmail,
    });

    await userMessage.save();

    const chain = makeChain(
      vectorStore,
      returnSourceDocuments,
      modelTemperature,
      sourceNumber,
    );
    const response = await chain.call({
      question: sanitizedQuestion,
      chat_history: history || [],
    });

    // console.log('RESPONSE TEXT: ', response);
    // console.log('RESPONSE SOURCES: ', response[1].sourceDocuments);

    // const botMessage = new Message({
    //   sender: 'bot',
    //   content: response[1].text.toString(),
    //   chatId: chatId,
    //   namespace: 'namespace',
    //   userEmail: userEmail,
    //   sourceDocs: response[0]
    //     ? response[0].map((doc: SourceDoc) => ({
    //         pageContent: doc?.pageContent,
    //         metadata: { source: doc?.metadata?.source },
    //       }))
    //     : [],
    // });

    // await botMessage.save();

    res.status(200).json({
      text: response.resultObject.text,
      sourceDocuments: response.resultContent,
    });
  } catch (error: any) {
    console.log('error', error);
    res.status(500).json({ error: error.message || 'Something went wrong' });
  }
}
