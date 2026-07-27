import { RotateCw, Car, Layers, ShoppingCart, MessageSquare, ArrowRight, Eye, Play, Pause } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import ramRampageImage from "@/assets/ram-rampage-rebel.jpg";
import ramRampageAccessorizedImage from "@/assets/ram-rampage-rebel-accessorized.jpg";
import ramRampageFront from "@/assets/ram-rampage-front.png";
import ramRampageFrontQuarter from "@/assets/ram-rampage-front-quarter.png";
import ramRampageRear from "@/assets/ram-rampage-rear.png";
import ramRampageRearQuarter from "@/assets/ram-rampage-rear-quarter.png";
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

const ANGLES = [0, 45, 90, 135, 180, 225, 270, 315] as const;

const VehicleVisualizationScreen = ({ accessories, clientData, onAccessoryToggle, onGenerateScript, onAddToProposal }: VehicleVisualizationScreenProps) => {
  const [rotation, setRotation] = useState<number>(0);
  const [isRotating, setIsRotating] = useState(false);
  const [isAutoSpin, setIsAutoSpin] = useState(false);
  const [showAfter, setShowAfter] = useState(true);

  // Auto-spin interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoSpin) {
      interval = setInterval(() => {
        setRotation((prev) => (prev + 45) % 360);
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [isAutoSpin]);

  const handleRotateNext = () => {
    setIsRotating(true);
    setRotation((prev) => (prev + 45) % 360);
    setTimeout(() => setIsRotating(false), 500);
  };

  const selectedAccessories = accessories.filter((a) => a.selected);

  // Angle view configuration mapping each rotation angle to realistic perspective photography
  const getAngleConfig = (deg: number) => {
    const normalized = (deg % 360 + 360) % 360;
    
    // In "Depois" mode with selected accessories, use accessorized imagery and accessory overlays
    const isAccessorized = showAfter && selectedAccessories.length > 0;

    switch (normalized) {
      case 0:
        return {
          title: "Vista Lateral (Perfil Direito)",
          image: isAccessorized ? ramRampageAccessorizedImage : ramRampageImage,
          flip: false,
        };
      case 45:
        return {
          title: "Vista Diagonal Dianteira (3/4)",
          image: ramRampageFrontQuarter,
          flip: false,
        };
      case 90:
        return {
          title: "Vista Frontal (Frente)",
          image: ramRampageFront,
          flip: false,
        };
      case 135:
        return {
          title: "Vista Diagonal Dianteira Oposta",
          image: ramRampageFrontQuarter,
          flip: true,
        };
      case 180:
        return {
          title: "Vista Lateral (Perfil Esquerdo)",
          image: isAccessorized ? ramRampageAccessorizedImage : ramRampageImage,
          flip: true,
        };
      case 225:
        return {
          title: "Vista Diagonal Traseira Oposta",
          image: ramRampageRearQuarter,
          flip: true,
        };
      case 270:
        return {
          title: "Vista Traseira (Caçamba)",
          image: ramRampageRear,
          flip: false,
        };
      case 315:
        return {
          title: "Vista Diagonal Traseira (3/4)",
          image: ramRampageRearQuarter,
          flip: false,
        };
      default:
        return {
          title: "Vista 360°",
          image: ramRampageImage,
          flip: false,
        };
    }
  };

  const currentAngleView = getAngleConfig(rotation);

  const depth3D = useMemo(() => {
    const radians = ((rotation % 360) * Math.PI) / 180;
    return {
      scaleX: Math.cos(radians),
      shadow: Math.abs(Math.sin(radians)) * 25 + 15,
    };
  }, [rotation]);

  return (
    <div className="min-h-screen p-6 md:p-8 app-container">
      <div className="max-w-7xl mx-auto fade-in">
        {/* Header */}
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="label-text text-sf-blue mb-1">Visualização Interativa 360° Multi-Ângulo</p>
            <h1 className="section-title">{clientData.vehicleModel} — {clientData.vehicleColor}</h1>
            <p className="text-muted-foreground text-xs mt-1">
              Ano: {clientData.vehicleYear} · Cliente: {clientData.clientName}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-sf-blue bg-sf-light-blue px-3 py-1.5 rounded-full border border-sf-blue/20">
              {currentAngleView.title}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Vehicle Display - Main Area */}
          <div className="lg:col-span-8">
            <div className="sf-card p-5 slide-up">
              <div
                className="relative aspect-video bg-gradient-to-b from-secondary/40 via-secondary/70 to-secondary rounded-lg overflow-hidden mb-4 border border-border/50"
              >
  // Helper to calculate exact visual overlay and pinpoint position for each accessory per angle
  const getAccessoryOverlayProps = (accId: string, angle: number) => {
    const norm = (angle % 360 + 360) % 360;
    
    switch (accId) {
      case "protetor": // Protetor de Caçamba HD
        if (norm === 0) return { top: "40%", left: "62%", width: "25%", height: "9%", name: "Protetor de Caçamba HD", area: "Caçamba" };
        if (norm === 180) return { top: "40%", left: "13%", width: "25%", height: "9%", name: "Protetor de Caçamba HD", area: "Caçamba" };
        if (norm === 270) return { top: "45%", left: "22%", width: "56%", height: "22%", name: "Protetor de Caçamba HD", area: "Caçamba" };
        if (norm === 315) return { top: "44%", left: "40%", width: "36%", height: "17%", name: "Protetor de Caçamba HD", area: "Caçamba" };
        if (norm === 225) return { top: "44%", left: "24%", width: "36%", height: "17%", name: "Protetor de Caçamba HD", area: "Caçamba" };
        if (norm === 45) return { top: "45%", left: "66%", width: "22%", height: "12%", name: "Protetor de Caçamba HD", area: "Caçamba" };
        if (norm === 135) return { top: "45%", left: "12%", width: "22%", height: "12%", name: "Protetor de Caçamba HD", area: "Caçamba" };
        return { top: "42%", left: "60%", width: "22%", height: "10%", name: "Protetor de Caçamba HD", area: "Caçamba" };

      case "capota": // Capota Marítima Retrátil
        if (norm === 0) return { top: "37%", left: "61%", width: "27%", height: "7%", name: "Capota Marítima Retrátil", area: "Caçamba" };
        if (norm === 180) return { top: "37%", left: "12%", width: "27%", height: "7%", name: "Capota Marítima Retrátil", area: "Caçamba" };
        if (norm === 270) return { top: "42%", left: "20%", width: "60%", height: "12%", name: "Capota Marítima Retrátil", area: "Caçamba" };
        if (norm === 315) return { top: "39%", left: "39%", width: "38%", height: "14%", name: "Capota Marítima Retrátil", area: "Caçamba" };
        if (norm === 225) return { top: "39%", left: "23%", width: "38%", height: "14%", name: "Capota Marítima Retrátil", area: "Caçamba" };
        return { top: "39%", left: "60%", width: "24%", height: "9%", name: "Capota Marítima Retrátil", area: "Caçamba" };

      case "santantonio": // Santo Antônio Esportivo
        if (norm === 0) return { top: "30%", left: "56%", width: "12%", height: "18%", name: "Santo Antônio Esportivo", area: "Cabine" };
        if (norm === 180) return { top: "30%", left: "32%", width: "12%", height: "18%", name: "Santo Antônio Esportivo", area: "Cabine" };
        if (norm === 270) return { top: "32%", left: "26%", width: "48%", height: "18%", name: "Santo Antônio Esportivo", area: "Cabine" };
        if (norm === 315) return { top: "31%", left: "37%", width: "22%", height: "20%", name: "Santo Antônio Esportivo", area: "Cabine" };
        if (norm === 225) return { top: "31%", left: "41%", width: "22%", height: "20%", name: "Santo Antônio Esportivo", area: "Cabine" };
        return { top: "31%", left: "55%", width: "16%", height: "18%", name: "Santo Antônio Esportivo", area: "Cabine" };

      case "estribo": // Estribo Lateral Premium
        if (norm === 0) return { top: "64%", left: "33%", width: "38%", height: "6%", name: "Estribo Lateral Premium", area: "Lateral" };
        if (norm === 180) return { top: "64%", left: "29%", width: "38%", height: "6%", name: "Estribo Lateral Premium", area: "Lateral" };
        if (norm === 45) return { top: "65%", left: "37%", width: "33%", height: "6%", name: "Estribo Lateral Premium", area: "Lateral" };
        if (norm === 135) return { top: "65%", left: "30%", width: "33%", height: "6%", name: "Estribo Lateral Premium", area: "Lateral" };
        return { top: "64%", left: "34%", width: "34%", height: "6%", name: "Estribo Lateral Premium", area: "Lateral" };

      case "friso": // Friso Lateral Cromado
        if (norm === 0) return { top: "54%", left: "34%", width: "36%", height: "3%", name: "Friso Lateral Cromado", area: "Portas" };
        if (norm === 180) return { top: "54%", left: "30%", width: "36%", height: "3%", name: "Friso Lateral Cromado", area: "Portas" };
        if (norm === 45) return { top: "54%", left: "36%", width: "30%", height: "3%", name: "Friso Lateral Cromado", area: "Portas" };
        if (norm === 135) return { top: "54%", left: "34%", width: "30%", height: "3%", name: "Friso Lateral Cromado", area: "Portas" };
        return { top: "54%", left: "34%", width: "34%", height: "3%", name: "Friso Lateral Cromado", area: "Portas" };

      case "pneus": // Pneus All-Terrain / Highway
        if (norm === 0) return { top: "59%", left: "17%", width: "67%", height: "20%", name: "Pneus All-Terrain", area: "Rodas" };
        if (norm === 180) return { top: "59%", left: "16%", width: "67%", height: "20%", name: "Pneus All-Terrain", area: "Rodas" };
        if (norm === 90) return { top: "62%", left: "20%", width: "60%", height: "18%", name: "Pneus All-Terrain", area: "Rodas" };
        if (norm === 270) return { top: "62%", left: "20%", width: "60%", height: "18%", name: "Pneus All-Terrain", area: "Rodas" };
        return { top: "60%", left: "18%", width: "64%", height: "19%", name: "Pneus All-Terrain", area: "Rodas" };

      default:
        return { top: "50%", left: "50%", width: "20%", height: "10%", name: accId, area: "Veículo" };
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-8 app-container">
      <div className="max-w-7xl mx-auto fade-in">
        {/* Header */}
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="label-text text-sf-blue mb-1">Visualização Interativa 360° Multi-Ângulo</p>
            <h1 className="section-title">{clientData.vehicleModel} — {clientData.vehicleColor}</h1>
            <p className="text-muted-foreground text-xs mt-1">
              Ano: {clientData.vehicleYear} · Cliente: {clientData.clientName}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-sf-blue bg-sf-light-blue px-3 py-1.5 rounded-full border border-sf-blue/20">
              {currentAngleView.title}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Vehicle Display - Main Area */}
          <div className="lg:col-span-8">
            <div className="sf-card p-5 slide-up">
              <div
                className="relative aspect-video bg-gradient-to-b from-secondary/40 via-secondary/70 to-secondary rounded-lg overflow-hidden mb-4 border border-border/50 select-none"
              >
                {/* Floor shadow & studio stage lighting */}
                <div
                  className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[85%] h-[18%] bg-gradient-to-t from-foreground/25 to-transparent rounded-[50%] blur-xl transition-all duration-500"
                  style={{
                    transform: `translateX(-50%) scaleX(${0.9 + Math.abs(depth3D.scaleX) * 0.2})`,
                    opacity: 0.4,
                  }}
                />

                {/* Vehicle Multi-Angle Image */}
                <div
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out p-4 ${isRotating ? 'scale-[0.98] opacity-90' : 'scale-100 opacity-100'}`}
                >
                  <img
                    src={currentAngleView.image}
                    alt={`${clientData.vehicleModel} - ${currentAngleView.title}`}
                    className="max-h-full max-w-full object-contain transition-all duration-500 drop-shadow-2xl"
                    style={{
                      transform: currentAngleView.flip ? 'scaleX(-1)' : 'none',
                      filter: showAfter && selectedAccessories.length > 0
                        ? 'contrast(1.06) saturate(1.1)'
                        : 'contrast(0.98) saturate(0.95)',
                    }}
                  />
                </div>

                {/* DYNAMIC ACCESSORY OVERLAYS & REALISTIC TRUCK BED LINER (PROTETOR DE CAÇAMBA) */}
                {showAfter && selectedAccessories.length > 0 && (
                  <div className="absolute inset-0 pointer-events-none">
                    {selectedAccessories.map((acc) => {
                      const props = getAccessoryOverlayProps(acc.id, rotation);

                      // Render realistic truck bedliner armor overlay for "Protetor de Caçamba HD"
                      if (acc.id === "protetor") {
                        return (
                          <div
                            key={acc.id}
                            className="absolute transition-all duration-500 z-10"
                            style={{
                              top: props.top,
                              left: props.left,
                              width: props.width,
                              height: props.height,
                            }}
                          >
                            {/* Bedliner HD Armor Rim & Bed Coating Layer */}
                            <div className="w-full h-full rounded border-2 border-slate-900/80 bg-gradient-to-r from-slate-900/90 via-slate-800/80 to-slate-900/90 shadow-2xl backdrop-blur-[1px] relative overflow-hidden flex items-center justify-center">
                              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:4px_4px]" />
                              <span className="relative z-10 px-1.5 py-0.5 bg-sf-navy/95 text-white text-[9px] font-extrabold tracking-wider uppercase rounded shadow border border-amber-400/50 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                                🛡️ Protetor de Caçamba HD
                              </span>
                            </div>
                          </div>
                        );
                      }

                      // Render Retractable Bed Cover for "Capota Marítima Retrátil"
                      if (acc.id === "capota") {
                        return (
                          <div
                            key={acc.id}
                            className="absolute transition-all duration-500 z-10"
                            style={{
                              top: props.top,
                              left: props.left,
                              width: props.width,
                              height: props.height,
                            }}
                          >
                            <div className="w-full h-full rounded border-t-2 border-slate-950 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 shadow-2xl flex items-center justify-center">
                              <span className="px-1.5 py-0.5 bg-black/80 text-white text-[8px] font-bold uppercase rounded border border-slate-700">
                                🔒 Capota Marítima Retrátil
                              </span>
                            </div>
                          </div>
                        );
                      }

                      // Render Sports Bar for "Santo Antônio Esportivo"
                      if (acc.id === "santantonio") {
                        return (
                          <div
                            key={acc.id}
                            className="absolute transition-all duration-500 z-10"
                            style={{
                              top: props.top,
                              left: props.left,
                              width: props.width,
                              height: props.height,
                            }}
                          >
                            <div className="w-full h-full border-t-4 border-x-4 border-slate-800 rounded-t-lg bg-slate-900/30 flex items-center justify-center">
                              <span className="px-1.5 py-0.5 bg-slate-900/90 text-white text-[8px] font-bold uppercase rounded border border-amber-500/40">
                                🏋️ Santo Antônio
                              </span>
                            </div>
                          </div>
                        );
                      }

                      // Render Side Steps for "Estribo Lateral Premium"
                      if (acc.id === "estribo") {
                        return (
                          <div
                            key={acc.id}
                            className="absolute transition-all duration-500 z-10"
                            style={{
                              top: props.top,
                              left: props.left,
                              width: props.width,
                              height: props.height,
                            }}
                          >
                            <div className="w-full h-full rounded-full border-b-2 border-slate-400 bg-gradient-to-r from-slate-700 via-slate-300 to-slate-700 shadow-lg flex items-center justify-center">
                              <span className="px-1 py-0.5 bg-sf-navy text-white text-[8px] font-bold uppercase rounded">
                                🚗 Estribo Lateral
                              </span>
                            </div>
                          </div>
                        );
                      }

                      // Default Hotspot Callout Pin for other selected accessories
                      return (
                        <div
                          key={acc.id}
                          className="absolute transition-all duration-500 z-10"
                          style={{
                            top: props.top,
                            left: props.left,
                          }}
                        >
                          <div className="flex items-center gap-1 bg-sf-navy/90 text-white px-2 py-0.5 rounded text-[9px] font-bold shadow-lg border border-sf-blue/40 backdrop-blur">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            {acc.name}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Year Badge */}
                <div className="absolute top-3 left-3 bg-sf-navy/90 backdrop-blur text-primary-foreground px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow">
                  <Car className="w-3 h-3" />
                  {clientData.vehicleYear}
                </div>

                {/* 360 Badge */}
                <div className="absolute top-3 right-3 bg-sf-blue text-primary-foreground px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider shadow">
                  360° Real Angle View
                </div>

                {/* Before/After label */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 pointer-events-none z-20">
                  <div className={`px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest shadow-md transition-all ${showAfter ? 'bg-sf-blue text-primary-foreground ring-2 ring-sf-blue/30' : 'bg-slate-700 text-white'}`}>
                    {showAfter
                      ? `Depois — Com ${selectedAccessories.length} Acessórios Instalados`
                      : 'Antes — Original (Sem Acessórios)'}
                  </div>
                </div>

                {/* Rotation angle badge */}
                <div className="absolute bottom-3 left-3 bg-foreground/80 backdrop-blur text-primary-foreground px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 shadow z-20">
                  <Layers className="w-3.5 h-3.5" />
                  {rotation}° · {currentAngleView.title}
                </div>

                {/* Selected accessory tags overlay - strictly active in "Depois" mode */}
                {showAfter ? (
                  <div className="absolute bottom-3 right-3 flex flex-wrap justify-end gap-1.5 max-w-[65%] z-20">
                    {selectedAccessories.length > 0 ? (
                      <>
                        {selectedAccessories.map((acc) => (
                          <span
                            key={acc.id}
                            className="px-2.5 py-1 bg-sf-navy/90 border border-sf-blue/40 text-primary-foreground text-[10px] font-semibold rounded-md backdrop-blur shadow flex items-center gap-1 animate-fadeIn"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            {acc.name}
                          </span>
                        ))}
                      </>
                    ) : (
                      <span className="px-2.5 py-1 bg-amber-500/90 text-white text-[10px] font-semibold rounded-md backdrop-blur shadow">
                        Nenhum acessório selecionado
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="absolute bottom-3 right-3 bg-slate-800/80 backdrop-blur text-slate-200 text-[10px] font-medium px-2.5 py-1 rounded-md shadow z-20">
                    Versão Original de Fábrica
                  </div>
                )}
              </div>

              {/* Angle selector quick buttons bar */}
              <div className="mb-4">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Selecione o Ângulo de Visão:</p>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                  {ANGLES.map((deg) => {
                    const active = rotation === deg;
                    return (
                      <button
                        key={deg}
                        onClick={() => {
                          setIsAutoSpin(false);
                          setRotation(deg);
                        }}
                        className={`py-1.5 px-1 rounded text-center transition-all ${
                          active
                            ? 'bg-sf-blue text-primary-foreground font-bold shadow-md scale-105'
                            : 'bg-secondary hover:bg-secondary/80 text-foreground text-xs font-medium'
                        }`}
                      >
                        <span className="text-[11px] block">{deg}°</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Controls Bar */}
              <div className="flex items-center justify-between flex-wrap gap-3 border-t border-border/60 pt-3">
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

                {/* Rotate Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAutoSpin(!isAutoSpin)}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded border transition-colors ${
                      isAutoSpin
                        ? 'bg-amber-500 text-white border-amber-600'
                        : 'bg-secondary hover:bg-secondary/80 text-foreground border-border'
                    }`}
                  >
                    {isAutoSpin ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    {isAutoSpin ? 'Pausar Giro' : 'Giro Contínuo 360°'}
                  </button>

                  <button
                    onClick={handleRotateNext}
                    disabled={isRotating}
                    className="btn-primary flex items-center gap-2 text-sm px-5 disabled:opacity-70"
                  >
                    <RotateCw className={`w-4 h-4 transition-transform duration-500 ${isRotating ? 'rotate-180' : ''}`} />
                    Girar +45°
                  </button>
                </div>
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

