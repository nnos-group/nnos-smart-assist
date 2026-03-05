import { MessageSquare, CheckCircle, ArrowRight, Sparkles, Award, User, MapPin, Car, Package, Shield, Mic, MicOff, Send } from "lucide-react";
import { Accessory, ClientData, getPackageName } from "@/types/accessories";
import { useMemo, useState, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SalesScriptScreenProps {
  clientData: ClientData;
  accessories: Accessory[];
  onClose: () => void;
}

interface CounterArgument {
  title: string;
  content: string;
  technique: string;
}

const generateCounterArgument = (
  objection: string,
  clientData: ClientData,
  selectedAccessories: Accessory[],
  totalPrice: number,
  packageName: string
): CounterArgument => {
  const text = objection.toLowerCase();
  const firstName = clientData.clientName.split(" ")[0] || "Cliente";
  const genderPrefix = clientData.clientGender?.toLowerCase().includes("fem") ? "Sra." : "Sr.";
  const monthlyPayment = Math.ceil(totalPrice / 12).toLocaleString("pt-BR");
  const accessoryNames = selectedAccessories.map(a => a.name).join(", ");

  if (/caro|preço|prec|dinheiro|custo|valor alto|pagar|cust/.test(text)) {
    return {
      title: "Custo-Benefício e Parcelamento",
      technique: "Parcelamento + Comparação de custo",
      content: `"${genderPrefix} ${firstName}, financiando o ${packageName} junto ao veículo, o investimento fica em apenas R$ ${monthlyPayment}/mês. Sem a proteção adequada, um único reparo de pintura ou lataria do ${clientData.vehicleModel} pode custar mais do que o pacote inteiro. Estamos falando de proteger um investimento de dezenas de milhares de reais por uma fração do valor."`,
    };
  }

  if (/não preciso|desnecessário|sem necessidade|não necessit|não uso|não vou usar/.test(text)) {
    return {
      title: "Necessidade Real de Proteção",
      technique: "Ancoragem no perfil de uso",
      content: `"${genderPrefix} ${firstName}, para uso em ${clientData.terrainType || "condições variadas"} na região ${clientData.state ? `do ${clientData.state}` : "informada"}, itens como ${accessoryNames} não são luxo — são necessidade. 8 em cada 10 clientes com o mesmo perfil de uso optam por esse pacote. ${clientData.climateCondition ? `Com ${clientData.climateCondition.toLowerCase()}, ` : ""}a proteção se torna ainda mais essencial."`,
    };
  }

  if (/pensar|penso|depois|volto|ver depois|decidir|calma|tempo/.test(text)) {
    return {
      title: "Condição Exclusiva",
      technique: "Urgência + Exclusividade",
      content: `"${genderPrefix} ${firstName}, entendo perfeitamente. Porém, o ${packageName} tem uma condição especial vinculada à compra do ${clientData.vehicleModel}. Após a saída da concessionária, a instalação individual desses itens (${accessoryNames}) pode custar até 40% a mais, além de exigir agendamento separado. Esta é a melhor janela de oportunidade."`,
    };
  }

  if (/já tenho|compro fora|aftermarket|paralelo|genéric|internet|mercado livre/.test(text)) {
    return {
      title: "Garantia e Procedência Original",
      technique: "Garantia de fábrica + Segurança",
      content: `"${genderPrefix} ${firstName}, acessórios originais mantêm a garantia de fábrica do ${clientData.vehicleModel} intacta. Itens paralelos podem comprometer a garantia, além de não oferecerem o mesmo encaixe e acabamento. O ${packageName} é homologado pelo fabricante, com instalação certificada e garantia própria."`,
    };
  }

  return {
    title: "Valor Personalizado",
    technique: "Reforço de valor percebido",
    content: `"${genderPrefix} ${firstName}, o ${packageName} foi montado especificamente para o perfil de uso do(a) senhor(a) com o ${clientData.vehicleModel} ${clientData.vehicleColor || ""}. Cada item — ${accessoryNames} — foi selecionado considerando sua região${clientData.state ? ` (${clientData.state})` : ""} e tipo de uso${clientData.terrainType ? ` (${clientData.terrainType})` : ""}. É uma solução completa, não um kit genérico."`,
  };
};

const SalesScriptScreen = ({ clientData, accessories, onClose }: SalesScriptScreenProps) => {
  const selectedAccessories = accessories.filter((a) => a.selected);
  const totalPrice = selectedAccessories.reduce((sum, a) => sum + a.price, 0);
  const packageName = getPackageName(clientData.vehicleModel);

  const [objectionText, setObjectionText] = useState("");
  const [counterArgument, setCounterArgument] = useState<CounterArgument | null>(null);
  const [isRecordingObjection, setIsRecordingObjection] = useState(false);
  const [focusedAccessoryIds, setFocusedAccessoryIds] = useState<string[]>(() => selectedAccessories.map(a => a.id));

  const focusedAccessories = useMemo(() => selectedAccessories.filter(a => focusedAccessoryIds.includes(a.id)), [selectedAccessories, focusedAccessoryIds]);
  const focusedTotal = useMemo(() => focusedAccessories.reduce((sum, a) => sum + a.price, 0), [focusedAccessories]);

  const toggleFocusedAccessory = useCallback((id: string) => {
    setFocusedAccessoryIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    if (counterArgument) setCounterArgument(null);
  }, [counterArgument]);

  const handleGenerateCounter = useCallback(() => {
    if (!objectionText.trim()) {
      toast.error("Digite ou dite a objeção do cliente primeiro.");
      return;
    }
    if (focusedAccessories.length === 0) {
      toast.error("Selecione ao menos um acessório para personalizar a contra-argumentação.");
      return;
    }
    const result = generateCounterArgument(objectionText, clientData, focusedAccessories, focusedTotal, packageName);
    setCounterArgument(result);
    toast.success("Contra-argumentação gerada!");
  }, [objectionText, clientData, focusedAccessories, focusedTotal, packageName]);

  const handleVoiceObjection = useCallback(() => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      toast.error("Reconhecimento de voz não suportado neste navegador.");
      return;
    }
    const recognition = new SpeechRecognitionAPI();
    recognition.lang = "pt-BR";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsRecordingObjection(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setObjectionText(prev => prev ? `${prev} ${transcript}` : transcript);
      toast.success("Objeção capturada por voz!");
    };
    recognition.onerror = () => {
      toast.error("Erro na captura de voz. Tente novamente.");
      setIsRecordingObjection(false);
    };
    recognition.onend = () => setIsRecordingObjection(false);
    recognition.start();
  }, []);

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
            <span className="label-text text-sf-blue">Script de Vendas</span>
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

        {/* Unified: Acessórios & Quebra de Objeções */}
        <div className="sf-card p-4 mb-6 slide-up border-l-4 border-l-sf-navy" style={{ animationDelay: "0.25s" }}>
          <div className="flex items-center gap-2 mb-3">
            <Package className="w-4 h-4 text-sf-blue" />
            <Shield className="w-4 h-4 text-ram-red" />
            <h4 className="font-semibold text-sm text-foreground">Acessórios & Quebra de Objeções</h4>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Selecione os itens sobre os quais o cliente tem objeção para personalizar a contra-argumentação.
          </p>

          {/* Accessory Chips */}
          <div className="flex flex-wrap gap-2 mb-3">
            {selectedAccessories.map((acc) => {
              const isFocused = focusedAccessoryIds.includes(acc.id);
              return (
                <button
                  key={acc.id}
                  onClick={() => toggleFocusedAccessory(acc.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                    isFocused
                      ? "bg-sf-blue text-white border-sf-blue shadow-sm"
                      : "bg-secondary/50 text-muted-foreground border-border hover:border-sf-blue/50"
                  }`}
                >
                  <CheckCircle className={`w-3 h-3 ${isFocused ? "opacity-100" : "opacity-0"}`} />
                  {acc.name}
                  <span className={`ml-1 ${isFocused ? "text-white/80" : "text-muted-foreground/60"}`}>
                    R$ {acc.price.toLocaleString("pt-BR")}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Focused Total */}
          <div className="flex justify-between items-center text-xs mb-4 px-1">
            <span className="text-muted-foreground">
              {focusedAccessories.length} de {selectedAccessories.length} itens selecionados
            </span>
            <span className="font-bold text-sf-blue text-sm">
              R$ {focusedTotal.toLocaleString("pt-BR")}
            </span>
          </div>

          {/* Objection Input */}
          <div className="border-t border-border pt-3">
            <div className="flex gap-2 mb-3">
              <Textarea
                value={objectionText}
                onChange={(e) => {
                  setObjectionText(e.target.value);
                  if (counterArgument) setCounterArgument(null);
                }}
                placeholder='Ex: "Está muito caro", "Não preciso disso", "Vou pensar"...'
                className="min-h-[60px] text-sm flex-1 resize-none"
              />
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleVoiceObjection}
                  className={`shrink-0 transition-colors ${isRecordingObjection ? "bg-ram-red text-white border-ram-red animate-pulse" : ""}`}
                  title={isRecordingObjection ? "Gravando..." : "Capturar objeção por voz"}
                >
                  {isRecordingObjection ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
                <Button
                  onClick={handleGenerateCounter}
                  size="icon"
                  className="shrink-0 bg-sf-blue hover:bg-sf-navy text-white"
                  title="Gerar contra-argumentação"
                  disabled={!objectionText.trim() || focusedAccessories.length === 0}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {counterArgument && (
              <div className="bg-secondary/50 rounded-lg p-4 border border-border fade-in">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-sf-blue/10 text-sf-blue text-[10px] font-semibold rounded-full">
                    {counterArgument.technique}
                  </span>
                </div>
                <h5 className="font-bold text-sm text-foreground mb-2">{counterArgument.title}</h5>
                <p className="text-sm text-foreground leading-relaxed italic">{counterArgument.content}</p>
              </div>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center slide-up" style={{ animationDelay: "0.35s" }}>
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
