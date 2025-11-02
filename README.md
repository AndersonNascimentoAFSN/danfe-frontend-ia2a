# DANFE Frontend IA2A

Um assistente inteligente para consulta de DANFEs (Documento Auxiliar da Nota Fiscal Eletrônica) construído com Next.js, Tailwind CSS e Vercel AI SDK.

## 🎯 Funcionalidades

### � Chat Inteligente com IA
- Interface conversacional para consulta de DANFEs
- Busca automática de informações fiscais pela chave de acesso
- Respostas formatadas e fáceis de entender

### 🔍 Busca de DANFE
- Digite uma chave de acesso de 44 dígitos no chat
- O assistente busca automaticamente as informações da DANFE
- Dados estruturados e interpretados pela IA

### 🔌 Integração MCP
- Cliente MCP completo para integração com servidores externos
- Autenticação via API Key
- Explorador de ferramentas e recursos MCP

## �🚀 Tecnologias

- **Next.js 16+** - Framework React com App Router
- **TypeScript** - Tipagem estática para JavaScript
- **Tailwind CSS** - Framework CSS utilitário
- **Vercel AI SDK** - Componentes de chat com IA e tool calling
- **Model Context Protocol (MCP)** - Protocolo para integração com servidores externos
- **Zod** - Validação de schemas TypeScript-first
- **Axios** - Cliente HTTP para requisições
- **ESLint** - Linter para manter código consistente

## 📦 Componentes Disponíveis

### Componentes de UI (components/ui)

- **Button** - Botão com variantes (primary, secondary, outline, ghost) e tamanhos (sm, md, lg)
- **Typography** - Componentes de tipografia (H1-H6, Paragraph, Lead, Small, Muted)

### Componentes de Layout (components/layout)

- **Navbar** - Barra de navegação responsiva com menu mobile
- **Header** - Cabeçalho hero com título, subtítulo e CTAs

### Componentes de Chat (components/chat)

- **Chat** - Componente principal de chat com IA
- **ChatMessage** - Renderiza mensagens individuais
- **ChatInput** - Campo de entrada de mensagens

## 🛠️ Instalação

\`\`\`bash
npm install
\`\`\`

## ⚙️ Configuração

Crie um arquivo .env.local na raiz do projeto:

\`\`\`env
# OpenAI API Key para o chat
OPENAI_API_KEY=your-openai-api-key

# MCP Server Configuration
NEXT_PUBLIC_MCP_SERVER_URL=https://mcp-danfe-ia2a.onrender.com/mcp
NEXT_PUBLIC_MCP_API_KEY=danfe_53b0d4af09aab7d7a6983cde9bfb18a3
\`\`\`

## 🚀 Executando o Projeto

\`\`\`bash
npm run dev
\`\`\`

O projeto estará disponível em http://localhost:3000

## 📖 Como Usar

### Consultando uma DANFE

1. Acesse http://localhost:3000
2. No chat, digite ou cole uma chave de acesso de 44 dígitos
3. Exemplo: "Busque a DANFE 12345678901234567890123456789012345678901234"
4. O assistente automaticamente:
   - Valida a chave de acesso
   - Busca as informações no servidor MCP
   - Apresenta os dados de forma organizada

### Páginas Disponíveis

- **/** - Chat principal para consulta de DANFEs
- **/mcp** - Explorador MCP (ferramentas e recursos)
- **/components** - Guia de componentes UI

---

Desenvolvido com ❤️ usando Next.js, Tailwind CSS e Vercel AI SDK

## 🔌 MCP Client Integration

O projeto inclui integração completa com o Model Context Protocol (MCP) para conectar-se a servidores MCP e utilizar suas ferramentas, recursos e prompts.

### Servidor MCP

- **URL**: https://mcp-danfe-ia2a.onrender.com
- **Protocolo**: JSON-RPC 2.0

### Recursos do MCP Client

- **Tools Explorer**: Visualize e execute ferramentas disponíveis no servidor MCP
- **Resources Viewer**: Navegue e leia recursos expostos pelo servidor
- **Hooks React**: Integração facilitada com hooks personalizados
- **TypeScript**: Tipagem completa para todas as operações

### Como usar o MCP Client

#### 1. Acessar o MCP Explorer

Navegue para `/mcp` para acessar a interface visual do MCP Explorer.

#### 2. Usar programaticamente

\`\`\`typescript
import { useMCPTools } from '@/lib/mcp';

function MyComponent() {
  const { tools, callTool, isLoading } = useMCPTools('https://mcp-danfe-ia2a.onrender.com');

  const handleExecuteTool = async () => {
    const result = await callTool({
      name: 'myTool',
      arguments: { param1: 'value1' }
    });
    console.log(result);
  };

  return (
    <div>
      {tools.map(tool => (
        <div key={tool.name}>{tool.name}</div>
      ))}
    </div>
  );
}
\`\`\`

#### 3. Hooks disponíveis

- \`useMCPClient(serverUrl)\` - Cliente base MCP
- \`useMCPTools(serverUrl)\` - Gerenciamento de ferramentas
- \`useMCPResources(serverUrl)\` - Gerenciamento de recursos
- \`useMCPPrompts(serverUrl)\` - Gerenciamento de prompts

### Componentes MCP

- **MCPToolsExplorer** - Interface para explorar e executar ferramentas
- **MCPResourcesViewer** - Interface para visualizar e ler recursos

### Estrutura de Arquivos MCP

\`\`\`
lib/mcp/
├── client.ts      # Cliente MCP principal
├── hooks.ts       # Hooks React para MCP
└── index.ts       # Exportações

components/mcp/
├── MCPToolsExplorer.tsx
├── MCPResourcesViewer.tsx
└── index.ts
\`\`\`
