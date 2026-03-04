import { Car, ChevronLeft, LogOut, Check } from "lucide-react";

interface NavigationBarProps {
  currentStep: number;
  onBack: () => void;
  onLogout: () => void;
  showBack: boolean;
}

const steps = [
  { id: 1, label: "Dados" },
  { id: 2, label: "Pacote Acessórios" },
  { id: 3, label: "Visualização" },
  { id: 4, label: "Script" },
];

const NavigationBar = ({ currentStep, onBack, onLogout, showBack }: NavigationBarProps) => {
  return (
    <nav className="sticky top-0 z-50 bg-sf-navy">
      <div className="max-w-6xl mx-auto px-6 py-2.5">
        <div className="flex items-center justify-between">
          {/* Left */}
          <div className="flex items-center gap-4">
            {showBack && (
              <button onClick={onBack} className="flex items-center gap-1 text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">
                <ChevronLeft className="w-4 h-4" />
                <span className="font-medium">Voltar</span>
              </button>
            )}
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-primary-foreground/15 flex items-center justify-center">
                <Car className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-primary-foreground text-sm tracking-tight">
                NNÓS <span className="text-primary-foreground/70 font-normal">Smart-Sell</span>
              </span>
            </div>
          </div>

          {/* Center - Progress Steps */}
          <div className="flex items-center gap-1">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all duration-200 ${
                  step.id === currentStep
                    ? "bg-primary-foreground text-sf-navy"
                    : step.id < currentStep
                    ? "bg-primary-foreground/15 text-primary-foreground"
                    : "text-primary-foreground/40"
                }`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    step.id === currentStep
                      ? "bg-sf-navy text-primary-foreground"
                      : step.id < currentStep
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-primary-foreground/10 text-primary-foreground/40"
                  }`}>
                    {step.id < currentStep ? <Check className="w-3 h-3" /> : step.id}
                  </span>
                  <span className="hidden sm:inline">{step.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-6 h-px mx-1 transition-colors ${
                    step.id < currentStep ? "bg-primary-foreground/30" : "bg-primary-foreground/10"
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Right */}
          <button onClick={onLogout} className="flex items-center gap-2 text-primary-foreground/60 hover:text-primary-foreground transition-colors">
            <span className="text-xs font-medium hidden sm:inline">Sair</span>
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
