import React from "react";
import { ShieldCheck, Sparkles, Check, AlertTriangle, Layers, Info, MapPin, Wrench } from "lucide-react";
import { AccessoryRecommendation, RecommendationTier } from "@/types/salesJourney";

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
      className={`rounded-2xl border transition-all p-5 flex flex-col justify-between space-y-4 ${
        isOutOfStock
          ? "opacity-60 bg-slate-100/90 border-dashed border-amber-300 ring-1 ring-amber-200/50 grayscale-[15%]"
          : isSelected
          ? "bg-white border-slate-300 shadow-md ring-1 ring-black/5"
          : "bg-slate-50/70 border-slate-200 opacity-60 hover:opacity-100"
      }`}
    >
      {/* HEADER DO CARD: CLASSIFICAÇÃO & ADERÊNCIA */}
      <div>
        {isOutOfStock && (
          <div className="mb-2.5 flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-amber-100/90 border border-amber-300 text-amber-900 text-xs font-bold">
            <span className="flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Sem Estoque Local Imediato</span>
            </span>
            <span className="text-[10px] font-semibold text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded">
              Encomenda CD (2 a 5 dias)
            </span>
          </div>
        )}

        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-wide border ${tierBadgeConfig.color}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${tierBadgeConfig.dot}`} />
              {tierBadgeConfig.label}
            </span>
            <span className="text-[10px] font-bold text-slate-600 uppercase bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {(accessory.category || 'acessório').toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
            <span>Aderência ao perfil:</span>
            <span className="text-sky-700 font-black">{matchScore}%</span>
          </div>
        </div>

        {recommendation.hasExplicitDemandMatch && (
          <div className="mb-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-300 text-amber-900 text-[11px] font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>{recommendation.explicitDemandLabel || "Item Priorizado por Demanda Direta"}</span>
          </div>
        )}

        {/* NOME & DESCRIÇÃO TÉCNICA */}
        <div className="flex items-start gap-3">
          <span className="text-3xl p-2 rounded-xl bg-slate-100 border border-slate-200 shrink-0">
            {accessory.icon || "🚗"}
          </span>
          <div>
            <h3 className="text-base font-bold text-slate-900 leading-snug">{accessory.name}</h3>
            <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{accessory.description}</p>
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
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            isSelected
              ? "bg-sky-600 hover:bg-sky-700 text-white shadow-2xs"
              : "bg-slate-200 hover:bg-slate-300 text-slate-700"
          }`}
        >
          {isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : null}
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
