import { ReheatedLead } from "@/types/leads";

const STORAGE_KEY = "smart_sell_reheated_leads_v1";

const INITIAL_MODEL_LEADS: ReheatedLead[] = [
  {
    id: "lead-model-1",
    clientName: "Carlos Silva",
    clientPhone: "(11) 98765-4321",
    vehicleModel: "JEEP RENEGADE TRAILHAWK",
    vehicleColor: "Verde Recon",
    clientData: {
      clientName: "Carlos Silva",
      clientAge: "38",
      clientGender: "Masculino",
      vehicleModel: "JEEP RENEGADE TRAILHAWK",
      vehicleColor: "Verde Recon",
      vehicleYear: "2025/2026",
      state: "São Paulo (SP)",
      terrainType: "Uso Misto (Trilhas Leves / Urbano)",
      climateCondition: "Poeira & Estrada de Terra Frequente",
    },
    selectedAccessories: [
      {
        id: "bagageiro",
        name: "Bagageiro de Teto Mopar Trail 400L",
        description: "Estrutura reforçada à prova de água e poeira",
        price: 3100,
        icon: "🎒",
        selected: true,
        stockStatus: "available",
        stockDays: 30,
        discountPercent: 0,
      },
      {
        id: "estribo",
        name: "Estribo Lateral Off-Road Trailhawk",
        description: "Construção reforçada para trilhas",
        price: 2600,
        icon: "🪜",
        selected: true,
        stockStatus: "available",
        stockDays: 45,
        discountPercent: 0,
      },
      {
        id: "protetor",
        name: "Protetor de Carter e Diferencial 4×4",
        description: "Blindagem completa para off-road severo",
        price: 1312,
        icon: "🛡️",
        selected: true,
        stockStatus: "dormant",
        stockDays: 190,
        discountPercent: 10,
      },
      {
        id: "pneus",
        name: "Pneus Pirelli All-Terrain Plus 215/65R17",
        description: "Máxima tração e resistência a furos",
        price: 4200,
        icon: "🛞",
        selected: true,
        stockStatus: "available",
        stockDays: 20,
        discountPercent: 0,
      },
    ],
    totalProposalValue: 11212,
    cdcMonthlyEstimate: "263,48",
    rejectionReason: "Orçamento / Preço no Momento",
    rejectionNotes: "Cliente achou o valor à vista alto. Tem interesse no bagageiro e estribo se houver bônus de montadora ou diluição no CDC do financiamento.",
    rejectedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    reheatStrategy: "Campanha Bônus Montadora",
    status: "pending_reheat",
  },
  {
    id: "lead-model-2",
    clientName: "Mariana Souza",
    clientPhone: "(19) 99123-8877",
    vehicleModel: "RAM RAMPAGE REBEL",
    vehicleColor: "Vermelho Volcano",
    clientData: {
      clientName: "Mariana Souza",
      clientAge: "44",
      clientGender: "Feminino",
      vehicleModel: "RAM RAMPAGE REBEL",
      vehicleColor: "Vermelho Volcano",
      vehicleYear: "2025/2026",
      state: "Mato Grosso (MT)",
      terrainType: "Uso Misto Rural/Estrada",
      climateCondition: "Calor Intenso & Poeira",
    },
    selectedAccessories: [
      {
        id: "estribo",
        name: "Estribo Lateral Premium",
        description: "Aço tubular antiderrapante",
        price: 2500,
        icon: "🪜",
        selected: true,
        stockStatus: "available",
        stockDays: 15,
        discountPercent: 0,
      },
      {
        id: "protetor",
        name: "Protetor de Caçamba HD",
        description: "Proteção reforçada anti-impacto",
        price: 1200,
        icon: "🛡️",
        selected: true,
        stockStatus: "dormant",
        stockDays: 200,
        discountPercent: 12,
      },
    ],
    totalProposalValue: 3556,
    cdcMonthlyEstimate: "83,57",
    rejectionReason: "Consulta a Cônjuge / Sócio",
    rejectionNotes: "Gostou muito da visualização 3D. Pediu para enviar ao WhatsApp para mostrar ao marido à noite.",
    rejectedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    reheatStrategy: "Check-in em 7 Dias",
    status: "pending_reheat",
  },
  {
    id: "lead-model-3",
    clientName: "Roberto Albuquerque",
    clientPhone: "(31) 98456-1122",
    vehicleModel: "JEEP COMPASS LONGITUDE",
    vehicleColor: "Cinza Granite",
    clientData: {
      clientName: "Roberto Albuquerque",
      clientAge: "51",
      clientGender: "Masculino",
      vehicleModel: "JEEP COMPASS LONGITUDE",
      vehicleColor: "Cinza Granite",
      vehicleYear: "2025/2026",
      state: "Minas Gerais (MG)",
      terrainType: "Urbano & Viagens",
      climateCondition: "Normal",
    },
    selectedAccessories: [
      {
        id: "friso",
        name: "Friso Lateral Pintado",
        description: "Proteção de portas original Mopar",
        price: 450,
        icon: "🚗",
        selected: true,
        stockStatus: "obsolete",
        stockDays: 380,
        discountPercent: 25,
      },
      {
        id: "rack",
        name: "Barras Transversais de Teto",
        description: "Alumínio aerodinâmico original",
        price: 1650,
        icon: "📦",
        selected: true,
        stockStatus: "available",
        stockDays: 40,
        discountPercent: 0,
      },
    ],
    totalProposalValue: 1987,
    cdcMonthlyEstimate: "46,69",
    rejectionReason: "Decidir Próximo à Entrega / Revisão",
    rejectionNotes: "Quer retirar o carro original e talvez instalar os acessórios na 1ª revisão de 10.000 km.",
    rejectedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    reheatStrategy: "Aviso de Giro de Estoque (Super Desconto)",
    status: "pending_reheat",
  },
];

export const getReheatedLeads = (): ReheatedLead[] => {
  if (typeof window === "undefined") return INITIAL_MODEL_LEADS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MODEL_LEADS));
      return INITIAL_MODEL_LEADS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MODEL_LEADS));
      return INITIAL_MODEL_LEADS;
    }
    return parsed;
  } catch (err) {
    console.error("Erro ao ler leads de reaquecimento:", err);
    return INITIAL_MODEL_LEADS;
  }
};

export const saveReheatedLead = (lead: Omit<ReheatedLead, "id" | "rejectedAt" | "status">): ReheatedLead => {
  const currentLeads = getReheatedLeads();
  const newLead: ReheatedLead = {
    ...lead,
    id: `lead-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    rejectedAt: new Date().toISOString(),
    status: "pending_reheat",
  };

  const updated = [newLead, ...currentLeads];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("smart_sell_leads_updated"));
  } catch (err) {
    console.error("Erro ao salvar lead de reaquecimento:", err);
  }
  return newLead;
};

export const deleteReheatedLead = (id: string): void => {
  const currentLeads = getReheatedLeads();
  const updated = currentLeads.filter((l) => l.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("smart_sell_leads_updated"));
  } catch (err) {
    console.error("Erro ao excluir lead de reaquecimento:", err);
  }
};

export const updateReheatedLeadStatus = (id: string, status: ReheatedLead["status"]): void => {
  const currentLeads = getReheatedLeads();
  const updated = currentLeads.map((l) => (l.id === id ? { ...l, status } : l));
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("smart_sell_leads_updated"));
  } catch (err) {
    console.error("Erro ao atualizar status do lead:", err);
  }
};

export const resetModelLeads = (): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MODEL_LEADS));
    window.dispatchEvent(new Event("smart_sell_leads_updated"));
  } catch (err) {
    console.error("Erro ao restaurar leads modelo:", err);
  }
};
