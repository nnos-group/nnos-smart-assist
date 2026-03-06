

# Plano: Redesign Inspirado no Salesforce Lightning

## Referência Visual Capturada

A página do Salesforce Help apresenta:
- **Barra superior azul escuro** com logo e navegação principal
- **Barra secundária clara** com links e dropdowns
- **Fundo branco limpo** com conteúdo centralizado
- **Tipografia profissional** com boa hierarquia
- **Bordas finas e sutis**, sem sombras pesadas
- **Cores**: azul Salesforce (#032D60 escuro, #0176D3 links), fundo branco puro, texto cinza escuro

## Mudanças Planejadas

### 1. Paleta de Cores (index.css)
Atualizar as variáveis CSS para refletir o estilo Salesforce Lightning:
- `--primary`: azul Salesforce (#032D60 → HSL ~210 95% 19%)
- `--accent`: azul ação (#0176D3 → HSL ~207 98% 41%)
- Manter `--ram-red` para CTAs de destaque
- Fundo mais branco e limpo (menos gradients mesh)
- Cards com fundo branco puro, bordas finas cinza claro

### 2. NavigationBar — Estilo Salesforce
- Barra superior com fundo azul escuro sólido (sem blur/glass)
- Logo branco no canto esquerdo
- Steps/progress em pills brancas/transparentes sobre fundo escuro
- Botão sair com ícone branco

### 3. LoginScreen — Estilo Enterprise
- Card centralizado sobre fundo branco/cinza claro
- Logo acima do card com ícone de nuvem/cloud estilo SF
- Inputs com bordas finas cinza, sem sombras internas
- Botão azul sólido (sem gradiente vermelho)

### 4. ClientDataScreen — Layout Clean
- Cards com borda fina `#e5e5e5`, fundo branco puro
- Headers de seção com ícone azul + texto em bold
- Dropdowns e inputs com estilo mais "flat" e corporativo
- Remover gradientes decorativos, usar separadores horizontais finos

### 5. PackageSuggestionScreen — Tabela Profissional
- Lista de acessórios em formato mais "table-like" com linhas alternadas
- Badges de estoque mantidos mas com estilo mais flat
- Summary card com bordas limpas, sem sombras pesadas

### 6. VehicleVisualizationScreen & SalesScriptScreen
- Mesmo tratamento: fundo limpo, cards brancos, bordas finas
- Tipografia mais sóbria, menos emojis decorativos
- Botões azuis sólidos como CTAs principais

### 7. Componentes de Estilo (index.css)
- `.card-premium`: borda `1px solid #d8dde6`, sem gradiente de fundo
- `.btn-primary`: azul sólido `#0176D3`, hover mais escuro, sem sombra glow
- `.btn-accent`: manter vermelho para ações de destaque (fechar venda)
- `.input-field`: borda `#d8dde6`, foco azul, sem rounded-xl (usar rounded-md)
- Remover `pulse-glow`, `shimmer` e gradientes mesh do background
- Adicionar `.sf-card` com estilo Salesforce Lightning card

### Arquivos Afetados
1. `src/index.css` — Paleta, variáveis, componentes globais
2. `tailwind.config.ts` — Cores atualizadas
3. `src/components/NavigationBar.tsx` — Barra azul escura SF-style
4. `src/components/LoginScreen.tsx` — Layout enterprise
5. `src/components/ClientDataScreen.tsx` — Cards clean
6. `src/components/PackageSuggestionScreen.tsx` — Lista profissional
7. `src/components/VehicleVisualizationScreen.tsx` — Visual limpo
8. `src/components/SalesScriptScreen.tsx` — Script corporativo
9. `src/components/SuccessModal.tsx` — Modal clean

