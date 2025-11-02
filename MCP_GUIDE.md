# Guia de Uso - MCP Client

Este guia demonstra como usar o MCP Client no projeto DANFE Frontend IA2A.

## � Autenticação

O servidor MCP requer autenticação via API Key. A chave é enviada automaticamente no header `X-API-Key`.

**Credenciais:**
- **URL**: `https://xxx/mcp`
- **API Key**: `xxxx`

As credenciais já estão configuradas no projeto. Para usar em produção ou alterar, configure as variáveis de ambiente no arquivo `.env.local`:

```env
NEXT_PUBLIC_MCP_SERVER_URL=https://xxx/mcp
NEXT_PUBLIC_MCP_API_KEY=xxxx
```

## �🚀 Início Rápido

### 1. Acessar o MCP Explorer

Navegue para [http://localhost:3000/mcp](http://localhost:3000/mcp) para acessar a interface visual.

### 2. Explorar Ferramentas

1. Na aba **Tools**, você verá todas as ferramentas disponíveis no servidor MCP
2. Clique em uma ferramenta para ver seus detalhes
3. Preencha os parâmetros necessários
4. Clique em **Execute Tool** para executar

### 3. Visualizar Recursos

1. Na aba **Resources**, você verá todos os recursos disponíveis
2. Clique em um recurso para visualizar seu conteúdo
3. Use o botão **Refresh** para recarregar o conteúdo

## 💻 Uso Programático

### Exemplo 1: Listar e Executar Ferramentas

```typescript
'use client';

import { useMCPTools } from '@/lib/mcp';
import { useState } from 'react';

export default function MyComponent() {
  const { tools, callTool, isLoading, error } = useMCPTools(
    'https://xxxx/mcp',
    'xxxx'
  );
  const [result, setResult] = useState<string>('');

  const handleExecute = async () => {
    try {
      const response = await callTool({
        name: 'example_tool',
        arguments: {
          param1: 'value1',
          param2: 'value2',
        },
      });

      if (!response.isError) {
        setResult(response.content[0]?.text || 'Success');
      }
    } catch (err) {
      console.error('Error executing tool:', err);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Available Tools</h2>
      <ul>
        {tools.map((tool) => (
          <li key={tool.name}>{tool.name}</li>
        ))}
      </ul>
      <button onClick={handleExecute}>Execute Tool</button>
      {result && <p>Result: {result}</p>}
    </div>
  );
}
```

### Exemplo 2: Ler Recursos

```typescript
'use client';

import { useMCPResources } from '@/lib/mcp';
import { useState } from 'react';

export default function ResourceComponent() {
  const { resources, readResource, isLoading } = useMCPResources(
    'https://xxx/mcp',
    'xxxx'
  );
  const [content, setContent] = useState<string>('');

  const handleReadResource = async (uri: string) => {
    try {
      const data = await readResource(uri);
      setContent(JSON.stringify(data, null, 2));
    } catch (err) {
      console.error('Error reading resource:', err);
    }
  };

  return (
    <div>
      <h2>Resources</h2>
      {resources.map((resource) => (
        <div key={resource.uri}>
          <h3>{resource.name}</h3>
          <button onClick={() => handleReadResource(resource.uri)}>
            Read
          </button>
        </div>
      ))}
      {content && <pre>{content}</pre>}
    </div>
  );
}
```

### Exemplo 3: Usar o Cliente Diretamente

```typescript
import { MCPClient } from '@/lib/mcp';

// Criar instância do cliente
const client = new MCPClient('https://mcp-danfe-ia2a.onrender.com');

// Listar ferramentas
const tools = await client.listTools();
console.log('Available tools:', tools);

// Executar ferramenta
const result = await client.callTool({
  name: 'my_tool',
  arguments: { input: 'test' },
});
console.log('Result:', result);

// Listar recursos
const resources = await client.listResources();
console.log('Available resources:', resources);

// Ler recurso
const resourceData = await client.readResource('resource://example');
console.log('Resource data:', resourceData);
```

## 📝 Tipos TypeScript

### MCPTool

```typescript
interface MCPTool {
  name: string;
  description?: string;
  inputSchema?: {
    type: string;
    properties?: Record<string, unknown>;
    required?: string[];
  };
}
```

### MCPCallToolParams

```typescript
interface MCPCallToolParams {
  name: string;
  arguments?: Record<string, unknown>;
}
```

### MCPCallToolResult

```typescript
interface MCPCallToolResult {
  content: Array<{
    type: string;
    text?: string;
    data?: unknown;
  }>;
  isError?: boolean;
}
```

## 🔧 Hooks Disponíveis

### useMCPClient

Hook básico para conectar ao servidor MCP.

```typescript
const { client, isConnected, isLoading, error } = useMCPClient(serverUrl);
```

### useMCPTools

Hook para gerenciar ferramentas MCP.

```typescript
const { tools, isLoading, error, loadTools, callTool } = useMCPTools(serverUrl);
```

### useMCPResources

Hook para gerenciar recursos MCP.

```typescript
const { resources, isLoading, error, loadResources, readResource } = useMCPResources(serverUrl);
```

### useMCPPrompts

Hook para gerenciar prompts MCP.

```typescript
const { prompts, isLoading, error, loadPrompts, getPrompt } = useMCPPrompts(serverUrl);
```

## 🌐 API do Servidor MCP

O servidor MCP segue o protocolo JSON-RPC 2.0 e aceita as seguintes requisições:

### POST /tools/list

Lista todas as ferramentas disponíveis.

### POST /tools/call

Executa uma ferramenta específica.

### POST /resources/list

Lista todos os recursos disponíveis.

### POST /resources/read

Lê um recurso específico.

### POST /prompts/list

Lista todos os prompts disponíveis.

### POST /prompts/get

Obtém um prompt específico.

### GET /health

Verifica o status do servidor.

## 🎯 Casos de Uso

### 1. Integrar ferramenta MCP em um chat

```typescript
const { callTool } = useMCPTools('https://mcp-danfe-ia2a.onrender.com');

const handleChatMessage = async (message: string) => {
  const result = await callTool({
    name: 'process_message',
    arguments: { message },
  });

  return result.content[0]?.text;
};
```

### 2. Carregar dados de recurso MCP

```typescript
const { readResource } = useMCPResources('https://mcp-danfe-ia2a.onrender.com');

const loadData = async () => {
  const data = await readResource('resource://data/users');
  return data;
};
```

### 3. Usar prompt MCP para AI

```typescript
const { getPrompt } = useMCPPrompts('https://mcp-danfe-ia2a.onrender.com');

const generatePrompt = async () => {
  const prompt = await getPrompt('greeting', { name: 'John' });
  return prompt;
};
```

## 📚 Documentação Adicional

- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
- [JSON-RPC 2.0 Specification](https://www.jsonrpc.org/specification)

## 🆘 Solução de Problemas

### Servidor Offline

Se o servidor aparecer como offline:

1. Verifique sua conexão com a internet
2. Confirme se a URL do servidor está correta
3. Tente recarregar a página

### Erro ao executar ferramenta

1. Verifique se todos os parâmetros obrigatórios foram preenchidos
2. Confirme se os valores estão no formato correto
3. Consulte a descrição da ferramenta para mais detalhes

### Erro ao ler recurso

1. Verifique se o URI do recurso está correto
2. Confirme se você tem permissão para acessar o recurso
3. Tente atualizar a lista de recursos
