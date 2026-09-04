import { useState, useEffect } from "react";
import { ChevronLeft, LogOut, Check, Flame } from "lucide-react";
import accessoriesBadge from "@/assets/accessories-badge.jpg";
import { getReheatedLeads } from "@/lib/leadsRepository";

interface NavigationBarProps {
  currentStep: number;
  onBack: () => void;
  onLogout: () => void;
  showBack: boolean;
  onOpenReheatedLeads?: () => void;
}

const steps = [
  { id: 1, label: "Dados & Perfil" },
  { id: 2, label: "Pacote Acessórios" },
  { id: 3, label: "Visualização 3D" },
  { id: 4, label: "Script & Fechamento" },
];

const NavigationBar = ({ currentStep, onBack, onLogout, showBack, onOpenReheatedLeads }: NavigationBarProps) => {
  const [leadsCount, setLeadsCount] = useState<number>(0);

  useEffect(() => {
    const updateCount = () => {
      setLeadsCount(getReheatedLeads().length);
    };
    updateCount();
    window.addEventListener("smart_sell_leads_updated", updateCount);
    return () => window.removeEventListener("smart_sell_leads_updated", updateCount);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[#001E36] text-white border-b border-sky-950/60 shadow-md">
      <div className="max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Identity & Enterprise Badge */}
          <div className="flex items-center gap-3 shrink-0">
            {showBack && (
              <button
                type="button"
                onClick={onBack}
                className="flex items-center gap-1.5 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition text-xs font-medium border border-slate-700/60 cursor-pointer"
                aria-label="Voltar para a tela anterior"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Voltar</span>
              </button>
            )}

            <div className="relative w-9 h-9 rounded-full bg-slate-950 border border-slate-700/80 shadow-md ring-1 ring-white/20 overflow-hidden flex items-center justify-center shrink-0">
              <img
                src={accessoriesBadge}
                alt="Emblema de Acessórios Jeep & RAM"
                className="w-full h-full object-cover scale-[1.04]"
              />
            </div>
            <div className="shrink-0">
              <span className="text-lg lg:text-xl font-bold tracking-tight text-white font-display whitespace-nowrap">
                Smart-Sell
              </span>
            </div>
          </div>

          {/* Stepper Navigation Bar */}
          <nav aria-label="Progresso da Proposta" className="hidden md:flex items-center gap-2 bg-slate-900/60 px-3 py-1.5 rounded-full border border-slate-700/60 shrink-0">
            {steps.map((step, index) => {
              const isActive = step.id === currentStep;
              const isPast = step.id < currentStep;

              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                      isActive
                        ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-sm ring-1 ring-sky-400/40 font-semibold"
                        : isPast
                        ? "text-slate-200 hover:text-white"
                        : "text-slate-400 opacity-75 hover:opacity-100"
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                        isActive
                          ? "bg-white text-sky-700"
                          : isPast
                          ? "bg-sky-500/30 text-sky-200 border border-sky-400/40"
                          : "bg-slate-800 text-slate-400 border border-slate-700"
                      }`}
                    >
                      {isPast ? <Check className="w-3 h-3 stroke-[3]" /> : step.id}
                    </span>
                    <span>{step.label}</span>
                  </div>

                  {index < steps.length - 1 && (
                    <div className={`w-4 h-[1px] mx-1 ${isPast ? "bg-sky-500/50" : "bg-slate-700"}`} />
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right Side: Leads Reaquecimento, Concessionária Hub & Logout */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Botão Base de Leads para Reaquecimento */}
            <button
              type="button"
              onClick={onOpenReheatedLeads}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 border border-orange-400/40 text-orange-200 hover:text-white transition text-xs font-bold shadow-xs cursor-pointer group"
              title="Acessar base de leads a serem reaquecidos (CRM Retargeting)"
            >
              <Flame className="w-4 h-4 text-orange-400 fill-orange-400/30 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Leads para Reaquecer</span>
              <span className="bg-orange-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-xs">
                {leadsCount}
              </span>
            </button>

            <div className="hidden lg:flex flex-col text-right">
              <span className="text-xs font-semibold text-slate-200 whitespace-nowrap">Concessionária Jeep Campinas</span>
              <span className="text-[11px] text-emerald-400 flex items-center justify-end gap-1.5 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Consultor Sênior Online
              </span>
            </div>
            <div className="h-6 w-[1px] bg-slate-700 hidden lg:block" />
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition border border-transparent hover:border-slate-700 cursor-pointer shrink-0"
            >
              <span>Sair</span>
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavigationBar;