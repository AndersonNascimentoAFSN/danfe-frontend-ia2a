import { openai } from '@ai-sdk/openai';
import { streamText, convertToModelMessages, UIMessage, tool, stepCountIs } from 'ai';
import { z } from 'zod';
import { MCPClient } from '@/lib/mcp/client';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// MCP Server configuration
const MCP_SERVER_URL = process.env.NEXT_PUBLIC_MCP_SERVER_URL;
const MCP_API_KEY = process.env.NEXT_PUBLIC_MCP_API_KEY;

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
Após buscar os dados, apresente as informações de forma organizada e clara.`,
    messages: convertToModelMessages(messages),
    tools: {
      buscar_danfe: tool({
        description: 'Busca informações detalhadas de uma DANFE pela chave de acesso de 44 dígitos',
        inputSchema: z.object({
          chaveAcesso: z
            .string()
            .length(44, 'A chave de acesso deve ter exatamente 44 dígitos')
            .regex(/^\d+$/, 'A chave de acesso deve conter apenas números')
            .describe('Chave de acesso da DANFE com 44 dígitos numéricos'),
        }),
        execute: async ({ chaveAcesso }: { chaveAcesso: string }) => {
          try {
            // Inicializa o cliente MCP
            const mcpClient = new MCPClient(MCP_SERVER_URL ?? '', MCP_API_KEY ?? '');

            // Primeiro adiciona a DANFE ao sistema
            await mcpClient.callTool({
              name: 'add_danfe',
              arguments: { chaveAcesso },
            });

            // Depois busca os dados da DANFE
            const result = await mcpClient.callTool({
              name: 'get_danfe_xml',
              arguments: { chaveAcesso },
            });

            return {
              success: true,
              data: result,
              message: 'DANFE encontrada com sucesso',
            };
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar informações da DANFE';
            return {
              success: false,
              error: errorMessage,
              message: 'Não foi possível buscar os dados da DANFE. Verifique se a chave de acesso está correta.',
            };
          }
        },
      }),
    },
    stopWhen: stepCountIs(5), // Permite multi-step para processar resultado da tool
  });

  return result.toUIMessageStreamResponse();
}
