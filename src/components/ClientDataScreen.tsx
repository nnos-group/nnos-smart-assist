import { User, Car, MapPin, Sparkles, ArrowRight } from "lucide-react";

interface ClientDataScreenProps {
  onGenerateSuggestion: () => void;
}

const ClientDataScreen = ({ onGenerateSuggestion }: ClientDataScreenProps) => {
  return (
    <div className="min-h-screen p-8 app-container">
      <div className="max-w-5xl mx-auto fade-in">
        {/* Header */}
        <div className="mb-8">
          <h1 className="section-title mb-2">Identificação do Cliente e Veículo</h1>
          <p className="text-muted-foreground">
            Preencha os dados para gerar sugestões personalizadas de acessórios
          </p>
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
                <div className="input-field bg-secondary/80 font-medium">
                  RAM RAMPAGE REBEL
                </div>
              </div>
              <div>
                <label className="label-text block mb-2">Cor</label>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-ram-red border-2 border-white shadow-md"></div>
                  <span className="input-field bg-secondary/80 flex-1 font-medium">
                    Vermelho Volcano
                  </span>
                </div>
              </div>
              <div>
                <label className="label-text block mb-2">Ano/Modelo</label>
                <div className="input-field bg-secondary/80 font-medium">
                  2024/2025
                </div>
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
                <div className="input-field bg-secondary/80 font-medium">
                  João Silva
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-text block mb-2">Idade</label>
                  <div className="input-field bg-secondary/80 font-medium">
                    35 anos
                  </div>
                </div>
                <div>
                  <label className="label-text block mb-2">Gênero</label>
                  <div className="input-field bg-secondary/80 font-medium">
                    Masculino
                  </div>
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
                <div className="input-field bg-secondary/80 font-medium">
                  Mato Grosso
                </div>
              </div>
              <div>
                <label className="label-text block mb-2">Tipo de Terreno</label>
                <div className="input-field bg-secondary/80 font-medium">
                  Estradas de Terra / Rural
                </div>
              </div>
              <div>
                <label className="label-text block mb-2">Condição Climática</label>
                <div className="input-field bg-secondary/80 font-medium">
                  Alta Incidência de Chuvas
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-lg bg-accent/10 border border-accent/20">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-ram-red flex-shrink-0 mt-0.5" />
                <p className="text-sm text-foreground">
                  <strong className="text-ram-red">Análise Regional:</strong> A região do Mato Grosso apresenta alta 
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
