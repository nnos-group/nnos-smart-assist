import { Car, ChevronLeft, LogOut, Check } from "lucide-react";

interface NavigationBarProps {
  currentStep: number;
  onBack: () => void;
  onLogout: () => void;
  showBack: boolean;
}

const steps = [
  { id: 1, label: "Dados" },
  { id: 2, label: "Pacote IA" },
  { id: 3, label: "Visualização" },
  { id: 4, label: "Script" },
];

const NavigationBar = ({ currentStep, onBack, onLogout, showBack }: NavigationBarProps) => {
  return (
    <nav className="sticky top-0 z-50 border-b border-border/50"
      style={{ background: "hsl(var(--card) / 0.92)", backdropFilter: "blur(16px) saturate(180%)" }}
    >
      <div className="max-w-6xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left */}
          <div className="flex items-center gap-4">
            {showBack && (
              <button onClick={onBack} className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm font-medium">Voltar</span>
              </button>
            )}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
                <Car className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground font-display text-sm">
                NNÓS <span className="text-ram-red">Smart-Sell</span>
              </span>
            </div>
          </div>

          {/* Center - Progress */}
          <div className="flex items-center gap-1">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                  step.id === currentStep
                    ? "text-primary-foreground shadow-sm"
                    : step.id < currentStep
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-secondary/60 text-muted-foreground"
                }`}
                  style={step.id === currentStep ? { background: "var(--gradient-primary)" } : undefined}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    step.id === currentStep
                      ? "bg-primary-foreground/20"
                      : step.id < currentStep
                      ? "bg-emerald-600 text-primary-foreground"
                      : "bg-muted"
                  }`}>
                    {step.id < currentStep ? <Check className="w-3 h-3" /> : step.id}
                  </span>
                  <span className="hidden sm:inline">{step.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-6 h-[2px] mx-0.5 rounded-full transition-colors ${
                    step.id < currentStep ? "bg-emerald-400" : "bg-border"
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Right */}
          <button onClick={onLogout} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <span className="text-xs font-medium hidden sm:inline">Sair</span>
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
