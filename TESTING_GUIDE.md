# Exemplos de Teste do Agente DANFE

Este arquivo contém exemplos práticos de como testar o agente de DANFE.

## 🧪 Testes Manuais

### 1. Teste de Consulta Básica

**Entrada:**
```
Busque a DANFE 12345678901234567890123456789012345678901234
```

**Comportamento esperado:**
- Agente reconhece a chave de acesso
- Valida formato (44 dígitos)
- Chama ferramenta buscar_danfe
- Apresenta dados da DANFE

---

### 2. Teste de Validação - Chave Curta

**Entrada:**
```
Consulte a DANFE 123
```

**Comportamento esperado:**
- Erro de validação
- Mensagem: "A chave de acesso deve ter exatamente 44 dígitos"
- Não chama o servidor MCP

---

### 3. Teste de Validação - Caracteres Inválidos

**Entrada:**
```
Busque a DANFE 1234567890123456789012345678901234567890ABCD
```

**Comportamento esperado:**
- Erro de validação
- Mensagem: "A chave de acesso deve conter apenas números"
- Não chama o servidor MCP

---

### 4. Teste de Conversação Natural

**Sequência de mensagens:**

**Usuário:**
```
Olá!
```

**Agente:**
```
Olá! Sou um assistente especializado em DANFEs. 
Como posso ajudá-lo hoje?
```

**Usuário:**
```
Preciso consultar uma nota fiscal
```

**Agente:**
```
Claro! Para consultar uma nota fiscal, preciso da chave de acesso 
da DANFE (44 dígitos numéricos). Você pode me fornecer?
```

**Usuário:**
```
12345678901234567890123456789012345678901234
```

**Agente:**
```
Perfeito! Vou buscar as informações dessa DANFE para você...
[Executa busca e apresenta dados]
```

---

### 5. Teste de DANFE Inexistente

**Entrada:**
```
Busque a DANFE 99999999999999999999999999999999999999999999
```

**Comportamento esperado:**
- Chama ferramenta buscar_danfe
- Servidor MCP retorna erro (DANFE não encontrada)
- Agente apresenta mensagem amigável:
  "Não foi possível encontrar essa DANFE. Verifique se a chave está correta."

---

### 6. Teste de Múltiplas Consultas

**Entrada 1:**
```
Busque a DANFE 11111111111111111111111111111111111111111111
```

**Resposta 1:**
```
[Dados da primeira DANFE]
```

**Entrada 2:**
```
Agora busque a DANFE 22222222222222222222222222222222222222222222
```

**Comportamento esperado:**
- Mantém contexto da conversa
- Executa segunda busca
- Apresenta dados da segunda DANFE
- Usuário pode perguntar sobre qualquer uma das DANFEs consultadas

---

## 🔧 Testes de Integração

### Teste 1: Conexão com MCP Server

**Verificar:**
- ✅ Servidor MCP está acessível
- ✅ API Key válida
- ✅ Timeout adequado (30s)
- ✅ Headers corretos (X-API-Key)

**Como testar:**
```bash
curl -X POST https://xxxx/mcp/tools/list \
  -H "Content-Type: application/json" \
  -H "X-API-Key: xxxx" \
  -d '{"jsonrpc":"2.0","method":"tools/list","id":1}'
```

---

### Teste 2: Tool Execution

**Verificar:**
- ✅ Tool add_danfe responde corretamente
- ✅ Tool get_danfe_xml retorna dados estruturados
- ✅ Erros são tratados apropriadamente

**Como testar:**
```typescript
// No console do navegador (F12)
const testToolCall = async () => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{
        role: 'user',
        parts: [{
          type: 'text',
          text: 'Busque a DANFE 12345678901234567890123456789012345678901234'
        }],
        id: 'test-1'
      }]
    })
  });
  
  // Verifica se o streaming funciona
  const reader = response.body.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    console.log(new TextDecoder().decode(value));
  }
};

testToolCall();
```

---

### Teste 3: Validação de Schema

**Verificar:**
- ✅ Zod valida chaveAcesso corretamente
- ✅ Mensagens de erro são claras
- ✅ Validação ocorre antes de chamar MCP

**Como testar:**
```typescript
import { z } from 'zod';

const chaveAcessoSchema = z
  .string()
  .length(44, 'A chave de acesso deve ter exatamente 44 dígitos')
  .regex(/^\d+$/, 'A chave de acesso deve conter apenas números');

// Teste 1: Chave válida
console.assert(
  chaveAcessoSchema.safeParse('12345678901234567890123456789012345678901234').success,
  'Chave válida falhou'
);

// Teste 2: Chave curta
console.assert(
  !chaveAcessoSchema.safeParse('123').success,
  'Chave curta passou'
);

// Teste 3: Caracteres inválidos
console.assert(
  !chaveAcessoSchema.safeParse('1234567890123456789012345678901234567890ABCD').success,
  'Chave com letras passou'
);
```

---

## 📊 Testes de Performance

### Teste 1: Tempo de Resposta

**Objetivo:** Medir tempo total desde input até resposta

**Métrica esperada:** < 5 segundos para busca completa

**Como medir:**
```typescript
const startTime = performance.now();

// Enviar mensagem no chat
sendMessage({ text: 'Busque a DANFE 12345...' });

// No callback de resposta completa:
const endTime = performance.now();
const duration = endTime - startTime;
console.log(`Tempo total: ${duration}ms`);
```

---

### Teste 2: Múltiplas Requisições Simultâneas

**Objetivo:** Verificar comportamento com carga

**Teste:**
```typescript
const promises = [];
for (let i = 0; i < 5; i++) {
  promises.push(
    fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [{
          role: 'user',
          parts: [{ type: 'text', text: `Busque a DANFE ${i.toString().repeat(44)}` }],
          id: `test-${i}`
        }]
      })
    })
  );
}

const results = await Promise.allSettled(promises);
console.log('Sucessos:', results.filter(r => r.status === 'fulfilled').length);
console.log('Falhas:', results.filter(r => r.status === 'rejected').length);
```

---

## 🐛 Testes de Erro

### Cenário 1: Servidor MCP Offline

**Simular:**
- Alterar URL do MCP para uma inválida temporariamente

**Comportamento esperado:**
- Timeout após 30s
- Mensagem de erro amigável
- Não quebra a aplicação

---

### Cenário 2: API Key Inválida

**Simular:**
- Alterar API Key para valor incorreto

**Comportamento esperado:**
- Erro 401/403 do servidor
- Mensagem: "Erro de autenticação. Verifique as credenciais."
- Log de erro no console (apenas desenvolvimento)

---

### Cenário 3: Rate Limiting

**Simular:**
- Fazer múltiplas requisições rapidamente

**Comportamento esperado:**
- Erro 429 (Too Many Requests)
- Mensagem: "Muitas requisições. Tente novamente em alguns segundos."

---

## ✅ Checklist de Qualidade

### Funcionalidades Core
- [ ] Busca de DANFE por chave de acesso funciona
- [ ] Validação de formato impede chaves inválidas
- [ ] Mensagens de erro são claras e úteis
- [ ] Multi-step tool calling permite resposta formatada
- [ ] Conversação natural funciona corretamente

### Integração MCP
- [ ] Conexão com servidor MCP estabelecida
- [ ] Autenticação via API Key funciona
- [ ] Tools add_danfe e get_danfe_xml respondem
- [ ] Timeout configurado adequadamente
- [ ] Erros do servidor são tratados

### UI/UX
- [ ] Mensagens do usuário aparecem corretamente
- [ ] Mensagens do assistente aparecem corretamente
- [ ] Loading state durante busca
- [ ] Scroll automático para última mensagem
- [ ] Responsivo em mobile

### Performance
- [ ] Tempo de resposta < 5 segundos
- [ ] Streaming de resposta funciona
- [ ] Sem memory leaks
- [ ] Build de produção otimizado

### Segurança
- [ ] API Key não exposta no frontend
- [ ] Validação server-side de inputs
- [ ] Rate limiting implementado
- [ ] Logs não expõem dados sensíveis

---

## 📝 Relatório de Testes

### Template de Relatório

```markdown
# Relatório de Testes - [Data]

## Testes Executados
- [ ] Consulta básica
- [ ] Validação de chave
- [ ] Conversação natural
- [ ] Tratamento de erros
- [ ] Performance

## Resultados
- **Sucessos:** X/Y
- **Falhas:** Y/Y
- **Tempo médio de resposta:** Xms

## Problemas Encontrados
1. [Descrição do problema]
   - Severidade: Alta/Média/Baixa
   - Status: Aberto/Resolvido

## Recomendações
- [Sugestão de melhoria 1]
- [Sugestão de melhoria 2]
```

---

Para mais informações, consulte:
- [AGENT_GUIDE.md](./AGENT_GUIDE.md) - Documentação do agente
- [MCP_GUIDE.md](./MCP_GUIDE.md) - Documentação do MCP Client
- [README.md](./README.md) - Documentação geral do projeto
