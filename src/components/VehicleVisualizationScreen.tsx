import { RotateCw, Check, MessageSquare, ArrowRight, Layers, Car, Zap } from "lucide-react";
import { useState, useMemo } from "react";
import ramRampageImage from "@/assets/ram-rampage-rebel.jpg";
import { Accessory, ClientData, vehicleImages } from "@/types/accessories";

interface VehicleVisualizationScreenProps {
  accessories: Accessory[];
  clientData: ClientData;
  onAccessoryToggle: (id: string) => void;
  onGenerateScript: () => void;
}

// Fallback de imagens por marca para demonstração
const getVehicleImage = (vehicleModel: string): string => {
  // Retornar a imagem local existente como fallback
  // Em produção, usaria vehicleImages[vehicleModel]
  return ramRampageImage;
};

const VehicleVisualizationScreen = ({ accessories, clientData, onAccessoryToggle, onGenerateScript }: VehicleVisualizationScreenProps) => {
  const [rotation, setRotation] = useState(0);
  const [isRotating, setIsRotating] = useState(false);

  const handleRotate = () => {
    setIsRotating(true);
    setRotation((prev) => (prev + 45) % 360);
    setTimeout(() => setIsRotating(false), 700);
  };

  const selectedAccessories = accessories.filter((a) => a.selected);
  const vehicleImage = getVehicleImage(clientData.vehicleModel);
  
  // Calcular profundidade 3D baseada na rotação
  const depth3D = useMemo(() => {
    const angle = rotation % 360;
    const radians = (angle * Math.PI) / 180;
    return {
      scaleX: Math.cos(radians),
      translateZ: Math.sin(radians) * 50,
      shadow: Math.abs(Math.sin(radians)) * 30 + 20,
    };
  }, [rotation]);

  return (
    <div className="min-h-screen p-8 app-container">
      <div className="max-w-6xl mx-auto fade-in">
        {/* Header */}
        <div className="mb-6">
          <p className="text-sm font-medium text-ram-red uppercase tracking-wider mb-1">
            Visualização Interativa 3D
          </p>
          <h1 className="section-title">{clientData.vehicleModel} - {clientData.vehicleColor}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Ano: {clientData.vehicleYear} • Cliente: {clientData.clientName}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Vehicle Display */}
          <div className="lg:col-span-3">
            <div className="card-premium p-6 slide-up">
              {/* Vehicle Image Container with 3D depth effect */}
              <div 
                className="relative aspect-video bg-gradient-to-br from-secondary via-background to-secondary rounded-xl overflow-hidden mb-6"
                style={{
                  perspective: "1500px",
                  perspectiveOrigin: "center center",
                }}
              >
                {/* Background gradient for depth */}
                <div 
                  className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/20 pointer-events-none"
                  style={{
                    opacity: 0.5 + Math.abs(Math.sin((rotation * Math.PI) / 180)) * 0.3,
                  }}
                />
                
                {/* Floor/shadow reflection */}
                <div 
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[20%] bg-gradient-to-t from-black/30 to-transparent rounded-[50%] blur-xl transition-all duration-700"
                  style={{
                    transform: `translateX(-50%) scaleX(${1 + Math.abs(depth3D.scaleX) * 0.2})`,
                    opacity: 0.4 + Math.abs(depth3D.scaleX) * 0.3,
                  }}
                />

                {/* Vehicle Image with 3D Transform */}
                <div 
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out p-4 ${isRotating ? 'blur-[2px]' : ''}`}
                  style={{ 
                    transform: `
                      perspective(1500px) 
                      rotateY(${rotation}deg) 
                      translateZ(${depth3D.translateZ}px)
                      scale(${0.95 + Math.abs(depth3D.scaleX) * 0.05})
                    `,
                    transformStyle: "preserve-3d",
                  }}
                >
                  <img 
                    src={vehicleImage} 
                    alt={`${clientData.vehicleModel} ${clientData.vehicleColor}`}
                    className="max-h-full max-w-full object-contain transition-all duration-700"
                    style={{
                      filter: `drop-shadow(0 ${depth3D.shadow}px ${depth3D.shadow * 1.5}px rgba(0,0,0,0.4))`,
                    }}
                  />
                </div>

                {/* 3D Rotation indicator ring */}
                <div 
                  className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[60%] h-4 border-2 border-dashed border-stellantis-blue/30 rounded-[50%] pointer-events-none"
                  style={{
                    transform: `translateX(-50%) rotateX(70deg) rotateZ(${rotation}deg)`,
                    transformStyle: "preserve-3d",
                  }}
                />

                {/* Accessory Badges Overlay */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-2 max-w-[90%]">
                  {selectedAccessories.slice(0, 4).map((acc) => (
                    <span 
                      key={acc.id}
                      className="px-3 py-1.5 bg-stellantis-blue/90 text-primary-foreground text-xs font-medium rounded-full backdrop-blur-sm shadow-lg"
                    >
                      ✓ {acc.name}
                    </span>
                  ))}
                  {selectedAccessories.length > 4 && (
                    <span className="px-3 py-1.5 bg-ram-red/90 text-primary-foreground text-xs font-medium rounded-full backdrop-blur-sm shadow-lg">
                      +{selectedAccessories.length - 4} mais
                    </span>
                  )}
                </div>

                {/* Rotation Indicator */}
                <div className="absolute bottom-4 left-4 bg-charcoal/80 text-primary-foreground px-3 py-1.5 rounded-lg text-sm font-medium backdrop-blur-sm flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  Vista: {rotation}°
                </div>

                {/* 3D Badge */}
                <div className="absolute top-4 right-4 bg-ram-red text-accent-foreground px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  Visualização 3D
                </div>

                {/* Vehicle Info Badge */}
                <div className="absolute top-4 left-4 bg-stellantis-blue/90 text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-1">
                  <Car className="w-3 h-3" />
                  {clientData.vehicleYear}
                </div>

                {/* Accessory Count */}
                <div className="absolute top-14 left-4 bg-charcoal/80 text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-medium backdrop-blur-sm">
                  {selectedAccessories.length} Acessórios Selecionados
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleRotate}
                  disabled={isRotating}
                  className="btn-primary flex items-center gap-2 px-8 disabled:opacity-70"
                >
                  <RotateCw className={`w-5 h-5 transition-transform duration-700 ${isRotating ? 'animate-spin' : ''}`} />
                  Girar 360°
                </button>
              </div>
            </div>
          </div>

          {/* Accessories Panel */}
          <div className="lg:col-span-1">
            <div className="card-premium p-5 slide-up" style={{ animationDelay: "0.1s" }}>
              <h3 className="label-text mb-4">Acessórios do Pacote</h3>
              
              <div className="space-y-2 mb-6 max-h-[300px] overflow-y-auto">
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
                      <span className="text-sm font-medium truncate max-w-[120px]">{acc.name}</span>
                    </div>
                    <Check className={`w-4 h-4 flex-shrink-0 ${acc.selected ? "opacity-100" : "opacity-30"}`} />
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
                    Visualização 3D aumenta conversão em 47%
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
