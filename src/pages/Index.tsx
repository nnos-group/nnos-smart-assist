import React, { useState } from "react";
import LoginScreen from "@/components/LoginScreen";
import NavigationBar, { ViewportDevice } from "@/components/NavigationBar";
import SuccessModal from "@/components/SuccessModal";
import { ReheatedLeadsModal } from "@/components/ReheatedLeadsModal";
import LostSalesDashboard from "@/components/LostSalesDashboard";
import { SalesJourneyProvider, useSalesJourney } from "@/context/SalesJourneyContext";
import { SalesJourneyStepper } from "@/components/SalesJourneyStepper";
import { DeviceSimulator } from "@/components/DeviceSimulator";

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
    document.querySelectorAll(".device-scroll-area, [data-device-viewport]").forEach((el) => {
      (el as HTMLElement).scrollTop = 0;
      (el as HTMLElement).scrollTo?.({ top: 0, left: 0, behavior: "instant" });
    });
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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
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

      {/* Simulador Avançado de Dispositivos (iPad Pro & iPhone 15 Pro) */}
      {viewportDevice !== "desktop" && (
        <DeviceSimulator
          device={viewportDevice}
          onDeviceChange={setViewportDevice}
          currentStep={state.currentStep}
        >
          {/* Stepper Consultivo Adaptativo */}
          <SalesJourneyStepper />

          {/* Conteúdo Renderizado da Etapa Atual */}
          <main key={state.currentStep} className="flex-1 w-full p-3 sm:p-5">
            {renderCurrentStep()}
          </main>
        </DeviceSimulator>
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
