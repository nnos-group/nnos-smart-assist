import React, { useState } from "react";
import {
  Tag, Zap, Award, BadgePercent, Clock, ArrowRight, ArrowLeft,
  CheckCircle, ShieldCheck, ShoppingCart, MessageSquare, Trash2,
  Boxes, ChevronDown, ChevronUp, AlertCircle, Sparkles, CheckCircle2
} from "lucide-react";
import { useSalesJourney } from "@/context/SalesJourneyContext";
import { getItemDiscountedPrice } from "@/lib/pricingEngine";
import { MOCK_COMMERCIAL_CAMPAIGNS, getEligibleCampaigns } from "@/lib/campaignEligibilityEngine";
import { CommercialCampaignBanner } from "./CommercialCampaignBanner";
import { toast } from "sonner";

export const PricePresentationScreen: React.FC = () => {
  const {
    state,
    availableAccessories,
    toggleAccessory,
    goToStep,
    setSellerDiscount,
    setFactoryBonus,
    applyCampaign,
    nextStep,
    prevStep,
  } = useSalesJourney();

  const { clientData, discoveryProfile, selectedAccessoryIds, quote, selectedCampaign } = state;

  const selectedAccessories = availableAccessories.filter((a) => selectedAccessoryIds.includes(a.id));
  const [showStockDetails, setShowStockDetails] = useState(true);

  // Classificação da Análise de Estoque da Concessionária
  const stockAnalysis = React.useMemo(() => {
    let availableCount = 0;
    let dormantCount = 0;
    let obsoleteCount = 0;

    selectedAccessories.forEach((item) => {
      const days = item.stockAgeDays || 0;
      if (days > 365) {
        obsoleteCount++;
      } else if (days > 180) {
        dormantCount++;
      } else {
        availableCount++;
      }
    });

    return {
      availableCount,
      dormantCount,
      obsoleteCount,
      totalCount: selectedAccessories.length,
    };
  }, [selectedAccessories]);

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

  const handleRemoveItem = (id: string, name: string) => {
    toggleAccessory(id);
    toast.info(`"${name}" removido da proposta.`);
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
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Acessórios Selecionados ({selectedAccessories.length})
              </h2>
              <span className="text-xs text-slate-500 font-medium">Preços com mão-de-obra inclusa</span>
            </div>
            {selectedAccessories.length > 0 && (
              <span className="text-xs text-slate-500 font-medium">
                Clique na lixeira para remover
              </span>
            )}
          </div>

          {selectedAccessories.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 space-y-2">
              <ShoppingCart className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-700">Nenhum acessório selecionado</p>
              <p className="text-xs text-slate-500">
                Volte para a etapa de recomendações para adicionar itens à proposta.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {selectedAccessories.map((item) => {
                const discounted = getItemDiscountedPrice(item);
                const hasDiscount = item.discountPercent > 0;
                const days = item.stockAgeDays || 0;

                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/70 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-2xl shrink-0">{item.icon}</span>
                      <div className="truncate">
                        <div className="text-xs font-bold text-slate-900 truncate">{item.name}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] text-slate-500 truncate">{item.description}</span>
                          {days > 365 ? (
                            <span className="shrink-0 text-[10px] font-black bg-rose-100 text-rose-800 px-2 py-0.5 rounded border border-rose-200">
                              🔥 OBSOLETO • {days}D (-{item.discountPercent}%)
                            </span>
                          ) : days > 180 ? (
                            <span className="shrink-0 text-[10px] font-black bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-200">
                              ⚡ DORMENTE • {days}D (-{item.discountPercent}%)
                            </span>
                          ) : (
                            <span className="shrink-0 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                              ✓ DISPONÍVEL
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 ml-3">
                      <div className="text-right">
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

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id, item.name)}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title={`Remover ${item.name} da proposta`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* PAINEL DE ANÁLISE DE ESTOQUE DA CONCESSIONÁRIA */}
          {selectedAccessories.length > 0 && (
            <div className="mt-4 p-4 rounded-xl bg-slate-900 text-white border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
                    <Boxes className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">
                      Análise de Estoque da Concessionária (Giro &amp; Oportunidades)
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Classificação etária das peças selecionadas com descontos de giro autorizados
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowStockDetails(!showStockDetails)}
                  className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer"
                >
                  <span>{showStockDetails ? "Recolher" : "Detalhes"}</span>
                  {showStockDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {showStockDetails && (
                <div className="pt-2 border-t border-slate-800 space-y-3 animate-in fade-in">
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-800/60">
                      <span className="block text-[10px] font-bold text-emerald-400 uppercase">Disponível (≤180d)</span>
                      <strong className="text-base font-black text-emerald-200">{stockAnalysis.availableCount} itens</strong>
                      <span className="block text-[10px] text-emerald-400/80">Sem desconto</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-amber-950/60 border border-amber-800/60">
                      <span className="block text-[10px] font-bold text-amber-400 uppercase">Dormente (&gt;180d)</span>
                      <strong className="text-base font-black text-amber-200">{stockAnalysis.dormantCount} itens</strong>
                      <span className="block text-[10px] text-amber-400/80">10% a 20% OFF</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-800/60">
                      <span className="block text-[10px] font-bold text-rose-400 uppercase">Obsoleto (&gt;1 ano)</span>
                      <strong className="text-base font-black text-rose-200">{stockAnalysis.obsoleteCount} itens</strong>
                      <span className="block text-[10px] text-rose-400/80">25% a 35% OFF</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="text-slate-300">
                        {stockAnalysis.dormantCount + stockAnalysis.obsoleteCount > 0
                          ? `Gatilho de Giro: ${stockAnalysis.dormantCount + stockAnalysis.obsoleteCount} item(ns) contam com abatimento de liquidação de estoque homologado.`
                          : "Todos os itens selecionados possuem giro ativo na concessionária."}
                      </span>
                    </div>
                    {quote.stockDiscountAmount > 0 && (
                      <span className="font-bold text-amber-400 shrink-0">
                        Economia: R$ {quote.stockDiscountAmount.toLocaleString("pt-BR")}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

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
                Bônus de Fábrica Adicional (R$)
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
                <span>Desconto de Estoque (Dormente/Obsoleto):</span>
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
                <span>Campanha Comercial{selectedCampaign ? ` (${selectedCampaign.name})` : ""}:</span>
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

          {/* BOTÕES DE AÇÃO: IR DIRETO PARA FECHAMENTO OU NEGOCIAÇÃO */}
          <div className="pt-2 space-y-2.5">
            {/* 1. Botão Principal Solicitado: Ir Direto para o Fechamento */}
            <button
              type="button"
              onClick={() => goToStep("closing")}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all transform active:scale-[0.99]"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Ir Direto para o Fechamento</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </button>

            {/* 2. Botão Secundário: Avançar para Negociação Assistida */}
            <button
              type="button"
              onClick={nextStep}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors border border-slate-200"
            >
              <MessageSquare className="w-4 h-4 text-slate-600" />
              <span>Tratar Objeções / Negociação Assistida (Etapa 6)</span>
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
