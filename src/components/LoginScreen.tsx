import { Car, Sparkles, ArrowRight } from "lucide-react";

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 app-container">
      <div className="w-full max-w-md fade-in">
        {/* Logo and Branding */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-stellantis-blue mb-6 shadow-lg">
            <Car className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            NNÓS <span className="text-gradient-accent">Smart-Sell</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Plataforma Inteligente de Vendas
          </p>
        </div>

        {/* Login Card */}
        <div className="card-premium p-8">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-ram-red" />
            <span className="text-sm font-medium text-muted-foreground">
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
            className="btn-accent w-full flex items-center justify-center gap-3 text-lg"
          >
            Iniciar Venda
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          © 2024 Stellantis • Concessionária Premium
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
