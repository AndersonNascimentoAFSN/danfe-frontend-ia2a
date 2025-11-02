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
        className={`max-w-[70%] rounded-lg px-4 py-2 ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-900'
        }`}
      >
        <div className="flex items-start gap-2">
          {!isUser && (
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
              AI
            </div>
          )}
          <div className="flex-1">
            <p className="text-sm whitespace-pre-wrap break-words">
              {content}
            </p>
          </div>
          {isUser && (
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white text-blue-600 flex items-center justify-center text-xs font-bold">
              U
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
