import React from "react";
import {
  Tag, Zap, Award, BadgePercent, Clock, ArrowRight, ArrowLeft,
  CheckCircle, ShieldCheck, ShoppingCart, MessageSquare
} from "lucide-react";
import { useSalesJourney } from "@/context/SalesJourneyContext";
import { getItemDiscountedPrice } from "@/lib/pricingEngine";
import { MOCK_COMMERCIAL_CAMPAIGNS, getEligibleCampaigns } from "@/lib/campaignEligibilityEngine";
import { CommercialCampaignBanner } from "./CommercialCampaignBanner";

export const PricePresentationScreen: React.FC = () => {
  const {
    state,
    availableAccessories,
    setSellerDiscount,
    setFactoryBonus,
    applyCampaign,
    nextStep,
    prevStep,
  } = useSalesJourney();

  const { clientData, discoveryProfile, selectedAccessoryIds, quote, selectedCampaign } = state;

  const selectedAccessories = availableAccessories.filter((a) => selectedAccessoryIds.includes(a.id));

  // Campanhas comerciais elegíveis para o modelo e acessórios selecionados
  const eligibleCampaigns = React.useMemo(() => {
    return getEligibleCampaigns(MOCK_COMMERCIAL_CAMPAIGNS, {
      dealershipId: "matriz",
      vehicleModel: clientData.vehicleModel,
      selectedAccessoryIds,
      subtotal: quote.subtotalAfterStockDiscounts || quote.finalTotal || 0,
    });
  }, [clientData.vehicleModel, selectedAccessoryIds, quote.subtotalAfterStockDiscounts, quote.finalTotal]);

  // Síntese contextualizada do investimento
  const generateContextSummary = () => {
    const usage = discoveryProfile.usageLocation.replace("_", " ");
    const dirtRoad = discoveryProfile.dirtRoadFrequency !== "nunca" ? " e uso em estradas de terra" : "";
    const cargo = discoveryProfile.cargoUsage !== "nao" ? `, o transporte frequente de ${discoveryProfile.cargoUsage.replace("_", " ")}` : "";
    const passengers = discoveryProfile.frequentPassengers.includes("criancas")
      ? " e a necessidade de facilitar o embarque das crianças"
      : "";

    return `Considerando o uso ${usage} do veículo${dirtRoad}${cargo}${passengers}, esta configuração reúne proteção, praticidade e segurança para o seu dia a dia.`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* HEADER DE ETAPA */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold mb-2 border border-sky-200/60">
            <Tag className="w-3.5 h-3.5 text-sky-600" />
            <span>Etapa 5 de 7 · Condições Comerciais &amp; F&amp;I</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display">
            Investimento
          </h1>
          <p className="text-sm text-slate-600 font-medium mt-1">
            Apresente as condições comerciais mantendo o foco nos benefícios construídos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
            Prazo: <strong>{quote.installationDeadlineDays} dia(s) útil</strong> · {quote.estimatedInstallationHours}h oficina
          </span>
        </div>
      </div>

      {/* CONTEXTUALIZAÇÃO CONSULTIVA ANTES DOS NÚMEROS */}
      <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-sky-900 text-white rounded-2xl p-6 shadow-md space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-sky-400" />
          <span>Solução sob medida para {clientData.clientName || "o Cliente"}</span>
        </div>
        <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed">
          “{generateContextSummary()}”
        </p>
        <p className="text-xs text-sky-300 font-bold uppercase tracking-wider pt-1">
          O investimento para deixar o veículo 0km totalmente preparado para essa utilização será de:
        </p>
      </div>

      {/* GATILHOS COMERCIAIS & CAMPANHAS VIGENTES DA MONTADORA */}
      <CommercialCampaignBanner
        eligibleCampaigns={eligibleCampaigns}
        selectedCampaign={selectedCampaign}
        onSelectCampaign={applyCampaign}
      />

      {/* GRID COMERCIAL: LISTA DE ITENS À ESQUERDA & TOTALIZADOR À DIREITA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* COLUNA ESQUERDA: LISTA DETALHADA COM PREÇO ORIGINAL E PROMOCIONAL */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Acessórios Selecionados ({selectedAccessories.length})
            </h2>
            <span className="text-xs text-slate-500 font-medium">Preços com mão-de-obra inclusa</span>
          </div>

          <div className="space-y-2">
            {selectedAccessories.map((item) => {
              const discounted = getItemDiscountedPrice(item);
              const hasDiscount = item.discountPercent > 0;

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/70"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{item.name}</div>
                      <div className="text-[11px] text-slate-500">{item.description}</div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    {hasDiscount ? (
                      <div>
                        <span className="text-[11px] text-slate-400 line-through block">
                          R$ {item.price.toLocaleString("pt-BR")}
                        </span>
                        <span className="text-xs font-black text-slate-900">
                          R$ {discounted.toLocaleString("pt-BR")}
                        </span>
                        <span className="text-[10px] font-bold text-amber-600 block">
                          ({item.discountPercent}% off estoque)
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-slate-900">
                        R$ {item.price.toLocaleString("pt-BR")}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* AJUSTES COMERCIAIS RÁPIDOS */}
          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="input-seller-discount">
                Desconto do Consultor (R$)
              </label>
              <input
                id="input-seller-discount"
                type="number"
                min={0}
                max={quote.subtotalAfterStockDiscounts}
                value={quote.sellerDiscount || ""}
                onChange={(e) => setSellerDiscount(Number(e.target.value) || 0)}
                placeholder="R$ 0"
                className="w-full rounded-xl border border-slate-200 p-2 text-xs font-bold text-slate-900"
              />
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Alçada de consultor: até 5% (acima exige aprovação do gerente)
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="input-factory-bonus">
                Bônus Montadora / Fábrica (R$)
              </label>
              <input
                id="input-factory-bonus"
                type="number"
                min={0}
                value={quote.factoryBonus || ""}
                onChange={(e) => setFactoryBonus(Number(e.target.value) || 0)}
                placeholder="R$ 0"
                className="w-full rounded-xl border border-slate-200 p-2 text-xs font-bold text-slate-900"
              />
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Subsídio oficial de montadora quando elegível
              </span>
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: CARD TOTALIZADOR COM CDC E CONDIÇÕES */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 space-y-4">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Resumo Financeiro</span>
            <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
              {clientData.vehicleModel}
            </span>
          </div>

          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal Tabela:</span>
              <span className="font-semibold text-slate-800">R$ {quote.originalSubtotal.toLocaleString("pt-BR")}</span>
            </div>

            {quote.stockDiscountAmount > 0 && (
              <div className="flex justify-between text-amber-700 font-semibold">
                <span>Desconto de Estoque:</span>
                <span>- R$ {quote.stockDiscountAmount.toLocaleString("pt-BR")}</span>
              </div>
            )}

            {quote.sellerDiscount > 0 && (
              <div className="flex justify-between text-blue-700 font-semibold">
                <span>Desconto da Concessionária:</span>
                <span>- R$ {quote.sellerDiscount.toLocaleString("pt-BR")} ({quote.sellerDiscountPercent}%)</span>
              </div>
            )}

            {quote.factoryBonus > 0 && (
              <div className="flex justify-between text-purple-700 font-semibold">
                <span>Bônus da Montadora:</span>
                <span>- R$ {quote.factoryBonus.toLocaleString("pt-BR")}</span>
              </div>
            )}

            {quote.campaignDiscount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Campanha Comercial:</span>
                <span>- R$ {quote.campaignDiscount.toLocaleString("pt-BR")}</span>
              </div>
            )}
          </div>

          {/* VALOR FINAL À VISTA */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-bold uppercase text-slate-500">Total à Vista</span>
              <span className="text-3xl font-black text-sky-600">
                R$ {quote.finalTotal.toLocaleString("pt-BR")}
              </span>
            </div>

            {/* PARCELAMENTO CARTÃO & CDC */}
            <div className="border-t border-slate-200 pt-3 space-y-2">
              <div className="flex justify-between text-xs text-slate-700">
                <span>Parcelamento Concessionária:</span>
                <span className="font-black text-slate-900">
                  {quote.installmentsCount}x de R$ {quote.monthlyInstallment.toLocaleString("pt-BR")} s/ juros
                </span>
              </div>

              <div className="bg-sky-50 text-sky-900 p-3 rounded-xl border border-sky-200 flex items-start gap-2">
                <Zap className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div className="text-xs leading-tight">
                  <span className="font-black block">Diluição no CDC Jeep / RAM Financiamento:</span>
                  <span className="text-[11px] block mt-0.5">
                    Apenas <strong>+ R$ {quote.monthlyCdc.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} / mês</strong> na parcela do veículo.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA PARA NEGOCIAR OU FECHAR */}
          <div className="pt-2 space-y-2">
            <button
              type="button"
              onClick={nextStep}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Avançar para Negociação Assistida</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* BOTÃO VOLTAR */}
      <div className="flex items-center justify-start pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={prevStep}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Entender os Benefícios</span>
        </button>
      </div>
    </div>
  );
};
