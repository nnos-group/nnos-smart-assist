/**
 * Smart-Sell — Argumentation Repository
 *
 * Persistência e analytics de argumentações comerciais.
 * Registra cada argumentação utilizada, vincula a resultados (ganhou/perdeu)
 * e calcula análise de Pareto sobre vendas perdidas.
 */

import { ArgumentationLog } from "@/types/salesArgument";
import { LostSaleRecord, ParetoAnalysis, RankedMetric, CommercialManagementOverview } from "@/types/lostSales";

const ARGUMENTATION_LOG_KEY = "smart_sell_argumentation_log_v1";
const LOST_SALES_KEY = "smart_sell_lost_sales_v1";

// ─── Sample Data ───────────────────────────────────────────────────────────────

const INITIAL_ARGUMENTATION_LOGS: ArgumentationLog[] = [
  {
    id: "arg-sample-1",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    clientName: "Carlos Silva",
    vehicleModel: "JEEP RENEGADE TRAILHAWK",
    region: "São Paulo",
    accessoryIds: ["bagageiro", "estribo", "protetor"],
    accessoryNames: ["Bagageiro de Teto Mopar Trail 400L", "Estribo Lateral Off-Road", "Protetor de Carter 4x4"],
    mode: "prepare",
    argumentSummary: "Argumentação focada em proteção off-road e versatilidade para uso misto",
    objectionPresented: "Orçamento / Preço no Momento",
    responseUsed: "Diluição no CDC e preservação de garantia",
    result: "lost",
    lossReason: "Orçamento / Preço no Momento",
    proposalValue: 11212,
    opportunityContext: "showroom",
    seller: "Ricardo Mendes",
    dealership: "Concessionária Jeep Campinas",
  },
  {
    id: "arg-sample-2",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    clientName: "Mariana Souza",
    vehicleModel: "RAM RAMPAGE REBEL",
    region: "Mato Grosso",
    accessoryIds: ["estribo", "protetor"],
    accessoryNames: ["Estribo Lateral Premium", "Protetor de Caçamba HD"],
    mode: "prepare",
    argumentSummary: "Argumentação focada em proteção para uso rural e valorização na revenda",
    objectionPresented: "Consulta a Cônjuge / Sócio",
    responseUsed: "Envio de visualização 3D pelo WhatsApp para decisão conjunta",
    result: "lost",
    lossReason: "Consulta a Cônjuge / Sócio",
    proposalValue: 3556,
    opportunityContext: "showroom",
    seller: "Ana Paula Costa",
    dealership: "Concessionária Jeep Campinas",
  },
  {
    id: "arg-sample-3",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    clientName: "Roberto Albuquerque",
    vehicleModel: "JEEP COMPASS LONGITUDE",
    region: "Minas Gerais",
    accessoryIds: ["friso", "rack"],
    accessoryNames: ["Friso Lateral Pintado", "Barras Transversais de Teto"],
    mode: "prepare",
    argumentSummary: "Argumentação focada em preservação da pintura e versatilidade para viagens",
    objectionPresented: "Decidir Próximo à Entrega / Revisão",
    responseUsed: "Condição especial vinculada à compra e alerta de aumento de tabela",
    result: "lost",
    lossReason: "Decidir Próximo à Entrega / Revisão",
    proposalValue: 1987,
    opportunityContext: "crm",
    seller: "Ricardo Mendes",
    dealership: "Concessionária Jeep Campinas",
  },
  {
    id: "arg-sample-4",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    clientName: "Fernando Oliveira",
    vehicleModel: "JEEP COMPASS SERIE S",
    region: "São Paulo",
    accessoryIds: ["bagageiro", "estribo", "pneus"],
    accessoryNames: ["Bagageiro Black Piano 450L", "Estribo Dark Série S", "Pneus High Performance"],
    mode: "prepare",
    argumentSummary: "Argumentação focada em estilo Série S e performance urbana",
    result: "won",
    proposalValue: 11000,
    opportunityContext: "showroom",
    seller: "Ana Paula Costa",
    dealership: "Concessionária Jeep Campinas",
  },
  {
    id: "arg-sample-5",
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    clientName: "Juliana Ferreira",
    vehicleModel: "FIAT TORO RANCH",
    region: "Goiás",
    accessoryIds: ["estribo", "protetor", "capota"],
    accessoryNames: ["Estribo Lateral Tubular", "Protetor de Caçamba", "Capota Marítima"],
    mode: "prepare",
    argumentSummary: "Argumentação focada em proteção rural e praticidade da caçamba",
    objectionPresented: "Prefere Apenas Uso Básico Urbano",
    responseUsed: "Demonstração de que 80% dos danos ocorrem no uso urbano também",
    result: "lost",
    lossReason: "Prefere Apenas Uso Básico Urbano",
    proposalValue: 3850,
    opportunityContext: "delivery",
    seller: "Ricardo Mendes",
    dealership: "Concessionária Jeep Campinas",
  },
  {
    id: "arg-sample-6",
    timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    clientName: "Paulo Henrique",
    vehicleModel: "RAM RAMPAGE LARAMIE",
    region: "Mato Grosso do Sul",
    accessoryIds: ["estribo", "protetor", "friso", "capota"],
    accessoryNames: ["Estribo Lateral Premium", "Protetor de Caçamba HD", "Friso Lateral Cromado", "Capota Rígida Elétrica"],
    mode: "recover",
    argumentSummary: "Recuperação com desconto de estoque dormente e reorganização do pacote",
    objectionPresented: "Aguardando Condição Especial / Bônus Montadora",
    responseUsed: "Apresentação do desconto automático de giro de estoque como bônus equivalente",
    result: "won",
    proposalValue: 8750,
    opportunityContext: "crm",
    seller: "Ana Paula Costa",
    dealership: "Concessionária Jeep Campinas",
  },
];

const INITIAL_LOST_SALES: LostSaleRecord[] = [
  {
    id: "lost-1",
    clientName: "Carlos Silva",
    vehicleModel: "JEEP RENEGADE TRAILHAWK",
    region: "São Paulo",
    seller: "Ricardo Mendes",
    dealership: "Concessionária Jeep Campinas",
    accessoriesRefused: [
      { id: "bagageiro", name: "Bagageiro de Teto Mopar Trail 400L", price: 3100 },
      { id: "estribo", name: "Estribo Lateral Off-Road", price: 2600 },
      { id: "protetor", name: "Protetor de Carter 4x4", price: 1312 },
    ],
    totalLostValue: 11212,
    lossReason: "Orçamento / Preço no Momento",
    notes: "Achou o valor à vista alto. Tem interesse se houver bônus de montadora.",
    lostAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    argumentationLogId: "arg-sample-1",
  },
  {
    id: "lost-2",
    clientName: "Mariana Souza",
    vehicleModel: "RAM RAMPAGE REBEL",
    region: "Mato Grosso",
    seller: "Ana Paula Costa",
    dealership: "Concessionária Jeep Campinas",
    accessoriesRefused: [
      { id: "estribo", name: "Estribo Lateral Premium", price: 2500 },
      { id: "protetor", name: "Protetor de Caçamba HD", price: 1056 },
    ],
    totalLostValue: 3556,
    lossReason: "Consulta a Cônjuge / Sócio",
    notes: "Gostou da visualização 3D. Pediu WhatsApp para mostrar ao marido.",
    lostAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    argumentationLogId: "arg-sample-2",
  },
  {
    id: "lost-3",
    clientName: "Roberto Albuquerque",
    vehicleModel: "JEEP COMPASS LONGITUDE",
    region: "Minas Gerais",
    seller: "Ricardo Mendes",
    dealership: "Concessionária Jeep Campinas",
    accessoriesRefused: [
      { id: "friso", name: "Friso Lateral Pintado", price: 338 },
      { id: "rack", name: "Barras Transversais de Teto", price: 1650 },
    ],
    totalLostValue: 1987,
    lossReason: "Decidir Próximo à Entrega / Revisão",
    notes: "Quer retirar o carro original e talvez instalar na 1ª revisão.",
    lostAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    argumentationLogId: "arg-sample-3",
  },
  {
    id: "lost-4",
    clientName: "Juliana Ferreira",
    vehicleModel: "FIAT TORO RANCH",
    region: "Goiás",
    seller: "Ricardo Mendes",
    dealership: "Concessionária Jeep Campinas",
    accessoriesRefused: [
      { id: "estribo", name: "Estribo Lateral Tubular", price: 1800 },
      { id: "protetor", name: "Protetor de Caçamba", price: 850 },
      { id: "capota", name: "Capota Marítima", price: 1200 },
    ],
    totalLostValue: 3850,
    lossReason: "Prefere Apenas Uso Básico Urbano",
    notes: "Não vê necessidade para uso na cidade.",
    lostAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    argumentationLogId: "arg-sample-5",
  },
  {
    id: "lost-5",
    clientName: "André Martins",
    vehicleModel: "JEEP RENEGADE SPORT",
    region: "Rio de Janeiro",
    seller: "Ana Paula Costa",
    dealership: "Concessionária Jeep Campinas",
    accessoriesRefused: [
      { id: "bagageiro", name: "Bagageiro de Teto Mopar 400L", price: 2850 },
      { id: "sensor", name: "Câmera e Sensores de Ré", price: 1800 },
    ],
    totalLostValue: 4650,
    lossReason: "Orçamento / Preço no Momento",
    notes: "Achou que o pacote com sensores ficou caro demais.",
    lostAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "lost-6",
    clientName: "Cláudia Santos",
    vehicleModel: "JEEP COMPASS LIMITED",
    region: "São Paulo",
    seller: "Ricardo Mendes",
    dealership: "Concessionária Jeep Campinas",
    accessoriesRefused: [
      { id: "estribo", name: "Estribo Lateral Slim Dark", price: 2600 },
      { id: "friso", name: "Friso Lateral Cromado", price: 780 },
    ],
    totalLostValue: 3380,
    lossReason: "Aguardando Condição Especial / Bônus Montadora",
    notes: "Quer esperar o bônus de fim de ano.",
    lostAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// ─── Argumentation Log CRUD ────────────────────────────────────────────────────

export const getArgumentationLogs = (): ArgumentationLog[] => {
  if (typeof window === "undefined") return INITIAL_ARGUMENTATION_LOGS;
  try {
    const raw = localStorage.getItem(ARGUMENTATION_LOG_KEY);
    if (!raw) {
      localStorage.setItem(ARGUMENTATION_LOG_KEY, JSON.stringify(INITIAL_ARGUMENTATION_LOGS));
      return INITIAL_ARGUMENTATION_LOGS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(ARGUMENTATION_LOG_KEY, JSON.stringify(INITIAL_ARGUMENTATION_LOGS));
      return INITIAL_ARGUMENTATION_LOGS;
    }
    return parsed;
  } catch {
    return INITIAL_ARGUMENTATION_LOGS;
  }
};

export const saveArgumentationLog = (log: Omit<ArgumentationLog, "id" | "timestamp">): ArgumentationLog => {
  const currentLogs = getArgumentationLogs();
  const newLog: ArgumentationLog = {
    ...log,
    id: `arg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
  };
  const updated = [newLog, ...currentLogs];
  try {
    localStorage.setItem(ARGUMENTATION_LOG_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("smart_sell_argumentation_updated"));
  } catch (err) {
    console.error("Erro ao salvar log de argumentação:", err);
  }
  return newLog;
};

export const updateArgumentationResult = (
  logId: string,
  result: "won" | "lost",
  lossReason?: string
): void => {
  const logs = getArgumentationLogs();
  const updated = logs.map((l) =>
    l.id === logId ? { ...l, result, lossReason: lossReason || l.lossReason } : l
  );
  try {
    localStorage.setItem(ARGUMENTATION_LOG_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("smart_sell_argumentation_updated"));
  } catch (err) {
    console.error("Erro ao atualizar resultado da argumentação:", err);
  }
};

// ─── Lost Sales CRUD ───────────────────────────────────────────────────────────

export const getLostSales = (): LostSaleRecord[] => {
  if (typeof window === "undefined") return INITIAL_LOST_SALES;
  try {
    const raw = localStorage.getItem(LOST_SALES_KEY);
    if (!raw) {
      localStorage.setItem(LOST_SALES_KEY, JSON.stringify(INITIAL_LOST_SALES));
      return INITIAL_LOST_SALES;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(LOST_SALES_KEY, JSON.stringify(INITIAL_LOST_SALES));
      return INITIAL_LOST_SALES;
    }
    return parsed;
  } catch {
    return INITIAL_LOST_SALES;
  }
};

export const saveLostSale = (record: Omit<LostSaleRecord, "id" | "lostAt">): LostSaleRecord => {
  const current = getLostSales();
  const newRecord: LostSaleRecord = {
    ...record,
    id: `lost-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    lostAt: new Date().toISOString(),
  };
  const updated = [newRecord, ...current];
  try {
    localStorage.setItem(LOST_SALES_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("smart_sell_lost_sales_updated"));
  } catch (err) {
    console.error("Erro ao salvar venda perdida:", err);
  }
  return newRecord;
};

export const logLostSale = (data: Partial<LostSaleRecord> & Record<string, unknown>): LostSaleRecord => {
  return saveLostSale({
    clientName: (data.clientName as string) || "Cliente",
    vehicleModel: (data.vehicleModel as string) || "Compass",
    region: (data.region as string) || "SP",
    seller: (data.seller as string) || "Consultor",
    dealership: (data.dealership as string) || "Concessionária Autorizada",
    accessoriesRefused: Array.isArray(data.selectedAccessories)
      ? (data.selectedAccessories as string[]).map((name: string, i: number) => ({ id: `acc-${i}`, name, price: 0 }))
      : Array.isArray(data.accessoriesRefused)
      ? data.accessoriesRefused
      : [],
    totalLostValue: (data.totalValue as number) || (data.totalLostValue as number) || 0,
    lossReason: (data.primaryReason as string) || (data.lossReason as string) || "Preço",
    notes: (data.notes as string) || (data.lostNotes as string) || "",
    argumentationLogId: data.argumentationLogId as string | undefined,
  });
};

// ─── Pareto Analysis ───────────────────────────────────────────────────────────

const buildRankedMetrics = (
  items: { key: string; value: number }[],
  total: number
): RankedMetric[] => {
  const grouped = new Map<string, { count: number; value: number }>();
  items.forEach(({ key, value }) => {
    const existing = grouped.get(key) || { count: 0, value: 0 };
    grouped.set(key, { count: existing.count + 1, value: existing.value + value });
  });

  return Array.from(grouped.entries())
    .map(([label, data]) => ({
      label,
      count: data.count,
      value: data.value,
      percentage: total > 0 ? Math.round((data.count / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);
};

export const calculateParetoAnalysis = (): ParetoAnalysis => {
  const lostSales = getLostSales();

  const totalOpportunities = lostSales.length;
  const totalLostValue = lostSales.reduce((sum, s) => sum + s.totalLostValue, 0);
  const avgTicket = totalOpportunities > 0 ? Math.round(totalLostValue / totalOpportunities) : 0;
  const totalClientsLost = new Set(lostSales.map((s) => s.clientName)).size;

  // Acessórios mais recusados (cada acessório individual conta)
  const accessoryItems: { key: string; value: number }[] = [];
  lostSales.forEach((sale) => {
    sale.accessoriesRefused.forEach((acc) => {
      accessoryItems.push({ key: acc.name, value: acc.price });
    });
  });
  const topRefusedAccessories = buildRankedMetrics(accessoryItems, accessoryItems.length);

  // Motivos de perda
  const reasonItems = lostSales.map((s) => ({ key: s.lossReason, value: s.totalLostValue }));
  const topLossReasons = buildRankedMetrics(reasonItems, totalOpportunities);

  // Por veículo
  const vehicleItems = lostSales.map((s) => ({ key: s.vehicleModel, value: s.totalLostValue }));
  const lossesByVehicle = buildRankedMetrics(vehicleItems, totalOpportunities);

  // Por região
  const regionItems = lostSales.map((s) => ({ key: s.region, value: s.totalLostValue }));
  const lossesByRegion = buildRankedMetrics(regionItems, totalOpportunities);

  // Por vendedor
  const sellerItems = lostSales
    .filter((s) => s.seller)
    .map((s) => ({ key: s.seller!, value: s.totalLostValue }));
  const lossesBySeller = buildRankedMetrics(sellerItems, sellerItems.length);

  // Por concessionária
  const dealershipItems = lostSales
    .filter((s) => s.dealership)
    .map((s) => ({ key: s.dealership!, value: s.totalLostValue }));
  const lossesByDealership = buildRankedMetrics(dealershipItems, dealershipItems.length);

  return {
    totalOpportunities,
    totalLostValue,
    avgTicket,
    totalClientsLost,
    topRefusedAccessories,
    topLossReasons,
    lossesByVehicle,
    lossesByRegion,
    lossesBySeller,
    lossesByDealership,
  };
};

/** Retorna argumentações com resultado para analytics de conversão */
export const getConversionAnalytics = (): {
  totalArgumentations: number;
  won: number;
  lost: number;
  pending: number;
  conversionRate: number;
  topWinningModes: { mode: string; count: number }[];
} => {
  const logs = getArgumentationLogs();
  const won = logs.filter((l) => l.result === "won").length;
  const lost = logs.filter((l) => l.result === "lost").length;
  const pending = logs.filter((l) => !l.result || l.result === "pending").length;
  const decided = won + lost;

  const prepareWins = logs.filter((l) => l.mode === "prepare" && l.result === "won").length;
  const recoverWins = logs.filter((l) => l.mode === "recover" && l.result === "won").length;

  return {
    totalArgumentations: logs.length,
    won,
    lost,
    pending,
    conversionRate: decided > 0 ? Math.round((won / decided) * 100) : 0,
    topWinningModes: [
      { mode: "Preparar a Venda", count: prepareWins },
      { mode: "Recuperar a Venda", count: recoverWins },
    ],
  };
};

/** Retorna visão executiva consolidada da gestão comercial da concessionária */
export const getCommercialManagementOverview = (): CommercialManagementOverview => {
  const lostSales = getLostSales();
  const logs = getArgumentationLogs();
  const dynamicWon = logs.filter((l) => l.result === "won").length;
  const dynamicLost = Math.max(lostSales.length, logs.filter((l) => l.result === "lost").length);

  // Valores de referência do painel executivo com acoplamento aos dados dinâmicos do MVP
  const totalServiceCalls = 128 + Math.max(0, logs.length - 6);
  const completedSales = 47 + Math.max(0, dynamicWon - 2);
  const lostSalesCount = 24 + Math.max(0, dynamicLost - 6);
  const openProposals = Math.max(0, totalServiceCalls - completedSales - lostSalesCount);
  const decided = completedSales + lostSalesCount;
  const conversionRate = decided > 0 ? Number(((completedSales / decided) * 100).toFixed(1)) : 36.7;
  const totalRevenue = 184500 + Math.max(0, dynamicWon - 2) * 3925;
  const avgTicket = completedSales > 0 ? Math.round(totalRevenue / completedSales) : 3925;

  return {
    totalServiceCalls,
    completedSales,
    openProposals,
    lostSalesCount,
    conversionRate,
    totalRevenue,
    avgTicket,
    pipelineStages: [
      { id: "stage-1", label: "Em atendimento", count: 28, value: 104200, conversionPercent: 100, color: "blue" },
      { id: "stage-2", label: "Proposta enviada", count: 24, value: 89400, conversionPercent: 85, color: "indigo" },
      { id: "stage-3", label: "Em negociação", count: 15, value: 58600, conversionPercent: 53, color: "amber" },
      { id: "stage-4", label: "Aguardando retorno", count: 14, value: 51100, conversionPercent: 50, color: "purple" },
      { id: "stage-5", label: "Venda concluída", count: completedSales, value: totalRevenue, conversionPercent: Math.round(conversionRate), color: "emerald" },
      { id: "stage-6", label: "Venda perdida", count: lostSalesCount, value: 94200, conversionPercent: 100 - Math.round(conversionRate), color: "rose" },
    ],
    topSellingAccessories: [
      { rank: 1, name: "Tapetes All-Weather de Borda Elevada", salesCount: 38, revenue: 30020 },
      { rank: 2, name: "Estribo Lateral Tubular / Premium", salesCount: 29, revenue: 72500 },
      { rank: 3, name: "Protetor de Cárter Reforçado HD", salesCount: 26, revenue: 31200 },
      { rank: 4, name: "Engate de Reboque Removível Mopar", salesCount: 21, revenue: 48300 },
      { rank: 5, name: "Barras Transversais de Teto Mopar", salesCount: 18, revenue: 26100 },
    ],
    productConversionComparison: [
      { name: "Tapetes All-Weather de Borda Elevada", recommendedCount: 52, presentedCount: 48, soldCount: 38, conversionRate: 79.2, revenue: 30020 },
      { name: "Estribo Lateral Tubular / Premium", recommendedCount: 44, presentedCount: 39, soldCount: 29, conversionRate: 74.4, revenue: 72500 },
      { name: "Protetor de Cárter Reforçado HD", recommendedCount: 41, presentedCount: 35, soldCount: 26, conversionRate: 74.3, revenue: 31200 },
      { name: "Engate de Reboque Removível Mopar", recommendedCount: 33, presentedCount: 28, soldCount: 21, conversionRate: 75.0, revenue: 48300 },
      { name: "Barras Transversais de Teto Mopar", recommendedCount: 28, presentedCount: 25, soldCount: 18, conversionRate: 72.0, revenue: 26100 },
      { name: "Película Solar Nano-Cerâmica 3M", recommendedCount: 36, presentedCount: 30, soldCount: 16, conversionRate: 53.3, revenue: 22080 },
    ],
    unavailableDemandDemo: [
      { name: "Engate Removível Mopar Compass (Ruptura transitória)", requests: 12, potentialRevenue: 27600 },
      { name: "Capota Rígida Elétrica Rampage (Fila de espera fábrica)", requests: 7, potentialRevenue: 38500 },
    ],
  };
};

