import { useState, useEffect } from "react";
import LoginScreen from "@/components/LoginScreen";
import ClientDataScreen from "@/components/ClientDataScreen";
import PackageSuggestionScreen from "@/components/PackageSuggestionScreen";
import VehicleVisualizationScreen from "@/components/VehicleVisualizationScreen";
import SalesScriptScreen from "@/components/SalesScriptScreen";
import NavigationBar from "@/components/NavigationBar";
import SuccessModal from "@/components/SuccessModal";
import { ReheatedLeadsModal } from "@/components/ReheatedLeadsModal";
import LostSalesDashboard from "@/components/LostSalesDashboard";
import { Accessory, ClientData, ClientSource, defaultClientData, getAccessoriesForVehicle } from "@/types/accessories";
import { ReheatedLead } from "@/types/leads";

type Screen = "login" | "data" | "package" | "visualization" | "script";

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("login");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showReheatedLeadsModal, setShowReheatedLeadsModal] = useState(false);
  const [showLostSalesDashboard, setShowLostSalesDashboard] = useState(false);
  const [clientSource, setClientSource] = useState<ClientSource>("live");
  const [clientData, setClientData] = useState<ClientData>(defaultClientData);
  const [accessories, setAccessories] = useState<Accessory[]>(getAccessoriesForVehicle(defaultClientData.vehicleModel));

  // Atualizar acessórios quando o modelo do veículo mudar
  useEffect(() => {
    setAccessories(getAccessoriesForVehicle(clientData.vehicleModel));
  }, [clientData.vehicleModel]);

  const handleAccessoryToggle = (id: string) => {
    setAccessories((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const getStepNumber = (): number => {
    switch (currentScreen) {
      case "data":
        return 1;
      case "package":
        return 2;
      case "visualization":
      case "script":
        return 3;
      default:
        return 0;
    }
  };

  const handleBack = () => {
    switch (currentScreen) {
      case "data":
        setCurrentScreen("login");
        break;
      case "package":
        setCurrentScreen("data");
        break;
      case "visualization":
        setCurrentScreen("package");
        break;
      case "script":
        setCurrentScreen("visualization");
        break;
    }
  };

  const handleLogout = () => {
    setCurrentScreen("login");
    setClientData(defaultClientData);
    setAccessories(getAccessoriesForVehicle(defaultClientData.vehicleModel));
    setClientSource("live");
  };

  const handleNewSale = () => {
    setShowSuccessModal(false);
    setClientData(defaultClientData);
    setAccessories(getAccessoriesForVehicle(defaultClientData.vehicleModel));
    setClientSource("live");
    setCurrentScreen("data");
  };

  const handleCloseSale = () => {
    setShowSuccessModal(true);
  };

  const handleResumeLead = (lead: ReheatedLead) => {
    setClientData(lead.clientData);
    setAccessories(lead.selectedAccessories);
    setClientSource("crm");
    setCurrentScreen("visualization");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar - Only show when not on login */}
      {currentScreen !== "login" && (
        <NavigationBar
          currentStep={getStepNumber()}
          onBack={handleBack}
          onLogout={handleLogout}
          showBack={currentScreen !== "data"}
          onOpenReheatedLeads={() => setShowReheatedLeadsModal(true)}
          onOpenLostSales={() => setShowLostSalesDashboard(true)}
        />
      )}

      {/* Screens */}
      <div className="screen-transition">
        {currentScreen === "login" && (
          <LoginScreen onLogin={() => setCurrentScreen("data")} />
        )}

        {currentScreen === "data" && (
          <ClientDataScreen
            clientData={clientData}
            onClientDataChange={setClientData}
            onGenerateSuggestion={() => setCurrentScreen("package")}
          />
        )}

        {currentScreen === "package" && (
          <PackageSuggestionScreen
            accessories={accessories}
            clientData={clientData}
            clientSource={clientSource}
            onAccessoryToggle={handleAccessoryToggle}
            onVisualize={() => setCurrentScreen("visualization")}
            onBack={handleBack}
          />
        )}

        {currentScreen === "visualization" && (
          <VehicleVisualizationScreen
            accessories={accessories}
            clientData={clientData}
            onAccessoryToggle={handleAccessoryToggle}
            onGenerateScript={() => setCurrentScreen("script")}
            onAddToProposal={handleCloseSale}
            onBack={handleBack}
          />
        )}

        {currentScreen === "script" && (
          <SalesScriptScreen 
            clientData={clientData}
            accessories={accessories}
            clientSource={clientSource}
            onClose={handleCloseSale} 
            onBack={() => setCurrentScreen("visualization")}
          />
        )}
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        onNewSale={handleNewSale}
      />

      {/* Reheated Leads Modal (CRM Retargeting) */}
      <ReheatedLeadsModal
        isOpen={showReheatedLeadsModal}
        onClose={() => setShowReheatedLeadsModal(false)}
        onResumeLead={handleResumeLead}
      />

      {/* Lost Sales Dashboard (Pareto Analysis) */}
      <LostSalesDashboard
        isOpen={showLostSalesDashboard}
        onClose={() => setShowLostSalesDashboard(false)}
      />
    </div>
  );
};

export default Index;
