import { OpenAI } from 'langchain/llms/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { ConversationalRetrievalQAChain } from 'langchain/chains';

const CONDENSE_PROMPT = `Condense the chat history and the follow-up question into a standalone question. 

Chat History:
{chat_history}

Follow-up input: {question}

Rephrased standalone question:`;

const QA_PROMPT = `As an AI, answer this document-based question. If uncertain or off-topic, admit it.

Context: {context}

Question: {question}

Always quote the part of the document relevant to its answer.

Never mention the word document when quoting something.

Make sure to mention that your're showing verses when asked about that as Here are some verses about the asked topic.

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
    maxTokens: 4096,
  });

  // Configures the chain to use the QA_PROMPT and CONDENSE_PROMPT prompts and to not return the source documents
  const chain = ConversationalRetrievalQAChain.fromLLM(
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
