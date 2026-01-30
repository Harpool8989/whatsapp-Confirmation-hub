
import React, { useState, useRef, useEffect } from 'react';
import { Message, ConversationState } from '../types';
import { processChatMessage } from '../services/geminiService';

interface ChatSimulatorProps {
  onOrderComplete: (orderData: any) => void;
}

const ChatSimulator: React.FC<ChatSimulatorProps> = ({ onOrderComplete }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hi! I saw your ad for the headphones. How much are they?', sender: 'customer', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [convState, setConvState] = useState<ConversationState>({
    currentStep: 'greeting',
    tempOrder: { product: 'Premium Wireless Headphones', price: 49.00 }
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'customer',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Call Gemini
    const result = await processChatMessage(inputText, convState);
    
    // Update State
    const updatedTempOrder = { ...convState.tempOrder, ...result.extractedData };
    const nextStep = result.nextStep || convState.currentStep;

    setConvState({
      currentStep: nextStep,
      tempOrder: updatedTempOrder
    });

    // Check if order confirmed
    if (result.intent === 'confirmation' && updatedTempOrder.customerName && updatedTempOrder.address && updatedTempOrder.phone) {
        onOrderComplete(updatedTempOrder);
    }

    setIsTyping(false);
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: result.message,
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, botMessage]);
  };

  return (
    <div className="bg-slate-100 rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col h-[600px] w-full max-w-md mx-auto">
      {/* Header */}
      <div className="bg-white p-4 flex items-center gap-3 border-b border-slate-200">
        <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-black border-2 border-white shadow-sm">
          <i className="fa-brands fa-whatsapp text-xl"></i>
        </div>
        <div>
          <h4 className="font-bold text-slate-900 text-sm">COD Assistant</h4>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Online</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.sender === 'customer' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm relative ${
              m.sender === 'customer' 
              ? 'bg-yellow-400 text-black rounded-tr-none' 
              : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
            }`}>
              {m.text}
              <div className={`text-[10px] mt-1 text-right opacity-60 font-medium`}>
                {m.timestamp}
                {m.sender === 'customer' && <i className="fa-solid fa-check-double ml-1 text-blue-600"></i>}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white p-4 border-t border-slate-200">
        <div className="flex items-center gap-2">
          <button className="text-slate-400 hover:text-slate-600">
            <i className="fa-solid fa-plus text-lg"></i>
          </button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={!inputText.trim() || isTyping}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              !inputText.trim() ? 'bg-slate-100 text-slate-400' : 'bg-yellow-400 text-black shadow-md hover:scale-105 active:scale-95'
            }`}
          >
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSimulator;
