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
    <header className="sticky top-0 z-50 bg-white/95 text-slate-900 border-b border-slate-200/80 shadow-xs backdrop-blur-md">
      <div className="max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Identity & Enterprise Badge */}
          <div className="flex items-center gap-3 shrink-0">
            {showBack && (
              <button
                type="button"
                onClick={onBack}
                className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition text-xs font-semibold border border-slate-200/80 cursor-pointer"
                aria-label="Voltar para a tela anterior"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Voltar</span>
              </button>
            )}

            <div className="relative h-10 w-auto aspect-[2055/1279] flex items-center justify-center shrink-0">
              <img
                src={accessoriesBadge}
                alt="Logomarca Oficial Jeep & RAM"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="shrink-0 flex items-center gap-2">
              <span className="text-lg lg:text-xl font-bold tracking-tight text-slate-900 font-display whitespace-nowrap">
                Smart-Sell
              </span>
            </div>
          </div>

          {/* Simulator Device Switcher (Computador, Tablet, Celular) */}
          {onDeviceChange && (
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
              <span className="hidden xl:inline-block text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">
                Simulação:
              </span>
              <button
                type="button"
                id="btn-viewport-desktop"
                onClick={() => onDeviceChange("desktop")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentDevice === "desktop"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white"
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
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white"
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
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white"
                }`}
                title="Simular visualização em Celular / Smartphone"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Celular</span>
              </button>
            </div>
          )}

          {/* Right Side: Leads Reaquecimento, Concessionária Hub & Logout */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Botão Base de Leads para Reaquecimento */}
            <button
              type="button"
              onClick={onOpenReheatedLeads}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-700 transition text-xs font-bold shadow-xs cursor-pointer group"
              title="Acessar base de leads a serem reaquecidos (CRM Retargeting)"
            >
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500/20 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Leads para Reaquecer</span>
              <span className="bg-orange-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-xs">
                {leadsCount}
              </span>
            </button>

            {/* Botão Painel de Vendas Perdidas (Pareto) */}
            <button
              type="button"
              onClick={onOpenLostSales}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 transition text-xs font-bold shadow-xs cursor-pointer group"
              title="Acessar Painel Gerencial de Vendas Perdidas (Análise de Pareto)"
            >
              <BarChart3 className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Painel de Perdas</span>
            </button>

            <div className="hidden lg:flex flex-col text-right">
              <span className="text-xs font-semibold text-slate-800 whitespace-nowrap">Concessionária Jeep Campinas</span>
              <span className="text-[11px] text-emerald-600 flex items-center justify-end gap-1.5 whitespace-nowrap font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Consultor Sênior Online
              </span>
            </div>
            <div className="h-6 w-[1px] bg-slate-200 hidden lg:block" />
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition border border-slate-200/80 cursor-pointer shrink-0"
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