import { Car, ChevronLeft, LogOut } from "lucide-react";

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

const NavigationBar = ({
  currentStep,
  onBack,
  onLogout,
  showBack,
}: NavigationBarProps) => {
  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            {showBack && (
              <button
                onClick={onBack}
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm font-medium">Voltar</span>
              </button>
            )}
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-stellantis-blue flex items-center justify-center">
                <Car className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-foreground">
                NNÓS <span className="text-ram-red">Smart-Sell</span>
              </span>
            </div>
          </div>

          {/* Center - Progress Steps */}
          <div className="flex items-center gap-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    step.id === currentStep
                      ? "bg-stellantis-blue text-white"
                      : step.id < currentStep
                      ? "bg-green-100 text-green-700"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                      step.id === currentStep
                        ? "bg-white/20"
                        : step.id < currentStep
                        ? "bg-green-600 text-white"
                        : "bg-muted"
                    }`}
                  >
                    {step.id < currentStep ? "✓" : step.id}
                  </span>
                  <span className="hidden sm:inline">{step.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-8 h-0.5 mx-1 ${
                      step.id < currentStep ? "bg-green-400" : "bg-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Right Section */}
          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="text-sm font-medium hidden sm:inline">Sair</span>
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
