import React, { useState } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I'm the Apollo ICU AI Assistant. I can help explain mortality risk, length of stay, or answer general ICU questions.", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const newMessages = [...messages, { text: input, sender: 'user' }];
    setMessages(newMessages);
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      let botReply = "I'm sorry, I didn't understand that.";
      const lowerInput = input.toLowerCase();
      
      if (lowerInput.includes('mortality') || lowerInput.includes('risk')) {
        botReply = "The mortality risk is calculated using our XGBoost AI model, analyzing 47 clinical features including vital signs, lab results, and patient history to predict the probability of survival.";
      } else if (lowerInput.includes('los') || lowerInput.includes('length of stay')) {
        botReply = "Length of Stay (LOS) is predicted in days. It helps hospital staff manage ICU bed occupancy and resources effectively. A critical patient might have a predicted stay of over 7 days.";
      } else if (lowerInput.includes('shap') || lowerInput.includes('explain')) {
        botReply = "SHAP (SHapley Additive exPlanations) values show how much each clinical feature contributed to the final prediction, providing transparency into the AI's decision-making process.";
      } else {
        botReply = "For detailed clinical interpretations, please refer to the dashboard analytics or consult with the attending physician. Is there anything else about the AI system you'd like to know?";
      }

      setMessages([...newMessages, { text: botReply, sender: 'bot' }]);
    }, 1000);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-20 right-6 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50 flex flex-col h-[400px]"
          >
            <div className="bg-apollo-blue p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Bot size={20} />
                <span className="font-semibold">Apollo AI Assistant</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-blue-100 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-apollo-blue text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-bl-none'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..." 
                className="flex-1 px-3 py-2 bg-slate-50 border border-gray-200 rounded-full focus:outline-none focus:border-apollo-blue text-sm"
              />
              <button type="submit" className="p-2 bg-apollo-blue text-white rounded-full hover:bg-blue-700 transition-colors">
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-apollo-blue text-white rounded-full shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-50"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </>
  );
};

export default Chatbot;
