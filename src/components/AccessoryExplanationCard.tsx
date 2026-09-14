import React from "react";
import {
  ShieldCheck, Wrench, Clock, Award, CheckCircle2,
  HelpCircle, ThumbsUp, AlertCircle, EyeOff, MapPin, Sparkles
} from "lucide-react";
import { Accessory, getAccessoryPartNumber, DEMO_PART_NUMBER_TOOLTIP } from "@/types/accessories";
import { ACCESSORY_METADATA_DATABASE } from "@/lib/recommendationEngine";
import { AccessoryExplanationStatus, ExplanationStatusType } from "@/types/salesJourney";

interface AccessoryExplanationCardProps {
  accessory: Accessory;
  explanationStatus?: AccessoryExplanationStatus;
  onStatusChange: (status: ExplanationStatusType, notes?: string) => void;
  orderNumber: number;
}

export const AccessoryExplanationCard: React.FC<AccessoryExplanationCardProps> = ({
  accessory,
  explanationStatus,
  onStatusChange,
  orderNumber,
}) => {
  const meta = ACCESSORY_METADATA_DATABASE[accessory.id];
  const currentStatus = explanationStatus?.status || "pending";

  const statusButtons: { id: ExplanationStatusType; label: string; icon: React.ReactNode; color: string }[] = [
    { id: "explained", label: "Explicado", icon: <CheckCircle2 className="w-3.5 h-3.5" />, color: "bg-emerald-600 text-white" },
    { id: "high-interest", label: "Interesse Alto", icon: <ThumbsUp className="w-3.5 h-3.5" />, color: "bg-sky-600 text-white" },
    { id: "doubt", label: "Dúvida do Cliente", icon: <HelpCircle className="w-3.5 h-3.5" />, color: "bg-amber-600 text-white" },
    { id: "resistance", label: "Resistência", icon: <AlertCircle className="w-3.5 h-3.5" />, color: "bg-rose-600 text-white" },
    { id: "not-applicable", label: "Não se Aplica", icon: <EyeOff className="w-3.5 h-3.5" />, color: "bg-slate-600 text-white" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-4">
      {/* HEADER DO CARD: ORDEM SUGERIDA, NOME E LOCALIZAÇÃO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-7 h-7 rounded-full bg-sky-100 text-sky-800 font-black text-xs flex items-center justify-center shrink-0">
            {orderNumber}
          </span>
          <span className="text-2xl p-2 rounded-xl bg-slate-100 border border-slate-200 shrink-0">
            {accessory.icon || "🚗"}
          </span>
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">{accessory.name}</h3>
            <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500 mt-0.5">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span className="truncate">{meta?.locationOnVehicle || "Veículo original Mopar"}</span>
              </span>
              <span
                className="inline-flex items-center gap-1 text-[10px] font-mono text-slate-500 bg-slate-100 hover:bg-slate-200 px-1.5 py-0.5 rounded border border-slate-200 cursor-help"
                title={DEMO_PART_NUMBER_TOOLTIP}
              >
                <span>Part Number: {getAccessoryPartNumber(accessory)}</span>
                <span className="text-[9px] text-amber-700 bg-amber-50 border border-amber-200 px-1 rounded font-sans font-bold">DEMO</span>
              </span>
            </div>
          </div>
        </div>

        {/* BADGES TÉCNICAS: INSTALAÇÃO E GARANTIA */}
        <div className="flex flex-wrap items-center gap-2 shrink-0 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-50 text-sky-800 border border-sky-200 text-[11px] font-semibold whitespace-nowrap">
            <ShieldCheck className="w-3 h-3 text-sky-600" />
            <span>Acessório Genuíno</span>
          </span>
          {meta?.installationHours && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-semibold whitespace-nowrap">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>{meta.installationHours}h inst.</span>
            </span>
          )}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold whitespace-nowrap">
            <Award className="w-3 h-3 text-emerald-600" />
            <span>Garantia Contratual Mopar</span>
          </span>
        </div>
      </div>

      {/* FUNÇÃO PRINCIPAL & POR QUE FOI RECOMENDADO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70 space-y-1">
          <span className="font-bold text-slate-900 block">Função Principal</span>
          <p className="text-slate-600 leading-relaxed">{meta?.primaryBenefit || accessory.description}</p>
        </div>

        <div className="bg-sky-50/70 p-3.5 rounded-xl border border-sky-200/70 space-y-1">
          <span className="font-bold text-sky-950 block">Relação com o Diagnóstico</span>
          <p className="text-sky-900 leading-relaxed">
            {meta?.problemSolved
              ? `Resolve: ${meta.problemSolved}. Mapeado para o uso diário declarado pelo cliente.`
              : "Compatível com a proposta e o modelo do veículo."}
          </p>
        </div>
      </div>

      {/* OS 4 PILARES DE BENEFÍCIO: PRÁTICO, PROTEÇÃO, SEGURANÇA E PRATICIDADE */}
      {meta && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs pt-1">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="font-bold text-slate-800 block text-[11px] mb-0.5">⚡ Benefício Prático</span>
            <p className="text-slate-600 text-[11px] leading-snug">{meta.practicalBenefit}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="font-bold text-slate-800 block text-[11px] mb-0.5">🛡️ Proteção</span>
            <p className="text-slate-600 text-[11px] leading-snug">{meta.protectionBenefit}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="font-bold text-slate-800 block text-[11px] mb-0.5">🔒 Segurança</span>
            <p className="text-slate-600 text-[11px] leading-snug">{meta.safetyBenefit}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="font-bold text-slate-800 block text-[11px] mb-0.5">🚗 Praticidade Diária</span>
            <p className="text-slate-600 text-[11px] leading-snug">{meta.convenienceBenefit}</p>
          </div>
        </div>
      )}

      {/* FEEDBACK DO CONSULTOR: CHECKLIST DE COMPREENSÃO DO CLIENTE */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-bold text-slate-700">Registro do Consultor para este item:</span>
        <div className="flex flex-wrap gap-1.5">
          {statusButtons.map((btn) => {
            const isCurrent = currentStatus === btn.id;
            return (
              <button
                key={btn.id}
                type="button"
                onClick={() => onStatusChange(btn.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isCurrent
                    ? `${btn.color} shadow-xs ring-1 ring-black/10`
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                {btn.icon}
                <span>{btn.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
