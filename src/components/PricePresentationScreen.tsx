import React, { useState } from "react";
import {
  Tag, Zap, Award, BadgePercent, Clock, ArrowRight, ArrowLeft,
  CheckCircle, ShieldCheck, ShoppingCart, MessageSquare, Trash2,
  Boxes, ChevronDown, ChevronUp, AlertCircle, Sparkles, CheckCircle2, Share2
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

  const { clientData, discoveryProfile, selectedAccessoryIds, quote, selectedCampaign, userSession } = state;

  const selectedAccessories = availableAccessories.filter((a) => selectedAccessoryIds.includes(a.id));
  
  // Análise de estoque fica sempre recolhida inicialmente por segurança
  const [showStockDetails, setShowStockDetails] = useState(false);

  // Alçada de desconto do usuário ativo
  const userRole = userSession?.role || "consultor";
  const maxAllowedPercent = userRole === "administrador" ? 20.0 : userRole === "gerente" ? 10.0 : 5.0;
  const userRoleLabel = userRole === "administrador" ? "Administrador" : userRole === "gerente" ? "Gerente" : "Consultor";

  const [discountPercentInput, setDiscountPercentInput] = useState<string>(() => {
    return quote.sellerDiscountPercent > 0 ? String(quote.sellerDiscountPercent) : "";
  });

  React.useEffect(() => {
    if (quote.sellerDiscountPercent > 0) {
      setDiscountPercentInput(String(quote.sellerDiscountPercent));
    } else if (quote.sellerDiscount === 0) {
      setDiscountPercentInput("");
    }
  }, [quote.sellerDiscountPercent, quote.sellerDiscount]);

  const handleDiscountPercentChange = (valStr: string) => {
    setDiscountPercentInput(valStr);
    if (valStr.trim() === "") {
      setSellerDiscount(0);
      return;
    }
    const parsed = parseFloat(valStr.replace(",", "."));
    if (isNaN(parsed) || parsed < 0) {
      setSellerDiscount(0);
      return;
    }

    if (parsed > maxAllowedPercent) {
      toast.error(`Limite de alçada atingido: o perfil ${userRoleLabel} permite no máximo ${maxAllowedPercent}% de desconto.`);
      setDiscountPercentInput(String(maxAllowedPercent));
      const amountInReais = Math.round((maxAllowedPercent / 100) * (quote.subtotalAfterStockDiscounts || 0));
      setSellerDiscount(amountInReais);
      return;
    }

    const amountInReais = Math.round((parsed / 100) * (quote.subtotalAfterStockDiscounts || 0));
    setSellerDiscount(amountInReais);
  };

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

  const handleShareWhatsAppProposal = () => {
    const accessoriesList = selectedAccessories.length > 0
      ? selectedAccessories.map((a) => `  ✓ *${a.name}* (c/ mão de obra inclusa)`).join("\n")
      : "Nenhum acessório selecionado";

    // Link interativo público de demonstração 3D
    const accIds = selectedAccessories.map((a) => a.id).join(",");
    const basePath = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
    const interactive3dUrl = `${window.location.origin}${basePath}/visualizacao?client=${encodeURIComponent(
      clientData.clientName || "Cliente"
    )}&model=${encodeURIComponent(clientData.vehicleModel)}&color=${encodeURIComponent(
      clientData.vehicleColor
    )}&acc=${encodeURIComponent(accIds)}&total=${quote.finalTotal}&cdc=${encodeURIComponent(
      quote.monthlyInstallment
    )}`;

    const totalSavings = (quote.stockDiscountAmount || 0) + (quote.sellerDiscount || 0) + (quote.campaignDiscount || 0);

    const message =
      `Olá, *${clientData.clientName || "Cliente"}*! Tudo bem?\n\n` +
      `Conforme conversamos na concessionária, preparei a proposta oficial de personalização do seu *${clientData.vehicleModel}* (${clientData.vehicleColor}):\n\n` +
      `⭐ *PACOTE DE ACESSÓRIOS SELECIONADOS:*\n${accessoriesList}\n\n` +
      `💎 *DIFERENCIAIS EXCLUSIVOS DE CONCESSIONÁRIA AUTORIZADA:*\n` +
      `• *100% Originais & Homologados de Fábrica:* Você adquire componentes desenvolvidos e testados sob os mais rigorosos padrões de engenharia Mopar / Stellantis, com durabilidade e encaixe sob medida.\n` +
      `• *Garantia Total do Veículo Preservada:* A instalação é executada por técnicos especializados na oficina autorizada. O seu veículo 0km mantém integralmente a garantia total de fábrica, sem qualquer risco elétrico ou estrutural.\n` +
      `• *Segurança Ativa e Passiva Integradas:* Acessórios testados contra impactos e perfeitamente integrados à eletrônica de bordo original do carro.\n` +
      `• *Valorização Comprovada na Revenda:* Carros com acessórios genuínos de fábrica têm maior procura, maior valor de avaliação e liquidez no mercado.\n\n` +
      `💰 *CONDIÇÕES ESPECIAIS HOMOLOGADAS:*\n` +
      (totalSavings > 0 ? `• De Tabela: R$ ${quote.originalSubtotal.toLocaleString("pt-BR")}\n• Economia Total Aplicada: - R$ ${totalSavings.toLocaleString("pt-BR")}\n` : "") +
      `• *Investimento Final à Vista:* R$ ${quote.finalTotal.toLocaleString("pt-BR")}\n` +
      `• *Parcelamento Concessionária:* ${quote.installmentsCount}x de R$ ${quote.monthlyInstallment.toLocaleString("pt-BR")} sem juros\n` +
      `• *Diluição no Financiamento:* + apenas R$ ${quote.monthlyCdc.toFixed(2)}/mês na parcela do veículo\n\n` +
      `📲 *ACESSE A VISUALIZAÇÃO 3D INTERATIVA:* \n` +
      `Gire o veículo e confira a transformação do seu carro montado em tempo real:\n` +
      `🔗 ${interactive3dUrl}\n\n` +
      `Os itens já estão pré-reservados em nosso estoque para a montagem. Posso confirmar a ordem de serviço para a entrega técnica?`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(interactive3dUrl).catch(() => {});
    }

    const encoded = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, "_blank");
    toast.success("Proposta comercial com argumentos de garantia e link 3D gerada para o WhatsApp!");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* HEADER DE ETAPA */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold mb-2 border border-sky-200/60">
            <Tag className="w-3.5 h-3.5 text-sky-600" />
            <span>Etapa 5 de 7 · Condições Comerciais</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display">
            Investimento
          </h1>
          <p className="text-sm text-slate-600 font-medium mt-1">
            Apresente as condições comerciais mantendo o foco nos benefícios construídos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
            Prazo: <strong>{quote.installationDeadlineDays} dia(s) útil</strong> · {quote.estimatedInstallationHours}h oficina
          </span>

          <button
            type="button"
            onClick={handleShareWhatsAppProposal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
            title="Enviar proposta oficial com link 3D, garantia de fábrica preservada e valores ao WhatsApp"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Enviar no WhatsApp</span>
          </button>
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

          {/* PAINEL DE ANÁLISE DE ESTOQUE DA CONCESSIONÁRIA (SEMPRE RECOLHIDO INICIALMENTE) */}
          {selectedAccessories.length > 0 && (
            <div className="mt-4 p-4 rounded-xl bg-slate-900 text-white border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
                    <Boxes className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">
                        Análise de Estoque da Concessionária (Giro &amp; Oportunidades)
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-amber-500/30">
                        🔒 Sigiloso / Uso Interno
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {showStockDetails
                        ? "Classificação etária das peças selecionadas com descontos de giro autorizados"
                        : "Informações estratégicas de estoque protegidas para não exibir ao cliente"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  id="btn-toggle-stock-details"
                  onClick={() => setShowStockDetails(!showStockDetails)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1.5 cursor-pointer border border-slate-700 transition-colors shadow-xs"
                >
                  <span>{showStockDetails ? "Recolher Informações" : "Exibir Análise de Giro"}</span>
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
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700" htmlFor="input-seller-discount">
                  Desconto do {userRoleLabel} (%)
                </label>
                <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                  Alçada máx: {maxAllowedPercent}%
                </span>
              </div>
              <div className="relative">
                <input
                  id="input-seller-discount"
                  type="number"
                  min={0}
                  max={maxAllowedPercent}
                  step={0.5}
                  value={discountPercentInput}
                  onChange={(e) => handleDiscountPercentChange(e.target.value)}
                  placeholder="0%"
                  className="w-full rounded-xl border border-slate-200 p-2 text-xs font-bold text-slate-900 pr-8"
                />
                <span className="absolute right-3 top-2 text-xs font-bold text-slate-400 pointer-events-none">
                  %
                </span>
              </div>
              <span className="text-[10px] text-slate-500 block mt-1">
                {quote.sellerDiscount > 0 ? (
                  <strong className="text-emerald-700">
                    Equivalente a - R$ {quote.sellerDiscount.toLocaleString("pt-BR")} na proposta
                  </strong>
                ) : (
                  `Limite autorizado para perfil ${userRoleLabel}: até ${maxAllowedPercent}%`
                )}
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

          {/* BOTÕES DE AÇÃO: ENVIAR WHATSAPP, IR DIRETO PARA FECHAMENTO OU NEGOCIAÇÃO */}
          <div className="pt-2 space-y-2.5">
            {/* 1. Botão Solicitado: Enviar Proposta & Visualização 3D ao WhatsApp */}
            <button
              type="button"
              onClick={handleShareWhatsAppProposal}
              className="w-full py-3 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold text-xs border border-emerald-300 shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              title="Gerar proposta oficial com link 3D, garantia de fábrica preservada e valores ao WhatsApp"
            >
              <Share2 className="w-4 h-4 text-emerald-600" />
              <span>Enviar Proposta &amp; Visualização 3D ao WhatsApp</span>
            </button>

            {/* 2. Botão Principal Solicitado: Ir Direto para o Fechamento */}
            <button
              type="button"
              onClick={() => goToStep("closing")}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all transform active:scale-[0.99]"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Ir Direto para o Fechamento</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </button>

            {/* 3. Botão Secundário: Avançar para Negociação Assistida */}
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
