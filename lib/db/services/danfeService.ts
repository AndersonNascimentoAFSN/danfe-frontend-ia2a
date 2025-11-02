import { connectDB } from '../mongoose';
import Danfe, { IDanfe } from '../models/Danfe';
import { MCPClient } from '@/lib/mcp/client';

export class DanfeService {
  /**
   * Busca uma DANFE pela chave de acesso
   * Primeiro verifica no banco, se não encontrar, busca no MCP
   */
  static async buscarDanfe(chaveAcesso: string): Promise<{
    success: boolean;
    data?: Record<string, unknown>;
    message: string;
    fonte: 'cache' | 'mcp';
  }> {
    try {
      // Conecta ao MongoDB
      await connectDB();

      // 1. Busca primeiro no banco de dados (cache)
      console.log(`🔍 Buscando DANFE ${chaveAcesso} no cache...`);
      const danfeCache = await Danfe.findOne({ chaveAcesso });

      if (danfeCache) {
        console.log(`✅ DANFE encontrada no cache`);
        return {
          success: true,
          data: danfeCache.dados,
          message: 'DANFE encontrada no cache local',
          fonte: 'cache',
        };
      }

      // 2. Se não encontrou no cache, busca no MCP
      console.log(`🌐 DANFE não encontrada no cache, buscando no MCP...`);
      const mcpClient = new MCPClient(
        process.env.NEXT_PUBLIC_MCP_SERVER_URL || '',
        process.env.NEXT_PUBLIC_MCP_API_KEY || ''
      );

      // Adiciona a DANFE ao sistema MCP
      await mcpClient.callTool({
        name: 'add_danfe',
        arguments: { chaveAcesso },
      });

      // Busca os dados da DANFE
      const result = await mcpClient.callTool({
        name: 'get_danfe_xml',
        arguments: { chaveAcesso },
      });

      if (!result || result.isError) {
        return {
          success: false,
          message: 'DANFE não encontrada no servidor',
          fonte: 'mcp',
        };
      }

      // 3. Salva no banco de dados para cache futuro
      console.log(`💾 Salvando DANFE no cache...`);
      const novaDanfe = new Danfe({
        chaveAcesso,
        dados: result,
        consultadoEm: new Date(),
        atualizadoEm: new Date(),
      });

      await novaDanfe.save();
      console.log(`✅ DANFE salva no cache com sucesso`);

      return {
        success: true,
        data: result,
        message: 'DANFE encontrada no servidor e salva no cache',
        fonte: 'mcp',
      };
    } catch (error) {
      console.error('❌ Erro ao buscar DANFE:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao buscar DANFE',
        fonte: 'mcp',
      };
    }
  }

  /**
   * Lista todas as DANFEs consultadas (histórico)
   */
  static async listarHistorico(limite = 50): Promise<IDanfe[]> {
    try {
      await connectDB();
      const historico = await Danfe.find()
        .sort({ atualizadoEm: -1 })
        .limit(limite)
        .select('chaveAcesso consultadoEm atualizadoEm');

      return historico;
    } catch (error) {
      console.error('Erro ao listar histórico:', error);
      return [];
    }
  }

  /**
   * Remove uma DANFE do cache
   */
  static async removerDoCache(chaveAcesso: string): Promise<boolean> {
    try {
      await connectDB();
      const resultado = await Danfe.deleteOne({ chaveAcesso });
      return resultado.deletedCount > 0;
    } catch (error) {
      console.error('Erro ao remover DANFE do cache:', error);
      return false;
    }
  }

  /**
   * Limpa todo o cache (usar com cuidado)
   */
  static async limparCache(): Promise<number> {
    try {
      await connectDB();
      const resultado = await Danfe.deleteMany({});
      return resultado.deletedCount;
    } catch (error) {
      console.error('Erro ao limpar cache:', error);
      return 0;
    }
  }

  /**
   * Estatísticas do cache
   */
  static async estatisticas() {
    try {
      await connectDB();
      const total = await Danfe.countDocuments();
      const maisRecente = await Danfe.findOne().sort({ atualizadoEm: -1 });
      const maisAntigo = await Danfe.findOne().sort({ consultadoEm: 1 });

      return {
        total,
        maisRecente: maisRecente?.chaveAcesso,
        maisAntigo: maisAntigo?.chaveAcesso,
        ultimaAtualizacao: maisRecente?.atualizadoEm,
      };
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      return null;
    }
  }
}
