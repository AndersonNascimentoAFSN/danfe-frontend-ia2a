'use client';

import React, { useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { H3 } from '../ui/Typography';

interface ChatProps {
  className?: string;
  title?: string;
  welcomeMessage?: string;
}

export const Chat: React.FC<ChatProps> = ({
  className = '',
  title = '💬 Assistente DANFE',
  welcomeMessage = 'Olá! Sou seu assistente especializado em DANFE. Como posso ajudá-lo hoje?',
}) => {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isLoading = status === 'streaming' || status === 'submitted';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const onSubmit = (message: string) => {
    if (message.trim()) {
      sendMessage({ text: message });
    }
  };

  return (
    <div className={`flex flex-col h-[700px] bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-gray-100 ${className}`}>
      {/* Header - Mais Destacado */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 text-white px-6 py-5 shadow-lg">
        <H3 className="text-white text-xl font-bold">{title}</H3>
        <p className="text-blue-100 text-xs mt-1">Consulte DANFEs de forma inteligente</p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500 max-w-md">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <p className="text-xl font-semibold text-gray-700 mb-3">{welcomeMessage}</p>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Como usar:</strong>
                </p>
                <p className="text-xs text-gray-500">
                  Digite a chave de acesso da DANFE (44 dígitos numéricos) e pressione Enter para consultar as informações.
                </p>
              </div>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {isLoading && messages.length > 0 && (
          <div className="flex justify-start mb-4">
            <div className="bg-white rounded-lg px-5 py-3 shadow-md border border-gray-200">
              <div className="flex space-x-2 items-center">
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0ms]" />
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce [animation-delay:150ms]" />
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce [animation-delay:300ms]" />
                <span className="text-xs text-gray-500 ml-2">Processando...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput
        onSubmit={onSubmit}
        isLoading={isLoading}
        placeholder="Digite sua mensagem ou chave de acesso da DANFE..."
      />
    </div>
  );
};
