import React, { useState } from "react";
import { Check, ChevronRight, History, Layers } from "lucide-react";
import { SalesJourneyStep } from "@/types/salesJourney";
import { JOURNEY_STEPS_ORDER, JOURNEY_STEPS_META, useSalesJourney } from "@/context/SalesJourneyContext";

interface SalesJourneyStepperProps {
  onStepClick?: (step: SalesJourneyStep) => void;
}

export const SalesJourneyStepper: React.FC<SalesJourneyStepperProps> = ({ onStepClick }) => {
  const { state, goToStep, currentStepIndex } = useSalesJourney();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentMeta = JOURNEY_STEPS_META[state.currentStep];
  const progressPercent = Math.round(((currentStepIndex + 1) / JOURNEY_STEPS_ORDER.length) * 100);

  const handleStepSelect = (step: SalesJourneyStep, stepIdx: number) => {
    // Permitir voltar para etapas anteriores livremente
    // ou avançar se o consultor já tiver passado por ela
    if (stepIdx <= currentStepIndex || onStepClick) {
      goToStep(step);
      setMobileMenuOpen(false);
      if (onStepClick) onStepClick(step);
    }
  };

  return (
    <div className="w-full bg-slate-900/90 border-b border-slate-800 text-white backdrop-blur-md sticky top-16 z-40">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        {/* DESKTOP & TABLET: Stepper horizontal completo */}
        <div className="hidden lg:flex items-center justify-between gap-2 overflow-x-auto py-1 scrollbar-none">
          {JOURNEY_STEPS_ORDER.map((step, idx) => {
            const meta = JOURNEY_STEPS_META[step];
            const isActive = step === state.currentStep;
            const isCompleted = idx < currentStepIndex;
            const isClickable = idx <= currentStepIndex;

            return (
              <React.Fragment key={step}>
                <button
                  type="button"
                  onClick={() => handleStepSelect(step, idx)}
                  disabled={!isClickable}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap text-left ${
                    isActive
                      ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-md ring-1 ring-sky-400/40 font-bold"
                      : isCompleted
                      ? "bg-slate-800/80 text-sky-200 hover:bg-slate-800 hover:text-white cursor-pointer"
                      : "text-slate-400 opacity-60 cursor-not-allowed"
                  }`}
                  title={`${meta.number}. ${meta.title} — ${meta.subtitle}`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 ${
                      isActive
                        ? "bg-white text-sky-700 shadow-xs"
                        : isCompleted
                        ? "bg-sky-500/20 text-sky-300 border border-sky-400/30"
                        : "bg-slate-800 text-slate-400 border border-slate-700"
                    }`}
                  >
                    {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : meta.number}
                  </span>

                  <div className="flex flex-col">
                    <span className="leading-tight">{meta.title}</span>
                  </div>
                </button>

                {idx < JOURNEY_STEPS_ORDER.length - 1 && (
                  <div
                    className={`h-[2px] w-4 shrink-0 transition-colors ${
                      idx < currentStepIndex ? "bg-sky-500/60" : "bg-slate-700"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* MOBILE & COMPACT TABLET: Visão compacta com número, nome, % e menu para consultar etapas anteriores */}
        <div className="flex lg:hidden items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-white font-black text-xs flex items-center justify-center shadow-xs shrink-0">
              {currentMeta.number}
            </span>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-white truncate">{currentMeta.title}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 shrink-0">
                  {progressPercent}%
                </span>
              </div>
              <span className="text-[11px] text-slate-400 truncate">{currentMeta.subtitle}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-semibold text-sky-300 border border-slate-700 hover:bg-slate-700 cursor-pointer shrink-0"
            aria-label="Ver todas as etapas da jornada"
          >
            <History className="w-3.5 h-3.5" />
            <span>Etapas</span>
          </button>
        </div>

        {/* MOBILE DROPDOWN / ACCORDION MENU */}
        {mobileMenuOpen && (
          <div className="mt-3 pt-3 border-t border-slate-800 lg:hidden flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Navegação entre etapas da jornada</span>
            </div>

            {JOURNEY_STEPS_ORDER.map((step, idx) => {
              const meta = JOURNEY_STEPS_META[step];
              const isActive = step === state.currentStep;
              const isCompleted = idx < currentStepIndex;
              const isClickable = idx <= currentStepIndex;

              return (
                <button
                  key={step}
                  type="button"
                  disabled={!isClickable}
                  onClick={() => handleStepSelect(step, idx)}
                  className={`flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                    isActive
                      ? "bg-sky-600 text-white font-bold"
                      : isCompleted
                      ? "bg-slate-800/80 text-slate-200 hover:bg-slate-700"
                      : "bg-slate-900/40 text-slate-400 opacity-50 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                        isActive
                          ? "bg-white text-sky-700"
                          : isCompleted
                          ? "bg-sky-500/30 text-sky-200"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {isCompleted ? <Check className="w-3.5 h-3.5" /> : meta.number}
                    </span>
                    <div>
                      <div className="text-xs font-bold">{meta.title}</div>
                      <div className="text-[10px] text-slate-300 opacity-80">{meta.subtitle}</div>
                    </div>
                  </div>
                  {isClickable && <ChevronRight className="w-4 h-4 opacity-70" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
