/**
 * Smart-Sell — Sales Argumentation Types
 *
 * Interfaces para o sistema de inteligência de argumentação comercial.
 * Cada recomendação gera automaticamente uma estrutura de "como vender",
 * personalizada pelo contexto do cliente, veículo, região e estoque.
 */

/** Resposta IA para uma objeção específica */
export interface ObjectionResponse {
  objection: string;
  response: string;
  category: "price" | "necessity" | "time" | "origin" | "partner" | "aesthetic" | "generic";
}

/** Argumentação de venda para um acessório individual */
export interface AccessorySellArgument {
  accessoryId: string;
  accessoryName: string;
  /** Por que recomendar — benefício racional e personalizado */
  whyRecommend: string;
  /** Como abordar o cliente — frase natural sugerida para o vendedor */
  approachPhrase: string;
  /** Argumentos principais — 2 a 4 benefícios objetivos contextuais */
  mainArguments: string[];
  /** Pergunta de fechamento — conduzir o cliente à decisão */
  closingQuestion: string;
  /** Objeções possíveis com respostas recomendadas */
  objections: ObjectionResponse[];
}

/** Narrativa de venda para o pacote completo como solução integrada */
export interface PackageNarrative {
  /** Headline de impacto para apresentação */
  headline: string;
  /** Narrativa completa combinando todos os acessórios */
  narrative: string;
  /** Benefícios-chave do pacote combinado */
  keyBenefits: string[];
  /** Frase de fechamento do pacote */
  packageClosing: string;
}

/** Resultado completo da geração de argumentação */
export interface SellRecommendation {
  mode: "prepare" | "recover";
  /** Argumentação individual por acessório */
  individualArguments: AccessorySellArgument[];
  /** Narrativa integrada do pacote */
  packageNarrative: PackageNarrative;
  /** Mensagem WhatsApp argumentativa (não apenas orçamento) */
  whatsappMessage: string;
  /** Score de confiança IA (0-100) */
  confidenceScore: number;
  /** Contexto da oportunidade */
  opportunityContext: "crm" | "showroom" | "delivery" | "postsale";
}

/** Contexto de recuperação de venda (Modo 2) */
export interface RecoveryContext {
  /** Acessórios recusados na proposta original */
  refusedAccessoryIds: string[];
  /** Motivo declarado da perda/objeção */
  lossReason: string;
  /** Valor da proposta original */
  originalProposalValue: number;
  /** Notas/respostas anteriores do cliente */
  previousNotes?: string;
  /** Campanha ou desconto disponível */
  availableDiscount?: number;
}

/** Log de argumentação utilizada — alimenta analytics de conversão */
export interface ArgumentationLog {
  id: string;
  timestamp: string;
  clientName: string;
  vehicleModel: string;
  region: string;
  accessoryIds: string[];
  accessoryNames: string[];
  mode: "prepare" | "recover";
  /** Resumo da argumentação utilizada */
  argumentSummary: string;
  /** Objeção apresentada pelo cliente */
  objectionPresented?: string;
  /** Resposta utilizada pelo vendedor */
  responseUsed?: string;
  /** Resultado da negociação */
  result?: "won" | "lost" | "pending";
  /** Motivo da perda (quando result = "lost") */
  lossReason?: string;
  /** Valor total da proposta */
  proposalValue: number;
  /** Contexto da oportunidade */
  opportunityContext: "crm" | "showroom" | "delivery" | "postsale";
  /** Vendedor (se identificado) */
  seller?: string;
  /** Concessionária */
  dealership?: string;
}
