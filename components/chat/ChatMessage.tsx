import React from 'react';
import { UIMessage } from 'ai';

interface ChatMessageProps {
  message: UIMessage;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  // Extrai o conteúdo da mensagem
  const getMessageContent = () => {
    if (message.parts && message.parts.length > 0) {
      return message.parts
        .filter(part => part.type === 'text')
        .map(part => part.text)
        .join('');
    }
    return '';
  };

  const content = getMessageContent();

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-md ${
          isUser
            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
            : 'bg-white text-gray-900 border-2 border-gray-100'
        }`}
      >
        <div className="flex items-start gap-3">
          {!isUser && (
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-lg">
              🤖
            </div>
          )}
          <div className="flex-1">
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              {content}
            </p>
          </div>
          {isUser && (
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white text-blue-600 flex items-center justify-center text-xs font-bold shadow-lg border-2 border-blue-200">
              👤
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
