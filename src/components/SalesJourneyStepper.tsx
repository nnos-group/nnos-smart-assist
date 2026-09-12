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
    <div className="w-full bg-white/95 border-b border-slate-200/80 text-slate-900 backdrop-blur-md sticky top-16 z-40 shadow-xs">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        {/* DESKTOP & TABLET: Stepper horizontal completo no estilo Cockpit Clean Day Mode */}
        <nav aria-label="Timeline Processo Cockpit" className="hidden lg:block py-1 overflow-x-auto scrollbar-none">
          <ol className="flex items-center justify-between min-w-[960px] text-xs">
            {JOURNEY_STEPS_ORDER.map((step, idx) => {
              const meta = JOURNEY_STEPS_META[step];
              const isActive = step === state.currentStep;
              const isCompleted = idx < currentStepIndex;
              const isClickable = idx <= currentStepIndex;

              return (
                <li key={step} className="flex-1 relative flex items-center">
                  <button
                    type="button"
                    onClick={() => handleStepSelect(step, idx)}
                    disabled={!isClickable}
                    className={`group flex items-center gap-2.5 text-left focus:outline-none transition-all ${
                      isClickable ? "cursor-pointer" : "cursor-not-allowed opacity-60"
                    }`}
                    title={`${meta.number}. ${meta.title} — ${meta.subtitle}`}
                  >
                    <div
                      className={`relative flex items-center justify-center shrink-0 transition-all ${
                        isActive
                          ? "w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs shadow-sm ring-4 ring-slate-100"
                          : isCompleted
                          ? "w-7 h-7 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-700 font-semibold text-xs"
                          : "w-7 h-7 rounded-full bg-slate-100 border border-slate-200 text-slate-400 font-semibold text-xs"
                      }`}
                    >
                      {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : meta.number}
                    </div>

                    <div className="min-w-0">
                      <span
                        className={`text-[10px] block leading-tight ${
                          isActive
                            ? "text-sky-600 font-bold uppercase tracking-wider"
                            : "text-slate-400 font-normal"
                        }`}
                      >
                        {isActive ? "ETAPA ATUAL" : meta.subtitle}
                      </span>
                      <span
                        className={`text-xs tracking-tight block truncate ${
                          isActive
                            ? "font-bold text-slate-900"
                            : isCompleted
                            ? "font-semibold text-slate-700 group-hover:text-slate-900"
                            : "font-medium text-slate-500"
                        }`}
                      >
                        {meta.title}
                      </span>
                    </div>
                  </button>

                  {idx < JOURNEY_STEPS_ORDER.length - 1 && (
                    <div
                      className={`h-[1px] flex-1 mx-3 transition-colors ${
                        isActive
                          ? "bg-gradient-to-r from-slate-900 to-slate-200"
                          : idx < currentStepIndex
                          ? "bg-emerald-300/80"
                          : "bg-slate-200"
                      }`}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {/* MOBILE & COMPACT TABLET: Visão compacta com número, nome, % e menu para consultar etapas anteriores */}
        <div className="flex lg:hidden items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-7 h-7 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center shadow-xs ring-2 ring-slate-100 shrink-0">
              {currentMeta.number}
            </span>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 truncate">{currentMeta.title}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 shrink-0">
                  {progressPercent}%
                </span>
              </div>
              <span className="text-[11px] text-slate-500 truncate">{currentMeta.subtitle}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-200 cursor-pointer shrink-0"
            aria-label="Ver todas as etapas da jornada"
          >
            <History className="w-3.5 h-3.5 text-slate-500" />
            <span>Etapas</span>
          </button>
        </div>

        {/* MOBILE DROPDOWN / ACCORDION MENU */}
        {mobileMenuOpen && (
          <div className="mt-3 pt-3 border-t border-slate-200 lg:hidden flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2">
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
                      ? "bg-slate-900 text-white font-bold shadow-sm"
                      : isCompleted
                      ? "bg-slate-50 text-slate-800 hover:bg-slate-100 border border-slate-200/80"
                      : "bg-slate-50/50 text-slate-400 opacity-50 cursor-not-allowed border border-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                        isActive
                          ? "bg-white text-slate-900"
                          : isCompleted
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {isCompleted ? <Check className="w-3.5 h-3.5" /> : meta.number}
                    </span>
                    <div>
                      <div className="text-xs font-bold">{meta.title}</div>
                      <div className="text-[10px] text-slate-500">{meta.subtitle}</div>
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
