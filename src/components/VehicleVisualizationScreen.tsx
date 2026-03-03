import { RotateCw, Check, MessageSquare, ArrowRight, Layers, Car } from "lucide-react";
import { useState, useMemo } from "react";
import ramRampageImage from "@/assets/ram-rampage-rebel.jpg";
import { Accessory, ClientData } from "@/types/accessories";

interface VehicleVisualizationScreenProps {
  accessories: Accessory[];
  clientData: ClientData;
  onAccessoryToggle: (id: string) => void;
  onGenerateScript: () => void;
}

const getVehicleImage = (): string => ramRampageImage;

const VehicleVisualizationScreen = ({ accessories, clientData, onAccessoryToggle, onGenerateScript }: VehicleVisualizationScreenProps) => {
  const [rotation, setRotation] = useState(0);
  const [isRotating, setIsRotating] = useState(false);

  const handleRotate = () => {
    setIsRotating(true);
    setRotation((prev) => (prev + 45) % 360);
    setTimeout(() => setIsRotating(false), 700);
  };

  const selectedAccessories = accessories.filter((a) => a.selected);
  const vehicleImage = getVehicleImage();

  const depth3D = useMemo(() => {
    const radians = ((rotation % 360) * Math.PI) / 180;
    return {
      scaleX: Math.cos(radians),
      translateZ: Math.sin(radians) * 50,
      shadow: Math.abs(Math.sin(radians)) * 30 + 20,
    };
  }, [rotation]);

  return (
    <div className="min-h-screen p-6 md:p-8 app-container">
      <div className="max-w-6xl mx-auto fade-in">
        {/* Header */}
        <div className="mb-5">
          <p className="label-text text-sf-blue mb-1">Visualização Interativa</p>
          <h1 className="section-title">{clientData.vehicleModel} — {clientData.vehicleColor}</h1>
          <p className="text-muted-foreground text-xs mt-1">
            Ano: {clientData.vehicleYear} · Cliente: {clientData.clientName}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          {/* Vehicle Display */}
          <div className="lg:col-span-3">
            <div className="sf-card p-5 slide-up">
              <div
                className="relative aspect-video bg-secondary rounded overflow-hidden mb-5"
                style={{ perspective: "1500px" }}
              >
                {/* Floor shadow */}
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[15%] bg-gradient-to-t from-foreground/15 to-transparent rounded-[50%] blur-xl transition-all duration-700"
                  style={{
                    transform: `translateX(-50%) scaleX(${1 + Math.abs(depth3D.scaleX) * 0.2})`,
                    opacity: 0.3 + Math.abs(depth3D.scaleX) * 0.3,
                  }}
                />

                {/* Vehicle Image */}
                <div
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out p-4 ${isRotating ? 'blur-[1px]' : ''}`}
                  style={{
                    transform: `perspective(1500px) rotateY(${rotation}deg) translateZ(${depth3D.translateZ}px) scale(${0.95 + Math.abs(depth3D.scaleX) * 0.05})`,
                    transformStyle: "preserve-3d",
                  }}
                >
                  <img
                    src={vehicleImage}
                    alt={`${clientData.vehicleModel} ${clientData.vehicleColor}`}
                    className="max-h-full max-w-full object-contain transition-all duration-700"
                    style={{ filter: `drop-shadow(0 ${depth3D.shadow}px ${depth3D.shadow * 1.5}px rgba(0,0,0,0.3))` }}
                  />
                </div>

                {/* Badges */}
                <div className="absolute top-3 left-3 bg-sf-navy text-primary-foreground px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Car className="w-3 h-3" />
                  {clientData.vehicleYear}
                </div>

                <div className="absolute top-3 right-3 bg-sf-blue text-primary-foreground px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                  360° View
                </div>

                <div className="absolute bottom-3 left-3 bg-foreground/70 text-primary-foreground px-2 py-1 rounded text-xs font-medium flex items-center gap-1.5">
                  <Layers className="w-3 h-3" />
                  {rotation}°
                </div>

                {/* Selected accessory tags */}
                <div className="absolute bottom-3 right-3 flex flex-wrap justify-end gap-1 max-w-[60%]">
                  {selectedAccessories.slice(0, 3).map((acc) => (
                    <span key={acc.id} className="px-2 py-0.5 bg-sf-navy/80 text-primary-foreground text-[10px] font-medium rounded">
                      {acc.name}
                    </span>
                  ))}
                  {selectedAccessories.length > 3 && (
                    <span className="px-2 py-0.5 bg-ram-red/80 text-primary-foreground text-[10px] font-medium rounded">
                      +{selectedAccessories.length - 3}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={handleRotate}
                  disabled={isRotating}
                  className="btn-primary flex items-center gap-2 text-sm px-6 disabled:opacity-70"
                >
                  <RotateCw className={`w-4 h-4 transition-transform duration-700 ${isRotating ? 'animate-spin' : ''}`} />
                  Girar 360°
                </button>
              </div>
            </div>
          </div>

          {/* Accessories Panel */}
          <div className="lg:col-span-1">
            <div className="sf-card p-4 slide-up" style={{ animationDelay: "0.1s" }}>
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">Acessórios</h3>

              <div className="space-y-1.5 mb-4 max-h-[300px] overflow-y-auto">
                {accessories.map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => onAccessoryToggle(acc.id)}
                    className={`w-full flex items-center justify-between p-2 rounded border text-left transition-colors text-sm ${
                      acc.selected
                        ? "bg-sf-light-blue border-accent text-foreground"
                        : "bg-card border-border text-muted-foreground hover:bg-secondary/50"
                    }`}
                  >
                    <span className="truncate max-w-[140px] text-xs font-medium">{acc.name}</span>
                    <Check className={`w-3.5 h-3.5 flex-shrink-0 ${acc.selected ? "text-sf-blue" : "opacity-20"}`} />
                  </button>
                ))}
              </div>

              <div className="border-t border-border pt-3">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs text-muted-foreground">Total:</span>
                  <span className="text-base font-bold text-sf-blue">
                    R$ {selectedAccessories.reduce((sum, a) => sum + a.price, 0).toLocaleString("pt-BR")}
                  </span>
                </div>

                <button
                  onClick={onGenerateScript}
                  disabled={selectedAccessories.length === 0}
                  className="btn-accent w-full flex items-center justify-center gap-2 text-xs h-9 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Gerar Argumentação
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleVisualizationScreen;
