import React, { useState } from "react";
import {
  Car, User, MapPin, Compass, ShieldCheck, Check, Sparkles,
  Mic, AlertCircle, ArrowRight, CheckCircle2, RotateCcw,
  Info, Database, Store, PackageCheck, Flame, Edit3
} from "lucide-react";
import { useSalesJourney } from "@/context/SalesJourneyContext";
import { DiscoveryProfile, JourneyClientSource } from "@/types/salesJourney";
import { parseVoiceTranscript, ParsedVoiceDiagnostic } from "@/lib/discoveryVoiceParser";
import { AIQuestionSuggestion } from "./AIQuestionSuggestion";
import { vehicleGroups, vehicleColors, vehicleYears, states, CRM_CLIENT, DELIVERY_CLIENT } from "./ClientDataScreen";

// Showroom default: Compass Branco — fields pre-selected, client name left blank
const SHOWROOM_DEFAULT = {
  vehicleModel: "JEEP COMPASS LIMITED",
  vehicleColor: "Branco Polar",
  vehicleYear: "2025 / 2026 (0 km)",
  clientName: "",
  clientAge: "",
  clientGender: "Masculino",
  state: "São Paulo (SP)",
  terrainType: "100% Urbano / Rodovias Pavimentadas",
  climateCondition: "Clima Temperado / Chuvoso Moderado",
};

// Discovery profiles per source
const DISCOVERY_CRM: Partial<DiscoveryProfile> = {
  usageLocation: "uso_misto",
  monthlyKm: "acima_2000",
  dirtRoadFrequency: "semanalmente",
  cargoUsage: "ferramentas",
  frequentPassengers: ["apenas_motorista"],
  tripFrequency: "semanalmente",
  specialNeeds: ["reboque", "protecao_cacamba", "acesso_facilitado"],
  priorities: ["protecao", "praticidade", "seguranca"],
  parkingLocation: "rua",
  specificNotes: "Cliente CRM cadastrado — perfil de trabalho intenso",
};

const DISCOVERY_DELIVERY: Partial<DiscoveryProfile> = {
  usageLocation: "uso_misto",
  monthlyKm: "1000_2000",
  dirtRoadFrequency: "ocasionalmente",
  cargoUsage: "nao",
  frequentPassengers: ["criancas"],
  tripFrequency: "mensalmente",
  specialNeeds: ["bagagem_extra", "acesso_facilitado", "transporte_bicicletas"],
  priorities: ["protecao", "conforto", "estetica"],
  parkingLocation: "garagem_fechada",
  specificNotes: "Entrega Técnica — Carlos Silva / Renegade Trailhawk Verde",
};

// Showroom discovery default: limpo para teste manual completo
const DISCOVERY_SHOWROOM: Partial<DiscoveryProfile> = {
  usageLocation: "cidade",
  monthlyKm: "500_1000",
  dirtRoadFrequency: "nunca",
  cargoUsage: "nao",
  frequentPassengers: [],
  tripFrequency: "raramente",
  specialNeeds: [],
  priorities: [],
  parkingLocation: "garagem_fechada",
  specificNotes: "",
};

// Itens inclusos na compra do veículo para Carlos Silva (Entrega Técnica)
const DELIVERY_INCLUDED_ITEMS = [
  { name: "Protetor de Cárter e Diferencial 4x4 Heavy Duty", status: "Instalado de Fábrica", icon: "🛡️" },
  { name: "Kit Parafusos Antifurto das Rodas de Liga", status: "Cortesia Concessionária", icon: "🔒" },
  { name: "Soleiras de Porta em Alumínio Trailhawk", status: "Item de Série da Versão", icon: "✨" },
];

// Oportunidades de Upsell não adquiridas na compra para oferta na entrega
const DELIVERY_UPSELL_OPPORTUNITIES = [
  { name: "Tapetes All-Weather de Borda Elevada Trailhawk", reason: "Retenção total de barro e líquidos com borda tipo bandeja", category: "Interior & Proteção", icon: "🛡️" },
  { name: "Película Solar Nano-Cerâmica 3M (Vidros Laterais)", reason: "Redução de até 60% do calor interno e proteção UV para passageiros", category: "Interior & Climatização", icon: "🌞" },
  { name: "Rack de Teto Adventure Mopar", reason: "Capacidade estendida para bagageiro ou suporte de bikes", category: "Exterior & Viagem", icon: "📦" },
  { name: "Iluminação Interna LED Trail Rated Mopar", reason: "Iluminação ambiente premium de alta durabilidade na cabine", category: "Interior & Tecnologia", icon: "💡" },
  { name: "Kit Protetor de Porta Interno Trail Rated", reason: "Proteção contra arranhões de calçados nos painéis de porta", category: "Interior & Preservação", icon: "🚗" },
];

export const ConsultativeDiscoveryChecklist: React.FC<{ onOpenReheatedLeads?: () => void }> = ({ onOpenReheatedLeads }) => {
  const {
    state,
    updateClientData,
    updateDiscoveryProfile,
    setClientSource,
    nextStep,
  } = useSalesJourney();

  const { clientData, discoveryProfile, clientSource } = state;

  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [voiceTranscriptText, setVoiceTranscriptText] = useState("");
  const [voiceParsedResult, setVoiceParsedResult] = useState<ParsedVoiceDiagnostic | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [dismissedAiKeys, setDismissedAiKeys] = useState<string[]>([]);

  // Source selection handler — loads preset data for each source mode
  const handleSourceSelect = (source: JourneyClientSource) => {
    setClientSource(source);
    if (source === "crm") {
      updateClientData(CRM_CLIENT);
      updateDiscoveryProfile(DISCOVERY_CRM);
    } else if (source === "technical-delivery") {
      updateClientData(DELIVERY_CLIENT);
      updateDiscoveryProfile(DISCOVERY_DELIVERY);
    } else if (source === "showroom") {
      updateClientData(SHOWROOM_DEFAULT);
      updateDiscoveryProfile(DISCOVERY_SHOWROOM);
    } else if (source === "reheated-lead") {
      // Open the leads modal to pick a lead from the list
      onOpenReheatedLeads?.();
    }
  };

  // Síntese comportamental da IA em tempo real com base no perfil
  const aiBehaviorSynthesis = React.useMemo(() => {
    const highlights: string[] = [];
    if (discoveryProfile.specialNeeds.includes("reboque")) {
      highlights.push("Tração & Reboque (Engate Removível Mopar)");
    }
    if (discoveryProfile.specialNeeds.includes("bagagem_extra")) {
      highlights.push("Ampliação Volumétrica (Bagageiro & Barras)");
    }
    if (discoveryProfile.specialNeeds.includes("transporte_bicicletas")) {
      highlights.push("Lazer Ativo (Suporte de Bikes)");
    }
    if (discoveryProfile.specialNeeds.includes("protecao_cacamba")) {
      highlights.push("Proteção de Caçamba (Capota & Protetor)");
    }
    if (discoveryProfile.specialNeeds.includes("acesso_facilitado")) {
      highlights.push("Acessibilidade (Estribos Laterais)");
    }
    if (discoveryProfile.specialNeeds.includes("iluminacao_adicional")) {
      highlights.push("Iluminação Extra (Faróis Auxiliares)");
    }
    if (discoveryProfile.specialNeeds.includes("organizacao_carga")) {
      highlights.push("Organização de Caçamba (Caixa & Tapetes)");
    }
    if (discoveryProfile.usageLocation === "zona_rural" || discoveryProfile.dirtRoadFrequency !== "nunca") {
      highlights.push("Uso Rural & Terreno Irregular (Blindagem de Cárter)");
    }
    if (discoveryProfile.frequentPassengers.includes("criancas") || discoveryProfile.frequentPassengers.includes("idosos")) {
      highlights.push("Conforto Familiar (Estribos & Tapetes All-Weather)");
    }

    const archetype = highlights.length > 0
      ? highlights.slice(0, 2).join(" • ")
      : "Uso Urbano & Rodoviário Conectado";

    return {
      archetype,
      highlights,
      confidenceScore: Math.min(99, 82 + highlights.length * 5),
    };
  }, [discoveryProfile]);

  // Helpers para atualização de perguntas multi-seleção
  const togglePassenger = (passenger: DiscoveryProfile["frequentPassengers"][number]) => {
    const current = discoveryProfile.frequentPassengers;
    const next = current.includes(passenger)
      ? current.filter((p) => p !== passenger)
      : [...current, passenger];
    updateDiscoveryProfile({ frequentPassengers: next.length > 0 ? next : ["apenas_motorista"] });
  };

  const toggleSpecialNeed = (need: DiscoveryProfile["specialNeeds"][number]) => {
    const current = discoveryProfile.specialNeeds;
    const next = current.includes(need) ? current.filter((n) => n !== need) : [...current, need];
    updateDiscoveryProfile({ specialNeeds: next });
  };

  const togglePriority = (priority: DiscoveryProfile["priorities"][number]) => {
    const current = discoveryProfile.priorities;
    if (current.includes(priority)) {
      updateDiscoveryProfile({ priorities: current.filter((p) => p !== priority) });
    } else {
      if (current.length >= 3) {
        // Máximo de 3 prioridades
        const shifted = [...current.slice(1), priority];
        updateDiscoveryProfile({ priorities: shifted });
      } else {
        updateDiscoveryProfile({ priorities: [...current, priority] });
      }
    }
  };

  // Simulação de entrada por voz
  const handleSimulateVoiceInput = (samplePhrase: string) => {
    setVoiceTranscriptText(samplePhrase);
    const parsed = parseVoiceTranscript(samplePhrase);
    setVoiceParsedResult(parsed);
  };

  const handleApplyVoiceParsing = () => {
    if (!voiceParsedResult) return;
    updateDiscoveryProfile({
      usageLocation: voiceParsedResult.usageLocation || discoveryProfile.usageLocation,
      dirtRoadFrequency: voiceParsedResult.dirtRoadFrequency || discoveryProfile.dirtRoadFrequency,
      cargoUsage: voiceParsedResult.cargoUsage || discoveryProfile.cargoUsage,
      frequentPassengers: voiceParsedResult.frequentPassengers.length > 0 ? voiceParsedResult.frequentPassengers : discoveryProfile.frequentPassengers,
      specialNeeds: voiceParsedResult.specialNeeds.length > 0 ? voiceParsedResult.specialNeeds : discoveryProfile.specialNeeds,
      priorities: voiceParsedResult.priorities.length > 0 ? voiceParsedResult.priorities : discoveryProfile.priorities,
      specificNotes: voiceTranscriptText,
    });
    setVoiceModalOpen(false);
    setVoiceParsedResult(null);
    setVoiceTranscriptText("");
  };

  const handleAiAccept = (key: string, value: string) => {
    const current = discoveryProfile.aiSuggestedAnswers || {};
    updateDiscoveryProfile({
      aiSuggestedAnswers: { ...current, [key]: value },
    });
  };

  const handleAiDismiss = (key: string) => {
    setDismissedAiKeys((prev) => [...prev, key]);
  };

  // Contagem de preenchimento
  const completedQuestionsCount = [
    discoveryProfile.usageLocation,
    discoveryProfile.monthlyKm,
    discoveryProfile.dirtRoadFrequency,
    discoveryProfile.cargoUsage,
    discoveryProfile.frequentPassengers.length > 0,
    discoveryProfile.tripFrequency,
    discoveryProfile.specialNeeds.length > 0,
    discoveryProfile.priorities.length > 0,
    discoveryProfile.parkingLocation,
  ].filter(Boolean).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* HEADER DE ETAPA */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold mb-2 border border-sky-200/60">
            <Compass className="w-3.5 h-3.5 text-sky-600" />
            <span>Etapa 1 de 7 · Diagnóstico Consultivo</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display">
            Entender o cliente
          </h1>
          <p className="text-sm text-slate-600 font-medium mt-1">
            Conheça o perfil e a utilização do veículo antes de apresentar qualquer solução.
          </p>
        </div>

        {/* CONTROLES RÁPIDOS: MODO DE ORIGEM E VOZ */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setVoiceModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
          >
            <Mic className="w-4 h-4" />
            <span>Diagnóstico por Voz</span>
          </button>

          <div className="text-right hidden sm:block pl-2 border-l border-slate-200">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Perguntas Respondidas</div>
            <div className="text-base font-black text-sky-600">{completedQuestionsCount} de 10</div>
          </div>
        </div>
      </div>

      {/* SELETOR DE ORIGEM DO ATENDIMENTO (Showroom, CRM, Entrega Técnica, Lead Reaquecido) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            id: "showroom" as JourneyClientSource,
            title: "Showroom",
            desc: "Entrevista consultiva completa",
            icon: <Store className="w-4 h-4" />,
            color: "border-sky-500 bg-sky-50/50 text-sky-900",
          },
          {
            id: "crm" as JourneyClientSource,
            title: "CRM",
            desc: "Dados carregados previamente",
            icon: <Database className="w-4 h-4" />,
            color: "border-blue-500 bg-blue-50/50 text-blue-900",
          },
          {
            id: "technical-delivery" as JourneyClientSource,
            title: "Entrega Técnica",
            desc: "Diagnóstico rápido de upsell",
            icon: <PackageCheck className="w-4 h-4" />,
            color: "border-amber-500 bg-amber-50/50 text-amber-900",
          },
          {
            id: "reheated-lead" as JourneyClientSource,
            title: "Lead Reaquecido",
            desc: "Recuperação com objeções salvas",
            icon: <Flame className="w-4 h-4 text-orange-500" />,
            color: "border-orange-500 bg-orange-50/50 text-orange-900",
          },
        ].map((item) => {
          const isSelected = clientSource === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSourceSelect(item.id)}
              className={`p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                isSelected
                  ? `${item.color} shadow-sm ring-1 ring-black/5`
                  : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs flex items-center gap-1.5">{item.icon} {item.title}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-sky-600 stroke-[3]" />}
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">{item.desc}</p>
            </button>
          );
        })}
      </div>

      {/* FEEDBACK & CONTEXTO DA ORIGEM DO ATENDIMENTO */}
      {/* 1. MODO SHOWROOM */}
      {clientSource === "showroom" && (
        <div className="rounded-2xl bg-sky-50 border border-sky-200 p-4 flex items-center justify-between gap-3 text-xs text-sky-950 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold shadow-sm shrink-0">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sky-900 text-xs">
                Modo Showroom: Jeep Compass Limited Branco Polar Pré-Selecionado
              </p>
              <p className="text-sky-700 text-[11px] mt-0.5">
                Campos de cliente e respostas de diagnóstico liberados para preenchimento em tempo real durante a demonstração.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase bg-sky-200 text-sky-800 px-2.5 py-1 rounded-md shrink-0 hidden sm:inline-block">
            Atendimento Presencial
          </span>
        </div>
      )}

      {/* 2. MODO CRM (João Silva • Rampage Rebel) */}
      {clientSource === "crm" && (
        <div className="rounded-2xl bg-blue-50/80 border-2 border-blue-200 p-4 sm:p-5 shadow-sm space-y-3 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-600/20 shrink-0">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-blue-800">Sincronização CRM Stellantis Ativa</span>
                  <span className="text-[10px] bg-blue-200 text-blue-900 border border-blue-300 px-2 py-0.5 rounded-full font-bold">
                    Cliente Cadastrado
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 mt-0.5">
                  {clientData.clientName} — {clientData.vehicleModel} ({clientData.vehicleColor})
                </h3>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Origem do Lead</span>
              <span className="text-xs font-black text-blue-700">CRM Vendas Diretas / Agro • 42 anos</span>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-blue-100 p-3 text-xs text-slate-600 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              <strong>Histórico Sincronizado:</strong> Perfil de trabalho intenso com tração e caçamba em Mato Grosso (MT). Demandas de reboque e proteção pré-validadas.
            </span>
          </div>
        </div>
      )}

      {/* 3. MODO ENTREGA TÉCNICA (Carlos Silva • Renegade Trailhawk • Itens inclusos + Upsell) */}
      {clientSource === "technical-delivery" && (
        <div className="bg-gradient-to-br from-amber-500/10 via-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md shadow-amber-500/20 shrink-0">
                <PackageCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-800">Modo Entrega Técnica • Upsell Personalizado</span>
                  <span className="text-[10px] bg-amber-200 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full font-bold">
                    Oportunidade Imediata na Entrega
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 mt-0.5">
                  Carlos Silva — {clientData.vehicleModel} ({clientData.vehicleColor})
                </h3>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Status do Veículo</span>
              <span className="text-xs font-black text-amber-800">Faturado • Retirada no Pátio</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Coluna 1: Acessórios já inclusos no pedido */}
            <div className="bg-white rounded-xl border border-amber-200 p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Acessórios Já Inclusos na Compra do Veículo
                </span>
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                  3 itens montados
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Acessórios faturados no pedido original (já instalados ou em montagem de oficina):
              </p>
              <div className="space-y-1.5">
                {DELIVERY_INCLUDED_ITEMS.map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{item.icon}</span>
                      <span className="font-semibold text-slate-800">{item.name}</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md shrink-0">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Coluna 2: Oportunidades de Upsell não adquiridas */}
            <div className="bg-white rounded-xl border border-amber-200 p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  Oportunidades de Upsell da Entrega Técnica
                </span>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full">
                  Oferta Consultiva
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Itens não adquiridos na compra que a IA identificou com alta taxa de conversão na entrega:
              </p>
              <div className="space-y-1.5">
                {DELIVERY_UPSELL_OPPORTUNITIES.slice(0, 3).map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-2.5 rounded-lg bg-amber-50/40 border border-amber-100 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-base shrink-0">{item.icon}</span>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 truncate">{item.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">{item.reason}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-md shrink-0 ml-2">
                      {item.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-amber-100/70 border border-amber-200 rounded-xl px-4 py-2.5 flex items-center gap-2 text-xs text-amber-900 font-medium">
            <Info className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              💡 <strong>Dica Consultiva de Entrega:</strong> Conforme você confirma os hábitos do Carlos Silva abaixo, a IA ajusta o kit de entrega na Etapa 2 para sugerir os acessórios perfeitos antes da saída do carro.
            </span>
          </div>
        </div>
      )}

      {/* 4. MODO LEAD REAQUECIDO */}
      {clientSource === "reheated-lead" && (
        <div className="rounded-2xl bg-orange-50/90 border-2 border-orange-200 p-4 sm:p-5 shadow-sm space-y-3 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold shadow-md shadow-orange-500/20 shrink-0">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-orange-800">Lead Reaquecido Ativo</span>
                  <span className="text-[10px] bg-orange-200 text-orange-900 border border-orange-300 px-2 py-0.5 rounded-full font-bold">
                    Retomada de Oportunidade
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 mt-0.5">
                  {clientData.clientName || "Lead Selecionado"} — {clientData.vehicleModel} ({clientData.vehicleColor})
                </h3>
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenReheatedLeads}
              className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs self-start sm:self-auto transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Abrir Lista de Leads</span>
            </button>
          </div>
          <div className="bg-white rounded-xl border border-orange-100 p-3 text-xs text-slate-600 flex items-center gap-2">
            <Info className="w-4 h-4 text-orange-600 shrink-0" />
            <span>
              Proposta anterior e histórico de objeções carregados. Você pode revisar as respostas do diagnóstico ou avançar diretamente para as recomendações calibradas.
            </span>
          </div>
        </div>
      )}

      {/* DADOS BÁSICOS DO CLIENTE & VEÍCULO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Car className="w-4 h-4 text-sky-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Veículo do Cliente</h2>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="input-vehicle-model">Modelo & Versão</label>
            <select
              id="input-vehicle-model"
              value={clientData.vehicleModel}
              onChange={(e) => updateClientData({ vehicleModel: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 cursor-pointer"
            >
              {vehicleGroups.map((g) => (
                <optgroup key={g.brand} label={g.brand}>
                  {g.models.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="input-vehicle-color">Cor</label>
              <select
                id="input-vehicle-color"
                value={clientData.vehicleColor}
                onChange={(e) => updateClientData({ vehicleColor: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 text-xs sm:text-sm font-medium text-slate-900 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 cursor-pointer"
              >
                {vehicleColors.map((c) => (
                  <option key={c.name} value={c.name}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="input-vehicle-year">Ano / Fabricação</label>
              <select
                id="input-vehicle-year"
                value={clientData.vehicleYear}
                onChange={(e) => updateClientData({ vehicleYear: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 text-xs sm:text-sm font-medium text-slate-900 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 cursor-pointer"
              >
                {vehicleYears.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <User className="w-4 h-4 text-sky-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Identificação & Localização</h2>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="input-client-name">Nome do Cliente</label>
            <input
              id="input-client-name"
              type="text"
              value={clientData.clientName}
              onChange={(e) => updateClientData({ clientName: e.target.value })}
              placeholder="Ex: João Silva"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="input-client-state">Estado / Região</label>
              <select
                id="input-client-state"
                value={clientData.state}
                onChange={(e) => updateClientData({ state: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 text-xs sm:text-sm font-medium text-slate-900 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 cursor-pointer"
              >
                {states.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="input-client-gender">Perfil de Compra</label>
              <select
                id="input-client-gender"
                value={clientData.clientGender}
                onChange={(e) => updateClientData({ clientGender: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 text-xs sm:text-sm font-medium text-slate-900 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 cursor-pointer"
              >
                <option value="Masculino">Pessoa Física (Masculino)</option>
                <option value="Feminino">Pessoa Física (Feminino)</option>
                <option value="Pessoa Jurídica (PJ / Frotista)">Pessoa Jurídica (PJ / Frotista)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* PAINEL DE INTELIGÊNCIA PREDITIVA EM TEMPO REAL (MOPAR AI RADAR) */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-5 sm:p-6 text-white border border-slate-700 shadow-xl space-y-4 animate-in fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-500/20 shrink-0">
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-sky-400">Inteligência Preditiva IA</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  ● Calibração Ativa em Tempo Real
                </span>
              </div>
              <p className="text-sm font-bold text-white mt-0.5">
                {aiBehaviorSynthesis.archetype}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Aderência da IA</span>
              <p className="text-sm font-black text-sky-400">{aiBehaviorSynthesis.confidenceScore}%</p>
            </div>
          </div>
        </div>

        {/* PRÉVIA DOS ITENS DIRECIONADOS EM TEMPO REAL */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">
              Itens Essenciais calculados em tempo real pela IA para este perfil:
            </span>
            <span className="text-[11px] font-bold text-sky-400">
              {state.recommendations.filter((r) => r.tier === "essential").length} Essenciais Priorizados
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {state.recommendations
              .filter((r) => r.tier === "essential")
              .slice(0, 3)
              .map((rec) => (
                <div
                  key={rec.accessoryId}
                  className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl p-3 flex items-center gap-2.5 transition-all shadow-sm"
                >
                  <span className="text-xl p-1.5 rounded-lg bg-slate-700/60 shrink-0">
                    {rec.accessory.icon || "🚗"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate">{rec.accessory.name}</p>
                    <p className="text-[10px] text-sky-400 font-semibold truncate">
                      {rec.hasExplicitDemandMatch ? "🎯 Demanda Direta" : `${rec.matchScore}% Match Preditivo`}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* AS 10 PERGUNTAS CONSULTIVAS ESTRUTURADAS EM CARDS */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-sky-600" />
          <h2 className="text-lg font-bold text-slate-900 font-display">
            Checklist de Diagnóstico de Utilização (10 Perguntas Mínimas)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. Onde o veículo será utilizado */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-3">
            <span className="text-[11px] font-bold text-sky-600 uppercase tracking-wider">Pergunta 1 de 10</span>
            <h3 className="text-sm font-bold text-slate-900">Onde o veículo será utilizado com maior frequência?</h3>
            <div className="grid grid-cols-2 gap-2">
              {([
                { id: "cidade", label: "Cidade / Trânsito Urbano" },
                { id: "rodovia", label: "Rodovias / Estradas" },
                { id: "zona_rural", label: "Zona Rural" },
                { id: "litoral", label: "Litoral / Maresia" },
                { id: "uso_misto", label: "Uso Misto" },
                { id: "off_road", label: "Trilhas / Off-road" },
              ] as { id: DiscoveryProfile["usageLocation"]; label: string }[]).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => updateDiscoveryProfile({ usageLocation: opt.id })}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold text-center border transition-all cursor-pointer ${
                    discoveryProfile.usageLocation === opt.id
                      ? "bg-sky-600 text-white border-sky-600 shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Quilometragem mensal aproximada */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-3">
            <span className="text-[11px] font-bold text-sky-600 uppercase tracking-wider">Pergunta 2 de 10</span>
            <h3 className="text-sm font-bold text-slate-900">Qual será a quilometragem mensal aproximada?</h3>
            <div className="grid grid-cols-2 gap-2">
              {([
                { id: "ate_500", label: "Até 500 km" },
                { id: "500_1000", label: "500 a 1.000 km" },
                { id: "1000_2000", label: "1.000 a 2.000 km" },
                { id: "acima_2000", label: "Acima de 2.000 km" },
              ] as { id: DiscoveryProfile["monthlyKm"]; label: string }[]).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => updateDiscoveryProfile({ monthlyKm: opt.id })}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold text-center border transition-all cursor-pointer ${
                    discoveryProfile.monthlyKm === opt.id
                      ? "bg-sky-600 text-white border-sky-600 shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Frequência em estradas de terra */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-3">
            <span className="text-[11px] font-bold text-sky-600 uppercase tracking-wider">Pergunta 3 de 10</span>
            <h3 className="text-sm font-bold text-slate-900">Com que frequência passará por estradas de terra?</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {([
                { id: "nunca", label: "Nunca" },
                { id: "ocasionalmente", label: "Ocasional" },
                { id: "semanalmente", label: "Semanal" },
                { id: "diariamente", label: "Diário" },
              ] as { id: DiscoveryProfile["dirtRoadFrequency"]; label: string }[]).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => updateDiscoveryProfile({ dirtRoadFrequency: opt.id })}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold text-center border transition-all cursor-pointer ${
                    discoveryProfile.dirtRoadFrequency === opt.id
                      ? "bg-sky-600 text-white border-sky-600 shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Transporte de cargas */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-3">
            <span className="text-[11px] font-bold text-sky-600 uppercase tracking-wider">Pergunta 4 de 10</span>
            <h3 className="text-sm font-bold text-slate-900">O veículo será usado para transportar cargas?</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {([
                { id: "nao", label: "Não transporta" },
                { id: "cargas_leves", label: "Cargas leves" },
                { id: "ferramentas", label: "Ferramentas" },
                { id: "materiais_profissionais", label: "Materiais prof." },
                { id: "cargas_pesadas", label: "Cargas pesadas" },
              ] as { id: DiscoveryProfile["cargoUsage"]; label: string }[]).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => updateDiscoveryProfile({ cargoUsage: opt.id })}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold text-center border transition-all cursor-pointer ${
                    discoveryProfile.cargoUsage === opt.id
                      ? "bg-sky-600 text-white border-sky-600 shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Quem será transportado com frequência? (múltipla seleção) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-sky-600 uppercase tracking-wider">Pergunta 5 de 10</span>
              <span className="text-[10px] font-bold text-slate-500">Múltipla seleção</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">Quem será transportado com frequência?</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {([
                { id: "criancas", label: "👶 Crianças" },
                { id: "idosos", label: "👵 Idosos" },
                { id: "animais", label: "🐕 Animais" },
                { id: "equipe_trabalho", label: "👷 Equipe trabalho" },
                { id: "apenas_motorista", label: "👤 Apenas motorista" },
              ] as { id: DiscoveryProfile["frequentPassengers"][number]; label: string }[]).map((opt) => {
                const isSelected = discoveryProfile.frequentPassengers.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => togglePassenger(opt.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold text-center border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-sky-600 text-white border-sky-600 shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Frequência de viagens */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-3">
            <span className="text-[11px] font-bold text-sky-600 uppercase tracking-wider">Pergunta 6 de 10</span>
            <h3 className="text-sm font-bold text-slate-900">Com que frequência realiza viagens?</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {([
                { id: "raramente", label: "Raramente" },
                { id: "mensalmente", label: "Mensalmente" },
                { id: "quinzenalmente", label: "Quinzenal" },
                { id: "semanalmente", label: "Semanal" },
              ] as { id: DiscoveryProfile["tripFrequency"]; label: string }[]).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => updateDiscoveryProfile({ tripFrequency: opt.id })}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold text-center border transition-all cursor-pointer ${
                    discoveryProfile.tripFrequency === opt.id
                      ? "bg-sky-600 text-white border-sky-600 shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 7. Necessidades específicas (múltipla seleção) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-3 md:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-sky-600 uppercase tracking-wider">Pergunta 7 de 10</span>
              <span className="text-[10px] font-bold text-slate-500">Múltipla seleção</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">Existe necessidade específica identificada?</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {([
                { id: "reboque", label: "🔗 Reboque / Carreta" },
                { id: "transporte_bicicletas", label: "🚲 Transporte de bikes" },
                { id: "bagagem_extra", label: "🧳 Bagagem extra" },
                { id: "protecao_cacamba", label: "🛡️ Proteção de caçamba" },
                { id: "acesso_facilitado", label: "🚗 Acesso facilitado" },
                { id: "iluminacao_adicional", label: "💡 Iluminação extra" },
                { id: "organizacao_carga", label: "🧰 Organização de carga" },
              ] as { id: DiscoveryProfile["specialNeeds"][number]; label: string }[]).map((opt) => {
                const isSelected = discoveryProfile.specialNeeds.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleSpecialNeed(opt.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold text-center border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-sky-600 text-white border-sky-600 shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 8. As 3 prioridades principais */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-3 md:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-sky-600 uppercase tracking-wider">Pergunta 8 de 10</span>
              <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                Selecione até 3 prioridades ({discoveryProfile.priorities.length}/3)
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">Quais são as três prioridades principais para o cliente?</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {([
                { id: "protecao", label: "🛡️ Proteção" },
                { id: "seguranca", label: "🔒 Segurança" },
                { id: "praticidade", label: "⚡ Praticidade" },
                { id: "conforto", label: "🛋️ Conforto" },
                { id: "estetica", label: "✨ Estética" },
                { id: "tecnologia", label: "📱 Tecnologia" },
                { id: "desempenho", label: "⚙️ Desempenho" },
                { id: "valorizacao_revenda", label: "📈 Valorização na revenda" },
              ] as { id: DiscoveryProfile["priorities"][number]; label: string }[]).map((opt) => {
                const isSelected = discoveryProfile.priorities.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => togglePriority(opt.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold text-center border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xs font-bold"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 9. Onde o veículo ficará estacionado? */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-3">
            <span className="text-[11px] font-bold text-sky-600 uppercase tracking-wider">Pergunta 9 de 10</span>
            <h3 className="text-sm font-bold text-slate-900">Onde o veículo ficará estacionado?</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {([
                { id: "garagem_fechada", label: "Garagem fechada" },
                { id: "estacionamento_aberto", label: "Estacionamento aberto" },
                { id: "rua", label: "Rua pública" },
                { id: "area_rural", label: "Área rural" },
                { id: "ambiente_industrial", label: "Ambiente industrial" },
              ] as { id: DiscoveryProfile["parkingLocation"]; label: string }[]).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => updateDiscoveryProfile({ parkingLocation: opt.id })}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold text-center border transition-all cursor-pointer ${
                    discoveryProfile.parkingLocation === opt.id
                      ? "bg-sky-600 text-white border-sky-600 shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 10. Necessidade ou preocupação específica (texto livre) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-3">
            <span className="text-[11px] font-bold text-sky-600 uppercase tracking-wider">Pergunta 10 de 10</span>
            <h3 className="text-sm font-bold text-slate-900">Existe alguma necessidade ou preocupação específica?</h3>
            <textarea
              rows={2}
              value={discoveryProfile.specificNotes}
              onChange={(e) => updateDiscoveryProfile({ specificNotes: e.target.value })}
              placeholder="Ex: Vai transportar barcos no fim do ano; esposa tem dificuldade de subir no carro..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600"
            />
          </div>
        </div>
      </div>

      {/* PERGUNTAS ADICIONAIS SUGERIDAS PELA PLATAFORMA */}
      <AIQuestionSuggestion
        discovery={discoveryProfile}
        onAcceptSuggestion={handleAiAccept}
        onDismiss={handleAiDismiss}
        dismissedKeys={dismissedAiKeys}
      />

      {/* BOTÃO DE AVANÇO PARA A ETAPA 2 */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <div className="text-xs text-slate-500">
          Ordem obrigatória: <strong>Entender o cliente</strong> → Recomendar acessórios → Ver no veículo
        </div>
        <button
          type="button"
          onClick={nextStep}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
        >
          <span>Avançar para Recomendar Acessórios</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* MODAL / CARD DE CAPTURA POR VOZ & PARSER DETERMINÍSTICO */}
      {voiceModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-sky-700 font-bold text-sm">
                <Mic className="w-4 h-4 text-sky-600" />
                <span>Captura por Voz com Interpretação Assistida</span>
              </div>
              <button
                type="button"
                onClick={() => setVoiceModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 text-xs cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Fale ou registre a rotina descrita pelo cliente. A plataforma irá interpretar os padrões de uso e sugerir os parâmetros de diagnóstico.
            </p>

            {/* Simulações de exemplo rápido */}
            <div className="bg-slate-50 p-3 rounded-xl space-y-1.5 border border-slate-200/70">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Exemplos rápidos de voz:</div>
              <button
                type="button"
                onClick={() => handleSimulateVoiceInput("Ele usa o carro durante a semana na cidade, mas todo fim de semana vai para o sítio. Leva os dois filhos e algumas ferramentas na caçamba.")}
                className="block text-left text-xs text-sky-700 hover:underline p-1 cursor-pointer font-medium"
              >
                🎙️ “Ele usa o carro na cidade, vai ao sítio no fim de semana, leva 2 filhos e ferramentas na caçamba.”
              </button>
              <button
                type="button"
                onClick={() => handleSimulateVoiceInput("Faz trilhas e estradas de terra diárias na fazenda com carga pesada e funcionários.")}
                className="block text-left text-xs text-sky-700 hover:underline p-1 cursor-pointer font-medium"
              >
                🎙️ “Faz trilhas e estradas de terra diárias na fazenda com carga pesada e funcionários.”
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="input-voice-transcript">Transcrição do Consultor / Áudio</label>
              <textarea
                id="input-voice-transcript"
                rows={3}
                value={voiceTranscriptText}
                onChange={(e) => {
                  setVoiceTranscriptText(e.target.value);
                  setVoiceParsedResult(parseVoiceTranscript(e.target.value));
                }}
                placeholder="Fale ou digite a frase do cliente..."
                className="w-full rounded-xl border border-slate-200 p-3 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600"
              />
            </div>

            {/* SEÇÃO: ENTENDI CORRETAMENTE? */}
            {voiceParsedResult && (
              <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-sky-900 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  <span>Entendi corretamente?</span>
                </div>
                <p className="text-xs text-slate-700 font-medium">
                  {voiceParsedResult.summaryMessage}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {voiceParsedResult.extractedKeywords.map((kw) => (
                    <span
                      key={kw}
                      className="px-2 py-0.5 rounded-full bg-white text-sky-800 text-[11px] font-semibold border border-sky-300 shadow-2xs"
                    >
                      ✓ {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setVoiceModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={!voiceParsedResult}
                onClick={handleApplyVoiceParsing}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Confirmar e Aplicar Diagnóstico
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
