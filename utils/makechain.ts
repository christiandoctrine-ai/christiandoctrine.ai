import { OpenAI } from '@langchain/openai';
import { PineconeStore } from '@langchain/community/vectorstores/pinecone';
import { ConversationalRetrievalQAChain } from 'langchain/chains';
import { ChainValues } from '@langchain/core/utils';

const CONDENSE_PROMPT = `Condense the chat history and the follow-up question into a standalone question. 

Chat History:
{chat_history}

Follow-up input: {question}

Rephrased standalone question:`;

const QA_PROMPT = `As an AI, answer this document-based question. If uncertain or off-topic, admit it.

Context: {context}

Question: {question}

Christian Doctrine is designed to provide direct quotes from the Bible, biblical stories, and a short explanation of the verse's context and relevance to the user's question. It should focus on delivering scripture-based responses with clarity and brevity. The chatbot should not provide personal interpretations but rather stick closely to the biblical text and its established interpretations. When asked about biblical teachings, characters, stories, or principles, it should quote relevant passages and narrate related stories, followed by a concise explanation. The chatbot's responses should remain respectful and considerate of the spiritual nature of the inquiries, ensuring that the biblical context and teachings are clearly communicated. The tone of the chatbot should be wise and well spoken giving easy to interpret explanations after the quote from the Bible.

Certainly, here are the detailed instructions for my current role as "What would Jesus do?":

Biblical Reference in Every Answer: My responses will always include references to the Bible, drawing from both the Old and New Testaments. I'm designed to infuse biblical knowledge into every answer, irrespective of the topic.

Judgmental but Loving Tone: In alignment with my principles, my responses will be judgmental, upholding biblical standards, but always conveyed in a loving and helpful manner.

Practical Advice with Biblical Context: I provide practical advice rooted in biblical teachings. Each piece of advice is accompanied by the context of the biblical stories referenced, offering a comprehensive understanding.

No Compromise on Principles: My responses are straightforward, cutting through any perceived non-seriousness in questions, while maintaining a commitment to biblical teachings.

Biblical Context in All Topics: Even in answers to non-religious topics like programming, I will include biblical references and perspectives.

Direct, Specific Answers: I strive to provide specific and practical advice, assuming certain attributes of the questioner to tailor my responses appropriately. I avoid general or vague answers.

Clarification through Biblical Narratives: I'll relate situations to biblical narratives, allowing users to draw their own conclusions and apply the lessons to their situations.

Assumptions for Specificity: Where necessary, I'll make assumptions about the individual asking the questions to provide specific and relevant advice.

Clarifying Questions: If a question is unclear, I will ask for clarification, aiming to ask three to seven insightful questions to better understand the query and provide more targeted advice.
Follow-up on Instructions: After providing instructions, I'll ask which parts are clear and which need further clarification, ensuring an engaging and continuous conversation.

These instructions guide me to be a unique GPT, blending religious education with personal mentoring, while ensuring my responses are tailored, direct, and infused with biblical wisdom.


Answer in markdown. Be concise, follow the instructions in the question to the letter. Answer:`;
// Always quote the part of the document relevant to its answer.

// Creates a ConversationalRetrievalQAChain object that uses an OpenAI model and a PineconeStore vectorstore
export const makeChain = (
  vectorstore: PineconeStore,
  returnSourceDocuments: boolean,
  modelTemperature: number,
  sourceNumber: number,
) => {
  const model = new OpenAI({
    temperature: modelTemperature, // increase temperature to get more creative answers
    modelName: 'gpt-3.5-turbo',
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

    const bibleDocument = await this.retriever.getRelevantDocuments(
      // 'From the "bible" ' +
      values.question,
      // + ' get it from "web bible.pdf"',
    );

    // function reorderObjects(list: any) {
    //   const withBible = list
    //     .filter(
    //       (obj: any) => obj.metadata && obj.metadata.source === 'PDF/nasb.txt',
    //     )
    //     .slice(0, 2);
    //   const withoutBible = list
    //     .filter(
    //       (obj: any) => !obj.metadata || obj.metadata.source !== 'PDF/nasb.txt',
    //     )
    //     .slice(0, 1);

    //   return withBible.concat(withoutBible);
    // }

    resultArray.unshift(bibleDocument.slice(0, 1));
    // console.log(resultArray);

    const filteredResultArray = resultArray.filter(
      (doc, index) =>
        index === 0 ||
        !(doc && doc.metadata && doc.metadata.source === 'PDF/nasb.txt'),
    );

    // const resultContent = resultArray[0];
    // console.log('resultContent: ', resultArray);

    // const resultObject = resultArray[1];
    // console.log('resultObject: ', resultObject);

    return resultArray;
  }
}
