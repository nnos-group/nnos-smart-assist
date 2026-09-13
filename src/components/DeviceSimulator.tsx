import React, { useState, useEffect, useRef } from "react";
import {
  Tablet,
  Smartphone,
  RotateCw,
  RotateCcw,
  ArrowUp,
  Monitor,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
  Check,
  Compass,
} from "lucide-react";
import { ViewportDevice } from "./NavigationBar";

export type DeviceOrientation = "portrait" | "landscape";

interface DeviceSimulatorProps {
  device: "tablet" | "mobile";
  onDeviceChange: (device: ViewportDevice) => void;
  children: React.ReactNode;
}

export const DeviceSimulator: React.FC<DeviceSimulatorProps> = ({
  device,
  onDeviceChange,
  children,
}) => {
  const [orientation, setOrientation] = useState<DeviceOrientation>("portrait");
  const [zoomLevel, setZoomLevel] = useState<number>(0.85); // Padrão 85% para visualização confortável em laptops
  const [currentTime, setCurrentTime] = useState<string>("09:41");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Atualiza a hora da status bar em tempo real
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Alterna orientação retrato / paisagem
  const toggleOrientation = () => {
    setOrientation((prev) => (prev === "portrait" ? "landscape" : "portrait"));
  };

  // Rola suavemente até o topo da tela do dispositivo
  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Dimensões do iPad Pro 11"
  const isTablet = device === "tablet";
  const isLandscape = orientation === "landscape";

  // Dimensões da tela útil
  let screenWidth = 768;
  let screenHeight = 1024;

  if (isTablet) {
    screenWidth = isLandscape ? 1024 : 768;
    screenHeight = isLandscape ? 768 : 1024;
  } else {
    // iPhone 15 Pro (393 × 852px)
    screenWidth = isLandscape ? 852 : 393;
    screenHeight = isLandscape ? 393 : 852;
  }

  const bezelSize = isTablet ? 14 : 12;
  const frameWidth = screenWidth + bezelSize * 2;
  const frameHeight = screenHeight + bezelSize * 2;
  const cornerRadius = isTablet ? 30 : 50;
  const screenCornerRadius = isTablet ? 18 : 40;

  return (
    <div
      className="flex-1 w-full min-h-[calc(100vh-64px)] flex flex-col items-center select-none overflow-x-hidden"
      style={{
        background: "radial-gradient(ellipse at 50% 15%, #1e293b 0%, #0f172a 65%, #020617 100%)",
        backgroundImage: `
          radial-gradient(circle at 50% 20%, rgba(14, 165, 233, 0.12) 0%, transparent 60%),
          radial-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px)
        `,
        backgroundSize: "100% 100%, 24px 24px",
        padding: "24px 16px 80px",
      }}
    >
      {/* =========================================================================
          STUDIO CONTROL BAR — Barra de Ferramentas Flutuante de Alta Fidelidade
          ========================================================================= */}
      <nav
        aria-label="Controles do Simulador de Dispositivo"
        className="relative z-50 mb-8 flex flex-wrap items-center justify-center gap-3 px-4 py-2.5 rounded-2xl border border-white/15 bg-slate-900/90 backdrop-blur-2xl shadow-2xl transition-all"
        style={{
          boxShadow: "0 10px 40px -10px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* Seletor de Aparelho */}
        <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl border border-white/10">
          <button
            type="button"
            onClick={() => onDeviceChange("tablet")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              isTablet
                ? "bg-sky-500 text-white shadow-md shadow-sky-500/25"
                : "text-slate-300 hover:text-white hover:bg-white/10"
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>iPad Pro</span>
            <span className="text-[10px] opacity-75 font-normal">
              {isLandscape ? "1024×768" : "768×1024"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onDeviceChange("mobile")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              !isTablet
                ? "bg-sky-500 text-white shadow-md shadow-sky-500/25"
                : "text-slate-300 hover:text-white hover:bg-white/10"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>iPhone 15</span>
            <span className="text-[10px] opacity-75 font-normal">
              {isLandscape ? "852×393" : "393×852"}
            </span>
          </button>
        </div>

        <div className="h-5 w-px bg-white/15 hidden sm:block" />

        {/* Girar Orientação (Paisagem / Retrato) */}
        <button
          type="button"
          onClick={toggleOrientation}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-bold text-slate-200 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
          title={`Alternar orientação atual (${isLandscape ? "Paisagem" : "Retrato"})`}
        >
          <RotateCw className="w-3.5 h-3.5 text-sky-400" />
          <span>{isLandscape ? "Paisagem (Horizontal)" : "Retrato (Vertical)"}</span>
        </button>

        <div className="h-5 w-px bg-white/15 hidden sm:block" />

        {/* Controles de Zoom / Escala */}
        <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl border border-white/10 text-xs font-bold text-slate-300">
          <button
            type="button"
            onClick={() => setZoomLevel((prev) => Math.max(0.65, Number((prev - 0.1).toFixed(2))))}
            disabled={zoomLevel <= 0.65}
            className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            title="Diminuir Zoom"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="px-1.5 min-w-[42px] text-center text-white font-mono text-[11px]">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoomLevel((prev) => Math.min(1.0, Number((prev + 0.1).toFixed(2))))}
            disabled={zoomLevel >= 1.0}
            className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            title="Aumentar Zoom"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel(zoomLevel === 0.85 ? 1.0 : 0.85)}
            className="px-2 py-1 ml-1 rounded-md bg-white/10 hover:bg-white/20 text-[10px] text-sky-300 hover:text-sky-200 cursor-pointer"
            title="Alternar entre escala 85% e 100%"
          >
            {zoomLevel === 1.0 ? "Ajustar 85%" : "100% Real"}
          </button>
        </div>

        <div className="h-5 w-px bg-white/15 hidden sm:block" />

        {/* Ações Rápidas: Voltar ao Topo & Sair */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-semibold text-slate-200 hover:text-white transition-all cursor-pointer"
            title="Rolar conteúdo para o topo"
          >
            <ArrowUp className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Topo</span>
          </button>

          <button
            type="button"
            onClick={() => onDeviceChange("desktop")}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/30 text-xs font-bold text-sky-300 hover:text-sky-100 transition-all cursor-pointer active:scale-95"
          >
            <Monitor className="w-3.5 h-3.5 text-sky-400" />
            <span>Voltar ao Computador</span>
          </button>
        </div>
      </nav>

      {/* =========================================================================
          DEVICE HARDWARE FRAME (iPad Pro 11" ou iPhone 15 Pro)
          ========================================================================= */}
      <div
        className="transition-transform duration-300 origin-top flex justify-center"
        style={{
          transform: `scale(${zoomLevel})`,
          marginBottom: `calc(-${frameHeight * (1 - zoomLevel)}px + 32px)`,
        }}
      >
        <div
          id="device-hardware-frame"
          style={{
            width: `${frameWidth}px`,
            height: `${frameHeight}px`,
            borderRadius: `${cornerRadius}px`,
            padding: `${bezelSize}px`,
            background:
              "linear-gradient(145deg, #374151 0%, #1f2937 35%, #111827 70%, #1f2937 100%)",
            boxShadow: `
              0 0 0 1.5px rgba(255, 255, 255, 0.18),
              0 0 0 3px rgba(15, 23, 42, 0.8),
              0 25px 60px -15px rgba(0, 0, 0, 0.85),
              0 40px 100px -20px rgba(14, 165, 233, 0.25)
            `,
            position: "relative",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Botões físicos de hardware decorativos */}
          {isTablet ? (
            <>
              {/* Botões de Volume iPad (lado superior esquerdo) */}
              <div
                style={{
                  position: "absolute",
                  left: "-5px",
                  top: "60px",
                  width: "5px",
                  height: "36px",
                  borderRadius: "3px 0 0 3px",
                  background: "linear-gradient(to left, #1f2937, #4b5563)",
                  boxShadow: "-2px 0 5px rgba(0,0,0,0.5)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: "-5px",
                  top: "105px",
                  width: "5px",
                  height: "36px",
                  borderRadius: "3px 0 0 3px",
                  background: "linear-gradient(to left, #1f2937, #4b5563)",
                  boxShadow: "-2px 0 5px rgba(0,0,0,0.5)",
                }}
              />
              {/* Botão Power iPad (topo direito) */}
              <div
                style={{
                  position: "absolute",
                  right: "60px",
                  top: "-5px",
                  height: "5px",
                  width: "50px",
                  borderRadius: "3px 3px 0 0",
                  background: "linear-gradient(to top, #1f2937, #4b5563)",
                  boxShadow: "0 -2px 5px rgba(0,0,0,0.5)",
                }}
              />
            </>
          ) : (
            <>
              {/* Botão Ação iPhone (lado esquerdo) */}
              <div
                style={{
                  position: "absolute",
                  left: "-4px",
                  top: "100px",
                  width: "4px",
                  height: "26px",
                  borderRadius: "3px 0 0 3px",
                  background: "linear-gradient(to left, #1f2937, #4b5563)",
                }}
              />
              {/* Volume Up / Down iPhone */}
              <div
                style={{
                  position: "absolute",
                  left: "-4px",
                  top: "145px",
                  width: "4px",
                  height: "46px",
                  borderRadius: "3px 0 0 3px",
                  background: "linear-gradient(to left, #1f2937, #4b5563)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: "-4px",
                  top: "205px",
                  width: "4px",
                  height: "46px",
                  borderRadius: "3px 0 0 3px",
                  background: "linear-gradient(to left, #1f2937, #4b5563)",
                }}
              />
              {/* Botão Liga/Desliga iPhone (lado direito) */}
              <div
                style={{
                  position: "absolute",
                  right: "-4px",
                  top: "160px",
                  width: "4px",
                  height: "75px",
                  borderRadius: "0 3px 3px 0",
                  background: "linear-gradient(to right, #1f2937, #4b5563)",
                }}
              />
            </>
          )}

          {/* =========================================================================
              SCREEN GLASS AREA (A tela visível e interativa)
              ========================================================================= */}
          <div
            id="device-screen-inner"
            style={{
              width: `${screenWidth}px`,
              height: `${screenHeight}px`,
              borderRadius: `${screenCornerRadius}px`,
              overflow: "hidden",
              background: "#F8FAFC",
              boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)",
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            {/* =====================================================================
                STATUS BAR NATIVA (iPadOS ou iOS com Dynamic Island)
                ===================================================================== */}
            {isTablet ? (
              // iPadOS Status Bar
              <header
                aria-label="Barra de status iPadOS"
                className="bg-[#F8FAFC]/95 border-b border-slate-200/60 shrink-0 px-5 py-2 flex items-center justify-between text-slate-800 text-xs font-semibold select-none backdrop-blur-md z-30"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs tracking-tight">{currentTime}</span>
                  <span className="text-[10px] text-slate-400 font-normal">Dom, 13 de Set</span>
                </div>

                {/* Câmera Frontal TrueDepth centralizada no topo */}
                <div
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle at 35% 35%, #374151, #030712)",
                    boxShadow: "0 0 0 1.5px rgba(0,0,0,0.1), inset 0 1px 2px rgba(0,0,0,0.8)",
                  }}
                  title="Câmera Frontal TrueDepth"
                />

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-500">5G</span>
                  {/* Wi-Fi Icon */}
                  <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
                    <path
                      d="M7.5 2.5C9.8 2.5 11.9 3.4 13.4 5L14.5 3.8C12.7 2 10.2 1 7.5 1C4.8 1 2.3 2 0.5 3.8L1.6 5C3.1 3.4 5.2 2.5 7.5 2.5Z"
                      fill="#1e293b"
                    />
                    <circle cx="7.5" cy="9.5" r="1.5" fill="#1e293b" />
                  </svg>
                  {/* Battery Icon */}
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] font-bold">100%</span>
                    <div className="w-5 h-2.5 rounded-xs border border-slate-800 p-0.5 flex items-center">
                      <div className="w-full h-full bg-emerald-500 rounded-2xs" />
                    </div>
                  </div>
                </div>
              </header>
            ) : (
              // iOS iPhone Status Bar com Dynamic Island
              <header
                aria-label="Barra de status iOS com Dynamic Island"
                className="bg-[#F8FAFC]/95 shrink-0 pt-2 pb-1 px-6 select-none z-30"
              >
                {/* Dynamic Island */}
                {!isLandscape && (
                  <div className="flex justify-center mb-1">
                    <div
                      style={{
                        width: "115px",
                        height: "32px",
                        borderRadius: "18px",
                        background: "#000000",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0 10px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                      }}
                    >
                      <div
                        style={{
                          width: "9px",
                          height: "9px",
                          borderRadius: "50%",
                          background: "#0f172a",
                          boxShadow: "inset 0 1px 2px rgba(255,255,255,0.15)",
                        }}
                      />
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: "radial-gradient(circle, #1e3a8a 30%, #030712 100%)",
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-slate-900 text-xs font-bold">
                  <span>{currentTime}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 font-bold">5G</span>
                    <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
                      <path
                        d="M7.5 2.5C9.8 2.5 11.9 3.4 13.4 5L14.5 3.8C12.7 2 10.2 1 7.5 1C4.8 1 2.3 2 0.5 3.8L1.6 5C3.1 3.4 5.2 2.5 7.5 2.5Z"
                        fill="#0f172a"
                      />
                      <circle cx="7.5" cy="9.5" r="1.5" fill="#0f172a" />
                    </svg>
                    <div className="w-5 h-2.5 rounded-xs border border-slate-900 p-0.5 flex items-center">
                      <div className="w-full h-full bg-emerald-500 rounded-2xs" />
                    </div>
                  </div>
                </div>
              </header>
            )}

            {/* =====================================================================
                APP CONTENT — Conteúdo Real Rolável da Aplicação
                ===================================================================== */}
            <div
              ref={scrollContainerRef}
              data-device-viewport={device}
              data-device-orientation={orientation}
              className="flex-1 w-full overflow-y-auto relative scroll-smooth device-scroll-area"
              style={{
                WebkitOverflowScrolling: "touch",
              }}
            >
              {children}
            </div>

            {/* =====================================================================
                HOME INDICATOR (Barra inferior nativa do iOS/iPadOS)
                ===================================================================== */}
            <footer
              aria-label="Home Indicator"
              className="bg-[#F8FAFC] py-2 flex justify-center items-center shrink-0 select-none z-30"
            >
              <div
                style={{
                  width: isTablet ? "130px" : "110px",
                  height: "4px",
                  borderRadius: "2px",
                  background: "rgba(15, 23, 42, 0.25)",
                }}
              />
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceSimulator;
