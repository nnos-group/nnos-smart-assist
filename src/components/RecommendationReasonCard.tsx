import React from "react";
import { ShieldCheck, Sparkles, Check, AlertTriangle, Layers, Info, MapPin, Wrench } from "lucide-react";
import { AccessoryRecommendation, RecommendationTier } from "@/types/salesJourney";
import { getAccessoryPartNumber, DEMO_PART_NUMBER_TOOLTIP } from "@/types/accessories";

interface RecommendationReasonCardProps {
  recommendation: AccessoryRecommendation;
  isSelected: boolean;
  onToggle: () => void;
  onRemoveRequest: () => void;
  onChangeTier: (tier: RecommendationTier) => void;
}

export const RecommendationReasonCard: React.FC<RecommendationReasonCardProps> = ({
  recommendation,
  isSelected,
  onToggle,
  onRemoveRequest,
  onChangeTier,
}) => {
  const { accessory, tier, matchScore, reason, relatedAnswers, problemSolved, benefitDelivered, regionalInfluence } =
    recommendation;

  const tierBadgeConfig = {
    essential: {
      label: "ESSENCIAL",
      color: "bg-rose-500/15 text-rose-700 border-rose-300",
      dot: "bg-rose-600",
      tagline: "Proteção ou usabilidade prioritária para a rotina declarada",
    },
    recommended: {
      label: "RECOMENDADO",
      color: "bg-sky-500/15 text-sky-700 border-sky-300",
      dot: "bg-sky-600",
      tagline: "Alta aderência ao perfil e conforto do condutor",
    },
    complementary: {
      label: "COMPLEMENTAR",
      color: "bg-emerald-500/15 text-emerald-700 border-emerald-300",
      dot: "bg-emerald-600",
      tagline: "Estética refinada e valorização do conjunto",
    },
  }[tier];

  const isOutOfStock = accessory.inStock === false || accessory.stockQuantity === 0;

  return (
    <div
      className={`cockpit-panel rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all hover:shadow-card ${
        isOutOfStock
          ? "opacity-60 bg-slate-50 border-dashed border-amber-300 ring-1 ring-amber-200/50"
          : isSelected
          ? "border-slate-300 shadow-card ring-1 ring-black/5"
          : "opacity-75 hover:opacity-100 border-slate-200"
      }`}
    >
      {/* HEADER DO CARD: CLASSIFICAÇÃO & ADERÊNCIA */}
      <div>
        {isOutOfStock && (
          <div className="mb-2.5 flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
            <span className="flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Sem Estoque Local Imediato</span>
            </span>
            <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
              Encomenda CD (2 a 5 dias)
            </span>
          </div>
        )}

        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide border ${tierBadgeConfig.color}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${tierBadgeConfig.dot}`} />
              {tierBadgeConfig.label}
            </span>
            <span className="text-[10px] font-bold text-slate-600 uppercase bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
              {(accessory.category || 'acessório').toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
            <span>Aderência:</span>
            <span className="text-sky-700 font-extrabold">{matchScore}%</span>
          </div>
        </div>

        {recommendation.hasExplicitDemandMatch && (
          <div className="mb-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>{recommendation.explicitDemandLabel || "Item Priorizado por Demanda Direta"}</span>
          </div>
        )}

        {/* NOME & DESCRIÇÃO TÉCNICA */}
        <div className="flex items-start gap-3 mt-1">
          <span className="text-2xl w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 text-slate-700 shadow-2xs">
            {accessory.icon || "🚗"}
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-sky-600 transition-colors">{accessory.name}</h3>
            <div
              className="inline-flex items-center gap-1 text-[10px] font-mono text-slate-500 bg-slate-100 hover:bg-slate-200 px-1.5 py-0.5 rounded border border-slate-200 mt-1 cursor-help transition-colors"
              title={DEMO_PART_NUMBER_TOOLTIP}
            >
              <span>Part Number: {getAccessoryPartNumber(accessory)}</span>
              <span className="text-[9px] text-amber-700 bg-amber-50 border border-amber-200 px-1 rounded font-sans font-bold">DEMO</span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-2 mt-1">{accessory.description}</p>
          </div>
        </div>
      </div>

      {/* PROBLEMA QUE RESOLVE & BENEFÍCIO ENTREGUE - SÍNTESE DIRETA PARA O CLIENTE */}
      <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
          <div>
            <span className="font-bold text-slate-800">Problema evitado: </span>
            <span className="text-slate-600">{problemSolved}</span>
          </div>
          <div>
            <span className="font-bold text-slate-800">Benefício entregue: </span>
            <span className="text-slate-600">{benefitDelivered}</span>
          </div>
        </div>

        {regionalInfluence && (
          <div className="flex items-center gap-1 text-[11px] text-slate-500 px-1">
            <MapPin className="w-3 h-3 text-sky-600 shrink-0" />
            <span>{regionalInfluence}</span>
          </div>
        )}
      </div>

      {/* AÇÕES DO CONSULTOR */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2">
        <button
          type="button"
          onClick={onToggle}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            isSelected
              ? "bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
              : "bg-white border border-slate-200 hover:bg-slate-50 text-slate-700"
          }`}
        >
          {isSelected ? <Check className="w-3.5 h-3.5 stroke-[2.5] text-sky-400" /> : null}
          <span>{isSelected ? "Incluído na Proposta" : "Desmarcado"}</span>
        </button>

        {isSelected && (
          <button
            type="button"
            onClick={onRemoveRequest}
            className="text-xs font-semibold text-rose-600 hover:text-rose-800 hover:underline cursor-pointer"
          >
            Remover item
          </button>
        )}
      </div>
    </div>
  );
};
