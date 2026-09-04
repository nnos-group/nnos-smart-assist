import { useState, useMemo, useCallback, useEffect } from "react";
import { 
  ArrowLeft, Sparkles, Volume2, Copy, Check, ShieldCheck, 
  Car, MapPin, BadgePercent, Mic, MicOff, Send, Share2, 
  FileText, ArrowRight, Lightbulb, User, CheckCircle, Zap, ShieldAlert, X
} from "lucide-react";
import { Accessory, ClientData, getPackageName } from "@/types/accessories";
import { generateSalesArguments, CounterArgumentResult } from "@/lib/salesKnowledge";
import { toast } from "sonner";

interface SalesScriptScreenProps {
  clientData: ClientData;
  accessories: Accessory[];
  onClose: () => void;
  onBack?: () => void;
}

const PRESET_OBJECTIONS = [
  {
    id: "expensive",
    label: '💰 "Achou caro / Fora do orçamento agora"',
    query: "O cliente disse que achou os itens caros para o orçamento atual e prefere deixar para depois.",
  },
  {
    id: "no-need",
    label: '⚡ "Não vê necessidade imediata no uso"',
    query: "O cliente disse que não vê necessidade imediata de instalar esses acessórios na sua região.",
  },
  {
    id: "aftermarket",
    label: '🔧 "Quer pesquisar em autopeças de rua"',
    query: "O cliente comentou que pretende cotar e colocar itens similares em lojas de autopeças fora da concessionária.",
  },
  {
    id: "consult-partner",
    label: '👥 "Precisa consultar a esposa / sócio"',
    query: "A esposa não acha necessário neste momento e preciso consultar a família.",
  },
];

const SalesScriptScreen = ({
  clientData,
  accessories,
  onClose,
  onBack,
}: SalesScriptScreenProps) => {
  const selectedAccessories = useMemo(
    () => accessories.filter((a) => a.selected),
    [accessories]
  );

  const totalPrice = useMemo(
    () =>
      selectedAccessories.reduce((sum, a) => {
        const discounted = Math.round(a.price * (1 - a.discountPercent / 100));
        return sum + discounted;
      }, 0),
    [selectedAccessories]
  );

  const packageName = getPackageName(clientData.vehicleModel);
  const firstName = (clientData.clientName || "Cliente").trim().split(" ")[0] || "Cliente";
  const initials = (clientData.clientName || "JS")
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const cdcMonthly = (totalPrice * 0.0235).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const [objectionText, setObjectionText] = useState(
    `O cliente disse: "Achei o valor dos acessórios muito elevado para agora, posso colocar mais tarde fora da loja."`
  );
  const [selectedPresetId, setSelectedPresetId] = useState<string>("expensive");
  const [isRecordingObjection, setIsRecordingObjection] = useState(false);
  const [focusedAccessoryIds, setFocusedAccessoryIds] = useState<string[]>(
    () => selectedAccessories.map((a) => a.id)
  );
  const [isCopiedOpening, setIsCopiedOpening] = useState(false);
  const [isCopiedResponse, setIsCopiedResponse] = useState(false);

  const focusedAccessories = useMemo(
    () => selectedAccessories.filter((a) => focusedAccessoryIds.includes(a.id)),
    [selectedAccessories, focusedAccessoryIds]
  );

  const focusedTotal = useMemo(
    () =>
      focusedAccessories.reduce((sum, a) => {
        const discounted = Math.round(a.price * (1 - a.discountPercent / 100));
        return sum + discounted;
      }, 0),
    [focusedAccessories]
  );

  // Inicialização determinística sem risco de loop infinito
  const [result, setResult] = useState<CounterArgumentResult | null>(() => {
    if (focusedAccessories.length > 0) {
      return generateSalesArguments(
        `O cliente disse: "Achei o valor dos acessórios muito elevado para agora, posso colocar mais tarde fora da loja."`,
        clientData,
        focusedAccessories,
        focusedTotal,
        packageName
      );
    }
    return null;
  });

  const toggleFocusedAccessory = useCallback((id: string) => {
    setFocusedAccessoryIds((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      const nextAccessories = selectedAccessories.filter((a) => next.includes(a.id));
      const nextTotal = nextAccessories.reduce((sum, a) => {
        const discounted = Math.round(a.price * (1 - a.discountPercent / 100));
        return sum + discounted;
      }, 0);
      if (nextAccessories.length > 0) {
        setResult(
          generateSalesArguments(
            objectionText,
            clientData,
            nextAccessories,
            nextTotal,
            packageName
          )
        );
      }
      return next;
    });
  }, [selectedAccessories, objectionText, clientData, packageName]);

  const handleGenerate = useCallback(() => {
    if (focusedAccessories.length === 0) {
      toast.error("Selecione ao menos um acessório para gerar a argumentação.");
      return;
    }
    const generated = generateSalesArguments(
      objectionText,
      clientData,
      focusedAccessories,
      focusedTotal,
      packageName
    );
    setResult(generated);
    toast.success("Contra-argumento gerado pelo Sales Copilot!");
  }, [objectionText, clientData, focusedAccessories, focusedTotal, packageName]);

  const handleSelectPreset = (preset: typeof PRESET_OBJECTIONS[0]) => {
    setSelectedPresetId(preset.id);
    setObjectionText(preset.query);
    if (focusedAccessories.length > 0) {
      const generated = generateSalesArguments(
        preset.query,
        clientData,
        focusedAccessories,
        focusedTotal,
        packageName
      );
      setResult(generated);
    }
  };

  const handleVoiceObjection = useCallback(() => {
    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
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
      setObjectionText((prev) => (prev ? `${prev} ${transcript}` : transcript));
      toast.success("Objeção capturada por voz!");
    };
    recognition.onerror = () => {
      toast.error("Erro na captura de voz. Tente novamente.");
      setIsRecordingObjection(false);
    };
    recognition.onend = () => setIsRecordingObjection(false);
    recognition.start();
  }, []);

  const openingScriptText = `Sr. ${firstName}, com base no seu perfil de uso aqui nas estradas de ${
    clientData.state?.replace(/\s*\(.*\)/, "") || "sua região"
  } e na potência do seu ${clientData.vehicleModel} ${clientData.vehicleColor}, o pacote ${packageName} não é apenas um adicional estético — ele é uma necessidade real para blindar o seu investimento contra o desgaste severo e assegurar a máxima valorização do seu patrimônio na revenda futura.`;

  const handleSpeakOpening = () => {
    if (!("speechSynthesis" in window)) {
      toast.error("Síntese de voz não suportada neste navegador.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(openingScriptText);
    utterance.lang = "pt-BR";
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
    toast.info("Reproduzindo síntese de voz da argumentação...");
  };

  const handleCopyOpening = () => {
    navigator.clipboard.writeText(openingScriptText);
    setIsCopiedOpening(true);
    toast.success("Script de abertura copiado para a área de transferência!");
    setTimeout(() => setIsCopiedOpening(false), 2500);
  };

  const handleCopyResponse = () => {
    if (!result) return;
    const fullText = `*Script Recomendado para o Consultor*\n\n1. Validação Empática: "${result.empathicValidation}"\n\n2. Quebra Técnica: "${result.technicalRefutation}"\n\n3. Fechamento F&I: "${result.closingFi}"`;
    navigator.clipboard.writeText(fullText);
    setIsCopiedResponse(true);
    toast.success("Contra-argumento copiado!");
    setTimeout(() => setIsCopiedResponse(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Olá ${firstName}! Tudo bem? Segue a síntese da proposta de acessórios homologados Mopar para o seu ${clientData.vehicleModel}:\n\n` +
      `Pacote: ${packageName}\n` +
      `Valor Total: R$ ${totalPrice.toLocaleString("pt-BR")} (ou +R$ ${cdcMonthly}/mês diluído no financiamento)\n\n` +
      `Itens com garantia total preservada de 3 anos de fábrica.\n` +
      `Podemos aprovar a ordem de instalação?`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  return (
    <div className="bg-slate-50 text-slate-800 font-sans antialiased min-h-screen flex flex-col selection:bg-blue-600 selection:text-white">
      {/* BEGIN: MainContent */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Sub-header & Context Title */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase text-blue-700 bg-blue-100/60 px-2.5 py-0.5 rounded-md border border-blue-200">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Assistente de Vendas
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 tracking-tight">
              Argumentação Consultiva &amp; Quebra de Objeções
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Scripts altamente persuasivos formulados para o perfil do comprador, telemetria regional e proteções selecionadas.
            </p>
          </div>
        </div>

        {/* BEGIN: DealSummaryBar */}
        <section aria-label="Resumo do Negócio" className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            {/* Cliente Card */}
            <div className="flex items-center space-x-3.5 pt-2 sm:pt-0 sm:pr-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold uppercase text-slate-400">Cliente</span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded">
                    Score Prime
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-900 truncate">
                  {clientData.clientName || "Cliente"}
                </div>
                <div className="text-xs text-slate-500 truncate">
                  {clientData.terrainType || "Uso Misto"} • {clientData.state?.replace(/\s*\(.*\)/, "") || "Brasil"}
                </div>
              </div>
            </div>

            {/* Veículo Card */}
            <div className="flex items-center space-x-3.5 pt-3 sm:pt-0 sm:px-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                <Car className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-semibold uppercase text-slate-400">Veículo Selecionado</span>
                <div className="text-sm font-bold text-slate-900 truncate uppercase">
                  {clientData.vehicleModel}
                </div>
                <div className="text-xs text-slate-500 truncate">
                  {clientData.vehicleColor} • {clientData.vehicleYear || "2025/2026"}
                </div>
              </div>
            </div>

            {/* Região & Solo Card */}
            <div className="flex items-center space-x-3.5 pt-3 sm:pt-0 sm:px-4">
              <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-semibold uppercase text-slate-400">Região &amp; Solo</span>
                <div className="text-sm font-bold text-slate-900 truncate">
                  {clientData.state || "Brasil"}
                </div>
                <div className="text-xs text-slate-500 truncate">
                  {clientData.terrainType || "Uso Misto"} • {clientData.climateCondition || "Normal"}
                </div>
              </div>
            </div>

            {/* Pacote F&I Card */}
            <div className="flex items-center space-x-3.5 pt-3 sm:pt-0 sm:pl-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                <BadgePercent className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase text-slate-400">Total Pacote</span>
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1 rounded">
                    Mopar Safe
                  </span>
                </div>
                <div className="text-base font-extrabold text-blue-700">
                  R$ {totalPrice.toLocaleString("pt-BR")}
                </div>
                <div className="text-xs text-emerald-700 font-semibold truncate">
                  + R$ {cdcMonthly}/mês no CDC
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* END: DealSummaryBar */}

        {/* BEGIN: ConsultativeOpening */}
        <section className="bg-gradient-to-br from-[#0a1e3f] via-[#0a3277] to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden border border-blue-700/60">
          {/* Decorative Background Aura */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/3 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/30 border border-blue-400/40 flex items-center justify-center text-blue-300">
                  <Sparkles className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
                    Abertura Consultiva Personalizada
                    <span className="text-[11px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      Confiança IA: 96%
                    </span>
                  </h2>
                  <p className="text-xs text-slate-300">Direcionamento inicial calibrado para o perfil do cliente e telemetria regional.</p>
                </div>
              </div>

              {/* Quick Audio / Helper Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSpeakOpening}
                  className="inline-flex items-center gap-1.5 text-xs font-medium bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg backdrop-blur-sm transition-all border border-white/10 active:scale-95 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5 text-blue-300" />
                  <span>Ouvir Síntese por Voz</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyOpening}
                  className="inline-flex items-center gap-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  {isCopiedOpening ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopiedOpening ? "Copiado!" : "Copiar Script"}</span>
                </button>
              </div>
            </div>

            {/* Script Quote Box */}
            <div className="bg-black/30 backdrop-blur-md rounded-xl p-5 border border-white/10">
              <p className="text-base sm:text-lg font-normal text-slate-100 leading-relaxed font-sans italic">
                "Sr. <span className="font-bold text-white not-italic underline decoration-blue-400 decoration-2 underline-offset-4">{firstName}</span>, com base no seu perfil de uso aqui nas estradas de <span className="font-semibold text-blue-200 not-italic">{clientData.state?.replace(/\s*\(.*\)/, "") || "sua região"}</span> e na extrema confiabilidade do seu novo <span className="font-semibold text-white not-italic">{clientData.vehicleModel} {clientData.vehicleColor}</span>, o pacote <span className="font-semibold text-blue-300 not-italic">{packageName}</span> não é apenas um adicional estético — ele é uma <span className="font-bold text-emerald-400 not-italic uppercase tracking-wide">necessidade real para blindar o seu investimento</span> contra o desgaste severo e assegurar a máxima valorização do seu patrimônio na revenda futura."
              </p>
            </div>

            {/* Footnote and Quick Trigger */}
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-300 pt-1">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
                <span>Gatilho Psicológico: <strong>Aversão à Perda Patrimonial + Orgulho de Conquista</strong></span>
              </div>
              <span className="text-slate-400">Tempo estimado de fala: 18 segundos</span>
            </div>
          </div>
        </section>
        {/* END: ConsultativeOpening */}

        {/* BEGIN: ValuePillars */}
        <section aria-labelledby="pillars-heading" className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 tracking-tight" id="pillars-heading">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              Pilares de Argumentação de Alto Impacto
            </h2>
            <span className="text-xs font-medium text-slate-500">Baseado em dados de telemetria e histórico MOPAR</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Pillar 1: Proteção & Revenda */}
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold tracking-wider uppercase text-blue-600">Pilar 01</span>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">Proteção do Investimento &amp; Revenda</h3>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3.5">
                  <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                    Protetor &amp; Blindagem
                  </span>
                  <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                    Friso Lateral
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed italic mb-4">
                  "As laterais e a parte inferior são as áreas mais expostas em estradas e no uso diário. O Protetor e os Frisos com padrão original de fábrica evitam riscos profundos e amassados, preservando a lataria intacta e garantindo até <strong className="text-slate-900 not-italic">12% a mais no valor residual</strong> na troca futura."
                </p>
              </div>

              <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-2.5 text-[11px] text-amber-900">
                <div className="font-bold flex items-center gap-1 mb-0.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                  Dica Contra Preço Alto:
                </div>
                Destaque que o custo de repintura e funilaria pós-uso sem proteção supera R$ 3.800 em oficinas especializadas.
              </div>
            </div>

            {/* Pillar 2: Performance & Segurança */}
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold tracking-wider uppercase text-orange-600">Pilar 02</span>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">Segurança &amp; Performance Operacional</h3>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3.5">
                  <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                    Estribo Lateral
                  </span>
                  <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                    Pneus All-Terrain
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed italic mb-4">
                  "Em chuvas intensas e trechos de baixa aderência, os pneus adequados reduzem drasticamente o risco de aquaplanagem, enquanto o estribo robusto oferece <strong className="text-slate-900 not-italic">embarque ergonômico e seguro</strong> para você e sua família com base antiderrapante."
                </p>
              </div>

              <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-2.5 text-[11px] text-blue-900">
                <div className="font-bold flex items-center gap-1 mb-0.5">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  Argumento Família:
                </div>
                O estribo é o item com maior índice de aprovação por acompanhantes e crianças na altura elevada do veículo.
              </div>
            </div>

            {/* Pillar 3: F&I & Diluição */}
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
                    <BadgePercent className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-600">Pilar 03</span>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">Facilidade F&amp;I &amp; Diluição no CDC</h3>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3.5">
                  <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                    Diluição no CDC
                  </span>
                  <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                    Garantia 3 Anos de Fábrica
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed italic mb-4">
                  "Em vez de desembolsar R$ {totalPrice.toLocaleString("pt-BR")} à vista no cartão ou balcão, o senhor inclui tudo na operação do banco por meros <strong className="text-slate-900 not-italic">+ R$ {cdcMonthly} ao mês</strong>. O carro já sai montado por técnicos certificados e protegido pela garantia integral."
                </p>
              </div>

              <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-2.5 text-[11px] text-emerald-900">
                <div className="font-bold flex items-center gap-1 mb-0.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  Efeito Diário:
                </div>
                Diga: "Sr. {firstName}, isso representa menos de R$ 7,00 por dia para rodar com o carro completo sem dor de cabeça."
              </div>
            </div>
          </div>
        </section>
        {/* END: ValuePillars */}

        {/* BEGIN: ObjectionHandlingModule */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          {/* Section Title & Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Acessórios &amp; Quebra de Objeções em Tempo Real</h2>
                <p className="text-xs text-slate-500">Selecione os itens em debate e especifique a resistência do comprador para gerar resposta técnica imediata.</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500">Valor do Pacote Selecionado</span>
              <div className="text-lg font-extrabold text-blue-700 font-mono">
                R$ {totalPrice.toLocaleString("pt-BR")}
              </div>
            </div>
          </div>

          {/* Selected Accessories Pills (Interactive Toggles) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>Itens em discussão no fechamento:</span>
              <span className="text-slate-400 font-normal">
                {focusedAccessories.length} de {selectedAccessories.length} itens selecionados
              </span>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {selectedAccessories.map((acc) => {
                const isFocused = focusedAccessoryIds.includes(acc.id);
                const discounted = Math.round(acc.price * (1 - acc.discountPercent / 100));

                return (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => toggleFocusedAccessory(acc.id)}
                    className={`inline-flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg shadow-sm transition border cursor-pointer ${
                      isFocused
                        ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                        : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                    }`}
                  >
                    <CheckCircle className={`w-4 h-4 ${isFocused ? "text-white" : "text-slate-400"}`} />
                    <span>{acc.name}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                      isFocused ? "bg-blue-700 text-white" : "bg-slate-200 text-slate-600"
                    }`}>
                      R$ {discounted.toLocaleString("pt-BR")}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Objection Simulator Form */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Qual a objeção declarada pelo Sr. {firstName}?
              </label>

              {/* Objection Preset Quick-Pills */}
              <div className="flex flex-wrap gap-2 mb-3">
                {PRESET_OBJECTIONS.map((preset) => {
                  const isSelected = selectedPresetId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`text-xs font-medium px-2.5 py-1 rounded-full border transition-colors shadow-2xs cursor-pointer ${
                        isSelected
                          ? "bg-blue-100/80 text-blue-900 border-blue-300 ring-1 ring-blue-400/40"
                          : "bg-white text-slate-700 border-slate-200 hover:text-blue-700 hover:border-blue-300"
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>

              {/* Input + Action Button */}
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    value={objectionText}
                    onChange={(e) => setObjectionText(e.target.value)}
                    placeholder="Descreva com as palavras do cliente ou clique em uma das sugestões acima..."
                    className="w-full text-xs sm:text-sm bg-white border-slate-300 rounded-lg shadow-inner py-2.5 pl-3.5 pr-16 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 placeholder-slate-400"
                  />
                  {objectionText && (
                    <button
                      type="button"
                      onClick={() => setObjectionText("")}
                      className="absolute right-9 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                      title="Limpar texto"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleVoiceObjection}
                    className={`absolute right-2.5 top-2 text-slate-400 hover:text-blue-600 p-1 rounded transition cursor-pointer ${
                      isRecordingObjection ? "text-rose-600 animate-pulse bg-rose-50" : ""
                    }`}
                    title="Capturar fala por voz"
                  >
                    {isRecordingObjection ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleGenerate}
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-lg shadow-sm transition whitespace-nowrap active:scale-98 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                  <span>Gerar Contra-Argumento IA</span>
                </button>
              </div>
            </div>

            {/* AI Generated Response Card */}
            <div className="bg-white rounded-xl border border-blue-200/80 p-4 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex p-1 rounded bg-blue-100 text-blue-700">
                    <Lightbulb className="w-3.5 h-3.5" />
                  </span>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Script Recomendado para o Consultor
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Probabilidade de Conversão: {result?.conversionProbability || 84}%
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyResponse}
                    className="text-slate-400 hover:text-blue-600 p-1 cursor-pointer transition"
                    title="Copiar resposta"
                  >
                    {isCopiedResponse ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* The Script Content Dinâmico */}
              <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                <p>
                  <strong className="text-slate-900 font-bold block sm:inline">1. Validação Empática:</strong>{" "}
                  <span>"{result?.empathicValidation || `Entendo perfeitamente, Sr. ${firstName}. Quando olhamos o valor isolado, a primeira reação é buscar adiar ou avaliar alternativas no mercado paralelo.`}"</span>
                </p>
                <p>
                  <strong className="text-slate-900 font-bold block sm:inline">2. Quebra Técnica de Objeção:</strong>{" "}
                  <span>"{result?.technicalRefutation || `Porém, no caso dos acessórios genuínos Mopar, eles são calibrados e testados especificamente para a eletrônica de bordo, sensores de segurança e suspensão do ${clientData.vehicleModel}. Peças de prateleira externa não contam com homologação e podem invalidar a garantia de fábrica de 3 anos.`}"</span>
                </p>
                <p>
                  <strong className="text-slate-900 font-bold block sm:inline">3. Fechamento de Valor F&amp;I:</strong>{" "}
                  <span>"{result?.closingFi || `Além disso, instalando hoje aqui na concessionária, o senhor não descapitaliza seu caixa: diluímos os itens em + apenas R$ ${cdcMonthly} na parcela mensal do financiamento. Podemos emitir a ordem de serviço com a aprovação imediata?`}"</span>
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* END: ObjectionHandlingModule */}
      </main>
      {/* END: MainContent */}

      {/* BEGIN: BottomStickyBar */}
      <footer className="sticky bottom-0 z-40 bg-white border-t border-slate-200 shadow-2xl py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Left Link */}
            {onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="text-xs font-semibold text-slate-600 hover:text-blue-700 flex items-center gap-1.5 transition-colors order-2 sm:order-1 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar para Visualização 3D</span>
              </button>
            ) : (
              <span className="text-xs text-slate-400 order-2 sm:order-1">Etapa 4 · Fechamento</span>
            )}

            {/* Right Call to Actions */}
            <div className="flex items-center gap-3 w-full sm:w-auto order-1 sm:order-2 justify-end">
              {/* Secondary CTA: Compartilhar no WhatsApp */}
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-lg border border-slate-300 transition active:scale-95 cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-emerald-600" />
                <span>Enviar Síntese no WhatsApp</span>
              </button>

              {/* Primary Hero CTA: Concluir e Enviar */}
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-lg shadow-lg shadow-blue-600/30 transition transform active:scale-95 group cursor-pointer"
              >
                <CheckCircle className="w-4 h-4 text-blue-200 group-hover:scale-110 transition-transform" />
                <span>Concluir e Enviar para Aprovação F&amp;I</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </footer>
      {/* END: BottomStickyBar */}

      {/* BEGIN: InstitutionalFooter */}
      <aside className="bg-slate-100 border-t border-slate-200 py-3 text-center text-[11px] text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Ambiente Seguro Concessionária (DMS &amp; F&amp;I Integrados)</span>
          </div>
          <div>
            <span>Dados de Conformidade LGPD</span>
          </div>
        </div>
      </aside>
      {/* END: InstitutionalFooter */}
    </div>
  );
};

export default SalesScriptScreen;
