import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Bot, Send, Trash2, ShieldCheck, User as UserIcon } from 'lucide-react';
import { api } from '../services/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  message: string;
  created_at: string;
}

const QUICK_QUESTIONS = [
  'What is digital arrest scam?',
  'I lost money in a scam, what to do?',
  'How to protect my OTP?',
  'Is this APK file safe to install?',
  'How to create a strong password?',
];

export const ChatbotPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadHistory = async () => {
    try {
      const res = await api.get<ChatMessage[]>('/chatbot/history');
      setMessages(res.data);
    } catch {
      // Start fresh
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    setInputText('');
    setIsSending(true);

    // Optimistic user bubble
    const tempUser: ChatMessage = { id: Date.now(), role: 'user', message: text, created_at: new Date().toISOString() };
    setMessages(prev => [...prev, tempUser]);

    try {
      const res = await api.post<ChatMessage>('/chatbot/message', { message: text });
      setMessages(prev => [...prev, res.data]);
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now() + 1, role: 'assistant',
        message: 'I am temporarily unavailable. Please try again in a moment.',
        created_at: new Date().toISOString()
      }]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 h-[calc(100vh-10rem)] flex flex-col">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Bot className="h-7 w-7 text-blue-400" /> AI Cybersecurity Assistant
          </h1>
          <p className="text-xs text-slate-400 mt-1">24/7 expert guidance on cyber threats, scam recovery, and digital security.</p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setMessages([])} leftIcon={<Trash2 className="h-4 w-4" />}>
          Clear Chat
        </Button>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.length === 0 && (
          <div className="text-center py-12 space-y-4">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shadow-cyber-glow">
              <Bot className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="text-base font-bold text-white">AntiHack AI Cyber Assistant</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">Ask anything about cyber fraud, scam prevention, password security, or how to recover from an attack.</p>
            <div className="flex flex-wrap gap-2 justify-center pt-2">
              {QUICK_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  className="text-xs px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:border-blue-500/50 hover:text-blue-400 transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`h-8 w-8 shrink-0 rounded-xl flex items-center justify-center ${
              msg.role === 'assistant'
                ? 'bg-blue-600/20 border border-blue-500/30 text-blue-400'
                : 'bg-slate-800 border border-slate-700 text-slate-400'
            }`}>
              {msg.role === 'assistant' ? <Bot className="h-4 w-4" /> : <UserIcon className="h-4 w-4" />}
            </div>
            <div className={`max-w-[75%] p-3.5 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'assistant'
                ? 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                : 'bg-blue-600 text-white rounded-tr-none'
            }`}>
              {msg.message}
            </div>
          </motion.div>
        ))}

        {isSending && (
          <div className="flex gap-3">
            <div className="h-8 w-8 shrink-0 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
              <Bot className="h-4 w-4 text-blue-400" />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none p-3.5 flex gap-1 items-center">
              {[0, 1, 2].map(i => (
                <span key={i} className="h-2 w-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="flex gap-3 border-t border-slate-800 pt-4">
        <input
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(inputText)}
          placeholder="Ask about phishing, OTP scams, password security..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
        <Button
          variant="primary"
          size="md"
          onClick={() => sendMessage(inputText)}
          disabled={!inputText.trim() || isSending}
          leftIcon={<Send className="h-4 w-4" />}
        >
          Send
        </Button>
      </div>
    </div>
  );
};
