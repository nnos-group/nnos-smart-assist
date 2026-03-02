import { Package, Check, Sparkles, Eye, ArrowRight, User, MapPin, Car, Clock, AlertTriangle, TrendingDown, PercentIcon } from "lucide-react";
import { Accessory, ClientData, getPackageName, getStockInfo } from "@/types/accessories";

interface PackageSuggestionScreenProps {
  accessories: Accessory[];
  clientData: ClientData;
  onAccessoryToggle: (id: string) => void;
  onVisualize: () => void;
}

const StockBadge = ({ status, days }: { status: string; days: number }) => {
  if (status === "dormant") {
    return (
      <span className="badge-dormant flex items-center gap-1">
        <Clock className="w-3 h-3" />
        Dormente · {days}d
      </span>
    );
  }
  if (status === "obsolete") {
    return (
      <span className="badge-obsolete flex items-center gap-1">
        <AlertTriangle className="w-3 h-3" />
        Obsoleto · {Math.round(days / 30)}m
      </span>
    );
  }
  return (
    <span className="badge-available">
      Em estoque
    </span>
  );
};

const PackageSuggestionScreen = ({ accessories, clientData, onAccessoryToggle, onVisualize }: PackageSuggestionScreenProps) => {
  const selectedAccessories = accessories.filter((item) => item.selected);
  
  // Calcular preços com desconto
  const getDiscountedPrice = (item: Accessory) => {
    return Math.round(item.price * (1 - item.discountPercent / 100));
  };
  
  const total = selectedAccessories.reduce((sum, item) => sum + getDiscountedPrice(item), 0);
  const totalOriginal = selectedAccessories.reduce((sum, item) => sum + item.price, 0);
  const totalSavings = totalOriginal - total;
  const packageName = getPackageName(clientData.vehicleModel);

  const dormantCount = accessories.filter(a => a.stockStatus === "dormant").length;
  const obsoleteCount = accessories.filter(a => a.stockStatus === "obsolete").length;

  return (
    <div className="min-h-screen p-6 md:p-8 app-container">
      <div className="max-w-5xl mx-auto fade-in">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-ram-red" />
            <span className="label-text text-ram-red">
              Recomendação Personalizada
            </span>
          </div>
          <h1 className="section-title">Pacote de Acessórios Recomendado pela IA</h1>
        </div>

        {/* Client Info Summary */}
        <div className="card-glass p-4 mb-6 slide-up">
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-stellantis-blue" />
              <span className="text-muted-foreground">Cliente:</span>
              <span className="font-semibold text-foreground">{clientData.clientName || "Não informado"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-stellantis-blue" />
              <span className="text-muted-foreground">Veículo:</span>
              <span className="font-semibold text-foreground">{clientData.vehicleModel} - {clientData.vehicleColor}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-stellantis-blue" />
              <span className="text-muted-foreground">Região:</span>
              <span className="font-semibold text-foreground">{clientData.state || "Não informado"}</span>
            </div>
          </div>
        </div>

        {/* Stock Alert Banner */}
        {(dormantCount > 0 || obsoleteCount > 0) && (
          <div className="card-premium p-4 mb-6 slide-up border-l-4" style={{ borderLeftColor: "hsl(var(--amber))", animationDelay: "0.05s" }}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "hsl(var(--amber) / 0.12)" }}
              >
                <TrendingDown className="w-5 h-5" style={{ color: "hsl(var(--amber))" }} />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-sm mb-1">📊 Análise de Estoque da Concessionária</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  A IA identificou {dormantCount > 0 && <><strong className="text-foreground">{dormantCount} itens em estoque dormente</strong> (&gt;180 dias) </>}
                  {dormantCount > 0 && obsoleteCount > 0 && "e "}
                  {obsoleteCount > 0 && <><strong className="text-foreground">{obsoleteCount} itens obsoletos</strong> (&gt;1 ano) </>}
                  neste pacote. Descontos automáticos aplicados para otimizar o giro de estoque.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Package Card */}
          <div className="lg:col-span-2 space-y-4">
            {/* Package Header */}
            <div className="card-premium p-6 slide-up border-l-4 border-l-ram-red" style={{ animationDelay: "0.05s" }}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{ background: "var(--gradient-accent)" }}
                >
                  <Package className="w-7 h-7 text-accent-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground font-display">
                    {packageName}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Otimizado para região: <span className="font-semibold text-stellantis-blue">{clientData.state || "Brasil"}</span>
                    {clientData.terrainType && <span> • {clientData.terrainType}</span>}
                  </p>
                </div>
              </div>
            </div>

            {/* Accessories List */}
            <div className="card-premium p-6 slide-up" style={{ animationDelay: "0.1s" }}>
              <h3 className="label-text mb-4">Selecione os Acessórios para {clientData.vehicleModel}</h3>
              <div className="space-y-3">
                {accessories.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => onAccessoryToggle(item.id)}
                    className={`accessory-card slide-up w-full text-left transition-all duration-200 ${
                      item.selected 
                        ? "ring-2 ring-primary/40 bg-primary/5" 
                        : "opacity-60 hover:opacity-80"
                    }`}
                    style={{ animationDelay: `${0.15 + index * 0.05}s` }}
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-colors flex-shrink-0 ${
                        item.selected ? "bg-secondary" : "bg-secondary/50"
                      }`}>
                        {item.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className={`font-semibold text-sm ${item.selected ? "text-foreground" : "text-muted-foreground"}`}>
                            {item.name}
                          </h4>
                          <StockBadge status={item.stockStatus} days={item.stockDays} />
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                      <div className="text-right">
                        {item.discountPercent > 0 ? (
                          <>
                            <span className="text-xs text-muted-foreground line-through block">
                              R$ {item.price.toLocaleString("pt-BR")}
                            </span>
                            <span className={`text-base font-bold ${item.selected ? "text-stellantis-blue" : "text-muted-foreground"}`}>
                              R$ {getDiscountedPrice(item).toLocaleString("pt-BR")}
                            </span>
                            <span className="discount-tag ml-1">
                              -{item.discountPercent}%
                            </span>
                          </>
                        ) : (
                          <span className={`text-base font-bold ${item.selected ? "text-stellantis-blue" : "text-muted-foreground"}`}>
                            R$ {item.price.toLocaleString("pt-BR")}
                          </span>
                        )}
                      </div>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                        item.selected ? "bg-emerald-100" : "bg-secondary"
                      }`}>
                        <Check className={`w-4 h-4 ${item.selected ? "text-emerald-600" : "text-muted-foreground/30"}`} />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Card */}
          <div className="lg:col-span-1">
            <div className="card-premium p-6 sticky top-20 slide-up" style={{ animationDelay: "0.2s" }}>
              <h3 className="label-text mb-4">Resumo do Pacote</h3>
              
              <div className="space-y-2.5 mb-6">
                {accessories.map((item) => (
                  <div key={item.id} className={`flex justify-between text-sm transition-opacity ${
                    item.selected ? "opacity-100" : "opacity-30 line-through"
                  }`}>
                    <span className="text-muted-foreground truncate max-w-[55%]">
                      {item.name}
                    </span>
                    <div className="text-right">
                      {item.discountPercent > 0 && item.selected ? (
                        <span className="font-medium text-foreground">
                          R$ {getDiscountedPrice(item).toLocaleString("pt-BR")}
                        </span>
                      ) : (
                        <span className="font-medium text-foreground">
                          R$ {item.price.toLocaleString("pt-BR")}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 mb-4">
                {totalSavings > 0 && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-muted-foreground">Desconto estoque</span>
                    <span className="text-sm font-bold" style={{ color: "hsl(var(--emerald))" }}>
                      - R$ {totalSavings.toLocaleString("pt-BR")}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-foreground">Total</span>
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

              {/* Stock Legend */}
              <div className="p-3 rounded-xl bg-secondary/40 mb-6 space-y-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Legenda de Estoque</p>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "hsl(var(--emerald))" }} />
                  <span>Disponível — Sem desconto</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "hsl(var(--amber))" }} />
                  <span>Dormente (&gt;180d) — 10-20% desc.</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "hsl(var(--orange-stock))" }} />
                  <span>Obsoleto (&gt;1 ano) — 25-35% desc.</span>
                </div>
              </div>

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
