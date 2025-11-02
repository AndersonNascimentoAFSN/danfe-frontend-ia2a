import axios, { AxiosInstance } from 'axios';

export interface MCPTool {
  name: string;
  description?: string;
  inputSchema?: {
    type: string;
    properties?: Record<string, any>;
    required?: string[];
  };
}

export interface MCPResource {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
}

export interface MCPPrompt {
  name: string;
  description?: string;
  arguments?: Array<{
    name: string;
    description?: string;
    required?: boolean;
  }>;
}

export interface MCPCallToolParams {
  name: string;
  arguments?: Record<string, any>;
}

export interface MCPCallToolResult {
  content: Array<{
    type: string;
    text?: string;
    data?: any;
  }>;
  isError?: boolean;
}

export class MCPClient {
  private baseUrl: string;
  private axiosInstance: AxiosInstance;
  private apiKey?: string;

  constructor(serverUrl: string, apiKey?: string) {
    this.baseUrl = serverUrl;
    this.apiKey = apiKey;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/event-stream',
    };
    
    if (apiKey) {
      headers['X-API-Key'] = apiKey;
    }
    
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers,
      timeout: 30000, // 30 seconds
    });
  }

  /**
   * Lista todas as ferramentas disponíveis no servidor MCP
   */
  async listTools(): Promise<MCPTool[]> {
    try {
      // Servidor MCP usa endpoint raiz para todas as chamadas JSON-RPC
      const response = await this.axiosInstance.post('', {
        jsonrpc: '2.0',
        method: 'tools/list',
        id: Date.now(),
      });

      return response.data.result?.tools || [];
    } catch (error) {
      console.error('Error listing tools:', error);
      throw new Error('Failed to list tools from MCP server');
    }
  }

  /**
   * Chama uma ferramenta específica no servidor MCP
   */
  async callTool(params: MCPCallToolParams): Promise<MCPCallToolResult> {
    try {
      // Servidor MCP usa endpoint raiz para todas as chamadas JSON-RPC
      const response = await this.axiosInstance.post('', {
        jsonrpc: '2.0',
        method: 'tools/call',
        params,
        id: Date.now(),
      });

      if (response.data.error) {
        return {
          content: [
            {
              type: 'text',
              text: response.data.error.message || 'Error calling tool',
            },
          ],
          isError: true,
        };
      }

      return response.data.result || { content: [] };
    } catch (error) {
      console.error('Error calling tool:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to call tool';
      throw new Error(`Failed to call tool: ${errorMessage}`);
    }
  }

  /**
   * Lista todos os recursos disponíveis no servidor MCP
   */
  async listResources(): Promise<MCPResource[]> {
    try {
      // Servidor MCP usa endpoint raiz para todas as chamadas JSON-RPC
      const response = await this.axiosInstance.post('', {
        jsonrpc: '2.0',
        method: 'resources/list',
        id: Date.now(),
      });

      return response.data.result?.resources || [];
    } catch (error) {
      console.error('Error listing resources:', error);
      throw new Error('Failed to list resources from MCP server');
    }
  }

  /**
   * Lê um recurso específico do servidor MCP
   */
  async readResource(uri: string): Promise<any> {
    try {
      // Servidor MCP usa endpoint raiz para todas as chamadas JSON-RPC
      const response = await this.axiosInstance.post('', {
        jsonrpc: '2.0',
        method: 'resources/read',
        params: { uri },
        id: Date.now(),
      });

      return response.data.result;
    } catch (error) {
      console.error('Error reading resource:', error);
      throw new Error('Failed to read resource from MCP server');
    }
  }

  /**
   * Lista todos os prompts disponíveis no servidor MCP
   */
  async listPrompts(): Promise<MCPPrompt[]> {
    try {
      // Servidor MCP usa endpoint raiz para todas as chamadas JSON-RPC
      const response = await this.axiosInstance.post('', {
        jsonrpc: '2.0',
        method: 'prompts/list',
        id: Date.now(),
      });

      return response.data.result?.prompts || [];
    } catch (error) {
      console.error('Error listing prompts:', error);
      throw new Error('Failed to list prompts from MCP server');
    }
  }

  /**
   * Obtém um prompt específico do servidor MCP
   */
  async getPrompt(name: string, args?: Record<string, string>): Promise<any> {
    try {
      // Servidor MCP usa endpoint raiz para todas as chamadas JSON-RPC
      const response = await this.axiosInstance.post('', {
        jsonrpc: '2.0',
        method: 'prompts/get',
        params: {
          name,
          arguments: args,
        },
        id: Date.now(),
      });

      return response.data.result;
    } catch (error) {
      console.error('Error getting prompt:', error);
      throw new Error('Failed to get prompt from MCP server');
    }
  }

  /**
   * Testa a conexão com o servidor MCP
   */
  async ping(): Promise<boolean> {
    try {
      const response = await this.axiosInstance.get('/health');
      return response.status === 200;
    } catch (error) {
      console.error('Error pinging server:', error);
      return false;
    }
  }
}

// Instância singleton do cliente MCP
let mcpClientInstance: MCPClient | null = null;

export function getMCPClient(serverUrl?: string, apiKey?: string): MCPClient {
  if (!mcpClientInstance && serverUrl) {
    mcpClientInstance = new MCPClient(serverUrl, apiKey);
  }
  
  if (!mcpClientInstance) {
    throw new Error('MCP Client not initialized. Please provide a server URL.');
  }
  
  return mcpClientInstance;
}

export function initMCPClient(serverUrl: string, apiKey?: string): MCPClient {
  mcpClientInstance = new MCPClient(serverUrl, apiKey);
  return mcpClientInstance;
}
