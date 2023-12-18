import { pinecone } from '@/utils/pinecone-client';
import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/utils/mongoConnection';
import Namespace from '@/models/Namespace';
import Message from '@/models/Message';
import { ChatModel, IChat } from '@/models/ChatModel';
import mongoose from 'mongoose';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { userEmail } = req.body as {
    userEmail: string;
  };
  const ChatModelTyped = ChatModel as mongoose.Model<IChat>;

  //   const targetIndex = process.env.PINECONE_INDEX_NAME ?? '';

  try {
    await connectDB();
    const deleteNamespace = await Namespace.findOneAndDelete({ userEmail });
    const deleteMessages = await Message.deleteMany({ userEmail });
    const deleteChats = await ChatModelTyped.deleteMany({ userEmail });

    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ error: 'Failed to delete the User.' });
  }
}
