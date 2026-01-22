import { useState } from "react";
import LoginScreen from "@/components/LoginScreen";
import ClientDataScreen from "@/components/ClientDataScreen";
import PackageSuggestionScreen from "@/components/PackageSuggestionScreen";
import VehicleVisualizationScreen from "@/components/VehicleVisualizationScreen";
import SalesScriptScreen from "@/components/SalesScriptScreen";
import NavigationBar from "@/components/NavigationBar";
import SuccessModal from "@/components/SuccessModal";

type Screen = "login" | "data" | "package" | "visualization" | "script";

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("login");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const getStepNumber = (): number => {
    switch (currentScreen) {
      case "data":
        return 1;
      case "package":
        return 2;
      case "visualization":
        return 3;
      case "script":
        return 4;
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
  };

  const handleNewSale = () => {
    setShowSuccessModal(false);
    setCurrentScreen("data");
  };

  const handleCloseSale = () => {
    setShowSuccessModal(true);
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
        />
      )}

      {/* Screens */}
      <div className="screen-transition">
        {currentScreen === "login" && (
          <LoginScreen onLogin={() => setCurrentScreen("data")} />
        )}

        {currentScreen === "data" && (
          <ClientDataScreen
            onGenerateSuggestion={() => setCurrentScreen("package")}
          />
        )}

        {currentScreen === "package" && (
          <PackageSuggestionScreen
            onVisualize={() => setCurrentScreen("visualization")}
          />
        )}

        {currentScreen === "visualization" && (
          <VehicleVisualizationScreen
            onGenerateScript={() => setCurrentScreen("script")}
          />
        )}

        {currentScreen === "script" && (
          <SalesScriptScreen onClose={handleCloseSale} />
        )}
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        onNewSale={handleNewSale}
      />
    </div>
  );
};

export default Index;
