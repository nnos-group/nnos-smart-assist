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

  const dynamicArguments = useMemo(() => {
    const args: Array<{ title: string; items: string[]; content: string; icon: string }> = [];

    const protectionItems = selectedAccessories.filter(a => ["protetor", "friso", "santantonio", "capota"].includes(a.id));
    const performanceItems = selectedAccessories.filter(a => ["pneus", "estribo", "guincho", "engate"].includes(a.id));
    const utilityItems = selectedAccessories.filter(a => ["rack", "toolbox", "sensor", "farol"].includes(a.id));

    if (protectionItems.length > 0) {
      args.push({
        title: "Proteção do Investimento",
        items: protectionItems.map(a => a.name),
        content: `${protectionItems.map(a => a.name).join(" e ")} ${protectionItems.length > 1 ? 'são essenciais' : 'é essencial'} para proteger seu ${clientData.vehicleModel} das condições em ${clientData.state || "sua região"}. ${clientData.terrainType ? `Para uso em ${clientData.terrainType.toLowerCase()}, ` : ''}esses itens preservam o valor de revenda.`,
        icon: "🛡️",
      });
    }

    if (performanceItems.length > 0) {
      args.push({
        title: "Performance e Segurança",
        items: performanceItems.map(a => a.name),
        content: `Para ${clientData.terrainType || "uso diversificado"} em ${clientData.state || "sua região"}, ${performanceItems.map(a => a.name).join(" e ")} ${performanceItems.length > 1 ? 'garantem' : 'garante'} máxima segurança. ${clientData.climateCondition ? `Com ${clientData.climateCondition.toLowerCase()}, ` : ''}essa configuração é ideal.`,
        icon: "⚡",
      });
    }

    if (utilityItems.length > 0) {
      args.push({
        title: "Praticidade",
        items: utilityItems.map(a => a.name),
        content: `${utilityItems.map(a => a.name).join(" e ")} ${utilityItems.length > 1 ? 'trazem' : 'traz'} praticidade ao dia a dia com seu ${clientData.vehicleModel}.`,
        icon: "🔧",
      });
    }

    if (args.length === 0 && selectedAccessories.length > 0) {
      args.push({
        title: "Pacote Completo",
        items: selectedAccessories.map(a => a.name),
        content: `O ${packageName} foi configurado para o ${clientData.vehicleModel} considerando seu perfil em ${clientData.state || "sua região"}.`,
        icon: "📦",
      });
    }

    return args;
  }, [selectedAccessories, clientData, packageName]);

  const firstName = clientData.clientName.split(" ")[0] || "Cliente";
  const genderPrefix = clientData.clientGender?.toLowerCase().includes("fem") ? "Sra." : "Sr.";

  return (
    <div className="min-h-screen p-6 md:p-8 app-container">
      <div className="max-w-4xl mx-auto fade-in">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-4 h-4 text-sf-blue" />
            <span className="label-text text-sf-blue">Script de Vendas — IA</span>
          </div>
          <h1 className="section-title">Argumentação Consultiva</h1>
        </div>

        {/* Summary Bar */}
        <div className="sf-card p-3 mb-5 slide-up">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-sf-blue" />
              <div>
                <span className="text-muted-foreground block">Cliente</span>
                <span className="font-medium text-foreground">{clientData.clientName}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Car className="w-3.5 h-3.5 text-sf-blue" />
              <div>
                <span className="text-muted-foreground block">Veículo</span>
                <span className="font-medium text-foreground">{clientData.vehicleModel}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-sf-blue" />
              <div>
                <span className="text-muted-foreground block">Região</span>
                <span className="font-medium text-foreground">{clientData.state}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Package className="w-3.5 h-3.5 text-sf-blue" />
              <div>
                <span className="text-muted-foreground block">Pacote</span>
                <span className="font-medium text-foreground">R$ {totalPrice.toLocaleString("pt-BR")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Intro Card */}
        <div className="sf-card p-4 mb-5 slide-up border-l-4 border-l-sf-navy">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-sf-blue flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm text-foreground mb-1">Abertura Consultiva</h3>
              <p className="text-sm text-foreground leading-relaxed">
                "{genderPrefix} <span className="font-semibold text-sf-blue">{firstName}</span>, com base no seu perfil
                e na região {clientData.state ? `do ${clientData.state}` : "informada"},
                o <span className="font-semibold text-sf-blue">{packageName}</span> para seu{" "}
                <span className="font-semibold text-sf-blue">{clientData.vehicleModel} {clientData.vehicleColor}</span> é uma{" "}
                <span className="font-semibold text-ram-red">necessidade para proteger seu investimento</span>."
              </p>
            </div>
          </div>
        </div>

        {/* Arguments */}
        <div className="space-y-3 mb-6">
          {dynamicArguments.map((arg, index) => (
            <div key={arg.title} className="sf-card p-4 slide-up" style={{ animationDelay: `${0.1 + index * 0.08}s` }}>
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{arg.icon}</span>
                <div className="flex-1">
                  <h3 className="font-bold text-sm text-foreground mb-1">
                    Argumento {index + 1}: {arg.title}
                  </h3>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {arg.items.map((item) => (
                      <span key={item} className="px-1.5 py-0.5 bg-sf-light-blue text-sf-navy text-[10px] font-medium rounded">
                        {item}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed italic">"{arg.content}"</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Accessories Summary */}
        <div className="sf-card p-4 mb-5 slide-up" style={{ animationDelay: "0.25s" }}>
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
            <Package className="w-3.5 h-3.5" />
            Acessórios Incluídos
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
            {selectedAccessories.map((acc) => (
              <div key={acc.id} className="flex items-center justify-between text-xs p-1.5 rounded bg-secondary/50">
                <span className="text-foreground">{acc.name}</span>
                <span className="text-muted-foreground ml-2">R$ {acc.price.toLocaleString("pt-BR")}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-2 border-t border-border flex justify-between items-center">
            <span className="text-sm font-semibold text-foreground">Total:</span>
            <span className="text-lg font-bold text-sf-blue">R$ {totalPrice.toLocaleString("pt-BR")}</span>
          </div>
        </div>

        {/* Tips */}
        <div className="sf-card p-4 mb-6 slide-up" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-sf-blue" />
            <h4 className="font-semibold text-sm text-foreground">Dicas de Fechamento</h4>
          </div>
          <ul className="space-y-1.5">
            {[
              <>Enfatize a <strong className="text-foreground">economia a longo prazo</strong> vs. reparos futuros</>,
              <>O pacote <strong className="text-foreground">mantém a garantia</strong> do {clientData.vehicleModel}</>,
              <>Financiamento junto ao veículo — parcela de <strong className="text-foreground">R$ {Math.ceil(totalPrice / 12).toLocaleString("pt-BR")}/mês</strong></>,
              ...(clientData.terrainType ? [<>Pacote <strong className="text-foreground">ideal para {clientData.terrainType.toLowerCase()}</strong></>] : []),
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "hsl(var(--emerald))" }} />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="flex justify-center slide-up" style={{ animationDelay: "0.4s" }}>
          <button onClick={onClose} className="btn-accent flex items-center gap-2 text-sm px-8 py-3">
            <CheckCircle className="w-5 h-5" />
            Fechar Venda
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <p className="text-center text-[11px] text-muted-foreground mt-4">
          O sistema registrará a venda de {clientData.clientName} e enviará os dados para o CRM
        </p>
      </div>
    </div>
  );
};

export default SalesScriptScreen;
