'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout';

interface DanfeHistorico {
  _id: string;
  chaveAcesso: string;
  consultadoEm: string;
  atualizadoEm: string;
}

interface Estatisticas {
  total: number;
  maisRecente: string | null;
  maisAntigo: string | null;
  ultimaAtualizacao: string | null;
}

export default function HistoricoPage() {
  const [historico, setHistorico] = useState<DanfeHistorico[]>([]);
  const [stats, setStats] = useState<Estatisticas | null>(null);
  const [loading, setLoading] = useState(true);
  const [limite, setLimite] = useState(50);
  const [searchTerm, setSearchTerm] = useState('');

  const carregarDados = async () => {
    setLoading(true);
    try {
      // Busca estatísticas
      const statsResponse = await fetch('/api/danfe/stats');
      const statsData = await statsResponse.json();
      if (statsData.success) {
        setStats(statsData.data);
      }

      // Busca histórico
      const historicoResponse = await fetch(`/api/danfe/historico?limite=${limite}`);
      const historicoData = await historicoResponse.json();
      if (historicoData.success) {
        setHistorico(historicoData.danfes);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limite]);

  const formatarData = (data: string) => {
    return new Date(data).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatarChave = (chave: string) => {
    // Formata a chave para melhor visualização: XXXX XXXX XXXX...
    return chave.match(/.{1,4}/g)?.join(' ') || chave;
  };

  const historicoFiltrado = historico.filter((item) =>
    item.chaveAcesso.includes(searchTerm.replace(/\s/g, ''))
  );

  const copiarChave = (chave: string) => {
    navigator.clipboard.writeText(chave);
    alert('Chave copiada para a área de transferência!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar logo="DANFE IA" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 mb-4 bg-green-100 rounded-full">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-3">
            Histórico de Consultas
          </h1>
          <p className="text-gray-600 text-lg">
            Todas as DANFEs consultadas e armazenadas em cache
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600 mb-4"></div>
            <p className="text-gray-600">Carregando dados...</p>
          </div>
        ) : (
          <>
            {/* Estatísticas */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600 text-sm font-medium">Total de DANFEs</span>
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600 text-sm font-medium">Mais Recente</span>
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-xs font-mono text-green-700 truncate">
                    {stats.maisRecente ? formatarChave(stats.maisRecente).substring(0, 19) + '...' : 'N/A'}
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600 text-sm font-medium">Mais Antiga</span>
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-xs font-mono text-purple-700 truncate">
                    {stats.maisAntigo ? formatarChave(stats.maisAntigo).substring(0, 19) + '...' : 'N/A'}
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-orange-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600 text-sm font-medium">Última Atualização</span>
                    <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <p className="text-xs text-orange-700">
                    {stats.ultimaAtualizacao ? formatarData(stats.ultimaAtualizacao) : 'N/A'}
                  </p>
                </div>
              </div>
            )}

            {/* Filtros e Controles */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex-1 w-full md:w-auto">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🔍 Buscar por chave de acesso
                  </label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Digite parte da chave..."
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                </div>

                <div className="w-full md:w-auto">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📊 Limite de resultados
                  </label>
                  <select
                    value={limite}
                    onChange={(e) => setLimite(Number(e.target.value))}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  >
                    <option value={10}>10 registros</option>
                    <option value={25}>25 registros</option>
                    <option value={50}>50 registros</option>
                    <option value={100}>100 registros</option>
                  </select>
                </div>

                <div className="w-full md:w-auto flex items-end">
                  <button
                    onClick={carregarDados}
                    className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Atualizar
                  </button>
                </div>
              </div>
            </div>

            {/* Lista de DANFEs */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Histórico Completo ({historicoFiltrado.length} registros)
                </h2>
              </div>

              {historicoFiltrado.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-600 text-lg">Nenhuma DANFE encontrada</p>
                  <p className="text-gray-500 text-sm mt-2">
                    {searchTerm ? 'Tente buscar com outros termos' : 'Consulte algumas DANFEs no chat para vê-las aqui'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b-2 border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Chave de Acesso
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Primeira Consulta
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Última Atualização
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {historicoFiltrado.map((item, index) => (
                        <tr key={item._id} className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm text-gray-900 break-all">
                                {formatarChave(item.chaveAcesso)}
                              </span>
                              <button
                                onClick={() => copiarChave(item.chaveAcesso)}
                                className="text-blue-600 hover:text-blue-800 transition-colors"
                                title="Copiar chave"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {formatarData(item.consultadoEm)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {formatarData(item.atualizadoEm)}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <Link
                              href={`/chat?chave=${item.chaveAcesso}`}
                              className="inline-flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              Consultar
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Info Footer */}
            <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">💡 Sobre o Cache</h3>
                  <p className="text-sm text-blue-800">
                    Todas as DANFEs consultadas são automaticamente salvas no banco de dados MongoDB.
                    Isso permite consultas instantâneas e reduz a necessidade de acessar o servidor MCP repetidamente.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
