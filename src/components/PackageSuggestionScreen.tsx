import { Package, Check, Sparkles, Eye, ArrowRight } from "lucide-react";
import { Accessory } from "@/types/accessories";

interface PackageSuggestionScreenProps {
  accessories: Accessory[];
  onAccessoryToggle: (id: string) => void;
  onVisualize: () => void;
}

const PackageSuggestionScreen = ({ accessories, onAccessoryToggle, onVisualize }: PackageSuggestionScreenProps) => {
  const selectedAccessories = accessories.filter((item) => item.selected);
  const total = selectedAccessories.reduce((sum, item) => sum + item.price, 0);
  const fullTotal = accessories.reduce((sum, item) => sum + item.price, 0);
  const savings = fullTotal === total ? 1200 : Math.round((fullTotal - total) * 0.13);

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
              <h3 className="label-text mb-4">Selecione os Acessórios</h3>
              <div className="space-y-3">
                {accessories.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => onAccessoryToggle(item.id)}
                    className={`accessory-card slide-up w-full text-left transition-all duration-200 ${
                      item.selected 
                        ? "ring-2 ring-primary bg-primary/5" 
                        : "opacity-60 hover:opacity-80"
                    }`}
                    style={{ animationDelay: `${0.15 + index * 0.05}s` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl transition-colors ${
                        item.selected ? "bg-secondary" : "bg-secondary/50"
                      }`}>
                        {item.icon}
                      </div>
                      <div>
                        <h4 className={`font-semibold ${item.selected ? "text-foreground" : "text-muted-foreground"}`}>
                          {item.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-lg font-bold ${item.selected ? "text-stellantis-blue" : "text-muted-foreground"}`}>
                        R$ {item.price.toLocaleString("pt-BR")}
                      </span>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                        item.selected ? "bg-green-100" : "bg-secondary"
                      }`}>
                        <Check className={`w-4 h-4 ${item.selected ? "text-green-600" : "text-muted-foreground/30"}`} />
                      </div>
                    </div>
                  </button>
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
                  <div key={item.id} className={`flex justify-between text-sm transition-opacity ${
                    item.selected ? "opacity-100" : "opacity-40 line-through"
                  }`}>
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
                {selectedAccessories.length < accessories.length && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {selectedAccessories.length} de {accessories.length} itens selecionados
                  </p>
                )}
              </div>

              {selectedAccessories.length === accessories.length && (
                <div className="p-4 rounded-lg bg-green-50 border border-green-200 mb-6">
                  <p className="text-sm text-green-800 font-medium">
                    💰 Economia de R$ {savings.toLocaleString("pt-BR")} em relação aos itens avulsos
                  </p>
                </div>
              )}

              <button
                onClick={onVisualize}
                disabled={selectedAccessories.length === 0}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
