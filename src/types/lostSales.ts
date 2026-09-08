/**
 * Smart-Sell — Lost Sales / Pareto Analysis Types
 *
 * Interfaces para o painel gerencial de vendas perdidas.
 * Permite análise de Pareto sobre oportunidades perdidas,
 * identificando padrões de recusa e oportunidades de melhoria.
 */

/** Registro individual de venda perdida */
export interface LostSaleRecord {
  id: string;
  clientName: string;
  vehicleModel: string;
  region: string;
  seller?: string;
  dealership?: string;
  /** IDs dos acessórios recusados */
  accessoriesRefused: { id: string; name: string; price: number }[];
  /** Valor total perdido */
  totalLostValue: number;
  /** Motivo principal da perda */
  lossReason: string;
  /** Notas adicionais */
  notes?: string;
  /** Data/hora da perda */
  lostAt: string;
  /** Argumentação utilizada antes da perda (se houve) */
  argumentationLogId?: string;
}

/** Métrica individual para ranking */
export interface RankedMetric {
  label: string;
  count: number;
  value: number;
  percentage: number;
}

/** Resultado completo da análise de Pareto */
export interface ParetoAnalysis {
  /** Total de oportunidades perdidas */
  totalOpportunities: number;
  /** Valor total perdido (R$) */
  totalLostValue: number;
  /** Ticket médio perdido (R$) */
  avgTicket: number;
  /** Total de clientes perdidos */
  totalClientsLost: number;
  /** Acessórios mais recusados */
  topRefusedAccessories: RankedMetric[];
  /** Principais motivos de perda */
  topLossReasons: RankedMetric[];
  /** Perdas por modelo de veículo */
  lossesByVehicle: RankedMetric[];
  /** Perdas por região */
  lossesByRegion: RankedMetric[];
  /** Perdas por vendedor */
  lossesBySeller: RankedMetric[];
  /** Perdas por concessionária */
  lossesByDealership: RankedMetric[];
}
