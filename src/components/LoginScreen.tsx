import { useState } from "react";
import { ArrowRight, Eye, EyeOff, Building2, Mail, Lock, Check, MapPin, X, ChevronRight, AlertCircle } from "lucide-react";

import accessoriesBadge from "@/assets/accessories-badge.jpg";

interface LoginScreenProps {
  onLogin: () => void;
}

export interface HubOption {
  id: string;
  name: string;
  city: string;
  code: string;
  isMatriz?: boolean;
}

export const JEEP_DEALERSHIP_GROUP = {
  groupName: "Grupo Concessionária Jeep",
  matriz: {
    id: "matriz",
    name: "Concessionária Jeep - Matriz Campinas (Orosimbo Maia)",
    city: "Campinas - SP",
    code: "#0101",
    isMatriz: true,
  },
  filiais: [
    { id: "filial-1", name: "Concessionária Jeep - Filial Campinas Amoreiras", city: "Campinas - SP", code: "#0102" },
    { id: "filial-2", name: "Concessionária Jeep - Filial Indaiatuba", city: "Indaiatuba - SP", code: "#0103" },
    { id: "filial-3", name: "Concessionária Jeep - Filial Piracicaba", city: "Piracicaba - SP", code: "#0104" },
    { id: "filial-4", name: "Concessionária Jeep - Filial Americana", city: "Americana - SP", code: "#0105" },
    { id: "filial-5", name: "Concessionária Jeep - Filial Limeira", city: "Limeira - SP", code: "#0106" },
  ],
};

const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [dealership, setDealership] = useState(JEEP_DEALERSHIP_GROUP.matriz.name);
  const [username, setUsername] = useState("consultor@stellantis.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [rememberSession, setRememberSession] = useState(true);
  const [isHubModalOpen, setIsHubModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() !== "nnos2026") {
      setErrorMessage("Senha de acesso incorreta. Verifique suas credenciais corporativas.");
      return;
    }
    setErrorMessage("");
    onLogin();
  };

  const handleSelectHub = (hubName: string) => {
    setDealership(hubName);
    setIsHubModalOpen(false);
  };

  return (
    <div className="h-full font-sans text-slate-800 antialiased hero-tech-bg flex flex-col justify-between items-center min-h-screen relative overflow-x-hidden selection:bg-brand-500 selection:text-white">
      {/* Ambient Light Orbs */}
      <div className="ambient-glow w-[32rem] h-[32rem] bg-blue-200/50 top-[-100px] left-1/2 -translate-x-1/2 -z-10" />
      <div className="ambient-glow w-96 h-96 bg-sky-200/40 bottom-[-120px] left-10 -z-10" />
      <div className="ambient-glow w-96 h-96 bg-indigo-100/60 bottom-10 right-10 -z-10" />

      {/* Wireframe Overlay Decor */}
      <div className="absolute inset-0 blueprint-grid pointer-events-none opacity-60" />

      {/* BEGIN: MainContainer */}
      <main className="w-full max-w-xl mx-auto flex flex-col items-center my-auto py-8 px-4 sm:px-6 z-10">
        {/* BEGIN: BrandHeader */}
        <div className="flex flex-col items-center text-center mb-6 relative">
          {/* Authentic Accessories Badge (Jeep & RAM) */}
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500/30 via-slate-800/40 to-slate-950/60 rounded-full blur-md opacity-40 group-hover:opacity-75 transition duration-500" />
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-slate-950 border-2 border-slate-700/80 shadow-2xl group-hover:scale-105 group-hover:border-amber-500/60 transition-all duration-300 overflow-hidden flex items-center justify-center">
              <img
                src={accessoriesBadge}
                alt="Emblema de Acessórios Jeep & RAM"
                className="w-full h-full object-cover scale-[1.04]"
              />
            </div>
          </div>

          {/* Main Title */}
          <div className="mt-4 flex items-center justify-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-slate-900">
              Smart<span className="text-brand-600 font-bold">-Sell</span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1.5 max-w-md tracking-normal">
            Plataforma Inteligente de Vendas de F&amp;I
          </p>
        </div>
        {/* END: BrandHeader */}

        {/* BEGIN: LoginFormCard */}
        <div className="w-full max-w-lg bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/90 shadow-card-lux p-6 sm:p-9 relative overflow-hidden">
          {/* Top Decorative Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-brand-500 to-transparent" />

          {/* Card Header */}
          <div className="pb-5 mb-5 border-b border-slate-100">
            <h2 className="text-lg sm:text-xl font-bold font-display text-slate-900 tracking-tight">
              Acesso ao Sistema de Vendas F&amp;I
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Identifique-se com sua credencial de concessionária</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Field: Concessionária / Hub Operacional */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider font-mono" htmlFor="dealership-code">
                  Concessionária / Hub Operacional
                </label>
                <button
                  type="button"
                  onClick={() => setIsHubModalOpen(true)}
                  className="text-[11px] font-semibold text-brand-600 hover:text-brand-700 hover:underline cursor-pointer transition-colors flex items-center gap-1"
                >
                  <span>Alterar Hub</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Building2 className="h-4 w-4 text-brand-600" />
                </div>
                <select
                  id="dealership-code"
                  value={dealership}
                  onChange={(e) => setDealership(e.target.value)}
                  className="block w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm font-medium text-slate-800 bg-slate-50/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/25 focus:border-brand-600 focus:bg-white transition-all appearance-none cursor-pointer"
                >
                  <optgroup label="🏢 Concessionária Matriz">
                    <option value={JEEP_DEALERSHIP_GROUP.matriz.name}>
                      {JEEP_DEALERSHIP_GROUP.matriz.name}
                    </option>
                  </optgroup>
                  <optgroup label="📍 Filiais da Rede (5 Unidades)">
                    {JEEP_DEALERSHIP_GROUP.filiais.map((filial) => (
                      <option key={filial.id} value={filial.name}>
                        {filial.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-brand-600" />
                <span>{JEEP_DEALERSHIP_GROUP.groupName} • 1 Matriz + 5 Filiais Integradas</span>
              </p>
            </div>

            {/* Field: ID Consultor / E-mail */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono" htmlFor="username">
                ID Consultor / E-mail Corporativo
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4 text-brand-600" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="email"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="consultor.fi@stellantis.com"
                  className="block w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm font-medium text-slate-900 bg-slate-50/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/25 focus:border-brand-600 focus:bg-white placeholder:text-slate-400 transition-all"
                />
              </div>
            </div>

            {/* Field: Senha */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider font-mono" htmlFor="password">
                  Senha de Acesso
                </label>
                <button
                  type="button"
                  onClick={() => alert("Para redefinir sua senha, solicite suporte ao Administrador F&I da Concessionária.")}
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700 hover:underline transition-colors"
                >
                  Esqueceu sua senha?
                </button>
              </div>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4 text-brand-600" />
                </div>
                <input
                  id="password"
                  name="password"
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="Digite a senha de acesso corporativo..."
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage("");
                  }}
                  className={`block w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm font-medium text-slate-900 bg-slate-50/80 border rounded-xl focus:ring-2 focus:bg-white transition-all ${
                    errorMessage
                      ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                      : "border-slate-200 focus:ring-brand-500/25 focus:border-brand-600"
                  } ${!showPassword ? "tracking-widest" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Alternar visualização da senha"
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 focus:outline-none transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errorMessage && (
                <div className="mt-2 flex items-center gap-2 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium animate-in fade-in slide-in-from-top-1">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>

            {/* Remember Session & Version */}
            <div className="flex items-center justify-between pt-1 pb-1">
              <label className="flex items-center text-xs text-slate-600 cursor-pointer hover:text-slate-900 transition-colors select-none font-medium">
                <input
                  type="checkbox"
                  checked={rememberSession}
                  onChange={(e) => setRememberSession(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500/30 focus:ring-offset-0 transition-colors"
                />
                <span className="ml-2.5">Manter sessão ativa neste terminal</span>
              </label>
              <span className="text-[11px] text-slate-500 font-mono font-medium">v4.9.4 PRO</span>
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              className="shimmer-btn w-full group relative flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-500 via-[#005ed9] to-brand-600 hover:from-brand-600 hover:to-brand-700 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-white shadow-glow-blue transition-all duration-200 cursor-pointer"
            >
              <span className="tracking-wide">Iniciar Venda / Acessar Sistema de Vendas</span>
              <ArrowRight className="w-4 h-4 text-white transform group-hover:translate-x-1.5 transition-transform" />
            </button>
          </form>
        </div>
        {/* END: LoginFormCard */}
      </main>
      {/* END: MainContainer */}

      {/* Modal de Seleção de Hub: Matriz e Filiais */}
      {isHubModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div>
                <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider font-mono">
                  Rede de Concessionárias Autorizadas
                </span>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mt-0.5">
                  <Building2 className="w-5 h-5 text-brand-600" />
                  {JEEP_DEALERSHIP_GROUP.groupName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsHubModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                aria-label="Fechar modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 max-h-[65vh] overflow-y-auto space-y-4">
              {/* Seção Matriz */}
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 font-mono flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-600" />
                  Concessionária Matriz (Sede Operacional)
                </p>
                <div
                  onClick={() => handleSelectHub(JEEP_DEALERSHIP_GROUP.matriz.name)}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    dealership === JEEP_DEALERSHIP_GROUP.matriz.name
                      ? "border-brand-600 bg-brand-50/50 shadow-sm"
                      : "border-slate-200 hover:border-brand-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-brand-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          {JEEP_DEALERSHIP_GROUP.matriz.name}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-100 text-brand-700">
                          MATRIZ
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {JEEP_DEALERSHIP_GROUP.matriz.city} • Código: {JEEP_DEALERSHIP_GROUP.matriz.code}
                      </p>
                    </div>
                  </div>
                  {dealership === JEEP_DEALERSHIP_GROUP.matriz.name && (
                    <div className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-sm">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              </div>

              {/* Seção Filiais (5 Unidades) */}
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 font-mono flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  Filiais Integradas da Rede (5 Unidades)
                </p>
                <div className="space-y-2">
                  {JEEP_DEALERSHIP_GROUP.filiais.map((filial) => {
                    const isSelected = dealership === filial.name;
                    return (
                      <div
                        key={filial.id}
                        onClick={() => handleSelectHub(filial.name)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? "border-brand-600 bg-brand-50/50 shadow-sm"
                            : "border-slate-200 hover:border-brand-200 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center flex-shrink-0">
                            <Building2 className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-slate-800 block">
                              {filial.name}
                            </span>
                            <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {filial.city} • {filial.code}
                            </span>
                          </div>
                        </div>
                        {isSelected ? (
                          <div className="w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-sm">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        ) : (
                          <span className="text-[11px] font-semibold text-brand-600 hover:underline">
                            Selecionar
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setIsHubModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 transition-colors shadow-sm"
              >
                Confirmar Seleção
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BEGIN: SiteFooter */}
      <footer className="w-full max-w-5xl mx-auto py-5 px-4 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200/80 z-10">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">© 2026 Stellantis</span>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <span className="text-slate-500 hidden sm:inline">Rede de Concessionárias Autorizadas</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3.5 text-[11px] text-slate-500 font-medium">
          <a href="#privacidade" className="hover:text-brand-600 transition-colors">
            Privacidade &amp; LGPD
          </a>
          <span className="text-slate-300">•</span>
          <a href="#termos" className="hover:text-brand-600 transition-colors">
            Termos de Uso
          </a>

          <span className="inline-flex items-center text-emerald-600 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 shadow-[0_0_6px_rgba(16,185,129,0.7)]" />
            Sistemas Operacionais
          </span>
        </div>
      </footer>
      {/* END: SiteFooter */}
    </div>
  );
};

export default LoginScreen;