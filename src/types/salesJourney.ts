import { Accessory, ClientData } from "./accessories";

export type SalesJourneyStep =
  | "customer-understanding"
  | "accessory-recommendation"
  | "vehicle-visualization"
  | "accessory-explanation"
  | "price-presentation"
  | "negotiation"
  | "closing";

export type JourneyClientSource =
  | "showroom"
  | "crm"
  | "technical-delivery"
  | "reheated-lead";

export type UserRole = "consultor" | "gerente" | "administrador";

export interface UserSession {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  dealership: string;
  dealershipId: string;
}

export interface DiscoveryProfile {
  usageLocation: "cidade" | "rodovia" | "zona_rural" | "uso_misto" | "off_road";
  monthlyKm: "ate_500" | "500_1000" | "1000_2000" | "acima_2000";
  dirtRoadFrequency: "nunca" | "ocasionalmente" | "semanalmente" | "diariamente";
  cargoUsage: "nao" | "cargas_leves" | "ferramentas" | "materiais_profissionais" | "cargas_pesadas";
  frequentPassengers: ("criancas" | "idosos" | "animais" | "equipe_trabalho" | "apenas_motorista")[];
  tripFrequency: "raramente" | "mensalmente" | "quinzenalmente" | "semanalmente";
  specialNeeds: (
    | "reboque"
    | "transporte_bicicletas"
    | "bagagem_extra"
    | "protecao_cacamba"
    | "acesso_facilitado"
    | "iluminacao_adicional"
    | "organizacao_carga"
  )[];
  priorities: (
    | "protecao"
    | "seguranca"
    | "praticidade"
    | "conforto"
    | "estetica"
    | "tecnologia"
    | "desempenho"
    | "valorizacao_revenda"
  )[];
  parkingLocation: "garagem_fechada" | "estacionamento_aberto" | "rua" | "area_rural" | "ambiente_industrial";
  specificNotes: string;
  aiSuggestedAnswers?: Record<string, string>;
}

export type RecommendationTier = "essential" | "recommended" | "complementary";

export interface AccessoryRecommendation {
  accessoryId: string;
  accessory: Accessory;
  tier: RecommendationTier;
  matchScore: number;
  reason: string;
  relatedAnswers: string[];
  problemSolved: string;
  benefitDelivered: string;
  regionalInfluence: string;
  hasExplicitDemandMatch?: boolean;
  explicitDemandLabel?: string;
  isCustomAdded?: boolean;
  removalReason?: string;
  consultantNotes?: string;
}

export type ExplanationStatusType =
  | "pending"
  | "explained"
  | "doubt"
  | "high-interest"
  | "medium-interest"
  | "resistance"
  | "not-applicable";

export interface AccessoryExplanationStatus {
  accessoryId: string;
  status: ExplanationStatusType;
  notes?: string;
}

export interface QuoteState {
  originalSubtotal: number;
  stockDiscountAmount: number;
  subtotalAfterStockDiscounts: number;
  sellerDiscount: number;
  sellerDiscountPercent: number;
  factoryBonus: number;
  campaignDiscount: number;
  finalTotal: number;
  monthlyCdc: number;
  installmentsCount: number;
  monthlyInstallment: number;
  estimatedInstallationHours: number;
  installationDeadlineDays: number;
  isPriceRevealed: boolean;
}

export interface CommercialCampaign {
  id: string;
  dealershipId: string;
  name: string;
  description: string;
  campaignType:
    | "discount"
    | "factoryBonus"
    | "freeInstallation"
    | "specialInstallment"
    | "bundle"
    | "limitedStock"
    | "custom";
  startDate: string;
  endDate: string;
  vehicleModels?: string[];
  vehicleVersions?: string[];
  accessoryIds?: string[];
  discountType?: "percentage" | "fixed";
  discountValue?: number;
  minimumPurchaseValue?: number;
  maximumDiscountValue?: number;
  stockLimit?: number;
  remainingQuantity?: number;
  customerMessage: string;
  consultantInstruction?: string;
  requiresManagerApproval: boolean;
  active: boolean;
}

export type ObjectionCategory =
  | "preco"
  | "nao_preciso"
  | "vou_instalar_depois"
  | "vou_comprar_fora"
  | "preciso_falar_outra_pessoa"
  | "duvida_garantia"
  | "duvida_instalacao"
  | "prazo"
  | "retirar_itens"
  | "concorrente"
  | "impacto_parcela"
  | "falta_disponibilidade";

export interface CommercialArgument {
  id: string;
  objection: ObjectionCategory;
  objectionLabel: string;
  targetAccessoryId?: string;
  targetProfile?: string;
  appropriateStep: SalesJourneyStep;
  mainArgument: string;
  alternativeArgument: string;
  deepeningQuestion: string;
  closingProposal: string;
  authorizedCondition?: string;
  maxAuthorizedDiscountPercent: number;
  approvedVersion: string;
  approvedAt: string;
  dealershipGroup: string;
  brand: string;
  active: boolean;
}

export interface NegotiationRecord {
  id: string;
  timestamp: string;
  objection: ObjectionCategory;
  argumentUsed: string;
  clientReaction: "aceitou" | "em_duvida" | "resistiu" | "pediu_desconto";
  newConditionOffered?: string;
  removedAccessoryIds: string[];
  discountApplied: number;
  discountApprovedBy?: string;
  result: "em_andamento" | "sucesso" | "impasse";
  notes?: string;
}

export interface NegotiationState {
  selectedObjection?: ObjectionCategory;
  customObjectionText?: string;
  activeArgument?: CommercialArgument;
  records: NegotiationRecord[];
  requestedSellerDiscount: number;
  isManagerApprovalNeeded: boolean;
  managerApprovalGranted: boolean;
  managerName?: string;
}

export type ClosingStatus =
  | "open"
  | "won"
  | "proposal-sent"
  | "analyzing"
  | "waiting-approval"
  | "scheduled-return"
  | "lost";

export interface LostSaleDetails {
  primaryReason: string;
  mainObjection: ObjectionCategory | string;
  presentedTotal: number;
  presentedCondition: string;
  refusedAccessoryIds: string[];
  canBeReheated: boolean;
  suggestedContactDate: string;
  lostNotes: string;
}

export interface VisualizationState {
  showAfter: boolean;
  activeHotspotId?: string;
  compareMode: boolean;
  selectedColor?: string;
}

export interface SalesJourneyState {
  currentStep: SalesJourneyStep;
  clientSource: JourneyClientSource;
  clientData: ClientData;
  userSession: UserSession;
  discoveryProfile: DiscoveryProfile;
  recommendations: AccessoryRecommendation[];
  selectedAccessoryIds: string[];
  visualizationState: VisualizationState;
  explanationStatus: AccessoryExplanationStatus[];
  quote: QuoteState;
  negotiation: NegotiationState;
  selectedCampaign?: CommercialCampaign;
  closingStatus: ClosingStatus;
  lostSaleDetails?: LostSaleDetails;
  createdAt: string;
  updatedAt: string;
}
