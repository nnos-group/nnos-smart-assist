import { useState, useMemo, useEffect } from "react";
import {
  Zap, ArrowRight, ShieldCheck, Check, Sparkles, MapPin,
  Database, Mic2, PackageCheck, Search, User, AlertTriangle,
  BadgeCheck, ShoppingCart, X, Loader2, Car, Store, Compass,
} from "lucide-react";
import { ClientData } from "@/types/accessories";
import VoiceInputButton from "./VoiceInputButton";
import { getRegionalTelemetryInsight, RegionalIntelligenceData } from "@/lib/regionalIntelligence";

// ─── Types ───────────────────────────────────────────────────────────────────
type ClientSource = "crm" | "live" | "delivery";

interface ClientDataScreenProps {
  clientData: ClientData;
  onClientDataChange: (data: ClientData) => void;
  onGenerateSuggestion: () => void;
}

interface CrmAccessory {
  name: string;
  inStock: boolean;
}

// ─── Static Data ─────────────────────────────────────────────────────────────
export const vehicleGroups = [
  {
    brand: "RAM",
    models: [
      "RAM RAMPAGE REBEL", "RAM RAMPAGE LARAMIE",
      "RAM 1500 LARAMIE", "RAM 2500 LARAMIE", "RAM 3500 LARAMIE",
    ],
  },
  { brand: "FIAT", models: ["FIAT TORO RANCH", "FIAT TORO ULTRA"] },
  {
    brand: "JEEP RENEGADE",
    models: [
      "JEEP RENEGADE SPORT", "JEEP RENEGADE LONGITUDE",
      "JEEP RENEGADE SAHARA", "JEEP RENEGADE TRAILHAWK", "JEEP RENEGADE SERIE S",
    ],
  },
  {
    brand: "JEEP COMPASS",
    models: [
      "JEEP COMPASS SPORT", "JEEP COMPASS LONGITUDE", "JEEP COMPASS LIMITED",
      "JEEP COMPASS SERIE S", "JEEP COMPASS TRAILHAWK", "JEEP COMPASS BLACKHAWK",
    ],
  },
  { brand: "JEEP SUVS", models: ["JEEP COMMANDER OVERLAND"] },
];

export const vehicleColors = [
  { name: "Verde Recon", label: "🟢 Verde Recon (Metálica)", color: "#2d4a3e" },
  { name: "Preto Carbon", label: "⚫ Carbon Black (Perolizada)", color: "#1a1a1a" },
  { name: "Branco Polar", label: "⚪ Branco Polar (Sólida)", color: "#f5f5f5" },
  { name: "Cinza Granite", label: "🔘 Sting Gray (Exclusiva)", color: "#5a5a5a" },
  { name: "Vermelho Volcano", label: "🔴 Vermelho Colorado", color: "#B22222" },
  { name: "Azul Patriot", label: "🔵 Azul Patriot (Metálica)", color: "#1e3a5f" },
];

export const vehicleYears = [
  "2025 / 2026 (0 km)", "2024 / 2025", "2024 / 2024", "2023 / 2024", "2023 / 2023",
];

export const states = [
  "Mato Grosso (MT)", "São Paulo (SP)", "Goiás (GO)", "Minas Gerais (MG)",
  "Paraná (PR)", "Mato Grosso do Sul (MS)", "Bahia (BA)", "Rio de Janeiro (RJ)",
  "Rio Grande do Sul (RS)", "Santa Catarina (SC)", "Ceará (CE)", "Pernambuco (PE)",
  "Espírito Santo (ES)", "Distrito Federal (DF)", "Amazonas (AM)", "Pará (PA)",
  "Rondônia (RO)", "Tocantins (TO)",
];

export const terrainTypes = [
  "Uso Misto (Urbano / Rural)",
  "100% Urbano / Rodovias Pavimentadas",
  "Predominância Rural / Estradas de Terra",
  "Litoral / Areia & Maresia Intensa",
  "Trilhas Off-Road / Severo",
];

export const climateConditions = [
  "Alta Incidência de Chuvas & Poeira",
  "Calor Extremo & Radiação Solar Intensa",
  "Clima Temperado / Chuvoso Moderado",
  "Secura Extrema & Particulados de Minério",
];

// ─── Clientes Mock ────────────────────────────────────────────────────────────
const CRM_CLIENT: ClientData = {
  vehicleModel: "RAM RAMPAGE REBEL",
  vehicleColor: "Verde Recon",
  vehicleYear: "2025 / 2026 (0 km)",
  clientName: "João Silva",
  clientAge: "42",
  clientGender: "Masculino",
  state: "Mato Grosso (MT)",
  terrainType: "Uso Misto (Urbano / Rural)",
  climateCondition: "Alta Incidência de Chuvas & Poeira",
};

const CRM_ACCESSORIES: CrmAccessory[] = [
  { name: "Protetor de Cárter Reforçado Mopar", inStock: true },
  { name: "Película Solar Nano-Cerâmica 3M", inStock: true },
  { name: "Tapetes Termoplásticos Borda Elevada", inStock: true },
  { name: "Estribo Lateral Mopar Retrátil", inStock: false },
  { name: "Kit Vedação Anti-Poeira (porta e caçamba)", inStock: false },
];

const DELIVERY_CLIENT: ClientData = {
  vehicleModel: "JEEP RENEGADE TRAILHAWK",
  vehicleColor: "Verde Recon",
  vehicleYear: "2024 / 2025",
  clientName: "Carlos Silva",
  clientAge: "37",
  clientGender: "Masculino",
  state: "São Paulo (SP)",
  terrainType: "Uso Misto (Urbano / Rural)",
  climateCondition: "Clima Temperado / Chuvoso Moderado",
};

const DELIVERY_UPSELL: CrmAccessory[] = [
  { name: "Tapetes Personalizados Mopar (jogo completo)", inStock: true },
  { name: "Película de Proteção Solar 3M", inStock: true },
  { name: "Rack de Teto Mopar para Renegade", inStock: true },
  { name: "Frisos de Proteção de Porta (4 peças)", inStock: true },
  { name: "Kit Primeiros Socorros Mopar", inStock: true },
];

// ─── Source Selector Tabs ──────────────────────────────────────────────────
const SOURCE_TABS: { id: ClientSource; label: string; icon: React.ReactNode; description: string; color: string }[] = [
  {
    id: "crm",
    label: "CRM",
    icon: <Database className="w-4 h-4" />,
    description: "Buscar cliente cadastrado",
    color: "blue",
  },
  {
    id: "live",
    label: "Show room",
    icon: <Store className="w-4 h-4" />,
    description: "Atendimento presencial no salão",
    color: "rose",
  },
  {
    id: "delivery",
    label: "Entrega Técnica",
    icon: <PackageCheck className="w-4 h-4" />,
    description: "Upsell na entrega",
    color: "amber",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Formulário de campos do veículo e cliente — compartilhado entre modos */
const VehicleAndClientFields = ({
  clientData,
  handleChange,
  readonly = false,
}: {
  clientData: ClientData;
  handleChange: (field: keyof ClientData, value: string) => void;
  readonly?: boolean;
}) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* CARD: Veículo */}
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center flex-shrink-0">
              <Car className="w-4 h-4 text-sky-600" />
            </div>
            <h2 className="text-base font-bold text-slate-900 font-display">Veículo</h2>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5" htmlFor="vehicle-model">Modelo & Versão</label>
            <select id="vehicle-model" value={clientData.vehicleModel} disabled={readonly}
              onChange={(e) => handleChange("vehicleModel", e.target.value)}
              className="block w-full rounded-xl border-slate-200 text-sm font-semibold text-slate-800 shadow-sm focus:border-sky-500 focus:ring-sky-500 bg-slate-50/50 py-2.5 px-3.5 transition disabled:opacity-70 disabled:cursor-default">
              {vehicleGroups.map((g) => (
                <optgroup key={g.brand} label={`🚗 ${g.brand}`}>
                  {g.models.map((m) => <option key={m} value={m}>{m}</option>)}
                </optgroup>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5" htmlFor="vehicle-color">Cor / Acabamento</label>
              <select id="vehicle-color" value={clientData.vehicleColor} disabled={readonly}
                onChange={(e) => handleChange("vehicleColor", e.target.value)}
                className="block w-full rounded-xl border-slate-200 text-sm text-slate-800 shadow-sm focus:border-sky-500 focus:ring-sky-500 bg-slate-50/50 py-2.5 px-3.5 transition font-medium disabled:opacity-70 disabled:cursor-default">
                {vehicleColors.map((c) => <option key={c.name} value={c.name}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5" htmlFor="vehicle-year">Ano / Fabricação</label>
              <select id="vehicle-year" value={clientData.vehicleYear} disabled={readonly}
                onChange={(e) => handleChange("vehicleYear", e.target.value)}
                className="block w-full rounded-xl border-slate-200 text-sm text-slate-800 shadow-sm focus:border-sky-500 focus:ring-sky-500 bg-slate-50/50 py-2.5 px-3.5 transition font-medium disabled:opacity-70 disabled:cursor-default">
                {vehicleYears.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

    </div>

    {/* CARD: Cliente */}
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center">
              <User className="w-4 h-4 text-sky-600" />
            </div>
            <h2 className="text-base font-bold text-slate-900 font-display">Cliente</h2>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5" htmlFor="customer-name">Nome Completo</label>
            <input id="customer-name" type="text" value={clientData.clientName} readOnly={readonly}
              onChange={(e) => handleChange("clientName", e.target.value)}
              placeholder="Digite o nome completo..."
              className="block w-full rounded-xl border-slate-200 text-sm font-semibold text-slate-800 shadow-sm focus:border-sky-500 focus:ring-sky-500 bg-slate-50/50 py-2.5 px-3.5 transition read-only:opacity-70 read-only:cursor-default" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5" htmlFor="customer-age">Idade</label>
              <div className="relative">
                <input id="customer-age" type="number" value={clientData.clientAge} readOnly={readonly}
                  onChange={(e) => handleChange("clientAge", e.target.value)}
                  placeholder="35"
                  className="block w-full rounded-xl border-slate-200 text-sm text-slate-800 shadow-sm focus:border-sky-500 focus:ring-sky-500 bg-slate-50/50 py-2.5 px-3.5 transition font-medium pr-12 read-only:opacity-70 read-only:cursor-default" />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-xs text-slate-400 font-medium">anos</div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5" htmlFor="customer-gender">Gênero</label>
              <select id="customer-gender" value={clientData.clientGender} disabled={readonly}
                onChange={(e) => handleChange("clientGender", e.target.value)}
                className="block w-full rounded-xl border-slate-200 text-sm text-slate-800 shadow-sm focus:border-sky-500 focus:ring-sky-500 bg-slate-50/50 py-2.5 px-3.5 transition font-medium disabled:opacity-70 disabled:cursor-default">
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Não-binário / Outro">Não-binário / Outro</option>
                <option value="Pessoa Jurídica (PJ / Frotista)">PJ / Frotista</option>
              </select>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
);

/** Card de telemetria regional compartilhado com inteligência preditiva profunda */
const RegionalCard = ({
  clientData,
  handleChange,
  insight,
  readonly = false,
  deliveryMode = false,
}: {
  clientData: ClientData;
  handleChange: (field: keyof ClientData, value: string) => void;
  insight: RegionalIntelligenceData;
  readonly?: boolean;
  deliveryMode?: boolean;
}) => (
  <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-7 space-y-6">
    {/* BEGIN: Header & Telemetry Status */}
    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100 shadow-xs">
          <Compass className="w-5 h-5 text-sky-600" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900 font-display">
            Análise Regional Preditiva
          </h2>
          <p className="text-xs text-slate-500">
            Calibração geoclimática com base em telemetria veicular
          </p>
        </div>
      </div>
    </div>
    {/* END: Header & Telemetry Status */}

    {/* BEGIN: Selector Controls */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {[
        { id: "region-state", label: "Estado / Região", field: "state" as keyof ClientData, options: states },
        { id: "region-terrain", label: "Tipo de Terreno", field: "terrainType" as keyof ClientData, options: terrainTypes },
        { id: "region-climate", label: "Condição Climática", field: "climateCondition" as keyof ClientData, options: climateConditions },
      ].map(({ id, label, field, options }) => (
        <div key={id}>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5" htmlFor={id}>{label}</label>
          <select id={id} value={clientData[field]} disabled={readonly}
            onChange={(e) => handleChange(field, e.target.value)}
            className="block w-full rounded-xl border-slate-200 text-sm font-medium text-slate-800 shadow-sm focus:border-sky-500 focus:ring-sky-500 bg-slate-50/50 py-2.5 px-3.5 transition disabled:opacity-70 disabled:cursor-default">
            {options.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      ))}
    </div>
    {/* END: Selector Controls */}

    {/* BEGIN: Geoclimatic Risk Diagnostics (4 Factors) */}
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
          Fatores Geoclimáticos &amp; Risco Operacional ({insight.stateName})
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {insight.geoclimaticRisks.map((risk) => (
          <div
            key={risk.id}
            className="rounded-xl p-3.5 border bg-slate-50/70 border-slate-200/80 flex flex-col justify-between space-y-2 hover:bg-white transition shadow-xs"
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs font-bold text-slate-800 truncate" title={risk.name}>
                {risk.name}
              </span>
              <span
                className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded shrink-0"
                style={{
                  backgroundColor: `${risk.color}15`,
                  color: risk.color,
                  border: `1px solid ${risk.color}40`,
                }}
              >
                {risk.level}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Índice de Exposição</span>
                <span className="font-bold text-slate-700 font-mono">{risk.score}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${risk.score}%`,
                    backgroundColor: risk.color,
                  }}
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
              {risk.description}
            </p>
          </div>
        ))}
      </div>
    </div>
    {/* END: Geoclimatic Risk Diagnostics */}

    {/* BEGIN: Predictive Synthesis Card */}
    <div className="rounded-2xl bg-gradient-to-br from-[#00192e] via-[#052648] to-[#0a1e3f] text-white p-5 sm:p-6 border border-sky-900 shadow-lg relative overflow-hidden space-y-5">
      {/* Glow effect */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header of synthesis */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-sky-400/20 text-sky-200 border border-sky-400/30 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
              Confiança Preditiva: {insight.confidenceRate}
            </span>
            <span className="bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
              Aderência da Rede: {insight.dealershipAdoptionRate}
            </span>
            <span className="text-xs text-sky-300 font-semibold">
              {insight.poloName}
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-black tracking-tight text-white mt-1">
            {deliveryMode ? "Oportunidades Preditivas na Entrega Técnica" : `Configuração Recomendada: ${insight.packageName}`}
          </h3>
        </div>

        <div className="text-left sm:text-right shrink-0">
          <span className="text-[11px] uppercase tracking-wider text-sky-300 font-bold block">
            Demanda Sazonal do Trimestre
          </span>
          <span className="text-sm font-extrabold text-amber-300">
            {insight.seasonalDemandIndex}
          </span>
          <span className="text-[10px] text-slate-300 block">{insight.seasonalPeakQuarter}</span>
        </div>
      </div>

      {/* Technical Diagnosis */}
      <div className="relative z-10">
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
          {insight.technicalDiagnosis}
        </p>
      </div>

      {/* Critical Recommended Accessories */}
      <div className="relative z-10 space-y-2.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-sky-300 block">
          Acessórios Homologados Mopar com Prioridade Preditiva Máxima:
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {insight.criticalAccessories.map((acc, idx) => (
            <div
              key={idx}
              className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-xl p-3 border border-white/10 flex items-start justify-between gap-2.5 transition"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-bold text-white leading-tight">
                    {acc.name}
                  </span>
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-sky-500/30 text-sky-200 border border-sky-400/40">
                    {acc.category}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  {acc.impactReason}
                </p>
              </div>
              <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded shrink-0 ${
                acc.criticality === "Essencial"
                  ? "bg-rose-500/30 text-rose-200 border border-rose-400/40"
                  : "bg-blue-500/30 text-blue-200 border border-blue-400/40"
              }`}>
                {acc.criticality}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4 Dealership & Client Business Metrics */}
      <div className="relative z-10 border-t border-white/10 pt-4 grid grid-cols-2 lg:grid-cols-4 gap-3 text-center">
        <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
          <span className="text-[10px] uppercase font-bold text-sky-300 block">Valorização no Trade-in</span>
          <span className="text-lg font-black text-emerald-400 font-mono">{insight.residualValueTradeInBonus}</span>
          <span className="text-[10px] text-slate-300 block">Recompra Concessionária</span>
        </div>
        <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
          <span className="text-[10px] uppercase font-bold text-sky-300 block">Economia Preventiva</span>
          <span className="text-lg font-black text-white font-mono">{insight.estimatedPreventedDamageCost}</span>
          <span className="text-[10px] text-slate-300 block">Funilaria &amp; Manutenção</span>
        </div>
        <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
          <span className="text-[10px] uppercase font-bold text-sky-300 block">Giro Médio Estoque</span>
          <span className="text-lg font-black text-amber-300 font-mono">{insight.averageInventoryTurnDays} dias</span>
          <span className="text-[10px] text-slate-300 block">Reposição Concessionária</span>
        </div>
        <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
          <span className="text-[10px] uppercase font-bold text-sky-300 block">Taxa de Aceitação</span>
          <span className="text-lg font-black text-sky-400 font-mono">{insight.dealershipAdoptionRate}</span>
          <span className="text-[10px] text-slate-300 block">Média da Rede Regional</span>
        </div>
      </div>

      {/* Dealership Pitch Tip */}
      <div className="relative z-10 bg-sky-950/80 rounded-xl p-3 border border-sky-800/80 flex items-start gap-2 text-xs text-sky-200">
        <Sparkles className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-white font-semibold">Dica Estratégica para o Consultor: </strong>
          <span>{insight.dealershipConsultantPitch}</span>
        </div>
      </div>
    </div>
    {/* END: Predictive Synthesis Card */}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const ClientDataScreen = ({ clientData, onClientDataChange, onGenerateSuggestion }: ClientDataScreenProps) => {
  const [clientSource, setClientSource] = useState<ClientSource>("live");
  const [crmSearch, setCrmSearch] = useState("");
  const [crmLoading, setCrmLoading] = useState(false);
  const [crmFound, setCrmFound] = useState(false);

  const handleChange = (field: keyof ClientData, value: string) => {
    onClientDataChange({ ...clientData, [field]: value });
  };

  const handleVoiceData = (extractedData: Partial<ClientData>) => {
    onClientDataChange({ ...clientData, ...extractedData });
  };

  // Carregar dados automáticos ao mudar de modo
  useEffect(() => {
    if (clientSource === "delivery") {
      onClientDataChange(DELIVERY_CLIENT);
      setCrmFound(false);
    } else if (clientSource === "live") {
      setCrmFound(false);
      setCrmSearch("");
    } else if (clientSource === "crm") {
      setCrmFound(false);
      setCrmSearch("");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientSource]);

  // Simulação de busca no CRM
  const handleCrmSearch = () => {
    const normalized = crmSearch.toLowerCase().trim();
    if (normalized.includes("joão") || normalized.includes("joao") || normalized.includes("silva")) {
      setCrmLoading(true);
      setTimeout(() => {
        onClientDataChange(CRM_CLIENT);
        setCrmFound(true);
        setCrmLoading(false);
      }, 1200);
    } else {
      setCrmFound(false);
    }
  };

  const insight = useMemo(
    () => getRegionalTelemetryInsight(
      clientData.state || "Mato Grosso (MT)",
      clientData.terrainType || "Uso Misto (Urbano / Rural)",
      clientData.climateCondition || "Alta Incidência de Chuvas & Poeira",
      clientData.vehicleModel
    ),
    [clientData.state, clientData.terrainType, clientData.climateCondition, clientData.vehicleModel]
  );

  const isReadonly = clientSource === "crm" && crmFound;
  const isDelivery = clientSource === "delivery";

  return (
    <div className="min-h-full bg-slate-50 text-slate-800 font-sans flex flex-col antialiased">
      <main className="flex-1 max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col space-y-4">

        {/* ── Header ── */}
        <div className="pb-2 border-b border-slate-200/80">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-sky-700 uppercase mb-1">
            <Zap className="w-4 h-4 text-sky-600 fill-sky-600" />
            <span>Etapa 01 — Onboarding Preditivo</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-display">
            Identificação do Cliente &amp; Veículo
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Selecione a fonte de dados do cliente e preencha ou carregue as informações para gerar o pacote personalizado.
          </p>
        </div>

        {/* ── Source Selector ── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
            Fonte de Informações do Cliente
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SOURCE_TABS.map((tab) => {
              const active = clientSource === tab.id;
              const colorMap: Record<string, string> = {
                blue: active ? "border-sky-500 bg-sky-50 text-sky-800 ring-1 ring-sky-300/60" : "border-slate-200 hover:border-sky-300 hover:bg-sky-50/50",
                rose: active ? "border-rose-500 bg-rose-50 text-rose-800 ring-1 ring-rose-300/60" : "border-slate-200 hover:border-rose-300 hover:bg-rose-50/50",
                amber: active ? "border-amber-500 bg-amber-50 text-amber-800 ring-1 ring-amber-300/60" : "border-slate-200 hover:border-amber-300 hover:bg-amber-50/50",
              };
              const iconColor: Record<string, string> = {
                blue: active ? "text-sky-600" : "text-slate-400",
                rose: active ? "text-rose-600" : "text-slate-400",
                amber: active ? "text-amber-600" : "text-slate-400",
              };
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setClientSource(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 transition-all duration-150 text-left cursor-pointer ${colorMap[tab.color]}`}
                >
                  <div className={`transition-colors ${iconColor[tab.color]}`}>{tab.icon}</div>
                  <div>
                    <div className={`text-sm font-bold ${active ? "" : "text-slate-700"}`}>{tab.label}</div>
                    <div className={`text-[11px] ${active ? "opacity-80" : "text-slate-400"}`}>{tab.description}</div>
                  </div>
                  {active && (
                    <div className="ml-auto">
                      <div className={`w-2 h-2 rounded-full animate-pulse ${
                        tab.color === "blue" ? "bg-sky-500" : tab.color === "rose" ? "bg-rose-500" : "bg-amber-500"
                      }`} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── CRM: Busca ── */}
        {clientSource === "crm" && (
          <div className="bg-white rounded-2xl border border-sky-200 shadow-sm p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <Database className="w-5 h-5 text-sky-600" />
              <h2 className="text-base font-bold text-slate-900">Buscar Cliente no CRM</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-700 border border-sky-200 uppercase tracking-wide">Stellantis CRM</span>
            </div>

            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={crmSearch}
                  onChange={(e) => { setCrmSearch(e.target.value); if (crmFound) setCrmFound(false); }}
                  onKeyDown={(e) => e.key === "Enter" && handleCrmSearch()}
                  placeholder="Digite o nome do cliente ou CPF..."
                  className="block w-full rounded-xl border-slate-200 text-sm font-medium text-slate-800 pl-9 pr-4 py-2.5 shadow-sm focus:border-sky-500 focus:ring-sky-500 bg-slate-50/50 transition"
                />
              </div>

              <div className="flex-shrink-0">
                <VoiceInputButton onDataExtracted={handleVoiceData} hideLabel={true} />
              </div>

              <button
                type="button"
                onClick={handleCrmSearch}
                disabled={crmLoading || !crmSearch.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
              >
                {crmLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>{crmLoading ? "Buscando..." : "Buscar"}</span>
              </button>
            </div>

            <p className="text-xs text-slate-400 mt-2">
              💡 Dica: tente buscar por <span className="font-semibold text-slate-600">"João Silva"</span> para carregar o cliente pré-cadastrado.
            </p>

            {/* CRM Found Card */}
            {crmFound && (
              <div className="mt-5 rounded-xl bg-emerald-50 border border-emerald-200 p-4 flex items-start gap-3">
                <BadgeCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-bold text-emerald-800">Cliente localizado no CRM</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-800">ATIVO</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-xs text-slate-600">
                    <span><strong>Nome:</strong> {CRM_CLIENT.clientName}</span>
                    <span><strong>Idade:</strong> {CRM_CLIENT.clientAge} anos</span>
                    <span><strong>Estado:</strong> {CRM_CLIENT.state}</span>
                    <span><strong>Veículo:</strong> {CRM_CLIENT.vehicleModel}</span>
                    <span><strong>Cor:</strong> {CRM_CLIENT.vehicleColor}</span>
                    <span><strong>Ano:</strong> {CRM_CLIENT.vehicleYear}</span>
                  </div>
                </div>
                <button type="button" onClick={() => { setCrmFound(false); setCrmSearch(""); }} className="text-slate-400 hover:text-slate-600 transition">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Pacote CRM com indicador de estoque */}
            {crmFound && (
              <div className="mt-5">
                <div className="flex items-center gap-2 mb-3">
                  <ShoppingCart className="w-4 h-4 text-sky-600" />
                  <span className="text-sm font-bold text-slate-900">Pacote Pré-Selecionado para João Silva</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-100 text-sky-700 border border-sky-200">PERSONALIZADO</span>
                </div>
                <div className="space-y-2">
                  {CRM_ACCESSORIES.map((acc) => (
                    <div
                      key={acc.name}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm ${
                        acc.inStock
                          ? "bg-emerald-50 border-emerald-200"
                          : "bg-amber-50 border-amber-200"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {acc.inStock
                          ? <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[3]" />
                          : <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        }
                        <span className={`font-medium ${acc.inStock ? "text-slate-800" : "text-slate-700"}`}>
                          {acc.name}
                        </span>
                      </div>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        acc.inStock
                          ? "bg-emerald-200 text-emerald-800"
                          : "bg-amber-200 text-amber-800"
                      }`}>
                        {acc.inStock ? "Em estoque" : "⚠ Adquirir — Sem estoque"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Entrega Técnica: Banner ── */}
        {isDelivery && (
          <div className="rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 p-[1px] shadow-md">
            <div className="rounded-2xl bg-amber-50 px-5 py-4 flex items-start gap-3">
              <PackageCheck className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-900">Modo Entrega Técnica — Oportunidade de Upsell</p>
                <p className="text-xs text-amber-700 mt-0.5">
                  Cliente Carlos Silva — Jeep Renegade Trailhawk Verde. Os acessórios abaixo <strong>não foram adquiridos</strong> na compra e representam oportunidade de venda imediata durante a entrega.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Campos do Veículo & Cliente ── */}
        {(clientSource === "live" || (clientSource === "crm" && crmFound) || isDelivery) && (
          <VehicleAndClientFields
            clientData={clientData}
            handleChange={handleChange}
            readonly={isReadonly || isDelivery}
          />
        )}

        {/* ── Show room: Voice Card ── */}
        {clientSource === "live" && (
          <div className="flex items-center gap-4 bg-white p-3 sm:px-5 sm:py-4 rounded-2xl border border-rose-200/80 shadow-sm group">
            <VoiceInputButton onDataExtracted={handleVoiceData} hideLabel={true} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">Preenchimento por Voz (IA Voice)</span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">SHOW ROOM</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Captura contextual por microfone em tempo real durante o atendimento no salão de vendas</p>
            </div>
          </div>
        )}

        {/* ── Telemetria Regional ── */}
        {(clientSource === "live" || (clientSource === "crm" && crmFound) || isDelivery) && (
          <RegionalCard
            clientData={clientData}
            handleChange={handleChange}
            insight={insight}
            readonly={isReadonly || isDelivery}
            deliveryMode={isDelivery}
          />
        )}

        {/* ── Entrega Técnica: Lista de Upsell ── */}
        {isDelivery && (
          <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <ShoppingCart className="w-5 h-5 text-amber-600" />
              <span className="text-sm font-bold text-slate-900">Acessórios para Oferta na Entrega</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200 uppercase">Não adquiridos</span>
            </div>
            <div className="space-y-2">
              {DELIVERY_UPSELL.map((acc) => (
                <div key={acc.name}
                  className="flex items-center justify-between px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-sm">
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[3]" />
                    <span className="font-medium text-slate-800">{acc.name}</span>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800">
                    Oferta na entrega
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CTA Principal ── */}
        {(clientSource === "live" || (clientSource === "crm" && crmFound) || isDelivery) && (
          <div className="flex flex-col items-center pt-3 pb-8 gap-3">
            <button
              type="button"
              onClick={onGenerateSuggestion}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl bg-gradient-to-r from-sky-600 via-blue-600 to-sky-700 hover:from-sky-500 hover:to-blue-600 text-white font-semibold text-base shadow-lg shadow-sky-700/25 hover:shadow-xl hover:shadow-sky-700/35 active:scale-[0.99] transition duration-200 cursor-pointer"
            >
              <Zap className="w-5 h-5 fill-current" />
              <span>
                {isDelivery
                  ? "Gerar Pacote de Entrega Técnica"
                  : clientSource === "crm"
                  ? "Confirmar Pacote CRM & Avançar"
                  : "Gerar Sugestão de Acessórios & Pacote F&I"}
              </span>
              <ArrowRight className="w-5 h-5 text-sky-200" />
            </button>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Processamento por IA: <strong>1.4s</strong> • Base F&I atualizada hoje</span>
            </div>
          </div>
        )}

        {/* ── Estado vazio do CRM (não buscou ainda) ── */}
        {clientSource === "crm" && !crmFound && !crmLoading && (
          <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400 gap-3">
            <Database className="w-10 h-10 text-slate-300" />
            <p className="text-sm font-medium">Busque um cliente pelo nome ou CPF para carregar os dados do CRM</p>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/70 py-4 mt-auto">
        <div className="max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span className="font-semibold text-slate-700">Smart-Sell</span>
        </div>
      </footer>
    </div>
  );
};

export default ClientDataScreen;
