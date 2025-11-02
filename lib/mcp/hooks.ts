'use client';

import { useState, useEffect, useCallback } from 'react';
import { MCPClient, MCPTool, MCPResource, MCPPrompt, MCPCallToolParams, MCPCallToolResult } from './client';

export function useMCPClient(serverUrl: string, apiKey?: string) {
  const [client, setClient] = useState<MCPClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Inicializa o cliente MCP
  useEffect(() => {
    const mcpClient = new MCPClient(serverUrl, apiKey);
    setClient(mcpClient);

    // Testa a conexão
    const checkConnection = async () => {
      try {
        const connected = await mcpClient.ping();
        setIsConnected(connected);
      } catch (err) {
        setIsConnected(false);
        setError('Failed to connect to MCP server');
      }
    };

    checkConnection();
  }, [serverUrl, apiKey]);

  return {
    client,
    isConnected,
    isLoading,
    error,
  };
}

export function useMCPTools(serverUrl: string, apiKey?: string) {
  const [tools, setTools] = useState<MCPTool[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { client } = useMCPClient(serverUrl, apiKey);

  const loadTools = useCallback(async () => {
    if (!client) return;

    setIsLoading(true);
    setError(null);

    try {
      const toolsList = await client.listTools();
      setTools(toolsList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tools');
    } finally {
      setIsLoading(false);
    }
  }, [client]);

  useEffect(() => {
    loadTools();
  }, [loadTools]);

  const callTool = useCallback(
    async (params: MCPCallToolParams): Promise<MCPCallToolResult> => {
      if (!client) {
        throw new Error('MCP client not initialized');
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await client.callTool(params);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to call tool';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [client]
  );

  return {
    tools,
    isLoading,
    error,
    loadTools,
    callTool,
  };
}

export function useMCPResources(serverUrl: string, apiKey?: string) {
  const [resources, setResources] = useState<MCPResource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { client } = useMCPClient(serverUrl, apiKey);

  const loadResources = useCallback(async () => {
    if (!client) return;

    setIsLoading(true);
    setError(null);

    try {
      const resourcesList = await client.listResources();
      setResources(resourcesList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load resources');
    } finally {
      setIsLoading(false);
    }
  }, [client]);

  useEffect(() => {
    loadResources();
  }, [loadResources]);

  const readResource = useCallback(
    async (uri: string) => {
      if (!client) {
        throw new Error('MCP client not initialized');
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await client.readResource(uri);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to read resource';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [client]
  );

  return {
    resources,
    isLoading,
    error,
    loadResources,
    readResource,
  };
}

export function useMCPPrompts(serverUrl: string, apiKey?: string) {
  const [prompts, setPrompts] = useState<MCPPrompt[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { client } = useMCPClient(serverUrl, apiKey);

  const loadPrompts = useCallback(async () => {
    if (!client) return;

    setIsLoading(true);
    setError(null);

    try {
      const promptsList = await client.listPrompts();
      setPrompts(promptsList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load prompts');
    } finally {
      setIsLoading(false);
    }
  }, [client]);

  useEffect(() => {
    loadPrompts();
  }, [loadPrompts]);

  const getPrompt = useCallback(
    async (name: string, args?: Record<string, string>) => {
      if (!client) {
        throw new Error('MCP client not initialized');
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await client.getPrompt(name, args);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to get prompt';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [client]
  );

  return {
    prompts,
    isLoading,
    error,
    loadPrompts,
    getPrompt,
  };
}
