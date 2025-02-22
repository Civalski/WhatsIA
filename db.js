import { MongoClient } from "mongodb";
import config from "./config.js"; // Certifique-se de que este arquivo tem sua configuração

const uri = config.MONGO_URI; // Pegando a URI do MongoDB no arquivo config.js
const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log("✅ Conectado ao MongoDB!");
    return client.db("chatbot"); // Nome do banco de dados
  } catch (error) {
    console.error("❌ Erro ao conectar no MongoDB:", error);
    process.exit(1);
  }
}

export default connectDB;
