import React, { useState } from "react";
import LoginScreen from "@/components/LoginScreen";
import NavigationBar, { ViewportDevice } from "@/components/NavigationBar";
import SuccessModal from "@/components/SuccessModal";
import { ReheatedLeadsModal } from "@/components/ReheatedLeadsModal";
import LostSalesDashboard from "@/components/LostSalesDashboard";
import { SalesJourneyProvider, useSalesJourney } from "@/context/SalesJourneyContext";
import { SalesJourneyStepper } from "@/components/SalesJourneyStepper";
import { Tablet, Smartphone, RotateCcw } from "lucide-react";

// 7 Etapas Consultivas
import { ConsultativeDiscoveryChecklist } from "@/components/ConsultativeDiscoveryChecklist";
import { RecommendationReviewScreen } from "@/components/RecommendationReviewScreen";
import VehicleVisualizationScreen from "@/components/VehicleVisualizationScreen";
import { AccessoryExplanationScreen } from "@/components/AccessoryExplanationScreen";
import { PricePresentationScreen } from "@/components/PricePresentationScreen";
import { NegotiationAssistantScreen } from "@/components/NegotiationAssistantScreen";
import { ClosingScreen } from "@/components/ClosingScreen";
import { ReheatedLead } from "@/types/leads";
import { UserRole } from "@/types/salesJourney";

const InnerSalesJourney = () => {
  const {
    state,
    currentStepIndex,
    availableAccessories,
    toggleAccessory,
    prevStep,
    nextStep,
    resetJourney,
    loadLeadForReheating,
    setUserSession,
  } = useSalesJourney();

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return typeof window !== "undefined" && Boolean(sessionStorage.getItem("smart_sell_auth_token"));
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showReheatedLeadsModal, setShowReheatedLeadsModal] = useState(false);
  const [showLostSalesDashboard, setShowLostSalesDashboard] = useState(false);
  const [viewportDevice, setViewportDevice] = useState<ViewportDevice>("desktop");

  // Garante que ao mudar de etapa o usuário sempre visualize o topo da tela
  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }
  }, [state.currentStep]);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleSessionReady = (role: UserRole, dealership: string) => {
    setUserSession({ role, dealership });
  };

  const handleLogout = () => {
    sessionStorage.removeItem("smart_sell_auth_token");
    sessionStorage.removeItem("smart_sell_sales_journey_v2");
    sessionStorage.removeItem("smart_sell_user_session");
    setIsLoggedIn(false);
    resetJourney("showroom");
  };

  const handleNewSale = () => {
    setShowSuccessModal(false);
    resetJourney("showroom");
  };

  const handleSaleWon = () => {
    setShowSuccessModal(true);
  };

  const handleResumeLead = (lead: ReheatedLead) => {
    loadLeadForReheating(lead);
    setShowReheatedLeadsModal(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background">
        <LoginScreen onLogin={handleLoginSuccess} onSessionReady={handleSessionReady} />
      </div>
    );
  }

  // Mapeamento dos acessórios com o status de seleção do estado central
  const mappedAccessories = availableAccessories.map((acc) => ({
    ...acc,
    selected: state.selectedAccessoryIds.includes(acc.id),
  }));

  const renderCurrentStep = () => (
    <div className="screen-transition">
      {/* Etapa 1: Entender o cliente */}
      {state.currentStep === "customer-understanding" && (
        <ConsultativeDiscoveryChecklist
          onOpenReheatedLeads={() => setShowReheatedLeadsModal(true)}
        />
      )}

      {/* Etapa 2: Recomendar acessórios */}
      {state.currentStep === "accessory-recommendation" && <RecommendationReviewScreen />}

      {/* Etapa 3: Mostrar no veículo */}
      {state.currentStep === "vehicle-visualization" && (
        <VehicleVisualizationScreen
          accessories={mappedAccessories}
          clientData={state.clientData}
          onAccessoryToggle={toggleAccessory}
          consultativeMode={true}
          onProceedToExplanation={nextStep}
          onBack={prevStep}
        />
      )}

      {/* Etapa 4: Explicar os acessórios */}
      {state.currentStep === "accessory-explanation" && <AccessoryExplanationScreen />}

      {/* Etapa 5: Apresentar o preço (Investimento) */}
      {state.currentStep === "price-presentation" && <PricePresentationScreen />}

      {/* Etapa 6: Negociar */}
      {state.currentStep === "negotiation" && <NegotiationAssistantScreen />}

      {/* Etapa 7: Fechar a venda */}
      {state.currentStep === "closing" && (
        <ClosingScreen
          onSaleWon={handleSaleWon}
          onOpenReheatedLeads={() => setShowReheatedLeadsModal(true)}
        />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Navigation Bar Corporativo com Seletor de Simulação */}
      <NavigationBar
        currentStep={currentStepIndex + 1}
        onBack={prevStep}
        onLogout={handleLogout}
        showBack={state.currentStep !== "customer-understanding"}
        onOpenReheatedLeads={() => setShowReheatedLeadsModal(true)}
        onOpenLostSales={() => setShowLostSalesDashboard(true)}
        hideLegacyStepper={true}
        currentDevice={viewportDevice}
        onDeviceChange={setViewportDevice}
      />

      {/* Visualização de acordo com o dispositivo simulado */}
      {viewportDevice === "desktop" && (
        <>
          {/* Stepper das 7 Etapas da Jornada Consultiva */}
          <SalesJourneyStepper />

          {/* Conteúdo da Etapa Atual */}
          <main className="flex-1 max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
            {renderCurrentStep()}
          </main>
        </>
      )}

      {viewportDevice === "tablet" && (
        <div className="flex-1 w-full bg-slate-200/90 py-6 px-4 flex flex-col items-center overflow-x-auto">
          <div className="mb-4 flex items-center gap-2.5 text-xs font-bold text-slate-700 bg-white/95 px-4 py-1.5 rounded-full shadow-md border border-slate-300">
            <Tablet className="w-4 h-4 text-sky-600" />
            <span>Simulação de Tela: Tablet (iPad 768px)</span>
            <button
              type="button"
              onClick={() => setViewportDevice("desktop")}
              className="ml-2 text-xs font-extrabold text-sky-600 hover:text-sky-800 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Restaurar Computador
            </button>
          </div>

          {/* Moldura Tablet */}
          <div className="w-full max-w-[768px] bg-slate-950 p-4 rounded-[36px] shadow-2xl border-4 border-slate-700 ring-2 ring-slate-900/50">
            <div className="bg-slate-100 rounded-[24px] overflow-hidden min-h-[820px] flex flex-col shadow-inner">
              <SalesJourneyStepper />
              <main className="flex-1 w-full p-4">
                {renderCurrentStep()}
              </main>
            </div>
          </div>
        </div>
      )}

      {viewportDevice === "mobile" && (
        <div className="flex-1 w-full bg-slate-200/90 py-6 px-4 flex flex-col items-center overflow-x-auto">
          <div className="mb-4 flex items-center gap-2.5 text-xs font-bold text-slate-700 bg-white/95 px-4 py-1.5 rounded-full shadow-md border border-slate-300">
            <Smartphone className="w-4 h-4 text-sky-600" />
            <span>Simulação de Tela: Celular (iPhone 390px)</span>
            <button
              type="button"
              onClick={() => setViewportDevice("desktop")}
              className="ml-2 text-xs font-extrabold text-sky-600 hover:text-sky-800 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Restaurar Computador
            </button>
          </div>

          {/* Moldura Celular */}
          <div className="w-full max-w-[400px] bg-slate-950 p-3 pt-4 rounded-[48px] shadow-2xl border-4 border-slate-700 ring-2 ring-slate-900/50">
            {/* Dynamic Island */}
            <div className="w-24 h-4 bg-black rounded-full mx-auto mb-3 shadow-inner" />
            <div className="bg-slate-100 rounded-[36px] overflow-hidden min-h-[800px] flex flex-col shadow-inner">
              <SalesJourneyStepper />
              <main className="flex-1 w-full p-3">
                {renderCurrentStep()}
              </main>
            </div>
          </div>
        </div>
      )}

      {/* Modais Gerenciais & Retargeting */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        onNewSale={handleNewSale}
      />

      <ReheatedLeadsModal
        isOpen={showReheatedLeadsModal}
        onClose={() => setShowReheatedLeadsModal(false)}
        onResumeLead={handleResumeLead}
      />

      <LostSalesDashboard
        isOpen={showLostSalesDashboard}
        onClose={() => setShowLostSalesDashboard(false)}
      />
    </div>
  );
};

const Index = () => {
  return (
    <SalesJourneyProvider>
      <InnerSalesJourney />
    </SalesJourneyProvider>
  );
};

export default Index;
