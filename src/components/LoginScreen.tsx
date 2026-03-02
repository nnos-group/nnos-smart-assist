import { Car, Sparkles, ArrowRight, Shield, Cpu, TrendingUp } from "lucide-react";

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 app-container relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.03]" 
        style={{ background: "radial-gradient(circle, hsl(var(--ram-red)), transparent 70%)" }} 
      />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-[0.04]" 
        style={{ background: "radial-gradient(circle, hsl(var(--stellantis-blue)), transparent 70%)" }} 
      />

      <div className="w-full max-w-md fade-in relative z-10">
        {/* Logo and Branding */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 shadow-lg relative"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Car className="w-10 h-10 text-primary-foreground" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ background: "var(--gradient-accent)" }}
            >
              <Cpu className="w-3 h-3 text-accent-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-1 font-display">
            NNÓS <span className="text-gradient-accent">Smart-Sell</span>
          </h1>
          <p className="text-muted-foreground text-base">
            Plataforma Inteligente de Vendas F&I
          </p>
        </div>

        {/* Login Card */}
        <div className="card-premium p-8">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-4 h-4 text-ram-red" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Powered by AI
            </span>
          </div>

          <div className="space-y-4 mb-8">
            <div>
              <label className="label-text block mb-2">Usuário</label>
              <input
                type="text"
                placeholder="consultor@stellantis.com"
                className="input-field"
                defaultValue="consultor@stellantis.com"
              />
            </div>
            <div>
              <label className="label-text block mb-2">Senha</label>
              <input
                type="password"
                placeholder="••••••••"
                className="input-field"
                defaultValue="••••••••"
              />
            </div>
          </div>

          <button
            onClick={onLogin}
            className="btn-accent w-full flex items-center justify-center gap-3 text-lg py-4"
          >
            Iniciar Venda
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Features row */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          {[
            { icon: Shield, label: "Seguro" },
            { icon: Cpu, label: "IA Integrada" },
            { icon: TrendingUp, label: "Resultados" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl bg-card/60 border border-border/30">
              <Icon className="w-4 h-4 text-muted-foreground" />
              <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          © 2025 Stellantis • Concessionária Premium
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
