# Guia do Agente de DANFE

Este documento explica como o agente de IA funciona para buscar e interpretar informações de DANFEs.

## 🤖 Como Funciona

O agente utiliza o **Vercel AI SDK** com **tool calling** para automaticamente buscar informações de DANFEs quando o usuário fornece uma chave de acesso.

### Fluxo de Execução

```
Usuário digita chave de acesso (44 dígitos)
    ↓
Modelo de IA detecta a intenção
    ↓
Chama ferramenta "buscar_danfe"
    ↓
Conecta ao servidor MCP
    ↓
Busca dados da DANFE
    ↓
IA interpreta e formata resposta
    ↓
Apresenta informações ao usuário
```

## 🛠️ Ferramentas (Tools)

### buscar_danfe

Ferramenta que busca informações detalhadas de uma DANFE pela chave de acesso.

**Parâmetros:**
- `chaveAcesso` (string): Chave de acesso de 44 dígitos numéricos

**Validação:**
- Deve conter exatamente 44 caracteres
- Deve conter apenas números (0-9)
- Passa por validação de checksum no servidor

**Exemplo de uso:**

```typescript
// O usuário digita:
"Busque informações da DANFE 12345678901234567890123456789012345678901234"

// O agente automaticamente:
1. Extrai a chave: "12345678901234567890123456789012345678901234"
2. Chama a ferramenta buscar_danfe
3. Recebe os dados
4. Formata e apresenta ao usuário
```

## 💬 Exemplos de Interação

### Exemplo 1: Consulta Simples

**Usuário:**
```
Me mostre as informações da DANFE 12345678901234567890123456789012345678901234
```

**Agente:**
1. Reconhece a chave de acesso
2. Chama a ferramenta buscar_danfe
3. Busca os dados no servidor MCP
4. Apresenta as informações de forma organizada

### Exemplo 2: Chave Inválida

**Usuário:**
```
Busque a DANFE 123
```

**Agente:**
```
A chave de acesso deve ter exatamente 44 dígitos numéricos. 
Por favor, forneça uma chave válida.
```

### Exemplo 3: Conversação Natural

**Usuário:**
```
Oi! Tenho uma nota fiscal aqui e preciso consultar os dados dela
```

**Agente:**
```
Olá! Ficarei feliz em ajudar a consultar os dados da nota fiscal.
Por favor, me forneça a chave de acesso de 44 dígitos da DANFE.
```

**Usuário:**
```
12345678901234567890123456789012345678901234
```

**Agente:**
```
Entendi! Vou buscar as informações dessa DANFE para você...
[Executa a ferramenta e apresenta os dados]
```

## 🔧 Configuração Técnica

### System Prompt

O agente possui instruções específicas para:

```typescript
system: `Você é um assistente especializado em DANFEs (Documento Auxiliar da Nota Fiscal Eletrônica).

Suas capacidades:
- Buscar informações de DANFEs usando a chave de acesso (44 dígitos numéricos)
- Interpretar e explicar dados da DANFE de forma clara
- Ajudar o usuário a entender as informações fiscais

Quando o usuário fornecer uma chave de acesso de 44 dígitos, use a ferramenta 'buscar_danfe' automaticamente.
Após buscar os dados, apresente as informações de forma organizada e clara.`
```

### Integração com MCP

O agente utiliza o **MCPClient** para conectar-se ao servidor MCP:

```typescript
const mcpClient = new MCPClient(
  'https://mcp-danfe-ia2a.onrender.com/mcp',
  'danfe_53b0d4af09aab7d7a6983cde9bfb18a3'
);

// Adiciona a DANFE ao sistema
await mcpClient.callTool({
  name: 'add_danfe',
  arguments: { chaveAcesso },
});

// Busca os dados da DANFE
const result = await mcpClient.callTool({
  name: 'get_danfe_xml',
  arguments: { chaveAcesso },
});
```

### Multi-Step Tool Calling

O agente utiliza `stopWhen: stepCountIs(5)` para permitir:

1. Executar a ferramenta
2. Processar o resultado
3. Gerar resposta textual formatada
4. Permitir follow-up se necessário

## 📊 Estrutura da Resposta

Quando a ferramenta é executada com sucesso, retorna:

```typescript
{
  success: true,
  data: {
    content: [
      {
        type: 'text',
        text: '...', // Dados da DANFE em formato texto
        data: {...}  // Dados estruturados
      }
    ]
  },
  message: 'DANFE encontrada com sucesso'
}
```

Em caso de erro:

```typescript
{
  success: false,
  error: 'Mensagem de erro',
  message: 'Não foi possível buscar os dados da DANFE...'
}
```

## 🎯 Boas Práticas

### Para o Usuário

1. **Forneça a chave completa**: Sempre digite todos os 44 dígitos
2. **Apenas números**: Não inclua traços, espaços ou outros caracteres
3. **Seja claro**: Deixe claro que deseja consultar uma DANFE

### Para o Desenvolvedor

1. **Validação robusta**: A ferramenta valida formato antes de chamar o MCP
2. **Tratamento de erros**: Erros são capturados e apresentados de forma amigável
3. **Timeout adequado**: Cliente MCP configurado com 30s de timeout
4. **Multi-step**: Permite que o agente processe e formate a resposta

## 🔐 Segurança

- **API Key**: Todas as requisições ao MCP incluem autenticação via X-API-Key
- **Validação**: Chave de acesso validada antes de enviar ao servidor
- **Rate limiting**: Servidor MCP possui rate limiting para evitar abuso
- **Environment variables**: Credenciais armazenadas em variáveis de ambiente

## 🚀 Próximos Passos

Possíveis melhorias futuras:

1. **Histórico de consultas**: Salvar DANFEs consultadas anteriormente
2. **Comparação**: Comparar dados entre múltiplas DANFEs
3. **Export**: Exportar dados para PDF, Excel, etc.
4. **Análise**: Análise automática de dados fiscais
5. **Notificações**: Alertas sobre problemas nas DANFEs

## 📚 Referências

- [Vercel AI SDK - Tool Calling](https://sdk.vercel.ai/docs/ai-sdk-core/tools-and-tool-calling)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [MCP Server DANFE](https://mcp-danfe-ia2a.onrender.com/)

---

Para mais informações sobre o MCP Client, consulte [MCP_GUIDE.md](./MCP_GUIDE.md)
