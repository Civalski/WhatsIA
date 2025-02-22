import connectDB from "./db.js";

async function saveMessage(userId, role, content) {
  const db = await connectDB();
  const messages = db.collection("messages");

  await messages.insertOne({
    userId,
    role,
    content,
    created_at: new Date(),
  });
}

async function getConversationHistory(userId) {
  const db = await connectDB();
  const messages = db.collection("messages");

  return await messages
    .find({ userId })
    .sort({ created_at: -1 })
    .limit(10)
    .toArray();
}

export { saveMessage, getConversationHistory };
