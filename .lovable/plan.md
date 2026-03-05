

# Plano: Unificar Acessórios + Quebra de Objeções com Seleção por Item

## Objetivo
Fundir a seção "Acessórios Incluídos" (linhas 247-265) com a seção "Quebra de Objeções" (linhas 288-341) em uma única seção. Os acessórios passam a ser selecionáveis individualmente dentro dessa seção, e a contra-argumentação gerada será personalizada conforme os itens selecionados pelo consultor.

## Mudanças no `SalesScriptScreen.tsx`

### Nova seção unificada: "Acessórios & Quebra de Objeções"
- Remover a seção "Acessórios Incluídos" separada (linhas 247-265)
- Remover a seção "Quebra de Objeções" separada (linhas 288-341)
- Criar uma única seção com:
  - Header: "Acessórios & Quebra de Objeções" (ícones Shield + Package)
  - Lista de acessórios selecionados como **chips clicáveis** (toggle on/off) — estado local `focusedAccessoryIds: Set<string>` controla quais estão "em foco" para a objeção
  - Por padrão todos estão selecionados; o consultor pode clicar para focar em itens específicos sobre os quais o cliente tem objeção
  - Total dinâmico mostrando apenas os itens em foco
  - Abaixo dos chips: o textarea + voz + botão de gerar (como já existe)
  - A função `generateCounterArgument` recebe os acessórios em foco (não todos) para personalizar a resposta

### Lógica
- Novo state: `focusedAccessoryIds: string[]` — inicializado com todos os IDs dos `selectedAccessories`
- Toggle individual: clicar no chip alterna o item no array de foco
- `generateCounterArgument` usa apenas os acessórios focados para gerar nomes, preços e argumentos
- Se nenhum item estiver focado, mostrar aviso para selecionar ao menos um

### Arquivo afetado
- `src/components/SalesScriptScreen.tsx` — única mudança

