import { OpenAI } from 'langchain/llms/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { ConversationalRetrievalQAChain } from 'langchain/chains';
import { ChainValues } from 'langchain/schema';

const CONDENSE_PROMPT = `Condense the chat history and the follow-up question into a standalone question. 

Chat History:
{chat_history}

Follow-up input: {question}

Rephrased standalone question:`;

const QA_PROMPT = `As an AI, answer this document-based question. If uncertain or off-topic, admit it.

Context: {context}

Question: {question}

Always quote the part of the document relevant to its answer.


Answer in markdown. Be concise, follow the instructions in the question to the letter. Answer:`;

// Creates a ConversationalRetrievalQAChain object that uses an OpenAI model and a PineconeStore vectorstore
export const makeChain = (
  vectorstore: PineconeStore,
  returnSourceDocuments: boolean,
  modelTemperature: number,
  sourceNumber: number,
) => {
  const model = new OpenAI({
    temperature: modelTemperature, // increase temperature to get more creative answers
    modelName: 'gpt-3.5-turbo-16k',
    maxTokens: 2048,
  });

  // Configures the chain to use the QA_PROMPT and CONDENSE_PROMPT prompts and to not return the source documents
  const chain = CustomConversationalRetrievalQAChain.fromLLM(
    model,
    vectorstore.asRetriever(sourceNumber),
    {
      qaTemplate: QA_PROMPT,
      questionGeneratorTemplate: CONDENSE_PROMPT,
      returnSourceDocuments,
    },
  );
  return chain;
};

class CustomConversationalRetrievalQAChain extends ConversationalRetrievalQAChain {
  async _call(values: ChainValues): Promise<ChainValues> {
    // Run the original _call method
    const originalResult = await super._call(values);

    // Ensure originalResult is an array
    const resultArray = Array.isArray(originalResult)
      ? originalResult
      : [originalResult];

    // Check if the first document is "The Bible"
    if (
      !(
        resultArray[0] &&
        resultArray[0].metadata &&
        resultArray[0].metadata.source === 'PDF/web bible.pdf'
      )
    ) {
      const bibleDocument = await this.retriever.getRelevantDocuments(
        'From the "web bible.pdf" ' + values.question,
        // + ' get it from "web bible.pdf"',
      );

      function reorderObjects(list: any) {
        const withBible = list.find(
          (obj: any) =>
            obj.metadata && obj.metadata.source === 'PDF/web bible.pdf',
        );
        const withoutBible = list.filter(
          (obj: any) =>
            !obj.metadata || obj.metadata.source !== 'PDF/web bible.pdf',
        );

        return [withBible].concat(withoutBible);
      }

      resultArray.unshift(reorderObjects(bibleDocument).slice(0, 2));
    }

    const filteredResultArray = resultArray.filter(
      (doc, index) =>
        index === 0 ||
        !(doc && doc.metadata && doc.metadata.source === 'PDF/web bible.pdf'),
    );

    return filteredResultArray;
  }
}
