import { MessageSquare, CheckCircle, ArrowRight, Sparkles, Award, User, MapPin, Car, Package } from "lucide-react";
import { Accessory, ClientData, getPackageName } from "@/types/accessories";
import { useMemo } from "react";

interface SalesScriptScreenProps {
  clientData: ClientData;
  accessories: Accessory[];
  onClose: () => void;
}

const SalesScriptScreen = ({ clientData, accessories, onClose }: SalesScriptScreenProps) => {
  const selectedAccessories = accessories.filter((a) => a.selected);
  const totalPrice = selectedAccessories.reduce((sum, a) => sum + a.price, 0);
  const packageName = getPackageName(clientData.vehicleModel);

  // Gerar argumentos dinamicamente baseados nos acessórios selecionados
  const dynamicArguments = useMemo(() => {
    const args: Array<{
      title: string;
      items: string[];
      content: string;
      icon: string;
    }> = [];

    // Agrupar acessórios por categoria/benefício
    const protectionItems = selectedAccessories.filter(a => 
      ["protetor", "friso", "santantonio", "capota"].includes(a.id)
    );
    const performanceItems = selectedAccessories.filter(a => 
      ["pneus", "estribo", "guincho", "engate"].includes(a.id)
    );
    const utilityItems = selectedAccessories.filter(a => 
      ["rack", "toolbox", "sensor", "farol"].includes(a.id)
    );

    if (protectionItems.length > 0) {
      args.push({
        title: "Proteção do Investimento",
        items: protectionItems.map(a => a.name),
        content: `${protectionItems.map(a => a.name).join(" e ")} ${protectionItems.length > 1 ? 'são essenciais' : 'é essencial'} para proteger seu ${clientData.vehicleModel} das condições encontradas em ${clientData.state || "sua região"}. ${clientData.terrainType ? `Especialmente para uso em ${clientData.terrainType.toLowerCase()}, ` : ''}esses itens preservam o valor de revenda do veículo.`,
        icon: "🛡️",
      });
    }

    if (performanceItems.length > 0) {
      args.push({
        title: "Performance e Segurança",
        items: performanceItems.map(a => a.name),
        content: `Para as condições de ${clientData.terrainType || "uso diversificado"} em ${clientData.state || "sua região"}, ${performanceItems.map(a => a.name).join(" e ")} ${performanceItems.length > 1 ? 'garantem' : 'garante'} máxima segurança e desempenho. ${clientData.climateCondition ? `Considerando o ${clientData.climateCondition.toLowerCase()}, ` : ''}essa configuração é ideal para sua rotina.`,
        icon: "⚡",
      });
    }

    if (utilityItems.length > 0) {
      args.push({
        title: "Praticidade e Funcionalidade",
        items: utilityItems.map(a => a.name),
        content: `${utilityItems.map(a => a.name).join(" e ")} ${utilityItems.length > 1 ? 'trazem' : 'traz'} praticidade ao dia a dia com seu ${clientData.vehicleModel}. São acessórios que fazem diferença no uso real do veículo.`,
        icon: "🔧",
      });
    }

    // Se não houver argumentos categorizados, criar argumento genérico
    if (args.length === 0 && selectedAccessories.length > 0) {
      args.push({
        title: "Pacote Completo",
        items: selectedAccessories.map(a => a.name),
        content: `O ${packageName} foi especialmente configurado para o ${clientData.vehicleModel} considerando seu perfil de uso em ${clientData.state || "sua região"}. Cada item foi selecionado para maximizar sua experiência.`,
        icon: "📦",
      });
    }

    return args;
  }, [selectedAccessories, clientData, packageName]);

  const firstName = clientData.clientName.split(" ")[0] || "Cliente";
  const genderPrefix = clientData.clientGender?.toLowerCase().includes("fem") ? "Sra." : "Sr.";

  return (
    <div className="min-h-screen p-8 app-container">
      <div className="max-w-4xl mx-auto fade-in">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-5 h-5 text-ram-red" />
            <span className="text-sm font-medium text-ram-red uppercase tracking-wider">
              Script de Vendas Gerado por IA
            </span>
          </div>
          <h1 className="section-title">Argumentação Consultiva</h1>
          <p className="text-muted-foreground mt-1">
            Script personalizado para o consultor F&I
          </p>
        </div>

        {/* Client & Vehicle Summary */}
        <div className="card-premium p-4 mb-6 slide-up bg-gradient-to-r from-secondary/50 to-background">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-stellantis-blue" />
              <div>
                <span className="text-muted-foreground text-xs block">Cliente</span>
                <span className="font-semibold text-foreground">{clientData.clientName}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-stellantis-blue" />
              <div>
                <span className="text-muted-foreground text-xs block">Veículo</span>
                <span className="font-semibold text-foreground">{clientData.vehicleModel}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-stellantis-blue" />
              <div>
                <span className="text-muted-foreground text-xs block">Região</span>
                <span className="font-semibold text-foreground">{clientData.state}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-stellantis-blue" />
              <div>
                <span className="text-muted-foreground text-xs block">Pacote</span>
                <span className="font-semibold text-foreground">R$ {totalPrice.toLocaleString("pt-BR")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Introduction Card */}
        <div className="card-premium p-6 mb-6 slide-up border-l-4 border-l-stellantis-blue">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-stellantis-blue flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground mb-2">
                Abertura Consultiva
              </h3>
              <p className="text-foreground leading-relaxed">
                "{genderPrefix} <span className="font-semibold text-stellantis-blue">{firstName}</span>, com base no seu perfil 
                e na região {clientData.state ? `do ${clientData.state}` : "informada"}, 
                nossa inteligência de dados identificou que o <span className="font-semibold text-stellantis-blue">{packageName}</span> para seu{" "}
                <span className="font-semibold text-stellantis-blue">{clientData.vehicleModel} {clientData.vehicleColor}</span> não é um luxo, 
                mas uma <span className="font-semibold text-ram-red">necessidade para proteger seu investimento</span>."
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Arguments */}
        <div className="space-y-4 mb-8">
          {dynamicArguments.map((arg, index) => (
            <div
              key={arg.title}
              className="card-premium p-6 slide-up"
              style={{ animationDelay: `${0.1 + index * 0.1}s` }}
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center text-3xl flex-shrink-0">
                  {arg.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg text-foreground">
                      Argumento {index + 1}: {arg.title}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {arg.items.map((item) => (
                      <span
                        key={item}
                        className="px-2 py-1 bg-stellantis-blue/10 text-stellantis-blue text-xs font-medium rounded-md"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                  <p className="text-foreground leading-relaxed italic">
                    "{arg.content}"
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Accessories Summary */}
        <div className="card-premium p-5 mb-6 slide-up" style={{ animationDelay: "0.25s" }}>
          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Package className="w-5 h-5 text-ram-red" />
            Acessórios Incluídos no Pacote
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {selectedAccessories.map((acc) => (
              <div key={acc.id} className="flex items-center gap-2 text-sm">
                <span className="text-lg">{acc.icon}</span>
                <span className="text-foreground">{acc.name}</span>
                <span className="text-muted-foreground text-xs ml-auto">
                  R$ {acc.price.toLocaleString("pt-BR")}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-border flex justify-between items-center">
            <span className="font-semibold text-foreground">Total do Pacote:</span>
            <span className="text-xl font-bold text-ram-red">
              R$ {totalPrice.toLocaleString("pt-BR")}
            </span>
          </div>
        </div>

        {/* Tips Card */}
        <div className="card-premium p-5 mb-8 bg-gradient-to-r from-secondary to-background slide-up" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center gap-3 mb-3">
            <Award className="w-5 h-5 text-ram-red" />
            <h4 className="font-semibold text-foreground">Dicas de Fechamento para {firstName}</h4>
          </div>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-sm text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Enfatize a <strong className="text-foreground">economia a longo prazo</strong> vs. reparos futuros</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Mencione que o pacote <strong className="text-foreground">mantém a garantia</strong> do {clientData.vehicleModel}</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Ofereça <strong className="text-foreground">financiamento junto ao veículo</strong> - parcela de R$ {Math.ceil(totalPrice / 12).toLocaleString("pt-BR")}/mês</span>
            </li>
            {clientData.terrainType && (
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Reforce que o pacote é <strong className="text-foreground">ideal para {clientData.terrainType.toLowerCase()}</strong></span>
              </li>
            )}
          </ul>
        </div>

        {/* Action Button */}
        <div className="flex justify-center slide-up" style={{ animationDelay: "0.4s" }}>
          <button
            onClick={onClose}
            className="btn-accent flex items-center gap-3 text-lg px-10 py-4 pulse-glow"
          >
            <CheckCircle className="w-6 h-6" />
            Fechar Venda
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Success Message */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Ao clicar, o sistema registrará a venda de {clientData.clientName} e enviará os dados para o CRM
        </p>
      </div>
    </div>
  );
};

export default SalesScriptScreen;
