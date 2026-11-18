import { useState, useEffect, useRef } from "react";
import { ChevronLeft, LogOut, Check, Flame, BarChart3, Monitor, Tablet, Smartphone, ShieldCheck, Users, History, ChevronDown } from "lucide-react";
import accessoriesBadge from "@/assets/accessories-badge.jpg";
import { getReheatedLeads } from "@/lib/leadsRepository";
import { UserSession } from "@/types/salesJourney";

export type ViewportDevice = "desktop" | "tablet" | "mobile";

interface NavigationBarProps {
  currentStep: number;
  onBack: () => void;
  onLogout: () => void;
  showBack: boolean;
  onOpenReheatedLeads?: () => void;
  onOpenLostSales?: () => void;
  onOpenUserControl?: (tab?: "users" | "logs") => void;
  userSession?: UserSession;
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
  onOpenUserControl,
  userSession,
  hideLegacyStepper = false,
  currentDevice = "desktop",
  onDeviceChange,
}: NavigationBarProps) => {
  const [leadsCount, setLeadsCount] = useState<number>(0);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const adminMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateCount = () => {
      setLeadsCount(getReheatedLeads().length);
    };
    updateCount();
    window.addEventListener("smart_sell_leads_updated", updateCount);
    return () => window.removeEventListener("smart_sell_leads_updated", updateCount);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (adminMenuRef.current && !adminMenuRef.current.contains(event.target as Node)) {
        setIsAdminMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isAdmin = userSession?.role === "administrador";
  const roleDisplay =
    userSession?.role === "administrador"
      ? "Administrador Online"
      : userSession?.role === "gerente"
      ? "Gerente Geral Online"
      : "Consultor Sênior Online";

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

          {onDeviceChange && (
            <div
              className="flex items-center gap-0.5 p-1 rounded-xl border border-slate-200/80"
              style={{
                background: "linear-gradient(135deg, #f1f5f9 0%, #f8fafc 100%)",
                boxShadow: "inset 0 1px 2px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06)",
              }}
            >
              <span className="hidden xl:inline-block text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 select-none">
                Preview:
              </span>
              <button
                type="button"
                id="btn-viewport-desktop"
                onClick={() => onDeviceChange("desktop")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  currentDevice === "desktop"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800 hover:bg-white/70"
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
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  currentDevice === "tablet"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800 hover:bg-white/70"
                }`}
                title="Simular visualização em Tablet (iPad 768px)"
              >
                <Tablet className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tablet</span>
                <span className="hidden xl:inline text-[9px] font-semibold opacity-60">768px</span>
              </button>
              <button
                type="button"
                id="btn-viewport-mobile"
                onClick={() => onDeviceChange("mobile")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  currentDevice === "mobile"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800 hover:bg-white/70"
                }`}
                title="Simular visualização em Celular (iPhone 14 390px)"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Celular</span>
                <span className="hidden xl:inline text-[9px] font-semibold opacity-60">390px</span>
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

            {/* Botão Dashboard Comercial & Painel de Perdas */}
            <button
              type="button"
              id="btn-open-commercial-dashboard"
              onClick={onOpenLostSales}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 transition text-xs font-bold shadow-xs cursor-pointer group"
              title="Acessar Dashboard Comercial & Análise de Perdas (DEMO)"
            >
              <BarChart3 className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Dashboard Comercial</span>
              <span className="text-[9px] font-black uppercase tracking-wider bg-blue-200/80 text-blue-900 px-1 py-0.2 rounded">
                DEMO
              </span>
            </button>

            {/* Menu Admin: Controle de Usuários & Log de Acesso */}
            {isAdmin && onOpenUserControl && (
              <div className="relative" ref={adminMenuRef}>
                <button
                  type="button"
                  id="btn-open-admin-menu"
                  onClick={() => setIsAdminMenuOpen((prev) => !prev)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-800 transition text-xs font-bold shadow-xs cursor-pointer"
                  title="Menu Administrativo: Controle de Usuários e Log de Acesso"
                  aria-expanded={isAdminMenuOpen}
                >
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span className="hidden sm:inline">Admin</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isAdminMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {isAdminMenuOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
                    <div className="px-3 py-1.5 border-b border-slate-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Painel Administrativo
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAdminMenuOpen(false);
                        onOpenUserControl("users");
                      }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-800 transition cursor-pointer"
                    >
                      <Users className="w-4 h-4 text-indigo-600" />
                      <span>Controle de Usuários</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAdminMenuOpen(false);
                        onOpenUserControl("logs");
                      }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-800 transition cursor-pointer"
                    >
                      <History className="w-4 h-4 text-indigo-600" />
                      <span>Log de Acesso</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="hidden lg:flex flex-col text-right">
              <span className="text-xs font-semibold text-slate-800 whitespace-nowrap max-w-[230px] truncate" title={userSession?.dealership || "Concessionária Jeep Campinas"}>
                {userSession?.dealership || "Concessionária Jeep Campinas"}
              </span>
              <span className="text-[11px] text-emerald-600 flex items-center justify-end gap-1.5 whitespace-nowrap font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {roleDisplay}
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