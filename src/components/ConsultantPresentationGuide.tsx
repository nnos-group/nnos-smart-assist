import React from "react";
import { Sparkles, MessageSquare, CheckCircle, ChevronRight, UserCheck } from "lucide-react";
import { Accessory } from "@/types/accessories";
import { DiscoveryProfile } from "@/types/salesJourney";

interface ConsultantPresentationGuideProps {
  orderedAccessories: Accessory[];
  discovery: DiscoveryProfile;
  clientName: string;
  vehicleModel: string;
}

export const ConsultantPresentationGuide: React.FC<ConsultantPresentationGuideProps> = ({
  orderedAccessories,
  discovery,
  clientName,
  vehicleModel,
}) => {
  // Gerar o roteiro dinamicamente sugerindo a melhor ordem
  const getScriptAdvice = () => {
    if (orderedAccessories.length === 0) return "Selecione acessórios para gerar o roteiro.";

    const firstItem = orderedAccessories[0];
    const secondItem = orderedAccessories.length > 1 ? orderedAccessories[1] : null;

    let text = `Comece pelo ${firstItem.name}, relacionando-o diretamente a ${
      discovery.dirtRoadFrequency !== "nunca"
        ? "sua utilização em estradas de terra"
        : discovery.cargoUsage !== "nao"
        ? "sua necessidade de transporte de carga"
        : "proteção de fábrica do veículo 0km"
    }.`;

    if (secondItem) {
      text += ` Em seguida, apresente o ${secondItem.name}, destacando ${
        discovery.frequentPassengers.includes("criancas") || discovery.frequentPassengers.includes("idosos")
          ? "a facilidade de embarque e segurança para a família"
          : "o conforto e a praticidade na rotina diária"
      }.`;
    }

    return text;
  };

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-md space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase tracking-wider">
          <MessageSquare className="w-4 h-4 text-sky-400" />
          <span>Roteiro de Apresentação Sugerido para o Consultor</span>
        </div>
        <span className="text-[11px] font-semibold text-slate-400">Guia de Conversação Mopar</span>
      </div>

      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
        {getScriptAdvice()}
      </p>

      <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
        <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>
          Mantenha a conversa focada na rotina de {clientName || "cliente"}. Não mencione valores até consolidar o valor percebido de cada item.
        </span>
      </div>
    </div>
  );
};
