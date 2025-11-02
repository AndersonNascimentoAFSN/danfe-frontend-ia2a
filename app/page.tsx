import Link from 'next/link';
import { Navbar } from '@/components/layout';
import { Button } from '@/components/ui';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar logo="DANFE IA" />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-4 mb-6 bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl">
            <svg className="w-16 h-16 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
            DANFE IA
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Assistente inteligente para consulta e análise de DANFEs
          </p>

          <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
            Consulte informações detalhadas de Documentos Auxiliares de Notas Fiscais Eletrônicas usando inteligência artificial e tecnologia MCP
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/chat">
              <Button 
                variant="primary" 
                className="px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
              >
                🚀 Começar Agora
              </Button>
            </Link>
            
            <a href="#como-funciona">
              <Button 
                variant="secondary" 
                className="px-8 py-4 text-lg font-semibold"
              >
                📖 Saiba Mais
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="como-funciona" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Como Funciona
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Três passos simples para acessar as informações da sua DANFE
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 border-2 border-purple-100 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Digite a Chave
              </h3>
              <p className="text-gray-600">
                Insira a chave de acesso de 44 dígitos da DANFE no chat inteligente
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-100 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                IA Processa
              </h3>
              <p className="text-gray-600">
                A inteligência artificial busca e processa as informações via protocolo MCP
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border-2 border-indigo-100 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Receba Dados
              </h3>
              <p className="text-gray-600">
                Obtenha todas as informações formatadas e organizadas de forma clara
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tecnologia de Ponta
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Construído com as melhores ferramentas e frameworks modernos
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Next.js 15', icon: '⚡', color: 'from-gray-600 to-gray-800' },
              { name: 'Vercel AI SDK', icon: '🤖', color: 'from-blue-600 to-blue-800' },
              { name: 'Model Context Protocol', icon: '🔌', color: 'from-purple-600 to-purple-800' },
              { name: 'TypeScript', icon: '📘', color: 'from-indigo-600 to-indigo-800' },
            ].map((tech, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-6 text-center border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all"
              >
                <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${tech.color} rounded-xl flex items-center justify-center text-3xl`}>
                  {tech.icon}
                </div>
                <p className="font-semibold text-gray-900">
                  {tech.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-12 shadow-2xl">
          <h2 className="text-4xl font-bold text-white mb-6">
            Pronto para Começar?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Experimente agora o assistente inteligente para consulta de DANFEs
          </p>
          <Link href="/chat">
            <Button 
              variant="primary" 
              className="bg-white text-purple-600 hover:bg-gray-100 px-10 py-4 text-lg font-bold shadow-xl"
            >
              Acessar o Chat →
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400 mb-4">
            Desenvolvido com ❤️ usando Next.js, Tailwind CSS e Vercel AI SDK
          </p>
          <div className="flex justify-center gap-6 text-sm">
            <Link href="/chat" className="text-gray-400 hover:text-white transition-colors">
              Chat
            </Link>
            <Link href="/mcp" className="text-gray-400 hover:text-white transition-colors">
              Status MCP
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
