import { openai } from '@ai-sdk/openai';
import { streamText, convertToModelMessages, UIMessage, tool, stepCountIs } from 'ai';
import { z } from 'zod';
import { DanfeService } from '@/lib/db';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai('gpt-4o-mini'),
    system: `Você é um assistente especializado em DANFEs (Documento Auxiliar da Nota Fiscal Eletrônica).

Suas capacidades:
- Buscar informações de DANFEs usando a chave de acesso (44 dígitos numéricos)
- Interpretar e explicar dados da DANFE de forma clara
- Ajudar o usuário a entender as informações fiscais

Quando o usuário fornecer uma chave de acesso de 44 dígitos, use a ferramenta 'buscar_danfe' automaticamente.
Após buscar os dados, apresente as informações de forma organizada e clara.

O sistema possui cache inteligente: as DANFEs consultadas são salvas no banco de dados para consultas futuras mais rápidas.
Quando os dados vierem do cache, informe ao usuário que a resposta foi instantânea graças ao cache local.`,
    messages: convertToModelMessages(messages),
    tools: {
      buscar_danfe: tool({
        description: 'Busca informações detalhadas de uma DANFE pela chave de acesso de 44 dígitos. Verifica primeiro no cache local (MongoDB) antes de consultar o servidor MCP.',
        inputSchema: z.object({
          chaveAcesso: z
            .string()
            .length(44, 'A chave de acesso deve ter exatamente 44 dígitos')
            .regex(/^\d+$/, 'A chave de acesso deve conter apenas números')
            .describe('Chave de acesso da DANFE com 44 dígitos numéricos'),
        }),
        execute: async ({ chaveAcesso }: { chaveAcesso: string }) => {
          try {
            console.log(`📋 Iniciando busca da DANFE: ${chaveAcesso}`);
            
            // Usa o serviço que verifica cache primeiro
            const resultado = await DanfeService.buscarDanfe(chaveAcesso);

            if (resultado.success) {
              const mensagemFonte = resultado.fonte === 'cache' 
                ? '⚡ Dados recuperados do cache (resposta instantânea)'
                : '🌐 Dados obtidos do servidor e salvos no cache';

              return {
                success: true,
                data: resultado.data,
                message: `${resultado.message}\n${mensagemFonte}`,
                fonte: resultado.fonte,
              };
            } else {
              return {
                success: false,
                error: resultado.message,
                message: 'Não foi possível buscar os dados da DANFE. Verifique se a chave de acesso está correta.',
              };
            }
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar informações da DANFE';
            console.error('❌ Erro na busca:', errorMessage);
            
            return {
              success: false,
              error: errorMessage,
              message: 'Erro ao processar a solicitação. Tente novamente.',
            };
          }
        },
      }),
    },
    stopWhen: stepCountIs(5),
  });

  return result.toUIMessageStreamResponse();
}
