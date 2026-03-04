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

const vehicleModels = [
  "RAM RAMPAGE REBEL", "RAM RAMPAGE LARAMIE", "RAM 1500 LARAMIE",
  "RAM 2500 LARAMIE", "RAM 3500 LARAMIE", "FIAT TORO RANCH",
  "FIAT TORO ULTRA", "JEEP COMPASS TRAILHAWK", "JEEP COMMANDER OVERLAND",
];

const vehicleColors = [
  { name: "Vermelho Volcano", color: "#B22222" },
  { name: "Preto Carbon", color: "#1a1a1a" },
  { name: "Branco Polar", color: "#f5f5f5" },
  { name: "Cinza Granite", color: "#5a5a5a" },
  { name: "Azul Patriot", color: "#1e3a5f" },
  { name: "Verde Recon", color: "#2d4a3e" },
];

const vehicleYears = ["2025/2026", "2024/2025", "2024/2024", "2023/2024", "2023/2023"];

const states = [
  "Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal",
  "Espírito Santo", "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul",
  "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí",
  "Rio de Janeiro", "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia",
  "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins",
];

const terrainTypes = [
  "Estradas Pavimentadas", "Estradas de Terra", "Trilhas Off-Road",
  "Uso Misto (Urbano/Rural)", "Fazenda/Agronegócio",
];

const climateConditions = [
  "Alta Incidência de Chuvas", "Clima Seco", "Clima Tropical",
  "Clima Subtropical", "Temperaturas Extremas",
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
    <div className="min-h-screen p-6 md:p-8 app-container">
      <div className="max-w-5xl mx-auto fade-in">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="section-title mb-1">Identificação do Cliente</h1>
            <p className="text-muted-foreground text-sm">
              Preencha os dados ou use o microfone para auto-preenchimento
            </p>
          </div>
          <VoiceInputButton onDataExtracted={handleVoiceData} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Vehicle Section */}
          <div className="sf-card p-5 slide-up" style={{ animationDelay: "0.05s" }}>
            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-border">
              <Car className="w-4 h-4 text-sf-blue" />
              <h2 className="text-sm font-bold text-foreground">Veículo</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-foreground block mb-1.5">Modelo</label>
                <Select value={clientData.vehicleModel} onValueChange={(v) => handleChange("vehicleModel", v)}>
                  <SelectTrigger className="w-full h-9 rounded text-sm">
                    <SelectValue placeholder="Selecione o modelo" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleModels.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1.5">Cor</label>
                <Select value={clientData.vehicleColor} onValueChange={(v) => handleChange("vehicleColor", v)}>
                  <SelectTrigger className="w-full h-9 rounded text-sm">
                    <div className="flex items-center gap-2">
                      {selectedColor && (
                        <div className="w-4 h-4 rounded-full border border-border flex-shrink-0" 
                          style={{ backgroundColor: selectedColor.color }} />
                      )}
                      <SelectValue placeholder="Selecione a cor" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleColors.map((c) => (
                      <SelectItem key={c.name} value={c.name}>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full border border-border" style={{ backgroundColor: c.color }} />
                          {c.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1.5">Ano/Modelo</label>
                <Select value={clientData.vehicleYear} onValueChange={(v) => handleChange("vehicleYear", v)}>
                  <SelectTrigger className="w-full h-9 rounded text-sm">
                    <SelectValue placeholder="Selecione o ano" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleYears.map((y) => (
                      <SelectItem key={y} value={y}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Client Section */}
          <div className="sf-card p-5 slide-up" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-border">
              <User className="w-4 h-4 text-sf-blue" />
              <h2 className="text-sm font-bold text-foreground">Cliente</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-foreground block mb-1.5">Nome Completo</label>
                <input type="text" value={clientData.clientName}
                  onChange={(e) => handleChange("clientName", e.target.value)}
                  className="input-field h-9 text-sm" placeholder="Nome do cliente" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-foreground block mb-1.5">Idade</label>
                  <input type="text" value={clientData.clientAge}
                    onChange={(e) => handleChange("clientAge", e.target.value)}
                    className="input-field h-9 text-sm" placeholder="Ex: 35" />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground block mb-1.5">Gênero</label>
                  <input type="text" value={clientData.clientGender}
                    onChange={(e) => handleChange("clientGender", e.target.value)}
                    className="input-field h-9 text-sm" placeholder="Ex: Masculino" />
                </div>
              </div>
            </div>
          </div>

          {/* Region Section - Full Width */}
          <div className="sf-card p-5 lg:col-span-2 slide-up" style={{ animationDelay: "0.15s" }}>
            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-border">
              <MapPin className="w-4 h-4 text-sf-blue" />
              <h2 className="text-sm font-bold text-foreground">Região de Uso</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-foreground block mb-1.5">Estado</label>
                <Select value={clientData.state} onValueChange={(v) => handleChange("state", v)}>
                  <SelectTrigger className="w-full h-9 rounded text-sm">
                    <SelectValue placeholder="Selecione o estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1.5">Tipo de Terreno</label>
                <Select value={clientData.terrainType} onValueChange={(v) => handleChange("terrainType", v)}>
                  <SelectTrigger className="w-full h-9 rounded text-sm">
                    <SelectValue placeholder="Selecione o terreno" />
                  </SelectTrigger>
                  <SelectContent>
                    {terrainTypes.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1.5">Condição Climática</label>
                <Select value={clientData.climateCondition} onValueChange={(v) => handleChange("climateCondition", v)}>
                  <SelectTrigger className="w-full h-9 rounded text-sm">
                    <SelectValue placeholder="Selecione o clima" />
                  </SelectTrigger>
                  <SelectContent>
                    {climateConditions.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-5 p-3 rounded bg-sf-light-blue border border-border">
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-sf-blue flex-shrink-0 mt-0.5" />
                <p className="text-xs text-foreground leading-relaxed">
                  <strong className="text-sf-blue">Análise Regional:</strong> A região do {clientData.state || "..."} apresenta alta 
                  demanda por acessórios de proteção e performance off-road.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="mt-6 flex justify-center slide-up" style={{ animationDelay: "0.25s" }}>
          <button onClick={onGenerateSuggestion} className="btn-primary flex items-center gap-2 text-sm px-8 py-3">
            <Sparkles className="w-4 h-4" />
            Gerar Sugestão de Acessórios
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientDataScreen;
