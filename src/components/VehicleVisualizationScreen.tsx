import { RotateCw, Check, MessageSquare, ArrowRight, Layers } from "lucide-react";
import { useState } from "react";
import ramRampageImage from "@/assets/ram-rampage-rebel.jpg";
import { Accessory } from "@/types/accessories";

interface VehicleVisualizationScreenProps {
  accessories: Accessory[];
  onAccessoryToggle: (id: string) => void;
  onGenerateScript: () => void;
}

const VehicleVisualizationScreen = ({ accessories, onAccessoryToggle, onGenerateScript }: VehicleVisualizationScreenProps) => {
  const [rotation, setRotation] = useState(0);

  const handleRotate = () => {
    setRotation((prev) => (prev + 45) % 360);
  };

  const selectedAccessories = accessories.filter((a) => a.selected);

  return (
    <div className="min-h-screen p-8 app-container">
      <div className="max-w-6xl mx-auto fade-in">
        {/* Header */}
        <div className="mb-6">
          <p className="text-sm font-medium text-ram-red uppercase tracking-wider mb-1">
            Visualização Interativa
          </p>
          <h1 className="section-title">RAM RAMPAGE REBEL - Vermelho Volcano</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Vehicle Display */}
          <div className="lg:col-span-3">
            <div className="card-premium p-6 slide-up">
              {/* Vehicle Image Container */}
              <div 
                className="relative aspect-video bg-gradient-to-br from-secondary via-background to-secondary rounded-xl overflow-hidden mb-6"
              >
                {/* Vehicle Image with 3D Transform */}
                <div 
                  className="absolute inset-0 flex items-center justify-center transition-transform duration-700 ease-out p-4"
                  style={{ 
                    transform: `perspective(1200px) rotateY(${rotation}deg) scale(${rotation % 90 === 0 ? 1 : 0.95})`,
                  }}
                >
                  <img 
                    src={ramRampageImage} 
                    alt="RAM Rampage Rebel Vermelho"
                    className="max-h-full max-w-full object-contain drop-shadow-2xl"
                  />
                </div>

                {/* Accessory Badges Overlay */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-2">
                  {selectedAccessories.map((acc) => (
                    <span 
                      key={acc.id}
                      className="px-3 py-1.5 bg-stellantis-blue/90 text-primary-foreground text-xs font-medium rounded-full backdrop-blur-sm shadow-lg"
                    >
                      ✓ {acc.name}
                    </span>
                  ))}
                </div>

                {/* Rotation Indicator */}
                <div className="absolute bottom-4 left-4 bg-charcoal/80 text-primary-foreground px-3 py-1.5 rounded-lg text-sm font-medium backdrop-blur-sm flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  Vista: {rotation}°
                </div>

                {/* AR Badge */}
                <div className="absolute top-4 right-4 bg-ram-red text-accent-foreground px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg">
                  Visualização AR
                </div>

                {/* Accessory Count */}
                <div className="absolute top-4 left-4 bg-stellantis-blue/90 text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg">
                  {selectedAccessories.length} Acessórios
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleRotate}
                  className="btn-primary flex items-center gap-2 px-8"
                >
                  <RotateCw className="w-5 h-5" />
                  Girar 360°
                </button>
              </div>
            </div>
          </div>

          {/* Accessories Panel */}
          <div className="lg:col-span-1">
            <div className="card-premium p-5 slide-up" style={{ animationDelay: "0.1s" }}>
              <h3 className="label-text mb-4">Acessórios do Pacote</h3>
              
              <div className="space-y-2 mb-6">
                {accessories.map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => onAccessoryToggle(acc.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                      acc.selected
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-secondary/50 border-border text-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{acc.icon}</span>
                      <span className="text-sm font-medium">{acc.name}</span>
                    </div>
                    <Check className={`w-4 h-4 ${acc.selected ? "opacity-100" : "opacity-30"}`} />
                  </button>
                ))}
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-muted-foreground">Total:</span>
                  <span className="text-lg font-bold text-ram-red">
                    R$ {selectedAccessories.reduce((sum, a) => sum + a.price, 0).toLocaleString("pt-BR")}
                  </span>
                </div>
                
                <button
                  onClick={onGenerateScript}
                  disabled={selectedAccessories.length === 0}
                  className="btn-accent w-full flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MessageSquare className="w-4 h-4" />
                  Gerar Argumentação
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Info Card */}
            <div className="card-premium p-4 mt-4 slide-up" style={{ animationDelay: "0.2s" }}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Cliente Engajado</p>
                  <p className="text-xs text-muted-foreground">
                    Visualização aumenta conversão em 47%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleVisualizationScreen;
