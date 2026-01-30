
import { GoogleGenAI, Type } from "@google/genai";
import { ChatbotResponse, ConversationState } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_INSTRUCTION = `
You are a professional WhatsApp COD (Cash On Delivery) Chatbot for an e-commerce store.
Your goal is to handle customer inquiries and collect order information.
You support Arabic, Darija, and English.

Available Product: "Premium Wireless Headphones" - Price: $49.00

Workflow:
1. Greeting: Welcome the user and ask how you can help.
2. Order Flow: If they want to buy, collect: Name, Address, and Phone Number.
3. Confirmation: After collecting all data, ask them to confirm the order.

Your response MUST be in JSON format.
Include:
- intent: The detected user intent.
- message: The natural language reply to the user (in the user's language).
- extractedData: Any order info (customerName, address, phone) found in the current message.
- nextStep: Suggest the next step in the conversation flow.
`;

export const processChatMessage = async (
  userInput: string,
  currentState: ConversationState
): Promise<ChatbotResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        Context: User is at step "${currentState.currentStep}".
        Current Temp Order Data: ${JSON.stringify(currentState.tempOrder)}.
        User Message: "${userInput}"
      `,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            intent: { type: Type.STRING, enum: ['price', 'order', 'confirmation', 'cancel', 'question', 'other'] },
            message: { type: Type.STRING },
            extractedData: {
              type: Type.OBJECT,
              properties: {
                customerName: { type: Type.STRING },
                address: { type: Type.STRING },
                phone: { type: Type.STRING }
              }
            },
            nextStep: { type: Type.STRING, enum: ['greeting', 'collecting_name', 'collecting_address', 'collecting_phone', 'confirming_order', 'idle'] }
          },
          required: ["intent", "message"]
        }
      }
    });

    const result = JSON.parse(response.text);
    return result as ChatbotResponse;
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      intent: 'other',
      message: "I'm sorry, I'm having trouble processing that right now. Could you please try again?",
      nextStep: currentState.currentStep
    };
  }
};
