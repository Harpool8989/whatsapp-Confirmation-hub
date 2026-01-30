
export enum OrderStatus {
  NEW = 'NEW',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELED = 'CANCELED'
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  product: string;
  price: number;
  status: OrderStatus;
  country: string;
  createdAt: string;
}

export interface Message {
  id: string;
  text: string;
  sender: 'customer' | 'bot';
  timestamp: string;
}

export interface WhatsAppConfig {
  accessToken: string;
  phoneNumberId: string;
  businessAccountId: string;
  verifyToken: string;
}

export interface ConversationState {
  currentStep: 'greeting' | 'collecting_name' | 'collecting_address' | 'collecting_phone' | 'confirming_order' | 'idle';
  tempOrder: Partial<Order>;
}

export interface ChatbotResponse {
  intent: 'price' | 'order' | 'confirmation' | 'cancel' | 'question' | 'other';
  message: string;
  extractedData?: Partial<Order>;
  nextStep?: ConversationState['currentStep'];
}
