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
    <div className="bg-gradient-to-br from-indigo-900/30 via-slate-900/40 to-sky-900/30 border border-sky-500/30 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sky-300 font-bold text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-sky-400 animate-pulse" />
          <span>Perguntas Sugeridas pela Inteligência da Plataforma</span>
        </div>
        <span className="text-[11px] text-slate-400 font-medium">Opcional · Apoio ao Consultor</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        {activeSuggestions.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-3.5 flex flex-col justify-between space-y-2.5 transition-all hover:border-sky-500/50"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-semibold text-slate-200 leading-relaxed">{item.question}</p>
              <button
                type="button"
                onClick={() => onDismiss(item.id)}
                className="text-slate-400 hover:text-slate-200 p-1 rounded-md hover:bg-white/5 cursor-pointer"
                title="Ignorar esta pergunta"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex flex-col gap-1.5 pt-1">
              {item.suggestedAnswers.map((ans) => (
                <button
                  key={ans}
                  type="button"
                  onClick={() => onAcceptSuggestion(item.id, ans)}
                  className="text-left text-[11px] font-medium px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-sky-600/30 hover:text-sky-200 text-slate-300 border border-slate-700/50 transition-colors flex items-center justify-between cursor-pointer group"
                >
                  <span className="leading-tight">{ans}</span>
                  <PlusCircle className="w-3.5 h-3.5 text-sky-400 opacity-0 group-hover:opacity-100 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
