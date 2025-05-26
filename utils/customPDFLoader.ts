import { Document } from '@langchain/core/documents';
import { readFile } from 'fs/promises';
import { BaseDocumentLoader } from '@langchain/community/document_loaders';
import * as fs from 'fs/promises';
import path from 'path';
import { TextSplitter } from 'langchain/text_splitter';

export abstract class BufferLoader extends BaseDocumentLoader {
  constructor(public filePathOrBlob: string | Blob) {
    super();
  }

  protected abstract parse(
    raw: Buffer,
    metadata: Document['metadata'],
  ): Promise<Document[]>;

  public async load(): Promise<Document[]> {
    let buffer: Buffer;
    let metadata: Record<string, string>;
    if (typeof this.filePathOrBlob === 'string') {
      buffer = await readFile(this.filePathOrBlob);
      metadata = { source: this.filePathOrBlob };
    } else {
      buffer = await this.filePathOrBlob
        .arrayBuffer()
        .then((ab) => Buffer.from(ab));
      metadata = { source: 'blob', blobType: this.filePathOrBlob.type };
    }
    return this.parse(buffer, metadata);
  }

  public async loadAndSplit(splitter: TextSplitter): Promise<Document[]> {
    const docs = await this.load();
    return splitter.splitDocuments(docs);
  }
}

export class CustomPDFLoader extends BufferLoader {
  public async parse(
    raw: Buffer,
    metadata: Document['metadata'],
  ): Promise<Document[]> {
    const { pdf } = await PDFLoaderImports();
    const parsed = await pdf(raw);
    const year = parsed?.info?.CreationDate?.substring(2, 6);

    let bibleDocument = new Document({
      pageContent: parsed.text,
      metadata: {
        ...metadata,
        pdf_numpages: parsed.numpages,
        author: parsed?.info?.Title,
        year: year,
        title: parsed?.info?.Author,
        page: parsed?.numpages,
      },
    });

    return [bibleDocument];
  }
}

async function PDFLoaderImports() {
  try {
    const { default: pdf } = await import('pdf-parse/lib/pdf-parse.js');
    return { pdf };
  } catch (e) {
    console.error(e);
    throw new Error(
      'Failed to load pdf-parse. Please install it with eg. `npm install pdf-parse`.',
    );
  }
}