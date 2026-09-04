import { Accessory, ClientData } from "./accessories";

export type RejectionReason = 
  | "Orçamento / Preço no Momento"
  | "Consulta a Cônjuge / Sócio"
  | "Decidir Próximo à Entrega / Revisão"
  | "Prefere Apenas Uso Básico Urbano"
  | "Aguardando Condição Especial / Bônus Montadora"
  | "Outro";

export type ReheatStrategy = 
  | "Campanha Bônus Montadora"
  | "Condição Especial CDC Taxa Zero"
  | "Aviso de Giro de Estoque (Super Desconto)"
  | "Check-in em 7 Dias"
  | "Check-in em 15 Dias";

export interface ReheatedLead {
  id: string;
  clientName: string;
  clientPhone: string;
  clientData: ClientData;
  vehicleModel: string;
  vehicleColor: string;
  selectedAccessories: Accessory[];
  totalProposalValue: number;
  cdcMonthlyEstimate: string;
  rejectionReason: RejectionReason;
  rejectionNotes?: string;
  rejectedAt: string; // ISO date or formatted
  reheatStrategy: ReheatStrategy;
  status: "pending_reheat" | "contacted" | "converted" | "archived";
}
