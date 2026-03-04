

# Plano: Redesign da Tela de Visualização Interativa de Acessórios

## Objetivo
Transformar a `VehicleVisualizationScreen` em uma experiência de showroom digital imersiva, focada no produto, com seleção via checkboxes/switches, toggle "Antes/Depois", e CTA de destaque "Adicionar à Proposta".

## Layout Proposto

```text
┌─────────────────────────────────────────────────────────────┐
│  HEADER: Modelo + Cor + Ano                                 │
├───────────────────────────────────────┬─────────────────────┤
│                                       │  PAINEL ACESSÓRIOS  │
│                                       │                     │
│     IMAGEM DO VEÍCULO                 │  ☑ Rack de Teto     │
│     (área principal, ~70%)            │  ☑ Estribo Lateral  │
│                                       │  ☐ Protetor Cárter  │
│                                       │  ☐ Capota Marítima  │
│                                       │                     │
│  [Antes ○────● Depois]  [Girar 360°] │  ─────────────────  │
│                                       │  Total: R$ 4.300    │
│  Tags dos acessórios ativos           │                     │
│                                       │  [Adicionar à       │
│                                       │   Proposta]  🟠     │
└───────────────────────────────────────┴─────────────────────┘
```

## Mudanças Detalhadas

### 1. Arquivo: `src/components/VehicleVisualizationScreen.tsx` (rewrite completo)

**Novo estado:**
- `showBefore: boolean` — toggle entre visão "Antes" (veículo sem acessórios) e "Depois" (com acessórios selecionados)
- Manter `rotation` e `isRotating` existentes

**Seleção de acessórios — novo design:**
- Cada acessório usa um **Checkbox** (de `@radix-ui/react-checkbox`) ao invés de botões simples
- Mostrar nome + preço em cada linha
- Visual limpo com bordas finas e hover sutil

**Toggle "Antes / Depois":**
- Usar o componente `Switch` do Radix existente
- Labels "Antes" / "Depois" ao lado do switch
- Quando em "Antes": ocultar as tags de acessórios sobrepostas na imagem e aplicar um efeito visual sutil (ex: leve desaturação ou label "Original")
- Quando em "Depois": mostrar normalmente com tags dos acessórios

**CTA "Adicionar à Proposta":**
- Botão laranja proeminente (`bg-orange-500 hover:bg-orange-600`) no rodapé do painel lateral
- Texto: "Adicionar à Proposta"
- Ícone de carrinho (`ShoppingCart` do lucide)
- Substitui o botão "Gerar Argumentação" atual (que passa a ser secundário ou mantido como link)

**Imagem principal:**
- Manter o sistema de rotação 3D existente
- Quando toggle está em "Antes": mostrar imagem com label overlay "ORIGINAL" e sem tags de acessórios
- Quando em "Depois": mostrar tags dos acessórios selecionados como já funciona

### 2. Arquivo: `src/index.css` (adição mínima)

- Adicionar classe `.btn-cta-orange` para o botão laranja de CTA:
  - `background: #f97316` (orange-500), hover `#ea580c` (orange-600)
  - Texto branco, rounded, font-bold, sombra sutil

### 3. Fluxo no `Index.tsx`

- Adicionar novo callback `onAddToProposal` no `VehicleVisualizationScreen` que dispara o `SuccessModal` ou navega para o script
- O botão "Gerar Argumentação" permanece como ação secundária
- O novo CTA "Adicionar à Proposta" chama o callback principal

### Arquivos Afetados
1. `src/components/VehicleVisualizationScreen.tsx` — redesign completo
2. `src/index.css` — adicionar `.btn-cta-orange`
3. `src/pages/Index.tsx` — adicionar handler `onAddToProposal`

