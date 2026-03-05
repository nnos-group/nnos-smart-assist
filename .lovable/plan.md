

# Plano: Aprimorar Tela de Argumentação Consultiva

## Mudanças

### 1. `SalesScriptScreen.tsx` — Rewrite

**Texto do header:**
- Linha 72: Alterar `"Script de Vendas — IA"` para `"Script de Vendas"`

**Nova seção: "Quebra de Objeções"**
Adicionar entre as "Dicas de Fechamento" e o CTA uma nova seção interativa:

- Um card com título "Quebra de Objeções" (ícone `Shield` ou `MessageSquareWarning`)
- Campo `Textarea` para o consultor digitar a objeção do cliente (placeholder: "Descreva a objeção do cliente...")
- Botão de captação por voz (reutilizar o padrão do `VoiceInputButton` — usar `SpeechRecognition` nativo para transcrever a objeção direto no textarea)
- Botão "Gerar Contra-Argumentação"
- Ao clicar, um sistema de matching local (sem API externa) identifica a categoria da objeção e exibe uma contra-argumentação personalizada com dados do cliente/veículo/pacote

**Categorias de objeções e técnicas de quebra de rejeição:**

| Objeção detectada | Técnica | Contra-argumento gerado |
|---|---|---|
| "caro" / "preço alto" / "não tenho dinheiro" | Parcelamento + custo-benefício | "Financiando junto ao veículo, fica apenas R$ X/mês. Sem proteção, um reparo de pintura custa R$ Y..." |
| "não preciso" / "desnecessário" | Ancoragem no terreno/clima | "Para uso em [terreno] no [estado], [acessório] é essencial. 8 em 10 clientes da sua região optam..." |
| "vou pensar" / "depois eu vejo" | Urgência + exclusividade | "Este pacote tem condição especial vinculada à compra do veículo. Após a saída, o valor individual..." |
| "já tenho" / "compro fora" | Garantia + procedência | "Acessórios originais mantêm a garantia de fábrica do [veículo]. Itens paralelos podem..." |
| Genérica / não identificada | Valor percebido | "O [pacote] foi montado especificamente para o perfil de uso do Sr./Sra. [nome]..." |

**Novos states no componente:**
- `objectionText: string` — texto da objeção
- `counterArgument: { title, content, technique } | null` — resultado gerado
- `isRecordingObjection: boolean` — estado do mic

### 2. Arquivos afetados
- `src/components/SalesScriptScreen.tsx` — único arquivo modificado

