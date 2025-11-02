'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout';
import { H1, H2, Paragraph, Button } from '@/components/ui';

const MCP_SERVER_URL = process.env.NEXT_PUBLIC_MCP_SERVER_URL;

export default function MCPPage() {
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  // Verifica o status do servidor ao carregar a página
  useEffect(() => {
    const checkServer = async () => {
      try {
        // Usa a rota API proxy para evitar CORS
        const response = await fetch('/api/mcp/status');
        const data = await response.json();
        setServerStatus(data.status === 'online' ? 'online' : 'offline');
      } catch (error) {
        console.error('Failed to check MCP server status:', error);
        setServerStatus('offline');
      }
    };

    checkServer();
    
    // Recheck a cada 30 segundos
    const interval = setInterval(checkServer, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleRetryConnection = async () => {
    setServerStatus('checking');
    try {
      const response = await fetch('/api/mcp/status');
      const data = await response.json();
      setServerStatus(data.status === 'online' ? 'online' : 'offline');
    } catch (error) {
      console.error('Failed to retry connection:', error);
      setServerStatus('offline');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar logo="DANFE IA" />

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <H1 className="text-white mb-4">MCP Explorer</H1>
          <Paragraph className="text-blue-100 text-lg max-w-3xl mb-6">
            Explore and interact with the Model Context Protocol (MCP) server. 
            Test tools, browse resources, and integrate AI capabilities into your application.
          </Paragraph>
          
          {/* Server Status */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 inline-flex">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  serverStatus === 'online'
                    ? 'bg-green-400 animate-pulse'
                    : serverStatus === 'offline'
                    ? 'bg-red-400'
                    : 'bg-yellow-400 animate-pulse'
                }`}
              ></div>
              <span className="text-sm font-medium">
                Server Status:{' '}
                {serverStatus === 'online' ? 'Online' : serverStatus === 'offline' ? 'Offline' : 'Checking...'}
              </span>
            </div>
            {/* <span className="text-sm text-blue-200">|</span>
            <span className="text-sm font-mono">{MCP_SERVER_URL}</span> */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {serverStatus === 'offline' ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <H2 className="text-yellow-800 mb-2">Server Offline</H2>
            <Paragraph className="text-yellow-700 mb-4">
              The MCP server appears to be offline or unreachable. Please check your connection
              or try again later.
            </Paragraph>
            <Button
              onClick={handleRetryConnection}
              variant="primary"
            >
              Retry Connection
            </Button>
          </div>
        ) : (
          <>
            {/* Server Online - Available Tools */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <H2 className="text-green-800 mb-3">✅ Server Online</H2>
              <Paragraph className="text-green-700 mb-4">
                The MCP server is online and ready to use. The chat agent on the home page can
                automatically use the following tools:
              </Paragraph>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-green-100">
                  <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                    <span>🔍</span> add_danfe
                  </h3>
                  <Paragraph className="text-sm text-gray-700 mb-2">
                    Adds a DANFE to the system for later query
                  </Paragraph>
                  <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                    <strong>Input:</strong> chaveAcesso (44 digits)
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-green-100">
                  <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                    <span>📄</span> get_danfe_xml
                  </h3>
                  <Paragraph className="text-sm text-gray-700 mb-2">
                    Retrieves structured data from a DANFE XML
                  </Paragraph>
                  <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                    <strong>Input:</strong> chaveAcesso (44 digits)
                  </div>
                </div>
              </div>
            </div>

            {/* How to Use */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <H2 className="text-blue-900 mb-3">💬 How to Use</H2>
              <Paragraph className="text-blue-800 mb-4">
                Go to the <Link href="/" className="text-blue-600 hover:underline font-medium">home page</Link> and simply
                type a DANFE access key in the chat. The AI agent will automatically:
              </Paragraph>
              <ol className="list-decimal list-inside space-y-2 text-blue-800">
                <li>Validate the access key format (44 numeric digits)</li>
                <li>Call the <code className="bg-blue-100 px-2 py-1 rounded">add_danfe</code> tool to add it to the system</li>
                <li>Call the <code className="bg-blue-100 px-2 py-1 rounded">get_danfe_xml</code> tool to fetch the data</li>
                <li>Present the information in a clear, organized format</li>
              </ol>
            </div>
          </>
        )}

        {/* Info Section */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <H2 className="text-blue-900 mb-3">About MCP</H2>
          <Paragraph className="text-blue-800 mb-4">
            The Model Context Protocol (MCP) is an open protocol that enables seamless integration
            between AI models and external tools, resources, and data sources. This explorer allows
            you to interact with the MCP server and test its capabilities.
          </Paragraph>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">🔧 Tools</h3>
              <Paragraph className="text-sm text-gray-700">
                Execute server-side functions and operations with custom parameters
              </Paragraph>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">📦 Resources</h3>
              <Paragraph className="text-sm text-gray-700">
                Access and read data resources exposed by the MCP server
              </Paragraph>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">💬 Prompts</h3>
              <Paragraph className="text-sm text-gray-700">
                Use pre-configured prompts with custom arguments for AI interactions
              </Paragraph>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
