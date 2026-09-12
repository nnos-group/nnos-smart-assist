import React from "react";
import {
  Sparkles, ArrowRight, ArrowLeft, CheckCircle, HelpCircle,
  Award, ShieldCheck, DollarSign
} from "lucide-react";
import { useSalesJourney } from "@/context/SalesJourneyContext";
import { AccessoryExplanationCard } from "./AccessoryExplanationCard";
import { ConsultantPresentationGuide } from "./ConsultantPresentationGuide";

export const AccessoryExplanationScreen: React.FC = () => {
  const {
    state,
    availableAccessories,
    updateExplanationStatus,
    revealPrice,
    nextStep,
    prevStep,
  } = useSalesJourney();

  const { clientData, discoveryProfile, selectedAccessoryIds, explanationStatus } = state;

  // Filtrar e ordenar os acessórios selecionados
  const selectedAccessories = availableAccessories.filter((a) => selectedAccessoryIds.includes(a.id));

  // Ordenação preferencial: primeiro protetor/essenciais, depois estribo/recomendados, depois acabamento
  const orderedAccessories = [...selectedAccessories].sort((a, b) => {
    const priorityOrder = ["protetor", "capota", "estribo", "pneus", "bagageiro", "rack", "santantonio", "engate", "sensor", "friso"];
    const idxA = priorityOrder.indexOf(a.id);
    const idxB = priorityOrder.indexOf(b.id);
    return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
  });

  const explainedCount = explanationStatus.filter(
    (e) => e.status === "explained" || e.status === "high-interest"
  ).length;

  const handleProceedToPrice = () => {
    revealPrice();
    nextStep();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* HEADER DE ETAPA */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold mb-2 border border-sky-200/60">
            <Award className="w-3.5 h-3.5 text-sky-600" />
            <span>Etapa 4 de 7 · Demonstração de Valor</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display">
            Entender os benefícios
          </h1>
          <p className="text-sm text-slate-600 font-medium mt-1">
            Explique como cada acessório atende às necessidades identificadas.
          </p>
        </div>

        <div className="text-right pl-2 border-l border-slate-200 hidden sm:block">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Itens Explicados</div>
          <div className="text-base font-black text-emerald-600">
            {explainedCount} de {selectedAccessories.length}
          </div>
        </div>
      </div>

      {/* PAINEL DISCRETO: ROTEIRO SUGERIDO PARA O CONSULTOR */}
      <ConsultantPresentationGuide
        orderedAccessories={orderedAccessories}
        discovery={discoveryProfile}
        clientName={clientData.clientName}
        vehicleModel={clientData.vehicleModel}
      />

      {/* LISTA DE CARDS DE EXPLICAÇÃO DOS ACESSÓRIOS */}
      <div className="space-y-4">
        {orderedAccessories.map((acc, index) => {
          const status = explanationStatus.find((e) => e.accessoryId === acc.id);
          return (
            <AccessoryExplanationCard
              key={acc.id}
              accessory={acc}
              explanationStatus={status}
              onStatusChange={(newStatus, notes) => updateExplanationStatus(acc.id, newStatus, notes)}
              orderNumber={index + 1}
            />
          );
        })}

        {orderedAccessories.length === 0 && (
          <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-300 text-slate-500 text-sm">
            Nenhum acessório selecionado para explicar. Volte à etapa de recomendação ou visualização.
          </div>
        )}
      </div>

      {/* PERGUNTA DE FECHAMENTO DE ETAPA: O CLIENTE COMPREENDEU OS BENEFÍCIOS? */}
      <div className="cockpit-panel rounded-2xl p-6 border border-sky-100 bg-gradient-to-b from-sky-50/40 via-white to-white text-slate-900 shadow-card flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-700">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Validação de Percepção de Valor</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">O cliente compreendeu os principais benefícios?</h2>
          <p className="text-xs text-slate-500 max-w-xl">
            Somente após o cliente perceber o valor prático e de proteção é o momento de revelar o investimento.
          </p>
        </div>

        <button
          type="button"
          onClick={handleProceedToPrice}
          className="flex items-center gap-2.5 px-6 py-2.5 rounded-xl bg-[#0077E6] hover:bg-[#0066CC] text-white font-bold text-xs tracking-tight shadow-glow-blue transition-all transform active:scale-95 cursor-pointer shrink-0"
        >
          <DollarSign className="w-4 h-4" />
          <span>Apresentar Investimento</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* BOTÃO VOLTAR */}
      <div className="flex items-center justify-start pt-2">
        <button
          type="button"
          onClick={prevStep}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Visualização no Veículo</span>
        </button>
      </div>
    </div>
  );
};
