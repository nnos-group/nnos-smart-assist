import { CommercialCampaign } from "@/types/salesJourney";

export const MOCK_COMMERCIAL_CAMPAIGNS: CommercialCampaign[] = [
  {
    id: "camp-ram-rebel-mes",
    dealershipId: "matriz",
    name: "Campanha Mês da Conquista RAM",
    description: "Desconto especial de 8% nos acessórios essenciais para a linha RAM Rampage.",
    campaignType: "discount",
    startDate: "2026-01-01T00:00:00Z",
    endDate: "2026-12-31T23:59:59Z",
    vehicleModels: ["RAM RAMPAGE REBEL", "RAM RAMPAGE LARAMIE", "RAM 1500 LARAMIE"],
    discountType: "percentage",
    discountValue: 8,
    minimumPurchaseValue: 3000,
    maximumDiscountValue: 1200,
    stockLimit: 15,
    remainingQuantity: 7,
    customerMessage: "Condição especial válida para a linha RAM neste mês na concessionária.",
    consultantInstruction: "Oferecer aos clientes de Rampage com subtotal de acessórios superior a R$ 3.000.",
    requiresManagerApproval: false,
    active: true,
  },
  {
    id: "camp-jeep-instalacao-gratis",
    dealershipId: "matriz",
    name: "Pacote Jeep Adventure — Instalação Cortesia",
    description: "Mão de obra de instalação 100% gratuita para pacotes com 3 ou mais acessórios homologados Jeep.",
    campaignType: "freeInstallation",
    startDate: "2026-01-01T00:00:00Z",
    endDate: "2026-12-31T23:59:59Z",
    vehicleModels: [
      "JEEP",
      "RENEGADE",
      "COMPASS",
      "COMMANDER",
    ],
    discountType: "fixed",
    discountValue: 450,
    minimumPurchaseValue: 2000,
    customerMessage: "Instalação técnica oficial gratuita homologada Mopar para este pacote (economia de R$ 450,00).",
    consultantInstruction: "Ressaltar a economia de mão de obra de oficina especializada (R$ 450,00).",
    requiresManagerApproval: false,
    active: true,
  },
  {
    id: "camp-bonus-compass-blackhawk",
    dealershipId: "matriz",
    name: "Bônus Fábrica Jeep Blackhawk",
    description: "Bônus fixo de R$ 500 concedido pela montadora para versões Série S e Blackhawk.",
    campaignType: "factoryBonus",
    startDate: "2026-01-01T00:00:00Z",
    endDate: "2026-12-31T23:59:59Z",
    vehicleModels: ["COMPASS", "SERIE S", "BLACKHAWK", "LIMITED", "LONGITUDE"],
    discountType: "fixed",
    discountValue: 500,
    minimumPurchaseValue: 2500,
    customerMessage: "Bônus de fábrica Mopar de R$ 500,00 aplicado diretamente à proposta.",
    consultantInstruction: "Bônus subsidiado pela montadora para clientes de versões topo de linha.",
    requiresManagerApproval: false,
    active: true,
  },
  {
    id: "camp-estoque-capota-rampage",
    dealershipId: "matriz",
    name: "Lote Especial Capota Rígida Rampage",
    description: "Desconto promocional para queima de lote de capotas retráteis em estoque.",
    campaignType: "limitedStock",
    startDate: "2026-01-01T00:00:00Z",
    endDate: "2026-12-31T23:59:59Z",
    vehicleModels: ["RAM", "RAMPAGE", "REBEL", "LARAMIE"],
    accessoryIds: ["capota"],
    discountType: "fixed",
    discountValue: 350,
    minimumPurchaseValue: 2000,
    stockLimit: 5,
    remainingQuantity: 3,
    customerMessage: "Restam 3 unidades em estoque com valor promocional de lote (R$ 350 de desconto).",
    consultantInstruction: "Verificar fisicamente a peça no almoxarifado antes de faturar.",
    requiresManagerApproval: false,
    active: true,
  },
  {
    id: "camp-mopar-fidelidade-nacional",
    dealershipId: "all",
    name: "Gatilho Comercial Concessionária — Bônus Mopar",
    description: "Bônus promocional de R$ 300 concedido pela concessionária para pedidos acima de R$ 2.000.",
    campaignType: "discount",
    startDate: "2026-01-01T00:00:00Z",
    endDate: "2026-12-31T23:59:59Z",
    vehicleModels: [], // Válido para todos os modelos
    discountType: "fixed",
    discountValue: 300,
    minimumPurchaseValue: 2000,
    customerMessage: "Bônus especial de fidelidade Mopar de R$ 300,00 concedido nesta proposta.",
    consultantInstruction: "Utilizar como gatilho de fechamento imediato antes de conceder margem do vendedor.",
    requiresManagerApproval: false,
    active: true,
  },
];

export interface CampaignEligibilityResult {
  eligible: boolean;
  campaign?: CommercialCampaign;
  rejectionReasons: string[];
}

export interface CampaignEligibilityParams {
  dealershipId?: string;
  vehicleModel?: string;
  selectedAccessoryIds?: string[];
  subtotal?: number;
  currentDate?: Date;
}

export function evaluateCampaignEligibility(
  campaign: CommercialCampaign,
  rawParams: CampaignEligibilityParams | any
): CampaignEligibilityResult {
  const reasons: string[] = [];
  
  if (!campaign) {
    return { eligible: false, rejectionReasons: ["Campanha inválida"] };
  }

  // Normalização defensiva de parâmetros
  const params: CampaignEligibilityParams =
    typeof rawParams === "object" && rawParams !== null
      ? rawParams
      : {
          dealershipId: "matriz",
          vehicleModel: typeof rawParams === "string" ? rawParams : "",
          selectedAccessoryIds: [],
          subtotal: 0,
        };

  const now = params.currentDate || new Date();
  const vehicleModel = (params.vehicleModel || "").trim().toUpperCase();
  const dealershipId = params.dealershipId || "matriz";
  const selectedAccessoryIds = params.selectedAccessoryIds || [];
  const subtotal = params.subtotal || 0;

  // 1. Status ativo
  if (!campaign.active) {
    reasons.push("Campanha inativa");
  }

  // 2. Validade temporal real
  if (campaign.startDate && campaign.endDate) {
    const start = new Date(campaign.startDate);
    const end = new Date(campaign.endDate);
    if (now < start || now > end) {
      reasons.push(`Campanha fora da vigência (início: ${start.toLocaleDateString("pt-BR")}, fim: ${end.toLocaleDateString("pt-BR")})`);
    }
  }

  // 3. Concessionária autorizada
  if (campaign.dealershipId && campaign.dealershipId !== "all" && campaign.dealershipId !== dealershipId) {
    reasons.push("Campanha não autorizada para esta concessionária");
  }

  // 4. Compatibilidade com o veículo
  if (campaign.vehicleModels && campaign.vehicleModels.length > 0) {
    const isModelMatched = campaign.vehicleModels.some((m) => {
      const targetModel = (m || "").trim().toUpperCase();
      if (!targetModel || !vehicleModel) return false;
      return vehicleModel.includes(targetModel) || targetModel.includes(vehicleModel);
    });
    if (!isModelMatched) {
      reasons.push(`Não se aplica ao veículo ${params.vehicleModel || "selecionado"}`);
    }
  }

  // 5. Compatibilidade com acessórios selecionados
  if (campaign.accessoryIds && campaign.accessoryIds.length > 0) {
    const hasRequiredAccessory = campaign.accessoryIds.some((id) => selectedAccessoryIds.includes(id));
    if (!hasRequiredAccessory) {
      reasons.push(`Exige a seleção de itens específicos (${campaign.accessoryIds.join(", ")})`);
    }
  }

  // 6. Valor mínimo de compra
  if (campaign.minimumPurchaseValue && subtotal < campaign.minimumPurchaseValue) {
    reasons.push(`Valor mínimo não atingido (mínimo: R$ ${campaign.minimumPurchaseValue.toLocaleString("pt-BR")})`);
  }

  // 7. Controle real de estoque
  if (campaign.stockLimit !== undefined && campaign.remainingQuantity !== undefined && campaign.remainingQuantity <= 0) {
    reasons.push("Estoque promocional esgotado");
  }

  return {
    eligible: reasons.length === 0,
    campaign: reasons.length === 0 ? campaign : undefined,
    rejectionReasons: reasons,
  };
}

export function getEligibleCampaigns(
  campaigns: CommercialCampaign[],
  paramsOrModel: CampaignEligibilityParams | string,
  maybeAccessoryIds?: string[],
  maybeSubtotalOrDate?: number | string | Date
): CommercialCampaign[] {
  if (!Array.isArray(campaigns)) return [];

  // Suporte a chamada como objeto { vehicleModel, ... } ou posicional
  let normalizedParams: CampaignEligibilityParams;
  if (typeof paramsOrModel === "object" && paramsOrModel !== null) {
    normalizedParams = paramsOrModel;
  } else {
    normalizedParams = {
      dealershipId: "matriz",
      vehicleModel: typeof paramsOrModel === "string" ? paramsOrModel : "",
      selectedAccessoryIds: Array.isArray(maybeAccessoryIds) ? maybeAccessoryIds : [],
      subtotal: typeof maybeSubtotalOrDate === "number" ? maybeSubtotalOrDate : 0,
      currentDate: maybeSubtotalOrDate instanceof Date ? maybeSubtotalOrDate : undefined,
    };
  }

  return campaigns.filter((c) => evaluateCampaignEligibility(c, normalizedParams).eligible);
}
