import { User, Car, MapPin, Sparkles, ArrowRight } from "lucide-react";
import { ClientData } from "@/types/accessories";
import VoiceInputButton from "./VoiceInputButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ClientDataScreenProps {
  clientData: ClientData;
  onClientDataChange: (data: ClientData) => void;
  onGenerateSuggestion: () => void;
}

// Opções para os dropdowns
const vehicleModels = [
  "RAM RAMPAGE REBEL",
  "RAM RAMPAGE LARAMIE",
  "RAM 1500 LARAMIE",
  "RAM 2500 LARAMIE",
  "RAM 3500 LARAMIE",
  "FIAT TORO RANCH",
  "FIAT TORO ULTRA",
  "JEEP COMPASS TRAILHAWK",
  "JEEP COMMANDER OVERLAND",
];

const vehicleColors = [
  { name: "Vermelho Volcano", color: "#B22222" },
  { name: "Preto Carbon", color: "#1a1a1a" },
  { name: "Branco Polar", color: "#f5f5f5" },
  { name: "Cinza Granite", color: "#5a5a5a" },
  { name: "Azul Patriot", color: "#1e3a5f" },
  { name: "Verde Recon", color: "#2d4a3e" },
];

const vehicleYears = [
  "2025/2026",
  "2024/2025",
  "2024/2024",
  "2023/2024",
  "2023/2023",
];

const states = [
  "Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal",
  "Espírito Santo", "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul",
  "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí",
  "Rio de Janeiro", "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia",
  "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins",
];

const terrainTypes = [
  "Estradas Pavimentadas",
  "Estradas de Terra",
  "Trilhas Off-Road",
  "Uso Misto (Urbano/Rural)",
  "Fazenda/Agronegócio",
];

const climateConditions = [
  "Alta Incidência de Chuvas",
  "Clima Seco",
  "Clima Tropical",
  "Clima Subtropical",
  "Temperaturas Extremas",
];

const ClientDataScreen = ({ clientData, onClientDataChange, onGenerateSuggestion }: ClientDataScreenProps) => {
  const handleChange = (field: keyof ClientData, value: string) => {
    onClientDataChange({ ...clientData, [field]: value });
  };

  const handleVoiceData = (extractedData: Partial<ClientData>) => {
    onClientDataChange({ ...clientData, ...extractedData });
  };

  const selectedColor = vehicleColors.find(c => c.name === clientData.vehicleColor);

  return (
    <div className="min-h-screen p-8 app-container">
      <div className="max-w-5xl mx-auto fade-in">
        {/* Header with Voice Input */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="section-title mb-2">Identificação do Cliente e Veículo</h1>
            <p className="text-muted-foreground">
              Preencha os dados ou use o microfone para falar as informações
            </p>
          </div>
          <VoiceInputButton onDataExtracted={handleVoiceData} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Vehicle Info */}
          <div className="card-premium p-6 slide-up" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-stellantis-blue flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Veículo</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label-text block mb-2">Modelo</label>
                <Select value={clientData.vehicleModel} onValueChange={(value) => handleChange("vehicleModel", value)}>
                  <SelectTrigger className="w-full font-medium">
                    <SelectValue placeholder="Selecione o modelo" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleModels.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="label-text block mb-2">Cor</label>
                <Select value={clientData.vehicleColor} onValueChange={(value) => handleChange("vehicleColor", value)}>
                  <SelectTrigger className="w-full font-medium">
                    <div className="flex items-center gap-3">
                      {selectedColor && (
                        <div 
                          className="w-6 h-6 rounded-full border-2 border-white shadow-md flex-shrink-0" 
                          style={{ backgroundColor: selectedColor.color }}
                        />
                      )}
                      <SelectValue placeholder="Selecione a cor" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleColors.map((color) => (
                      <SelectItem key={color.name} value={color.name}>
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-5 h-5 rounded-full border border-border" 
                            style={{ backgroundColor: color.color }}
                          />
                          {color.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="label-text block mb-2">Ano/Modelo</label>
                <Select value={clientData.vehicleYear} onValueChange={(value) => handleChange("vehicleYear", value)}>
                  <SelectTrigger className="w-full font-medium">
                    <SelectValue placeholder="Selecione o ano" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleYears.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Client Info */}
          <div className="card-premium p-6 slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-stellantis-blue flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Cliente</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label-text block mb-2">Nome Completo</label>
                <input
                  type="text"
                  value={clientData.clientName}
                  onChange={(e) => handleChange("clientName", e.target.value)}
                  className="input-field w-full font-medium"
                  placeholder="Nome do cliente"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-text block mb-2">Idade</label>
                  <input
                    type="text"
                    value={clientData.clientAge}
                    onChange={(e) => handleChange("clientAge", e.target.value)}
                    className="input-field w-full font-medium"
                    placeholder="Ex: 35"
                  />
                </div>
                <div>
                  <label className="label-text block mb-2">Gênero</label>
                  <input
                    type="text"
                    value={clientData.clientGender}
                    onChange={(e) => handleChange("clientGender", e.target.value)}
                    className="input-field w-full font-medium"
                    placeholder="Ex: Masculino"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Region Info */}
          <div className="card-premium p-6 lg:col-span-2 slide-up" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-stellantis-blue flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Região de Uso</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="label-text block mb-2">Estado</label>
                <Select value={clientData.state} onValueChange={(value) => handleChange("state", value)}>
                  <SelectTrigger className="w-full font-medium">
                    <SelectValue placeholder="Selecione o estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="label-text block mb-2">Tipo de Terreno</label>
                <Select value={clientData.terrainType} onValueChange={(value) => handleChange("terrainType", value)}>
                  <SelectTrigger className="w-full font-medium">
                    <SelectValue placeholder="Selecione o terreno" />
                  </SelectTrigger>
                  <SelectContent>
                    {terrainTypes.map((terrain) => (
                      <SelectItem key={terrain} value={terrain}>
                        {terrain}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="label-text block mb-2">Condição Climática</label>
                <Select value={clientData.climateCondition} onValueChange={(value) => handleChange("climateCondition", value)}>
                  <SelectTrigger className="w-full font-medium">
                    <SelectValue placeholder="Selecione o clima" />
                  </SelectTrigger>
                  <SelectContent>
                    {climateConditions.map((climate) => (
                      <SelectItem key={climate} value={climate}>
                        {climate}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-lg bg-accent/10 border border-accent/20">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-ram-red flex-shrink-0 mt-0.5" />
                <p className="text-sm text-foreground">
                  <strong className="text-ram-red">Análise Regional:</strong> A região do {clientData.state || "..."} apresenta alta 
                  demanda por acessórios de proteção e performance off-road devido às condições de estradas 
                  não pavimentadas e clima tropical com chuvas intensas.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8 flex justify-center slide-up" style={{ animationDelay: "0.4s" }}>
          <button
            onClick={onGenerateSuggestion}
            className="btn-accent flex items-center gap-3 text-lg px-10 py-4 pulse-glow"
          >
            <Sparkles className="w-6 h-6" />
            Gerar Sugestão de IA
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientDataScreen;
