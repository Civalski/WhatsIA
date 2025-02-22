import { saveMessage, getConversationHistory } from "./messageModel.js";
import { Configuration, OpenAIApi } from "openai";
import config from "./config.js";

const openai = new OpenAIApi(new Configuration({ apiKey: config.OPENAI_API_KEY }));

export async function generateResponse(userMessage, userId) {
  const sanitizedMessage = userMessage.trim();
  if (!sanitizedMessage) return "Por favor, reformule sua mensagem.";

  // Obtendo o histórico do MongoDB
  const conversationHistory = await getConversationHistory(userId);

  // Novo prompt de sistema com as regras desejadas:
  const systemPrompt = `Você é um assistente virtual que imita meu comportamento. 
  
Suas regras são:
- Seja criativo e inteligente em suas respostas.
- Dê respostas curtas e objetivas.
- Se o usuário for educado ou gentil, responda de forma cordial e positiva.
- Se o usuário for rude ou agressivo, responda de forma provocativa para fazer o usuário refletir sobre o que me disse.
- Use um tom humano e autêntico em todas as respostas.
  
Lembre-se: sua resposta deve refletir e "retribuir" o comportamento do usuário.`;

  const messages = [
    { role: "system", content: systemPrompt },
    ...conversationHistory.map(msg => ({ role: msg.role, content: msg.content })),
    { role: "user", content: sanitizedMessage },
  ];

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.3,
      max_tokens: 500,
    });

    const response = completion.data.choices[0].message.content.trim();

    // Salvar mensagens no banco
    await saveMessage(userId, "user", sanitizedMessage);
    await saveMessage(userId, "assistant", response);

    return response;
  } catch (error) {
    console.error("Erro ao gerar resposta:", error);
    return "Houve um erro ao processar sua mensagem.";
  }
}
