'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout';
import { Button } from '@/components/ui';

export default function MCPPage() {
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [lastCheck, setLastCheck] = useState<Date>(new Date());

  // Verifica o status do servidor ao carregar a página
  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await fetch('/api/mcp/status');
        const data = await response.json();
        setServerStatus(data.status === 'online' ? 'online' : 'offline');
        setLastCheck(new Date());
      } catch (error) {
        console.error('Falha ao verificar status do servidor MCP:', error);
        setServerStatus('offline');
        setLastCheck(new Date());
      }
    };

    checkServer();
    
    // Verifica novamente a cada 30 segundos
    const interval = setInterval(checkServer, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleRetryConnection = async () => {
    setServerStatus('checking');
    try {
      const response = await fetch('/api/mcp/status');
      const data = await response.json();
      setServerStatus(data.status === 'online' ? 'online' : 'offline');
      setLastCheck(new Date());
    } catch (error) {
      console.error('Falha ao tentar reconectar:', error);
      setServerStatus('offline');
      setLastCheck(new Date());
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar logo="DANFE IA" />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 mb-4 bg-purple-100 rounded-full">
            <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
            Status do Servidor MCP
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Monitoramento em tempo real do Model Context Protocol Server
          </p>
        </div>

        {/* Status Card - Destaque Principal */}
        <div className="relative mb-8">
          {/* Decorative background */}
          <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          
          <div className="relative bg-white rounded-2xl shadow-2xl border-2 border-gray-100 overflow-hidden">
            {/* Status Header */}
            <div className={`px-8 py-6 ${
              serverStatus === 'online' 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                : serverStatus === 'offline'
                ? 'bg-gradient-to-r from-red-500 to-rose-600'
                : 'bg-gradient-to-r from-yellow-500 to-amber-600'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    serverStatus === 'online'
                      ? 'bg-white/20 animate-pulse'
                      : 'bg-white/20'
                  }`}>
                    {serverStatus === 'online' ? (
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : serverStatus === 'offline' ? (
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    ) : (
                      <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-1">
                      {serverStatus === 'online' ? '✅ Online' : serverStatus === 'offline' ? '❌ Offline' : '⏳ Verificando...'}
                    </h2>
                    <p className="text-white/90 text-sm">
                      Última verificação: {formatTime(lastCheck)}
                    </p>
                  </div>
                </div>
                {serverStatus === 'offline' && (
                  <Button
                    onClick={handleRetryConnection}
                    className="bg-white text-red-600 hover:bg-red-50 shadow-lg"
                  >
                    🔄 Tentar Novamente
                  </Button>
                )}
              </div>
            </div>

            {/* Status Details */}
            <div className="px-8 py-6">
              {serverStatus === 'online' ? (
                <>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      ℹ️ Informações do Servidor
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <p className="text-xs text-green-600 font-medium mb-1">ENDPOINT</p>
                        <p className="text-sm text-green-900 font-mono break-all">
                          /api/mcp/*
                        </p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <p className="text-xs text-green-600 font-medium mb-1">PROTOCOLO</p>
                        <p className="text-sm text-green-900 font-semibold">
                          JSON-RPC 2.0
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                    <h3 className="text-md font-semibold text-blue-900 mb-3 flex items-center gap-2">
                      <span>�</span> Como Usar
                    </h3>
                    <p className="text-sm text-blue-800 mb-3">
                      O servidor MCP está funcionando perfeitamente! Você pode usar o assistente DANFE na página inicial.
                    </p>
                    <Link href="/">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                        Ir para o Chat →
                      </Button>
                    </Link>
                  </div>
                </>
              ) : serverStatus === 'offline' ? (
                <div className="bg-red-50 rounded-xl p-6 border border-red-200 text-center">
                  <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <h3 className="text-xl font-bold text-red-900 mb-2">
                    Servidor Indisponível
                  </h3>
                  <p className="text-sm text-red-700 mb-4 max-w-md mx-auto">
                    O servidor MCP está offline ou inacessível no momento. Por favor, verifique sua conexão ou tente novamente mais tarde.
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600 mb-4"></div>
                  <p className="text-gray-600">Verificando status do servidor...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Footer */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            🔐 Sobre o Model Context Protocol (MCP)
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            O MCP é um protocolo aberto que permite integração perfeita entre modelos de IA e ferramentas externas. 
            Este servidor fornece acesso aos dados das DANFEs de forma segura e eficiente.
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Atualização automática a cada 30 segundos</span>
          </div>
        </div>
      </main>
    </div>
  );
}
