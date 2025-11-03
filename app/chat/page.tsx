'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout';
import { Chat } from '@/components/chat';

function ChatContent() {
  const searchParams = useSearchParams();
  const chave = searchParams.get('chave');

  useEffect(() => {
    if (chave) {
      // Adiciona um pequeno delay para garantir que o chat está montado
      const timer = setTimeout(() => {
        const input = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (input) {
          input.value = chave;
          input.focus();
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [chave]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar logo="DANFE IA" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
            💬 Chat DANFE
          </h1>
          <p className="text-gray-600 text-lg">
            Converse com o assistente inteligente para consultar informações de DANFEs
          </p>
        </div>

        {/* Chat Component */}
        <div className="relative">
          {/* Decorative elements */}
          <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
          
          <div className="relative">
            <Chat
              title="💬 Assistente DANFE"
              welcomeMessage="Olá! Sou seu assistente especializado em DANFE. Como posso ajudá-lo hoje?"
            />
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            💡 Como usar
          </h3>
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              <strong>1.</strong> Digite ou cole a chave de acesso da DANFE (44 dígitos numéricos)
            </p>
            <p>
              <strong>2.</strong> Você pode perguntar de forma natural, por exemplo:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1 text-gray-500">
              <li>&quot;Busque a DANFE 12345678901234567890123456789012345678901234&quot;</li>
              <li>&quot;Consulte informações da chave 12345...&quot;</li>
              <li>&quot;Quero ver os dados da DANFE 12345...&quot;</li>
            </ul>
            <p>
              <strong>3.</strong> Aguarde enquanto a IA processa e retorna as informações formatadas
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando chat...</p>
        </div>
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}
