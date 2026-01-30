
import { WhatsAppConfig } from '../types';

/**
 * Service to interact with either the official Meta WhatsApp Cloud API
 * OR a local WhatsApp-Web bridge for QR-based linking.
 */
export const sendWhatsAppMessage = async (
  to: string,
  text: string,
  config?: WhatsAppConfig
) => {
  // If no config provided, attempt to talk to the Local Bridge (QR Method)
  if (!config?.accessToken) {
    console.log("[Bridge] Attempting to send via Local Bridge...");
    try {
      const response = await fetch('http://localhost:3001/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, message: text })
      });
      return await response.json();
    } catch (e) {
      throw new Error("Local Bridge not found. Please run the terminal command shown in the Channels tab.");
    }
  }

  // Official Cloud API logic (kept as secondary option)
  const url = `https://graph.facebook.com/v18.0/${config.phoneNumberId}/messages`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: to.replace(/\D/g, ''),
      type: "text",
      text: { body: text }
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "Failed to send message");
  }

  return await response.json();
};

export const simulateIncomingWebhook = (from: string, text: string) => {
  console.log(`[Webhook Simulator] Incoming from ${from}: ${text}`);
};
