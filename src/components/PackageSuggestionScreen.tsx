import { Package, Check, Sparkles, Eye, ArrowRight, User, MapPin, Car, Clock, AlertTriangle, TrendingDown } from "lucide-react";
import { Accessory, ClientData, getPackageName, getStockInfo } from "@/types/accessories";

interface PackageSuggestionScreenProps {
  accessories: Accessory[];
  clientData: ClientData;
  onAccessoryToggle: (id: string) => void;
  onVisualize: () => void;
}

const StockBadge = ({ status, days }: {status: string;days: number;}) => {
  if (status === "dormant") {
    return (
      <span className="badge-dormant flex items-center gap-1">
        <Clock className="w-3 h-3" />
        Dormente · {days}d
      </span>);

  }
  if (status === "obsolete") {
    return (
      <span className="badge-obsolete flex items-center gap-1">
        <AlertTriangle className="w-3 h-3" />
        Obsoleto · {Math.round(days / 30)}m
      </span>);

  }
  return <span className="badge-available">Em estoque</span>;
};

const PackageSuggestionScreen = ({ accessories, clientData, onAccessoryToggle, onVisualize }: PackageSuggestionScreenProps) => {
  const selectedAccessories = accessories.filter((item) => item.selected);

  const getDiscountedPrice = (item: Accessory) => {
    return Math.round(item.price * (1 - item.discountPercent / 100));
  };

  const total = selectedAccessories.reduce((sum, item) => sum + getDiscountedPrice(item), 0);
  const totalOriginal = selectedAccessories.reduce((sum, item) => sum + item.price, 0);
  const totalSavings = totalOriginal - total;
  const packageName = getPackageName(clientData.vehicleModel);

  const dormantCount = accessories.filter((a) => a.stockStatus === "dormant").length;
  const obsoleteCount = accessories.filter((a) => a.stockStatus === "obsolete").length;

  return (
    <div className="min-h-screen p-6 md:p-8 app-container">
      <div className="max-w-5xl mx-auto fade-in">
        {/* Header */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-sf-blue" />
            <span className="label-text text-sf-blue">Recomendação Personalizada</span>
          </div>
          <h1 className="section-title">Pacote de Acessórios Recomendado</h1>
        </div>

        {/* Client Info Summary */}
        <div className="sf-card p-3 mb-5 slide-up">
          <div className="flex flex-wrap items-center gap-5 text-sm">
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-sf-blue" />
              <span className="text-muted-foreground">Cliente:</span>
              <span className="font-medium text-foreground">{clientData.clientName || "Não informado"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Car className="w-3.5 h-3.5 text-sf-blue" />
              <span className="text-muted-foreground">Veículo:</span>
              <span className="font-medium text-foreground">{clientData.vehicleModel} - {clientData.vehicleColor}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-sf-blue" />
              <span className="text-muted-foreground">Região:</span>
              <span className="font-medium text-foreground">{clientData.state || "Não informado"}</span>
            </div>
          </div>
        </div>

        {/* Stock Alert Banner */}
        {(dormantCount > 0 || obsoleteCount > 0) &&
        <div className="sf-card p-3 mb-5 slide-up border-l-4" style={{ borderLeftColor: "hsl(var(--amber))", animationDelay: "0.05s" }}>
            <div className="flex items-start gap-3">
              <TrendingDown className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "hsl(var(--amber))" }} />
              <div>
                <h3 className="font-semibold text-foreground text-xs mb-0.5">Análise de Estoque da Concessionária</h3>
                <p className="text-xs text-muted-foreground">
                  {dormantCount > 0 && <><strong className="text-foreground">{dormantCount} itens em estoque dormente</strong> (&gt;180 dias) </>}
                  {dormantCount > 0 && obsoleteCount > 0 && "e "}
                  {obsoleteCount > 0 && <><strong className="text-foreground">{obsoleteCount} itens obsoletos</strong> (&gt;1 ano) </>}
                  — Descontos automáticos aplicados.
                </p>
              </div>
            </div>
          </div>
        }

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Accessories List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Package Header */}
            <div className="sf-card p-4 slide-up border-l-4 border-l-accent" style={{ animationDelay: "0.05s" }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-sf-blue flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">{packageName}</h2>
                  <p className="text-xs text-muted-foreground">
                    Região: <span className="font-medium text-sf-blue">{clientData.state || "Brasil"}</span>
                    {clientData.terrainType && <span> · {clientData.terrainType}</span>}
                  </p>
                </div>
              </div>
            </div>

            {/* Accessories Table */}
            <div className="sf-card slide-up" style={{ animationDelay: "0.1s" }}>
              <div className="px-4 py-3 border-b border-border">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                  Selecione os Acessórios — {clientData.vehicleModel}
                </h3>
              </div>
              <div className="divide-y divide-border">
                {accessories.map((item, index) =>
                <button
                  key={item.id}
                  onClick={() => onAccessoryToggle(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors duration-150 ${
                  item.selected ?
                  "bg-sf-light-blue" :
                  index % 2 === 0 ?
                  "bg-card hover:bg-secondary/50" :
                  "bg-secondary/30 hover:bg-secondary/60"}`
                  }>
                  
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                    item.selected ? "bg-sf-blue border-accent text-primary-foreground" : "border-border bg-card"}`
                    }>
                        {item.selected && <Check className="w-3 h-3" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-sm font-medium ${item.selected ? "text-foreground" : "text-muted-foreground"}`}>
                            {item.name}
                          </span>
                          <StockBadge status={item.stockStatus} days={item.stockDays} />
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                      {item.discountPercent > 0 ?
                    <div className="text-right">
                          <span className="text-xs text-muted-foreground line-through block">
                            R$ {item.price.toLocaleString("pt-BR")}
                          </span>
                          <span className={`text-sm font-bold ${item.selected ? "text-sf-blue" : "text-muted-foreground"}`}>
                            R$ {getDiscountedPrice(item).toLocaleString("pt-BR")}
                          </span>
                          <span className="discount-tag ml-1">-{item.discountPercent}%</span>
                        </div> :

                    <span className={`text-sm font-bold ${item.selected ? "text-sf-blue" : "text-muted-foreground"}`}>
                          R$ {item.price.toLocaleString("pt-BR")}
                        </span>
                    }
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sf-card p-4 sticky top-16 slide-up" style={{ animationDelay: "0.2s" }}>
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">Resumo do Pacote</h3>

              <div className="space-y-2 mb-4">
                {accessories.map((item) =>
                <div key={item.id} className={`flex justify-between text-xs transition-opacity ${
                item.selected ? "opacity-100" : "opacity-30 line-through"}`
                }>
                    <span className="text-muted-foreground truncate max-w-[55%]">{item.name}</span>
                    <span className="font-medium text-foreground">
                      R$ {(item.selected && item.discountPercent > 0 ? getDiscountedPrice(item) : item.price).toLocaleString("pt-BR")}
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t border-border pt-3 mb-4">
                {totalSavings > 0 &&
                <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-muted-foreground">Economia estoque</span>
                    <span className="text-xs font-bold" style={{ color: "hsl(var(--emerald))" }}>
                      - R$ {totalSavings.toLocaleString("pt-BR")}
                    </span>
                  </div>
                }
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-foreground">Total</span>
                  <span className="text-xl font-bold text-sf-blue">
                    R$ {total.toLocaleString("pt-BR")}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  ou 12x de R$ {Math.ceil(total / 12).toLocaleString("pt-BR")}
                </p>
                {selectedAccessories.length < accessories.length &&
                <p className="text-[11px] text-muted-foreground mt-1">
                    {selectedAccessories.length} de {accessories.length} itens selecionados
                  </p>
                }
              </div>

              {/* Stock Legend */}
              <div className="p-2.5 rounded bg-secondary mb-4 space-y-1.5">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Legenda</p>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "hsl(var(--emerald))" }} />
                  Disponível — Sem desconto
                </div>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "hsl(var(--amber))" }} />
                  Dormente (&gt;180d) — 10-20%
                </div>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "hsl(var(--orange-stock))" }} />
                  Obsoleto (&gt;1 ano) — 25-35%
                </div>
              </div>

              <button
                onClick={onVisualize}
                disabled={selectedAccessories.length === 0}
                className="btn-primary w-full flex items-center justify-center gap-2 text-sm h-10 disabled:opacity-50 disabled:cursor-not-allowed">
                
                <Eye className="w-4 h-4" />
                Visualizar no Veículo
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>);

};

export default PackageSuggestionScreen;