/**
 * Smart-Sell — Investment Recomposition Engine
 *
 * Otimiza a configuração dos acessórios de acordo com a capacidade de investimento
 * informada pelo cliente durante a fase de negociação (Etapa 6).
 *
 * Regras:
 * 1. Preservar acessórios essenciais prioritariamente;
 * 2. Preservar itens de maior aderência / matchScore;
 * 3. Retirar complementares primeiro;
 * 4. Depois retirar recomendados excedentes;
 * 5. Não adicionar itens incompatíveis;
 * 6. Utilizar os preços atuais do MVP (com descontos de estoque ou campanhas vigentes);
 * 7. Apresentar 3 alternativas: Essencial, Recomendado e Completo.
 */

import { Accessory } from "@/types/accessories";
import { AccessoryRecommendation, CommercialCampaign } from "@/types/salesJourney";
import { getItemDiscountedPrice } from "./pricingEngine";

export interface RecompositionTierPackage {
  id: "essential" | "recommended" | "complete";
  title: string;
  tagline: string;
  accessories: Accessory[];
  totalValue: number;
  differenceFromTarget: number; // positivo = acima da capacidade, negativo = abaixo
  isHighlighted?: boolean;
}

export interface InvestmentRecompositionResult {
  targetBudget: number;
  essential: RecompositionTierPackage;
  recommended: RecompositionTierPackage;
  complete: RecompositionTierPackage;
}

export function recomposeAccessoriesByBudget({
  selectedAccessories,
  recommendations,
  targetBudget,
  activeCampaign,
}: {
  selectedAccessories: Accessory[];
  recommendations: AccessoryRecommendation[];
  targetBudget: number;
  activeCampaign?: CommercialCampaign;
}): InvestmentRecompositionResult {
  // Mapa de recomendação para acessar matchScore e tier
  const recMap = new Map<string, AccessoryRecommendation>();
  recommendations.forEach((r) => recMap.set(r.accessoryId, r));

  // Helper para obter preço real com desconto de estoque
  const getPrice = (acc: Accessory): number => {
    return getItemDiscountedPrice(acc);
  };

  // Calcular total do pacote original completo
  const completeTotal = selectedAccessories.reduce((sum, a) => sum + getPrice(a), 0);

  // Ordenar itens selecionados por importância:
  // 1. Essencial primeiro, depois Recomendado, depois Complementar
  // 2. Maior matchScore primeiro
  // 3. Menor preço como critério de desempate
  const tierWeight: Record<string, number> = {
    essential: 3,
    recommended: 2,
    complementary: 1,
  };

  const prioritizedItems = [...selectedAccessories].sort((a, b) => {
    const recA = recMap.get(a.id);
    const recB = recMap.get(b.id);
    const weightA = recA ? tierWeight[recA.tier] || 2 : 2;
    const weightB = recB ? tierWeight[recB.tier] || 2 : 2;

    if (weightA !== weightB) return weightB - weightA;

    const scoreA = recA?.matchScore || 50;
    const scoreB = recB?.matchScore || 50;
    if (scoreA !== scoreB) return scoreB - scoreA;

    return getPrice(a) - getPrice(b);
  });

  // 1. PACOTE COMPLETO: Todos os itens originalmente selecionados
  const completePackage: RecompositionTierPackage = {
    id: "complete",
    title: "Completo",
    tagline: "Configuração originalmente apresentada com máxima conveniência e proteção",
    accessories: selectedAccessories,
    totalValue: completeTotal,
    differenceFromTarget: completeTotal - targetBudget,
  };

  // 2. PACOTE ESSENCIAL: Itens indispensáveis estritamente dentro ou o mais próximo possível do targetBudget
  // Preserva essenciais primeiro, retirando complementares e recomendados até caber no orçamento
  const essentialItems: Accessory[] = [];
  let essentialAccumulated = 0;

  for (const item of prioritizedItems) {
    const price = getPrice(item);
    const rec = recMap.get(item.id);
    const isEssentialTier = rec?.tier === "essential";

    // Se é essencial, tenta incluir sempre. Se já ultrapassou o orçamento mas ainda não temos nada, inclui pelo menos o 1º
    if (isEssentialTier || essentialAccumulated + price <= targetBudget || essentialItems.length === 0) {
      if (essentialAccumulated + price <= targetBudget * 1.05 || essentialItems.length === 0) {
        essentialItems.push(item);
        essentialAccumulated += price;
      }
    }
  }

  const essentialPackage: RecompositionTierPackage = {
    id: "essential",
    title: "Essencial",
    tagline: "Itens indispensáveis priorizados dentro da capacidade de investimento",
    accessories: essentialItems,
    totalValue: essentialAccumulated,
    differenceFromTarget: essentialAccumulated - targetBudget,
  };

  // 3. PACOTE RECOMENDADO: Melhor equilíbrio entre investimento e benefício
  // Inclui todos os essenciais + os recomendados de maior aderência, permitindo uma leve aproximação saudável
  const recommendedItems: Accessory[] = [...essentialItems];
  let recommendedAccumulated = essentialAccumulated;

  for (const item of prioritizedItems) {
    if (!recommendedItems.some((i) => i.id === item.id)) {
      const price = getPrice(item);
      const rec = recMap.get(item.id);
      // Complementares só entram se sobrar margem folgada
      if (rec?.tier === "complementary" && recommendedAccumulated + price > targetBudget * 1.15) {
        continue;
      }
      // Adiciona se mantiver equilíbrio
      if (recommendedAccumulated + price <= Math.max(targetBudget * 1.2, essentialAccumulated + price)) {
        recommendedItems.push(item);
        recommendedAccumulated += price;
      }
    }
  }

  // Se recomendado ficou igual ao essencial, tenta incluir mais um item da lista original para dar alternativa de valor
  if (recommendedItems.length === essentialItems.length && prioritizedItems.length > essentialItems.length) {
    const nextItem = prioritizedItems.find((item) => !recommendedItems.some((i) => i.id === item.id));
    if (nextItem) {
      recommendedItems.push(nextItem);
      recommendedAccumulated += getPrice(nextItem);
    }
  }

  const recommendedPackage: RecompositionTierPackage = {
    id: "recommended",
    title: "Recomendado",
    tagline: "Melhor relação custo-benefício mantendo os itens mais importantes",
    accessories: recommendedItems,
    totalValue: recommendedAccumulated,
    differenceFromTarget: recommendedAccumulated - targetBudget,
    isHighlighted: true,
  };

  return {
    targetBudget,
    essential: essentialPackage,
    recommended: recommendedPackage,
    complete: completePackage,
  };
}
