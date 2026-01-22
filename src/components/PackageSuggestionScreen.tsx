import { Package, Check, Sparkles, Eye, ArrowRight } from "lucide-react";

interface PackageSuggestionScreenProps {
  onVisualize: () => void;
}

const accessories = [
  {
    name: "Estribo Lateral Premium",
    description: "Acesso facilitado e proteção lateral",
    price: 2500,
    icon: "🚗",
  },
  {
    name: "Protetor de Caçamba HD",
    description: "Proteção contra riscos e impactos",
    price: 1200,
    icon: "🛡️",
  },
  {
    name: "Pneus All-Terrain 265/70R16",
    description: "Tração superior em qualquer terreno",
    price: 4800,
    icon: "⚙️",
  },
  {
    name: "Friso Lateral Cromado",
    description: "Proteção e estética refinada",
    price: 450,
    icon: "✨",
  },
];

const PackageSuggestionScreen = ({ onVisualize }: PackageSuggestionScreenProps) => {
  const total = accessories.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen p-8 app-container">
      <div className="max-w-5xl mx-auto fade-in">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-ram-red" />
            <span className="text-sm font-medium text-ram-red uppercase tracking-wider">
              Recomendação Personalizada
            </span>
          </div>
          <h1 className="section-title">Pacote de Acessórios Recomendado pela IA</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Package Card */}
          <div className="lg:col-span-2 space-y-4">
            {/* Package Header */}
            <div className="card-premium p-6 slide-up border-l-4 border-l-ram-red">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-ram-red flex items-center justify-center shadow-lg">
                  <Package className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Pacote Off-Road Pro
                  </h2>
                  <p className="text-muted-foreground">
                    Otimizado para região: <span className="font-semibold text-stellantis-blue">Mato Grosso</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Accessories List */}
            <div className="card-premium p-6 slide-up" style={{ animationDelay: "0.1s" }}>
              <h3 className="label-text mb-4">Acessórios Incluídos</h3>
              <div className="space-y-3">
                {accessories.map((item, index) => (
                  <div
                    key={item.name}
                    className="accessory-card slide-up"
                    style={{ animationDelay: `${0.15 + index * 0.05}s` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-2xl">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-stellantis-blue">
                        R$ {item.price.toLocaleString("pt-BR")}
                      </span>
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Card */}
          <div className="lg:col-span-1">
            <div className="card-premium p-6 sticky top-8 slide-up" style={{ animationDelay: "0.2s" }}>
              <h3 className="label-text mb-4">Resumo do Pacote</h3>
              
              <div className="space-y-3 mb-6">
                {accessories.map((item) => (
                  <div key={item.name} className="flex justify-between text-sm">
                    <span className="text-muted-foreground truncate max-w-[60%]">
                      {item.name}
                    </span>
                    <span className="font-medium text-foreground">
                      R$ {item.price.toLocaleString("pt-BR")}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-foreground">Total</span>
                  <span className="text-2xl font-bold text-ram-red">
                    R$ {total.toLocaleString("pt-BR")}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  ou 12x de R$ {Math.ceil(total / 12).toLocaleString("pt-BR")}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-green-50 border border-green-200 mb-6">
                <p className="text-sm text-green-800 font-medium">
                  💰 Economia de R$ 1.200 em relação aos itens avulsos
                </p>
              </div>

              <button
                onClick={onVisualize}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <Eye className="w-5 h-5" />
                Visualizar no Veículo
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageSuggestionScreen;
