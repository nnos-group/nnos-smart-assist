import React from "react";
import { Sparkles, X, PlusCircle, Check } from "lucide-react";
import { DiscoveryProfile } from "@/types/salesJourney";

interface AIQuestionSuggestionProps {
  discovery: DiscoveryProfile;
  onAcceptSuggestion: (key: string, value: string) => void;
  onDismiss: (key: string) => void;
  dismissedKeys: string[];
}

export const AIQuestionSuggestion: React.FC<AIQuestionSuggestionProps> = ({
  discovery,
  onAcceptSuggestion,
  onDismiss,
  dismissedKeys,
}) => {
  const suggestions: { id: string; condition: boolean; question: string; suggestedAnswers: string[] }[] = [
    {
      id: "criancas_embarque",
      condition: discovery.frequentPassengers.includes("criancas"),
      question: "Como você transportará crianças, qual a faixa de idade e necessidade de facilitar o embarque diário?",
      suggestedAnswers: [
        "Crianças pequenas (exige estribo e fixação segura)",
        "Idade escolar (foco em proteção contra marcas de calçados nas soleiras)",
        "Bebês (foco em ergonomia para colocação de cadeirinha)",
      ],
    },
    {
      id: "rural_severidade",
      condition: discovery.usageLocation === "zona_rural" || discovery.dirtRoadFrequency === "diariamente",
      question: "No trajeto rural diário, há presença constante de pedras soltas, atoleiros de lama ou necessidade de iluminação noturna?",
      suggestedAnswers: [
        "Alta incidência de pedras soltas e valetas (blindagem inferior prioritária)",
        "Atoleiros e lama pesada (tração e pneus A/T)",
        "Trechos noturnos sem postes (iluminação auxiliar potente)",
      ],
    },
    {
      id: "carga_ferramentas",
      condition: discovery.cargoUsage === "ferramentas" || discovery.cargoUsage === "materiais_profissionais",
      question: "As ferramentas e mostruários ficarão na caçamba durante paradas na rua ou em clientes?",
      suggestedAnswers: [
        "Sim, exigem vedação total contra chuva e tranca com chave antifurto",
        "Apenas transporte pontual com necessidade de amarração firme",
        "Necessidade de caixa de ferramentas embutida modular",
      ],
    },
    {
      id: "viagens_bagagem",
      condition: discovery.tripFrequency === "semanalmente" || discovery.tripFrequency === "quinzenalmente",
      question: "Nas viagens frequentes com a família, o volume de malas costuma lotar o porta-malas?",
      suggestedAnswers: [
        "Sim, frequentemente falta espaço (bagageiro de teto indicado)",
        "Transportamos bicicletas ou pranchas (racks e suportes específicos)",
      ],
    },
  ];

  const activeSuggestions = suggestions.filter(
    (s) => s.condition && !dismissedKeys.includes(s.id) && !discovery.aiSuggestedAnswers?.[s.id]
  );

  if (activeSuggestions.length === 0) return null;

  return (
    <div className="bg-white border-2 border-sky-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3.5 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-sky-600" />
          </div>
          <span className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide font-display">
            Perguntas Sugeridas pela Inteligência da Plataforma
          </span>
        </div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-sky-800 border border-sky-200 self-start sm:self-auto">
          Opcional · Apoio ao Consultor
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        {activeSuggestions.map((item) => (
          <div
            key={item.id}
            className="bg-slate-50 border border-slate-200/90 rounded-xl p-4 flex flex-col justify-between space-y-3 transition-all hover:border-sky-300 hover:bg-sky-50/30 shadow-xs"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs sm:text-[13px] font-bold text-slate-900 leading-snug">{item.question}</p>
              <button
                type="button"
                onClick={() => onDismiss(item.id)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-200/60 cursor-pointer transition-colors shrink-0"
                title="Ignorar esta pergunta"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-1.5 pt-1">
              {item.suggestedAnswers.map((ans) => (
                <button
                  key={ans}
                  type="button"
                  onClick={() => onAcceptSuggestion(item.id, ans)}
                  className="text-left text-xs font-semibold px-3 py-2 rounded-lg bg-white hover:bg-sky-600 hover:text-white text-slate-800 border border-slate-200 hover:border-sky-600 transition-all flex items-center justify-between cursor-pointer group shadow-2xs"
                >
                  <span className="leading-snug pr-2">{ans}</span>
                  <PlusCircle className="w-4 h-4 text-sky-600 group-hover:text-white shrink-0 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
