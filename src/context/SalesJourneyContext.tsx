import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { defaultClientData, getAccessoriesForVehicle, Accessory, ClientData } from "@/types/accessories";
import {
  SalesJourneyStep,
  JourneyClientSource,
  DiscoveryProfile,
  AccessoryRecommendation,
  AccessoryExplanationStatus,
  ExplanationStatusType,
  QuoteState,
  NegotiationState,
  CommercialCampaign,
  ClosingStatus,
  LostSaleDetails,
  SalesJourneyState,
  UserSession,
  ObjectionCategory,
  RecommendationTier,
} from "@/types/salesJourney";
import { calculateQuote } from "@/lib/pricingEngine";
import { generateRecommendations } from "@/lib/recommendationEngine";
import { getApprovedArgumentForObjection } from "@/lib/argumentSelectionEngine";

const JOURNEY_STORAGE_KEY = "smart_sell_sales_journey_v2";

export const DEFAULT_DISCOVERY_PROFILE: DiscoveryProfile = {
  usageLocation: "uso_misto",
  monthlyKm: "1000_2000",
  dirtRoadFrequency: "semanalmente",
  cargoUsage: "ferramentas",
  frequentPassengers: ["criancas", "apenas_motorista"],
  tripFrequency: "quinzenalmente",
  specialNeeds: ["protecao_cacamba", "acesso_facilitado"],
  priorities: ["protecao", "praticidade", "seguranca"],
  parkingLocation: "garagem_fechada",
  specificNotes: "",
};

export const DEFAULT_USER_SESSION: UserSession = {
  userId: "usr-01",
  name: "Ricardo Mendes",
  email: "consultor@stellantis.com",
  role: "consultor",
  dealership: "Concessionária Jeep - Matriz Campinas",
  dealershipId: "matriz",
};

export const JOURNEY_STEPS_ORDER: SalesJourneyStep[] = [
  "customer-understanding",
  "accessory-recommendation",
  "vehicle-visualization",
  "accessory-explanation",
  "price-presentation",
  "negotiation",
  "closing",
];

export const JOURNEY_STEPS_META: Record<SalesJourneyStep, { number: number; title: string; subtitle: string }> = {
  "customer-understanding": {
    number: 1,
    title: "Entender o cliente",
    subtitle: "Conheça o perfil e a utilização do veículo antes de apresentar qualquer solução.",
  },
  "accessory-recommendation": {
    number: 2,
    title: "Recomendar acessórios",
    subtitle: "Soluções selecionadas pela inteligência da plataforma e validadas pelo consultor.",
  },
  "vehicle-visualization": {
    number: 3,
    title: "Ver no veículo",
    subtitle: "Mostre ao cliente como as soluções ficarão aplicadas no veículo escolhido.",
  },
  "accessory-explanation": {
    number: 4,
    title: "Entender os benefícios",
    subtitle: "Explique como cada acessório atende às necessidades identificadas.",
  },
  "price-presentation": {
    number: 5,
    title: "Investimento",
    subtitle: "Apresente as condições comerciais mantendo o foco nos benefícios construídos.",
  },
  negotiation: {
    number: 6,
    title: "Negociação assistida",
    subtitle: "Utilize argumentos aprovados e adequados ao perfil do cliente.",
  },
  closing: {
    number: 7,
    title: "Fechamento",
    subtitle: "Confirme a decisão e registre a conclusão da oportunidade.",
  },
};

interface SalesJourneyContextType {
  state: SalesJourneyState;
  currentStepIndex: number;
  availableAccessories: Accessory[];
  goToStep: (step: SalesJourneyStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  setClientSource: (source: JourneyClientSource) => void;
  updateClientData: (data: Partial<ClientData>) => void;
  updateDiscoveryProfile: (profile: Partial<DiscoveryProfile>) => void;
  toggleAccessory: (id: string) => void;
  addAccessory: (id: string, targetTier?: RecommendationTier) => void;
  removeAccessory: (id: string, reason?: string) => void;
  changeAccessoryTier: (id: string, tier: RecommendationTier) => void;
  updateExplanationStatus: (id: string, status: ExplanationStatusType, notes?: string) => void;
  setSellerDiscount: (amount: number) => void;
  setFactoryBonus: (amount: number) => void;
  applyCampaign: (campaign: CommercialCampaign | undefined) => void;
  selectObjection: (objection: ObjectionCategory, customText?: string) => void;
  recordNegotiationAction: (reaction: "aceitou" | "em_duvida" | "resistiu" | "pediu_desconto", condition?: string, notes?: string) => void;
  requestManagerApproval: (managerName: string) => void;
  finalizeSale: (status: ClosingStatus, lostDetails?: LostSaleDetails) => void;
  resetJourney: (newSource?: JourneyClientSource) => void;
  loadLeadForReheating: (leadData: Record<string, unknown>) => void;
  setUserSession: (session: Partial<UserSession>) => void;
  setVisualizationState: (viz: Partial<SalesJourneyState["visualizationState"]>) => void;
  revealPrice: () => void;
}

const SalesJourneyContext = createContext<SalesJourneyContextType | undefined>(undefined);

function getInitialState(): SalesJourneyState {
  const saved = typeof window !== "undefined" ? sessionStorage.getItem(JOURNEY_STORAGE_KEY) : null;
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // ignore
    }
  }

  const initialAccessories = getAccessoriesForVehicle(defaultClientData.vehicleModel);
  const initialRecommendations = generateRecommendations(initialAccessories, defaultClientData, DEFAULT_DISCOVERY_PROFILE);
  const initialSelectedIds = initialRecommendations.filter((r) => r.tier !== "complementary").map((r) => r.accessoryId);
  const initialQuote = calculateQuote({
    accessories: initialAccessories,
    selectedAccessoryIds: initialSelectedIds,
  });

  return {
    currentStep: "customer-understanding",
    clientSource: "showroom",
    clientData: defaultClientData,
    userSession: DEFAULT_USER_SESSION,
    discoveryProfile: DEFAULT_DISCOVERY_PROFILE,
    recommendations: initialRecommendations,
    selectedAccessoryIds: initialSelectedIds,
    visualizationState: {
      showAfter: true,
      compareMode: false,
    },
    explanationStatus: initialSelectedIds.map((id) => ({
      accessoryId: id,
      status: "pending",
    })),
    quote: initialQuote,
    negotiation: {
      records: [],
      requestedSellerDiscount: 0,
      isManagerApprovalNeeded: false,
      managerApprovalGranted: false,
    },
    closingStatus: "open",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export const SalesJourneyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<SalesJourneyState>(getInitialState);

  // Persistir no sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(JOURNEY_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  const availableAccessories = useMemo(() => {
    return getAccessoriesForVehicle(state.clientData.vehicleModel);
  }, [state.clientData.vehicleModel]);

  // Recalcular cotação sempre que os itens selecionados, descontos ou campanhas mudarem
  const recalculateCurrentQuote = useCallback(
    (
      selectedIds: string[],
      sellerDiscount: number,
      factoryBonus: number,
      campaign?: CommercialCampaign
    ) => {
      return calculateQuote({
        accessories: availableAccessories,
        selectedAccessoryIds: selectedIds,
        sellerDiscount,
        factoryBonus,
        campaign,
      });
    },
    [availableAccessories]
  );

  const currentStepIndex = useMemo(() => {
    return JOURNEY_STEPS_ORDER.indexOf(state.currentStep);
  }, [state.currentStep]);

  const goToStep = useCallback((step: SalesJourneyStep) => {
    setState((prev) => ({
      ...prev,
      currentStep: step,
      updatedAt: new Date().toISOString(),
    }));
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, []);

  const nextStep = useCallback(() => {
    setState((prev) => {
      const idx = JOURNEY_STEPS_ORDER.indexOf(prev.currentStep);
      if (idx < JOURNEY_STEPS_ORDER.length - 1) {
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        }
        return {
          ...prev,
          currentStep: JOURNEY_STEPS_ORDER[idx + 1],
          updatedAt: new Date().toISOString(),
        };
      }
      return prev;
    });
  }, []);

  const prevStep = useCallback(() => {
    setState((prev) => {
      const idx = JOURNEY_STEPS_ORDER.indexOf(prev.currentStep);
      if (idx > 0) {
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        }
        return {
          ...prev,
          currentStep: JOURNEY_STEPS_ORDER[idx - 1],
          updatedAt: new Date().toISOString(),
        };
      }
      return prev;
    });
  }, []);

  const setClientSource = useCallback((source: JourneyClientSource) => {
    setState((prev) => ({
      ...prev,
      clientSource: source,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const updateClientData = useCallback(
    (partial: Partial<ClientData>) => {
      setState((prev) => {
        const updatedClient = { ...prev.clientData, ...partial };
        const newAvailable = getAccessoriesForVehicle(updatedClient.vehicleModel);
        const newRecs = generateRecommendations(newAvailable, updatedClient, prev.discoveryProfile);
        const newSelected = newRecs.filter((r) => r.tier !== "complementary").map((r) => r.accessoryId);
        const newQuote = calculateQuote({
          accessories: newAvailable,
          selectedAccessoryIds: newSelected,
          sellerDiscount: prev.quote.sellerDiscount,
          factoryBonus: prev.quote.factoryBonus,
          campaign: prev.selectedCampaign,
        });

        return {
          ...prev,
          clientData: updatedClient,
          recommendations: newRecs,
          selectedAccessoryIds: newSelected,
          quote: newQuote,
          explanationStatus: newSelected.map((id) => ({ accessoryId: id, status: "pending" })),
          updatedAt: new Date().toISOString(),
        };
      });
    },
    []
  );

  const updateDiscoveryProfile = useCallback(
    (partial: Partial<DiscoveryProfile>) => {
      setState((prev) => {
        const updatedDiscovery = { ...prev.discoveryProfile, ...partial };
        const newRecs = generateRecommendations(availableAccessories, prev.clientData, updatedDiscovery);
        const newSelected = newRecs.filter((r) => r.tier !== "complementary").map((r) => r.accessoryId);
        const newQuote = calculateQuote({
          accessories: availableAccessories,
          selectedAccessoryIds: newSelected,
          sellerDiscount: prev.quote.sellerDiscount,
          factoryBonus: prev.quote.factoryBonus,
          campaign: prev.selectedCampaign,
        });

        return {
          ...prev,
          discoveryProfile: updatedDiscovery,
          recommendations: newRecs,
          selectedAccessoryIds: newSelected,
          quote: newQuote,
          explanationStatus: newSelected.map((id) => ({ accessoryId: id, status: "pending" })),
          updatedAt: new Date().toISOString(),
        };
      });
    },
    [availableAccessories]
  );

  const toggleAccessory = useCallback(
    (id: string) => {
      setState((prev) => {
        const isSelected = prev.selectedAccessoryIds.includes(id);
        const nextSelected = isSelected
          ? prev.selectedAccessoryIds.filter((item) => item !== id)
          : [...prev.selectedAccessoryIds, id];

        const nextQuote = recalculateCurrentQuote(
          nextSelected,
          prev.quote.sellerDiscount,
          prev.quote.factoryBonus,
          prev.selectedCampaign
        );

        return {
          ...prev,
          selectedAccessoryIds: nextSelected,
          quote: nextQuote,
          updatedAt: new Date().toISOString(),
        };
      });
    },
    [recalculateCurrentQuote]
  );

  const addAccessory = useCallback(
    (id: string, targetTier?: RecommendationTier) => {
      setState((prev) => {
        if (prev.selectedAccessoryIds.includes(id)) return prev;
        const targetAcc = availableAccessories.find((a) => a.id === id);
        if (!targetAcc) return prev;

        const nextSelected = [...prev.selectedAccessoryIds, id];
        const existingRec = prev.recommendations.find((r) => r.accessoryId === id);
        let nextRecs = prev.recommendations;

        if (!existingRec) {
          const newRec: AccessoryRecommendation = {
            accessoryId: id,
            accessory: targetAcc,
            tier: targetTier || "complementary",
            matchScore: 85,
            reason: `Adicionado pelo consultor a partir do catálogo oficial homologado para ${prev.clientData.vehicleModel}.`,
            relatedAnswers: ["Catálogo oficial Mopar"],
            problemSolved: "Personalização sob demanda",
            benefitDelivered: targetAcc.description,
            regionalInfluence: `Concessionária autorizada ${prev.clientData.state}`,
            isCustomAdded: true,
          };
          nextRecs = [...prev.recommendations, newRec];
        } else if (targetTier && existingRec.tier !== targetTier) {
          nextRecs = prev.recommendations.map((r) =>
            r.accessoryId === id ? { ...r, tier: targetTier } : r
          );
        }

        const nextQuote = recalculateCurrentQuote(
          nextSelected,
          prev.quote.sellerDiscount,
          prev.quote.factoryBonus,
          prev.selectedCampaign
        );
        return {
          ...prev,
          selectedAccessoryIds: nextSelected,
          recommendations: nextRecs,
          quote: nextQuote,
          updatedAt: new Date().toISOString(),
        };
      });
    },
    [availableAccessories, recalculateCurrentQuote]
  );

  const removeAccessory = useCallback(
    (id: string, reason?: string) => {
      setState((prev) => {
        const nextSelected = prev.selectedAccessoryIds.filter((item) => item !== id);
        const targetRec = prev.recommendations.find((r) => r.accessoryId === id);
        const nextRecs = targetRec?.tier === "complementary"
          ? prev.recommendations.filter((r) => r.accessoryId !== id)
          : prev.recommendations.map((r) =>
              r.accessoryId === id ? { ...r, removalReason: reason || "Removido pelo consultor" } : r
            );
        const nextQuote = recalculateCurrentQuote(
          nextSelected,
          prev.quote.sellerDiscount,
          prev.quote.factoryBonus,
          prev.selectedCampaign
        );

        return {
          ...prev,
          selectedAccessoryIds: nextSelected,
          recommendations: nextRecs,
          quote: nextQuote,
          updatedAt: new Date().toISOString(),
        };
      });
    },
    [recalculateCurrentQuote]
  );

  const changeAccessoryTier = useCallback((id: string, tier: RecommendationTier) => {
    setState((prev) => ({
      ...prev,
      recommendations: prev.recommendations.map((r) => (r.accessoryId === id ? { ...r, tier } : r)),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const updateExplanationStatus = useCallback((id: string, status: ExplanationStatusType, notes?: string) => {
    setState((prev) => {
      const existing = prev.explanationStatus.find((e) => e.accessoryId === id);
      const nextStatus = existing
        ? prev.explanationStatus.map((e) => (e.accessoryId === id ? { ...e, status, notes } : e))
        : [...prev.explanationStatus, { accessoryId: id, status, notes }];
      return {
        ...prev,
        explanationStatus: nextStatus,
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const setSellerDiscount = useCallback(
    (amount: number) => {
      setState((prev) => {
        const nextQuote = recalculateCurrentQuote(
          prev.selectedAccessoryIds,
          amount,
          prev.quote.factoryBonus,
          prev.selectedCampaign
        );
        const isManagerNeeded = nextQuote.sellerDiscountPercent > 5;
        return {
          ...prev,
          quote: nextQuote,
          negotiation: {
            ...prev.negotiation,
            requestedSellerDiscount: amount,
            isManagerApprovalNeeded: isManagerNeeded,
          },
          updatedAt: new Date().toISOString(),
        };
      });
    },
    [recalculateCurrentQuote]
  );

  const setFactoryBonus = useCallback(
    (amount: number) => {
      setState((prev) => {
        const nextQuote = recalculateCurrentQuote(
          prev.selectedAccessoryIds,
          prev.quote.sellerDiscount,
          amount,
          prev.selectedCampaign
        );
        return {
          ...prev,
          quote: nextQuote,
          updatedAt: new Date().toISOString(),
        };
      });
    },
    [recalculateCurrentQuote]
  );

  const applyCampaign = useCallback(
    (campaign: CommercialCampaign | undefined) => {
      setState((prev) => {
        const nextQuote = recalculateCurrentQuote(
          prev.selectedAccessoryIds,
          prev.quote.sellerDiscount,
          prev.quote.factoryBonus,
          campaign
        );
        return {
          ...prev,
          selectedCampaign: campaign,
          quote: nextQuote,
          updatedAt: new Date().toISOString(),
        };
      });
    },
    [recalculateCurrentQuote]
  );

  const selectObjection = useCallback((objection: ObjectionCategory, customText?: string) => {
    setState((prev) => {
      const activeArg = getApprovedArgumentForObjection(objection, prev);
      return {
        ...prev,
        negotiation: {
          ...prev.negotiation,
          selectedObjection: objection,
          customObjectionText: customText,
          activeArgument: activeArg,
        },
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const recordNegotiationAction = useCallback(
    (reaction: "aceitou" | "em_duvida" | "resistiu" | "pediu_desconto", condition?: string, notes?: string) => {
      setState((prev) => {
        const activeArg = prev.negotiation.activeArgument;
        const newRecord = {
          id: `neg-${Date.now()}`,
          timestamp: new Date().toISOString(),
          objection: prev.negotiation.selectedObjection || "preco",
          argumentUsed: activeArg ? activeArg.mainArgument : "Apresentação consultiva de valor",
          clientReaction: reaction,
          newConditionOffered: condition,
          removedAccessoryIds: [],
          discountApplied: prev.quote.sellerDiscount,
          result: (reaction === "aceitou" ? "sucesso" : "em_andamento") as "sucesso" | "em_andamento",
          notes,
        };

        return {
          ...prev,
          negotiation: {
            ...prev.negotiation,
            records: [newRecord, ...prev.negotiation.records],
          },
          updatedAt: new Date().toISOString(),
        };
      });
    },
    []
  );

  const requestManagerApproval = useCallback((managerName: string) => {
    setState((prev) => ({
      ...prev,
      negotiation: {
        ...prev.negotiation,
        isManagerApprovalNeeded: false,
        managerApprovalGranted: true,
        managerName,
      },
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const finalizeSale = useCallback((status: ClosingStatus, lostDetails?: LostSaleDetails) => {
    setState((prev) => ({
      ...prev,
      closingStatus: status,
      lostSaleDetails: lostDetails,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const resetJourney = useCallback((newSource: JourneyClientSource = "showroom") => {
    sessionStorage.removeItem(JOURNEY_STORAGE_KEY);
    const initialAccessories = getAccessoriesForVehicle(defaultClientData.vehicleModel);
    const initialRecs = generateRecommendations(initialAccessories, defaultClientData, DEFAULT_DISCOVERY_PROFILE);
    const initialSelected = initialRecs.filter((r) => r.tier !== "complementary").map((r) => r.accessoryId);
    const initialQuote = calculateQuote({
      accessories: initialAccessories,
      selectedAccessoryIds: initialSelected,
    });

    setState({
      currentStep: "customer-understanding",
      clientSource: newSource,
      clientData: defaultClientData,
      userSession: DEFAULT_USER_SESSION,
      discoveryProfile: DEFAULT_DISCOVERY_PROFILE,
      recommendations: initialRecs,
      selectedAccessoryIds: initialSelected,
      visualizationState: {
        showAfter: true,
        compareMode: false,
      },
      explanationStatus: initialSelected.map((id) => ({ accessoryId: id, status: "pending" })),
      quote: initialQuote,
      negotiation: {
        records: [],
        requestedSellerDiscount: 0,
        isManagerApprovalNeeded: false,
        managerApprovalGranted: false,
      },
      closingStatus: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }, []);

  const loadLeadForReheating = useCallback((lead: Record<string, unknown>) => {
    if (!lead || !lead.clientData) return;
    const client = lead.clientData as ClientData;
    const available = getAccessoriesForVehicle(client.vehicleModel);
    const selectedAccessories = lead.selectedAccessories as Accessory[] | undefined;
    const selectedIds = selectedAccessories
      ? selectedAccessories.map((a: Accessory) => a.id)
      : available.filter((a) => a.selected).map((a) => a.id);

    const recs = generateRecommendations(available, client, DEFAULT_DISCOVERY_PROFILE);
    const quote = calculateQuote({
      accessories: available,
      selectedAccessoryIds: selectedIds,
    });

    setState((prev) => ({
      ...prev,
      clientSource: "reheated-lead",
      clientData: client,
      selectedAccessoryIds: selectedIds,
      recommendations: recs,
      quote,
      currentStep: prev.currentStep === "customer-understanding" ? "customer-understanding" : "vehicle-visualization",
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const setUserSession = useCallback((session: Partial<UserSession>) => {
    setState((prev) => ({
      ...prev,
      userSession: { ...prev.userSession, ...session },
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const setVisualizationState = useCallback((viz: Partial<SalesJourneyState["visualizationState"]>) => {
    setState((prev) => ({
      ...prev,
      visualizationState: { ...prev.visualizationState, ...viz },
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const revealPrice = useCallback(() => {
    setState((prev) => ({
      ...prev,
      quote: { ...prev.quote, isPriceRevealed: true },
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  return (
    <SalesJourneyContext.Provider
      value={{
        state,
        currentStepIndex,
        availableAccessories,
        goToStep,
        nextStep,
        prevStep,
        setClientSource,
        updateClientData,
        updateDiscoveryProfile,
        toggleAccessory,
        addAccessory,
        removeAccessory,
        changeAccessoryTier,
        updateExplanationStatus,
        setSellerDiscount,
        setFactoryBonus,
        applyCampaign,
        selectObjection,
        recordNegotiationAction,
        requestManagerApproval,
        finalizeSale,
        resetJourney,
        loadLeadForReheating,
        setUserSession,
        setVisualizationState,
        revealPrice,
      }}
    >
      {children}
    </SalesJourneyContext.Provider>
  );
};

export const useSalesJourney = () => {
  const context = useContext(SalesJourneyContext);
  if (!context) {
    throw new Error("useSalesJourney deve ser utilizado dentro de um SalesJourneyProvider");
  }
  return context;
};
