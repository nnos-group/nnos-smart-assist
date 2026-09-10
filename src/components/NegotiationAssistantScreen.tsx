import React, { useState } from "react";
import {
  MessageSquare, ShieldCheck, ArrowRight, ArrowLeft, Check,
  AlertTriangle, CheckCircle2, ChevronRight, Lock, Award, History, Sparkles
} from "lucide-react";
import { useSalesJourney } from "@/context/SalesJourneyContext";
import { ObjectionCategory } from "@/types/salesJourney";
import { APPROVED_COMMERCIAL_ARGUMENTS, getApprovedArgumentForObjection } from "@/lib/argumentSelectionEngine";
import { ManagerApprovalDialog } from "./ManagerApprovalDialog";

export const NegotiationAssistantScreen: React.FC = () => {
  const {
    state,
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

      {/* SELETOR DE OBJEÇÕES DO CLIENTE */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Qual objeção o cliente apresentou?
          </span>
          <span className="text-xs text-slate-500">12 categorias mapeadas Mopar</span>
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
                    ? "bg-sky-600 text-white border-sky-600 shadow-sm"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <div className="line-clamp-2 leading-tight">{arg.objectionLabel}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* PAINEL ESTRUTURADO DO FLUXO DE NEGOCIAÇÃO (OS 6 PONTOS OBRIGATÓRIOS) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-sky-800 font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-sky-600" />
            <span>Conduta Recomendada para a Objeção Selecionada</span>
          </div>
          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
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
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Investimento</span>
        </button>

        <button
          type="button"
          onClick={nextStep}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
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
