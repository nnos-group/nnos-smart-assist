import React, { useState, useMemo } from "react";
import {
  MessageSquare, ShieldCheck, ArrowRight, ArrowLeft, Check,
  AlertTriangle, CheckCircle2, ChevronRight, Lock, Award, History, Sparkles,
  DollarSign, SlidersHorizontal, Layers, CheckCircle
} from "lucide-react";
import { useSalesJourney } from "@/context/SalesJourneyContext";
import { ObjectionCategory } from "@/types/salesJourney";
import { APPROVED_COMMERCIAL_ARGUMENTS, getApprovedArgumentForObjection } from "@/lib/argumentSelectionEngine";
import { recomposeAccessoriesByBudget } from "@/lib/investmentRecompositionEngine";
import { ManagerApprovalDialog } from "./ManagerApprovalDialog";
import { toast } from "sonner";

export const NegotiationAssistantScreen: React.FC = () => {
  const {
    state,
    availableAccessories,
    applyRecomposedPackage,
    selectObjection,
    recordNegotiationAction,
    setSellerDiscount,
    requestManagerApproval,
    nextStep,
    prevStep,
  } = useSalesJourney();

  const { negotiation, quote, clientData, userSession } = state;
  const currentObjection = negotiation.selectedObjection || "preco";
  const activeArgument = negotiation.activeArgument || getApprovedArgumentForObjection(currentObjection);

  const [customObjectionInput, setCustomObjectionInput] = useState("");
  const [managerModalOpen, setManagerModalOpen] = useState(false);
  const [discountInputValue, setDiscountInputValue] = useState(quote.sellerDiscount || 0);

  // Capacidade de investimento (opcional na negociação após apresentação do preço)
  const [budgetInput, setBudgetInput] = useState<string>(() => {
    return negotiation.targetAccessoryInvestment ? String(negotiation.targetAccessoryInvestment) : "3000";
  });

  const numericBudget = Math.max(500, parseFloat(budgetInput.replace(/\D/g, "")) || 3000);

  // Otimização em cima dos acessórios já selecionados (recomposição em 3 pacotes)
  const recomposition = useMemo(() => {
    const currentSelected = availableAccessories.filter((a) => state.selectedAccessoryIds.includes(a.id));
    return recomposeAccessoriesByBudget({
      selectedAccessories: currentSelected.length > 0 ? currentSelected : availableAccessories,
      recommendations: state.recommendations,
      targetBudget: numericBudget,
      activeCampaign: state.selectedCampaign,
    });
  }, [availableAccessories, state.selectedAccessoryIds, state.recommendations, numericBudget, state.selectedCampaign]);

  const handleSelectObjectionCategory = (obj: ObjectionCategory) => {
    selectObjection(obj);
  };

  const handleApplyDiscount = () => {
    setSellerDiscount(discountInputValue);
    if (quote.subtotalAfterStockDiscounts > 0 && (discountInputValue / quote.subtotalAfterStockDiscounts) * 100 > 5) {
      setManagerModalOpen(true);
    }
  };

  const handleManagerApproved = (mgrName: string) => {
    requestManagerApproval(mgrName);
    setManagerModalOpen(false);
  };

  const handleSelectPackageConfiguration = (pkgTitle: string, itemIds: string[]) => {
    applyRecomposedPackage(itemIds, numericBudget);
    toast.success(`Pacote "${pkgTitle}" aplicado com sucesso à proposta!`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* HEADER DE ETAPA */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold mb-2 border border-sky-200/60">
            <MessageSquare className="w-3.5 h-3.5 text-sky-600" />
            <span>Etapa 6 de 7 · Negociação Assistida &amp; Quebra de Objeções</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display">
            Negociação assistida
          </h1>
          <p className="text-sm text-slate-600 font-medium mt-1">
            Utilize argumentos aprovados e adequados ao perfil do cliente.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
            Perfil: <strong>{userSession.role.toUpperCase()}</strong> (Alçada max: 5%)
          </span>
        </div>
      </div>

      {/* ADEQUAR À CAPACIDADE DE INVESTIMENTO (MÓDULO OPCIONAL DA FASE DE NEGOCIAÇÃO) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-2xs">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-black uppercase tracking-tight text-slate-900 font-display">
                  Adequar à Capacidade de Investimento
                </h2>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded">
                  Recomposição Inteligente
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Reorganiza o pacote preservando essenciais e retirando complementares conforme o valor informado
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 self-start sm:self-auto">
            Proposta Atual: <strong>R$ {quote.finalTotal.toLocaleString("pt-BR")}</strong>
          </span>
        </div>

        {/* Abordagem consultiva recomendada */}
        <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/80 text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block mb-1">
            Abordagem Consultiva Recomendada ao Cliente:
          </span>
          <p className="text-sm font-semibold text-slate-800 italic">
            “Considerando a solução apresentada, quanto você estaria confortável em investir hoje nos acessórios do seu veículo?”
          </p>
        </div>

        {/* Input da capacidade e atalhos rápidos */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1 max-w-sm">
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1" htmlFor="input-target-budget">
              Capacidade informada pelo cliente
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400 pointer-events-none">R$</span>
              <input
                id="input-target-budget"
                type="number"
                step={500}
                min={500}
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                placeholder="Ex: 3000"
                className="w-full pl-9 pr-3 py-2 text-sm font-bold text-slate-900 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/70 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap pt-2 sm:pt-4">
            <span className="text-[11px] font-bold text-slate-400 mr-1">Atalhos:</span>
            {[2000, 2850, 3000, 3500, 4500].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setBudgetInput(String(val))}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                  numericBudget === val
                    ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                R$ {val.toLocaleString("pt-BR")}
              </button>
            ))}
          </div>
        </div>

        {/* Indicador claro da capacidade informada */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
          <span className="font-bold text-slate-800">
            Capacidade informada: <strong className="text-emerald-700 text-sm">R$ {numericBudget.toLocaleString("pt-BR")}</strong>
          </span>
          <span className="text-slate-500">
            Selecione uma alternativa abaixo para reorganizar a configuração da proposta:
          </span>
        </div>

        {/* As 3 Alternativas: ESSENCIAL, RECOMENDADO, COMPLETO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* 1. ESSENCIAL */}
          {(() => {
            const pkg = recomposition.essential;
            const itemIds = pkg.accessories.map((a) => a.id);
            const isCurrentlySelected =
              itemIds.length === state.selectedAccessoryIds.length &&
              itemIds.every((id) => state.selectedAccessoryIds.includes(id));

            return (
              <div
                className={`rounded-2xl border p-4 flex flex-col justify-between space-y-3 transition-all ${
                  isCurrentlySelected
                    ? "border-emerald-500 bg-emerald-50/20 shadow-sm ring-1 ring-emerald-500/30"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                      ESSENCIAL
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {pkg.accessories.length} itens
                    </span>
                  </div>

                  <div className="py-2">
                    <span className="text-2xl font-black text-slate-900 block">
                      R$ {pkg.totalValue.toLocaleString("pt-BR")}
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5 leading-snug">
                      {pkg.tagline}
                    </span>
                  </div>

                  {/* Relação de itens */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100 max-h-48 overflow-y-auto">
                    {pkg.accessories.map((acc) => (
                      <div key={acc.id} className="text-xs flex items-center justify-between text-slate-700">
                        <span className="truncate pr-2 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{acc.name}</span>
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500 shrink-0">
                          R$ {acc.price.toLocaleString("pt-BR")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSelectPackageConfiguration("Essencial", itemIds)}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    isCurrentlySelected
                      ? "bg-emerald-600 text-white shadow-2xs cursor-default"
                      : "bg-slate-900 hover:bg-slate-800 text-white"
                  }`}
                >
                  {isCurrentlySelected ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Configuração Ativa</span>
                    </>
                  ) : (
                    <span>Aplicar Essencial</span>
                  )}
                </button>
              </div>
            );
          })()}

          {/* 2. RECOMENDADO (DESTAQUE) */}
          {(() => {
            const pkg = recomposition.recommended;
            const itemIds = pkg.accessories.map((a) => a.id);
            const isCurrentlySelected =
              itemIds.length === state.selectedAccessoryIds.length &&
              itemIds.every((id) => state.selectedAccessoryIds.includes(id));

            return (
              <div
                className={`rounded-2xl border-2 p-4 flex flex-col justify-between space-y-3 relative transition-all shadow-sm ${
                  isCurrentlySelected
                    ? "border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-600/30"
                    : "border-emerald-500 bg-white hover:border-emerald-600"
                }`}
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs">
                  Melhor Equilíbrio
                </div>

                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-800">
                      RECOMENDADO
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                      {pkg.accessories.length} itens
                    </span>
                  </div>

                  <div className="py-2">
                    <span className="text-2xl font-black text-emerald-700 block">
                      R$ {pkg.totalValue.toLocaleString("pt-BR")}
                    </span>
                    <span className="text-[11px] text-slate-600 block mt-0.5 leading-snug">
                      {pkg.tagline}
                    </span>
                  </div>

                  {/* Relação de itens */}
                  <div className="space-y-1.5 pt-2 border-t border-emerald-100 max-h-48 overflow-y-auto">
                    {pkg.accessories.map((acc) => (
                      <div key={acc.id} className="text-xs flex items-center justify-between text-slate-700">
                        <span className="truncate pr-2 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{acc.name}</span>
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500 shrink-0">
                          R$ {acc.price.toLocaleString("pt-BR")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSelectPackageConfiguration("Recomendado", itemIds)}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    isCurrentlySelected
                      ? "bg-emerald-600 text-white shadow-2xs cursor-default"
                      : "bg-[#0077E6] hover:bg-[#0066CC] text-white shadow-glow-blue"
                  }`}
                >
                  {isCurrentlySelected ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Configuração Ativa</span>
                    </>
                  ) : (
                    <span>Aplicar Recomendado</span>
                  )}
                </button>
              </div>
            );
          })()}

          {/* 3. COMPLETO */}
          {(() => {
            const pkg = recomposition.complete;
            const itemIds = pkg.accessories.map((a) => a.id);
            const isCurrentlySelected =
              itemIds.length === state.selectedAccessoryIds.length &&
              itemIds.every((id) => state.selectedAccessoryIds.includes(id));

            return (
              <div
                className={`rounded-2xl border p-4 flex flex-col justify-between space-y-3 transition-all ${
                  isCurrentlySelected
                    ? "border-sky-500 bg-sky-50/20 shadow-sm ring-1 ring-sky-500/30"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                      COMPLETO
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {pkg.accessories.length} itens
                    </span>
                  </div>

                  <div className="py-2">
                    <span className="text-2xl font-black text-slate-900 block">
                      R$ {pkg.totalValue.toLocaleString("pt-BR")}
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5 leading-snug">
                      {pkg.tagline}
                    </span>
                  </div>

                  {/* Relação de itens */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100 max-h-48 overflow-y-auto">
                    {pkg.accessories.map((acc) => (
                      <div key={acc.id} className="text-xs flex items-center justify-between text-slate-700">
                        <span className="truncate pr-2 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                          <span className="truncate">{acc.name}</span>
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500 shrink-0">
                          R$ {acc.price.toLocaleString("pt-BR")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSelectPackageConfiguration("Completo", itemIds)}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    isCurrentlySelected
                      ? "bg-sky-600 text-white shadow-2xs cursor-default"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                  }`}
                >
                  {isCurrentlySelected ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Configuração Ativa</span>
                    </>
                  ) : (
                    <span>Manter Completo</span>
                  )}
                </button>
              </div>
            );
          })()}
        </div>
      </div>

      {/* SELETOR DE OBJEÇÕES DO CLIENTE */}
      <div className="cockpit-panel rounded-2xl border border-slate-200 p-5 space-y-3 shadow-card">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Qual objeção o cliente apresentou?
          </span>
          <span className="text-xs text-slate-500 font-medium">12 categorias mapeadas Mopar</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {APPROVED_COMMERCIAL_ARGUMENTS.map((arg) => {
            const isSelected = currentObjection === arg.objection;
            return (
              <button
                key={arg.id}
                type="button"
                onClick={() => handleSelectObjectionCategory(arg.objection)}
                className={`p-3 rounded-xl text-left text-xs font-semibold border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className="line-clamp-2 leading-tight">{arg.objectionLabel}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* PAINEL ESTRUTURADO DO FLUXO DE NEGOCIAÇÃO (OS 6 PONTOS OBRIGATÓRIOS) */}
      <div className="cockpit-panel rounded-2xl border border-slate-200 p-6 space-y-5 shadow-card">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-sky-800 font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-sky-600" />
            <span>Conduta Recomendada para a Objeção Selecionada</span>
          </div>
          <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
            Versão homologada: {activeArgument.approvedVersion} ({activeArgument.brand})
          </span>
        </div>

        {/* 1. Objeção Identificada */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
          <span className="font-bold text-slate-500 uppercase tracking-wider block text-[10px] mb-0.5">
            1. Objeção Identificada
          </span>
          <p className="text-sm font-bold text-slate-900">{activeArgument.objectionLabel}</p>
        </div>

        {/* 2 & 3. Argumento Principal & Argumento Alternativo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-sky-50/80 p-4 rounded-xl border border-sky-200/80 space-y-1.5">
            <span className="font-bold text-sky-950 uppercase tracking-wider block text-[10px]">
              2. Argumento Principal Aprovado
            </span>
            <p className="text-slate-800 font-medium leading-relaxed">{activeArgument.mainArgument}</p>
          </div>

          <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-200/70 space-y-1.5">
            <span className="font-bold text-indigo-950 uppercase tracking-wider block text-[10px]">
              3. Argumento Alternativo
            </span>
            <p className="text-slate-800 font-medium leading-relaxed">{activeArgument.alternativeArgument}</p>
          </div>
        </div>

        {/* 4 & 5. Pergunta de Aprofundamento & Proposta de Fechamento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-amber-50/80 p-4 rounded-xl border border-amber-200/80 space-y-1.5">
            <span className="font-bold text-amber-950 uppercase tracking-wider block text-[10px]">
              4. Pergunta de Aprofundamento
            </span>
            <p className="text-slate-800 font-medium leading-relaxed italic">
              “{activeArgument.deepeningQuestion}”
            </p>
          </div>

          <div className="bg-emerald-50/80 p-4 rounded-xl border border-emerald-200/80 space-y-1.5">
            <span className="font-bold text-emerald-950 uppercase tracking-wider block text-[10px]">
              5. Proposta de Fechamento
            </span>
            <p className="text-slate-800 font-medium leading-relaxed font-semibold">
              “{activeArgument.closingProposal}”
            </p>
          </div>
        </div>

        {/* 6. Condição Comercial Autorizada */}
        {activeArgument.authorizedCondition && (
          <div className="p-3.5 rounded-xl bg-slate-900 text-white text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-sky-400" />
              <span>
                <strong>6. Condição Autorizada:</strong> {activeArgument.authorizedCondition}
              </span>
            </div>
            <span className="text-[11px] text-sky-300 font-bold bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
              Desconto Máx Autônomo: {activeArgument.maxAuthorizedDiscountPercent}%
            </span>
          </div>
        )}

        {/* REGISTRO DA REAÇÃO DO CLIENTE & HISTÓRICO */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <span className="text-xs font-bold text-slate-800 block">Registrar Reação do Cliente à Argumentação:</span>
          <div className="flex flex-wrap gap-2">
            {[
              { id: "aceitou" as const, label: "✓ Cliente Aceitou o Argumento", color: "bg-emerald-600 text-white" },
              { id: "em_duvida" as const, label: "? Permanece em Dúvida", color: "bg-amber-600 text-white" },
              { id: "pediu_desconto" as const, label: "$ Pediu Desconto Adicional", color: "bg-blue-600 text-white" },
              { id: "resistiu" as const, label: "✕ Manteve Resistência", color: "bg-rose-600 text-white" },
            ].map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => recordNegotiationAction(btn.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${btn.color} shadow-xs hover:opacity-90`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* HISTÓRICO DE AÇÕES DESTA PROPOSTA */}
        {negotiation.records.length > 0 && (
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <History className="w-3.5 h-3.5 text-slate-500" />
              <span>Histórico da Negociação ({negotiation.records.length} registros)</span>
            </div>
            <div className="space-y-1.5 max-h-32 overflow-y-auto">
              {negotiation.records.map((rec) => (
                <div key={rec.id} className="p-2 rounded-lg bg-slate-50 text-[11px] text-slate-600 flex justify-between">
                  <span>Objeção: <strong>{rec.objection}</strong> ({rec.clientReaction})</span>
                  <span>{new Date(rec.timestamp).toLocaleTimeString("pt-BR")}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* NAVEGAÇÃO ENTRE ETAPAS */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={prevStep}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Investimento</span>
        </button>

        <button
          type="button"
          onClick={nextStep}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0077E6] hover:bg-[#0066CC] text-white font-bold text-xs tracking-tight transition-all shadow-glow-blue cursor-pointer active:scale-95"
        >
          <span>Avançar para Fechamento</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* MODAL DE APROVAÇÃO GERENCIAL SE SOLICITADO */}
      <ManagerApprovalDialog
        isOpen={managerModalOpen}
        onClose={() => setManagerModalOpen(false)}
        onApprove={handleManagerApproved}
        requestedDiscountPercent={quote.sellerDiscountPercent}
        requestedDiscountValue={discountInputValue}
      />
    </div>
  );
};
