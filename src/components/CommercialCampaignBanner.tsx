import React from "react";
import { Tag, Check, Clock } from "lucide-react";
import { CommercialCampaign } from "@/types/salesJourney";

interface CommercialCampaignBannerProps {
  eligibleCampaigns: CommercialCampaign[];
  selectedCampaign?: CommercialCampaign;
  onSelectCampaign: (campaign: CommercialCampaign | undefined) => void;
}

export const CommercialCampaignBanner: React.FC<CommercialCampaignBannerProps> = ({
  eligibleCampaigns,
  selectedCampaign,
  onSelectCampaign,
}) => {
  if (eligibleCampaigns.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border-2 border-purple-300 shadow-sm p-5 sm:p-6 space-y-4 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-purple-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-700 text-white flex items-center justify-center shadow-xs shrink-0">
            <Tag className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-purple-950 uppercase tracking-tight">
              Gatilhos Comerciais Homologados &amp; Campanhas Vigentes
            </h3>
            <p className="text-xs text-slate-600 mt-0.5 font-medium">
              Condições oficiais da fábrica e montadora ativas para este veículo e acessórios selecionados
            </p>
          </div>
        </div>
        <span className="text-[11px] font-extrabold text-purple-900 bg-purple-100 border border-purple-300 px-3 py-1 rounded-full self-start sm:self-auto">
          ● {eligibleCampaigns.length} Campanha(s) Elegível(is)
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {eligibleCampaigns.map((camp) => {
          const isSelected = selectedCampaign?.id === camp.id;
          const endDateFormatted = new Date(camp.endDate).toLocaleDateString("pt-BR");

          return (
            <div
              key={camp.id}
              className={`p-4 rounded-xl border-2 transition-all flex flex-col justify-between space-y-3 ${
                isSelected
                  ? "bg-purple-50/90 border-purple-600 text-slate-900 shadow-md ring-2 ring-purple-500/20"
                  : "bg-slate-50/80 border-slate-200 text-slate-800 hover:border-purple-300 hover:bg-white shadow-2xs"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug">{camp.name}</h4>
                  {isSelected ? (
                    <span className="flex items-center gap-1 text-[10px] font-black bg-purple-700 text-white px-2.5 py-0.5 rounded-full shrink-0 shadow-2xs">
                      <Check className="w-3 h-3 stroke-[3]" /> ATIVA
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-md shrink-0">
                      Disponível
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
                  {camp.customerMessage}
                </p>
              </div>

              <div className="pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-purple-700" />
                  <span>Válida até {endDateFormatted}</span>
                </div>
                {camp.remainingQuantity && (
                  <span className="font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded">
                    Lote limitado: {camp.remainingQuantity} un.
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => onSelectCampaign(isSelected ? undefined : camp)}
                className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                  isSelected
                    ? "bg-purple-700 hover:bg-purple-800 text-white shadow-sm"
                    : "bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-300 font-extrabold"
                }`}
              >
                {isSelected ? "✓ Campanha Aplicada no Investimento" : "+ Aplicar Esta Campanha ao Investimento"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
