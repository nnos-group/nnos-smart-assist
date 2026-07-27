import { RotateCw, Car, Layers, ShoppingCart, MessageSquare, ArrowRight, Eye } from "lucide-react";
import { useState, useMemo } from "react";
import ramRampageImage from "@/assets/ram-rampage-rebel.jpg";
import ramRampageAccessorizedImage from "@/assets/ram-rampage-rebel-accessorized.jpg";
import { Accessory, ClientData } from "@/types/accessories";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

interface VehicleVisualizationScreenProps {
  accessories: Accessory[];
  clientData: ClientData;
  onAccessoryToggle: (id: string) => void;
  onGenerateScript: () => void;
  onAddToProposal: () => void;
}

const VehicleVisualizationScreen = ({ accessories, clientData, onAccessoryToggle, onGenerateScript, onAddToProposal }: VehicleVisualizationScreenProps) => {
  const [rotation, setRotation] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [showAfter, setShowAfter] = useState(true);

  const handleRotate = () => {
    setIsRotating(true);
    setRotation((prev) => (prev + 45) % 360);
    setTimeout(() => setIsRotating(false), 700);
  };

  const selectedAccessories = accessories.filter((a) => a.selected);
  const vehicleImage = showAfter && selectedAccessories.length > 0
    ? ramRampageAccessorizedImage
    : ramRampageImage;

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
      <div className="max-w-7xl mx-auto fade-in">
        {/* Header */}
        <div className="mb-5">
          <p className="label-text text-sf-blue mb-1">Visualização Interativa</p>
          <h1 className="section-title">{clientData.vehicleModel} — {clientData.vehicleColor}</h1>
          <p className="text-muted-foreground text-xs mt-1">
            Ano: {clientData.vehicleYear} · Cliente: {clientData.clientName}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Vehicle Display - Main Area */}
          <div className="lg:col-span-8">
            <div className="sf-card p-5 slide-up">
              <div
                className="relative aspect-video bg-secondary rounded overflow-hidden mb-4"
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
                    filter: `drop-shadow(0 ${depth3D.shadow}px ${depth3D.shadow * 1.5}px rgba(0,0,0,0.3))`,
                  }}
                >
                  <img
                    src={vehicleImage}
                    alt={`${clientData.vehicleModel} ${clientData.vehicleColor}`}
                    className="max-h-full max-w-full object-contain transition-all duration-700"
                  />
                </div>

                {/* Year Badge */}
                <div className="absolute top-3 left-3 bg-sf-navy text-primary-foreground px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Car className="w-3 h-3" />
                  {clientData.vehicleYear}
                </div>

                {/* 360 Badge */}
                <div className="absolute top-3 right-3 bg-sf-blue text-primary-foreground px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                  360° View
                </div>

                {/* Before/After label */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 pointer-events-none">
                  <div className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${showAfter ? 'bg-sf-blue text-primary-foreground' : 'bg-foreground/70 text-primary-foreground'}`}>
                    {showAfter ? 'Depois — Com Acessórios' : 'Antes — Original'}
                  </div>
                </div>

                {/* Rotation angle */}
                <div className="absolute bottom-3 left-3 bg-foreground/70 text-primary-foreground px-2 py-1 rounded text-xs font-medium flex items-center gap-1.5">
                  <Layers className="w-3 h-3" />
                  {rotation}°
                </div>

                {/* Selected accessory tags - only show in "After" mode */}
                {showAfter && (
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
                )}
              </div>

              {/* Controls Bar */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                {/* Before/After Toggle */}
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium transition-colors ${!showAfter ? 'text-foreground' : 'text-muted-foreground'}`}>
                    Antes
                  </span>
                  <Switch
                    checked={showAfter}
                    onCheckedChange={setShowAfter}
                  />
                  <span className={`text-xs font-medium transition-colors ${showAfter ? 'text-foreground' : 'text-muted-foreground'}`}>
                    Depois
                  </span>
                </div>

                {/* Rotate Button */}
                <button
                  onClick={handleRotate}
                  disabled={isRotating}
                  className="btn-primary flex items-center gap-2 text-sm px-5 disabled:opacity-70"
                >
                  <RotateCw className={`w-4 h-4 transition-transform duration-700 ${isRotating ? 'animate-spin' : ''}`} />
                  Girar 360°
                </button>
              </div>
            </div>
          </div>

          {/* Accessories Panel */}
          <div className="lg:col-span-4">
            <div className="sf-card p-5 slide-up flex flex-col" style={{ animationDelay: "0.1s" }}>
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                Acessórios Disponíveis
              </h3>

              {/* Accessory list with checkboxes */}
              <div className="space-y-1 mb-5 max-h-[340px] overflow-y-auto pr-1">
                {accessories.map((acc) => (
                  <label
                    key={acc.id}
                    className={`flex items-center gap-3 p-2.5 rounded border cursor-pointer transition-colors ${
                      acc.selected
                        ? "bg-sf-light-blue border-accent"
                        : "bg-card border-border hover:bg-secondary/50"
                    }`}
                  >
                    <Checkbox
                      checked={acc.selected}
                      onCheckedChange={() => onAccessoryToggle(acc.id)}
                      className="flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-medium text-foreground block truncate">{acc.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-sf-blue whitespace-nowrap">
                      R$ {acc.price.toLocaleString("pt-BR")}
                    </span>
                  </label>
                ))}
              </div>

              {/* Total + Actions */}
              <div className="border-t border-border pt-4 mt-auto">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs text-muted-foreground font-medium">
                    {selectedAccessories.length} {selectedAccessories.length === 1 ? 'item selecionado' : 'itens selecionados'}
                  </span>
                  <span className="text-lg font-bold text-sf-blue">
                    R$ {selectedAccessories.reduce((sum, a) => sum + a.price, 0).toLocaleString("pt-BR")}
                  </span>
                </div>

                {/* CTA - Adicionar à Proposta */}
                <button
                  onClick={onAddToProposal}
                  disabled={selectedAccessories.length === 0}
                  className="btn-cta-orange w-full flex items-center justify-center gap-2 text-sm h-11 mb-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Adicionar à Proposta
                </button>

                {/* Secondary - Gerar Argumentação */}
                <button
                  onClick={onGenerateScript}
                  disabled={selectedAccessories.length === 0}
                  className="w-full flex items-center justify-center gap-2 text-xs h-9 text-muted-foreground hover:text-foreground font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
