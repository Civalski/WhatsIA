import dotenv from 'dotenv';
dotenv.config();

const config = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  MONGO_URI: process.env.MONGO_URI,
};

export default config;