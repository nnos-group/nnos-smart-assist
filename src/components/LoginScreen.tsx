import { Car, ArrowRight, Shield, Cpu, TrendingUp } from "lucide-react";

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-secondary">
      <div className="w-full max-w-sm fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded bg-sf-navy mb-4">
            <Car className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Smart-Sell

          </h1>
          <p className="text-muted-foreground text-sm">
            Plataforma Inteligente de Vendas F&I
          </p>
        </div>

        {/* Login Card */}
        <div className="sf-card p-6">
          <h2 className="text-base font-semibold text-foreground mb-5">Entrar</h2>

          <div className="space-y-4 mb-6">
            <div>
              <label className="text-xs font-medium text-foreground block mb-1.5">Usuário</label>
              <input
                type="text"
                placeholder="consultor@stellantis.com"
                className="input-field h-9 text-sm"
                defaultValue="consultor@stellantis.com" />
              
            </div>
            <div>
              <label className="text-xs font-medium text-foreground block mb-1.5">Senha</label>
              <input
                type="password"
                placeholder="••••••••"
                className="input-field h-9 text-sm"
                defaultValue="••••••••" />
              
            </div>
          </div>

          <button
            onClick={onLogin}
            className="btn-primary w-full flex items-center justify-center gap-2 h-10 text-sm">
            
            Iniciar Venda
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-2 mt-5">
          {[
          { icon: Shield, label: "Seguro" },
          { icon: Cpu, label: "Inteligência Integrada" },
          { icon: TrendingUp, label: "Resultados" }].
          map(({ icon: Icon, label }) =>
          <div key={label} className="flex flex-col items-center gap-1 py-2 px-2 rounded border border-border bg-card text-center">
              <Icon className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[10px] font-medium text-muted-foreground">{label}</span>
            </div>
          )}
        </div>

        <p className="text-center text-[11px] text-muted-foreground mt-6">© 2026 Stellantis • Concessionária Premium

        </p>
      </div>
    </div>);

};

export default LoginScreen;