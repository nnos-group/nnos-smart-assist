

# Plano: Assistente de Vendas com IA Local Aprimorada — Quebra de Objeções por 3 Pilares

## Objetivo
Substituir a lógica simples de regex por um sistema local sofisticado que gera argumentos categorizados nos 3 pilares (Segurança, Valorização, Estilo de Vida) + roteiro de diálogo sugerido, com conhecimento específico por acessório e marca JEEP/RAM.

## Mudanças no `SalesScriptScreen.tsx`

### 1. Nova estrutura de saída (substitui `CounterArgument`)

```text
interface SalesArgument {
  category: "security" | "value" | "lifestyle";
  icon: string;
  label: string;          // "Segurança e Proteção", "Valorização do Bem", "Estilo de Vida"
  hook: string;           // Frase de impacto para o vendedor
  content: string;        // Argumento detalhado
}

interface CounterArgumentResult {
  arguments: SalesArgument[];      // 3 argumentos (1 por pilar)
  dialogueScript: string;          // Roteiro sugerido de diálogo
  closingPhrase: string;           // Frase de fechamento
}
```

### 2. Base de conhecimento por acessório (`accessoryKnowledge`)

Mapa local com argumentos específicos para cada `id` de acessório, cobrindo os 3 pilares. Exemplos:

- **estribo**: Segurança (apoio para crianças/idosos, anti-escorregão) → Valorização (barreira contra portadas, +15% revenda) → Lifestyle (declaração de chegada, estribo elétrico recolhe automaticamente)
- **protetor**: Segurança (armadura para motor/câmbio, evita prejuízo de R$20k+) → Valorização (manutenção preventiva, economia longo prazo) → Lifestyle (liberdade off-road sem preocupação)
- **capota**: Segurança (proteção de carga contra furto/intempéries) → Valorização (RAM com capota original valoriza na revenda) → Lifestyle (versatilidade e praticidade)
- **pneus**: Segurança (tração em chuva/terra, redução distância frenagem) → Valorização (dura 40% mais, economia com trocas) → Lifestyle (liberdade de pegar qualquer estrada)
- **santantonio**: Segurança (proteção de cabine em capotamento) → Valorização (acessório original Mopar) → Lifestyle (visual imponente e robusto)
- **rack/guincho/engate/sensor/farol/friso/toolbox**: argumentos equivalentes por pilar

### 3. Lógica de geração (`generateSalesArguments`)

1. Para cada acessório focado, buscar argumentos no `accessoryKnowledge`
2. Cruzar com o tipo de objeção detectada (preço, necessidade, tempo, origem) para priorizar o pilar mais relevante
3. Combinar argumentos dos acessórios selecionados em 3 blocos (1 por pilar)
4. Personalizar com dados do cliente (nome, gênero, veículo, região, terreno, clima)
5. Gerar roteiro de diálogo contextualizado: "Quando o cliente disser '[objeção]', você pode responder..."
6. Campo de objeção passa a ser **opcional** — se vazio, gera argumentação proativa genérica

### 4. Nova UI da seção de resultado

Substituir o card único de resposta por:

```text
┌─────────────────────────────────────────────┐
│  🛡️ Segurança e Proteção                    │
│  • [Frase de impacto / gancho]              │
│  • [Argumento detalhado personalizado]       │
├─────────────────────────────────────────────┤
│  💰 Valorização do Bem                       │
│  • [Frase de impacto / gancho]              │
│  • [Argumento detalhado personalizado]       │
├─────────────────────────────────────────────┤
│  ✨ Estilo de Vida e Exclusividade           │
│  • [Frase de impacto / gancho]              │
│  • [Argumento detalhado personalizado]       │
├─────────────────────────────────────────────┤
│  💬 Roteiro Sugerido                         │
│  "Quando o cliente disser '[X]',            │
│   você pode responder: ..."                 │
└─────────────────────────────────────────────┘
```

Cada bloco é um sub-card com ícone colorido, título do pilar, bullet points com gancho + argumento.

### 5. Ajustes na UI existente

- Botão "Send" muda label para "Gerar Argumentação" (mantém ícone `Send`)
- Placeholder do textarea: `'Descreva a objeção do cliente (opcional). Ex: "Achou caro", "Não vê necessidade", "A esposa não gostou"...'`
- Botão agora funciona **mesmo sem objeção digitada** (gera argumentação proativa se campo vazio)
- Desabilitar botão apenas se nenhum acessório estiver focado

### Arquivo afetado
- `src/components/SalesScriptScreen.tsx` — único arquivo modificado

