import { MessageSquare, CheckCircle, ArrowRight, Sparkles, Award } from "lucide-react";

interface SalesScriptScreenProps {
  onClose: () => void;
}

const arguments_data = [
  {
    title: "Segurança e Tração",
    items: ["Estribo Lateral", "Pneus All-Terrain"],
    content:
      "O Estribo e os Pneus All-Terrain são cruciais para a segurança e tração em estradas não pavimentadas, comuns na sua região, minimizando riscos e custos de manutenção futura.",
    icon: "🛡️",
  },
  {
    title: "Proteção do Investimento",
    items: ["Protetor de Caçamba", "Friso Lateral"],
    content:
      "O Protetor de Caçamba e o Friso Lateral evitam danos por pedras e detritos, mantendo o valor de revenda do seu veículo. É uma proteção inteligente que se paga ao longo do tempo.",
    icon: "💎",
  },
];

const SalesScriptScreen = ({ onClose }: SalesScriptScreenProps) => {
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
                "Sr. <span className="font-semibold text-stellantis-blue">João</span>, com base no seu perfil 
                e na região do <span className="font-semibold text-stellantis-blue">Mato Grosso</span>, 
                nossa inteligência de dados identificou que este pacote não é um luxo, 
                mas uma <span className="font-semibold text-ram-red">necessidade para proteger seu investimento</span>."
              </p>
            </div>
          </div>
        </div>

        {/* Arguments */}
        <div className="space-y-4 mb-8">
          {arguments_data.map((arg, index) => (
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

        {/* Tips Card */}
        <div className="card-premium p-5 mb-8 bg-gradient-to-r from-secondary to-background slide-up" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center gap-3 mb-3">
            <Award className="w-5 h-5 text-ram-red" />
            <h4 className="font-semibold text-foreground">Dicas de Fechamento</h4>
          </div>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-sm text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Enfatize a <strong className="text-foreground">economia a longo prazo</strong> vs. reparos futuros</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Mencione que o pacote <strong className="text-foreground">mantém a garantia</strong> do veículo</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Ofereça <strong className="text-foreground">financiamento junto ao veículo</strong> para facilitar</span>
            </li>
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

        {/* Success Message (appears on hover concept) */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Ao clicar, o sistema registrará a venda e enviará os dados para o CRM
        </p>
      </div>
    </div>
  );
};

export default SalesScriptScreen;
