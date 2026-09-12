import { useState, useEffect } from "react";
import { ChevronLeft, LogOut, Check, Flame, BarChart3, Monitor, Tablet, Smartphone } from "lucide-react";
import accessoriesBadge from "@/assets/accessories-badge.jpg";
import { getReheatedLeads } from "@/lib/leadsRepository";

export type ViewportDevice = "desktop" | "tablet" | "mobile";

interface NavigationBarProps {
  currentStep: number;
  onBack: () => void;
  onLogout: () => void;
  showBack: boolean;
  onOpenReheatedLeads?: () => void;
  onOpenLostSales?: () => void;
  hideLegacyStepper?: boolean;
  currentDevice?: ViewportDevice;
  onDeviceChange?: (device: ViewportDevice) => void;
}

const steps = [
  { id: 1, label: "Dados & Perfil" },
  { id: 2, label: "Pacote Acessórios" },
  { id: 3, label: "Visualização 3D & Fechamento" },
];

const NavigationBar = ({
  currentStep,
  onBack,
  onLogout,
  showBack,
  onOpenReheatedLeads,
  onOpenLostSales,
  hideLegacyStepper = false,
  currentDevice = "desktop",
  onDeviceChange,
}: NavigationBarProps) => {
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

            <div className="relative h-11 w-28 sm:w-32 rounded-lg overflow-hidden shadow-sm flex items-center justify-center shrink-0 border border-white/20">
              <img
                src={accessoriesBadge}
                alt="Logomarca Oficial Jeep & RAM"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="shrink-0">
              <span className="text-lg lg:text-xl font-bold tracking-tight text-white font-display whitespace-nowrap">
                Smart-Sell
              </span>
            </div>
          </div>

          {/* Simulator Device Switcher (Computador, Tablet, Celular) */}
          {onDeviceChange && (
            <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-700/80 shadow-inner">
              <span className="hidden xl:inline-block text-[10px] font-black uppercase tracking-wider text-slate-400 px-2">
                Simulação:
              </span>
              <button
                type="button"
                id="btn-viewport-desktop"
                onClick={() => onDeviceChange("desktop")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentDevice === "desktop"
                    ? "bg-sky-600 text-white shadow-sm ring-1 ring-sky-400/40"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
                title="Simular visualização em Computador / Desktop"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Computador</span>
              </button>
              <button
                type="button"
                id="btn-viewport-tablet"
                onClick={() => onDeviceChange("tablet")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentDevice === "tablet"
                    ? "bg-sky-600 text-white shadow-sm ring-1 ring-sky-400/40"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
                title="Simular visualização em Tablet (iPad / Galaxy Tab)"
              >
                <Tablet className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tablet</span>
              </button>
              <button
                type="button"
                id="btn-viewport-mobile"
                onClick={() => onDeviceChange("mobile")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentDevice === "mobile"
                    ? "bg-sky-600 text-white shadow-sm ring-1 ring-sky-400/40"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
                title="Simular visualização em Celular / Smartphone"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Celular</span>
              </button>
            </div>
          )}

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

            {/* Botão Painel de Vendas Perdidas (Pareto) */}
            <button
              type="button"
              onClick={onOpenLostSales}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/40 text-rose-200 hover:text-white transition text-xs font-bold shadow-xs cursor-pointer group"
              title="Acessar Painel Gerencial de Vendas Perdidas (Análise de Pareto)"
            >
              <BarChart3 className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Painel de Perdas</span>
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