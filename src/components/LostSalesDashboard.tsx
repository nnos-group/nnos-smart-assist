/**
 * LostSalesDashboard — Painel Comercial & Análise de Pareto de Vendas Perdidas
 *
 * Painel gerencial expandido com visão executiva da operação comercial:
 * - KPIs Executivos (Atendimentos, Vendas, Conversão, Faturamento, Ticket Médio)
 * - Funil do Pipeline Comercial (Em atendimento -> Fechamento)
 * - Inteligência de Produtos (Mais vendidos, mais recomendados vs apresentados vs vendidos)
 * - Análise de Pareto de Vendas Perdidas (Acessórios recusados e motivos de perda)
 * - Identificação clara com badges DEMO
 */

import { useState, useEffect, useMemo } from "react";
import {
  X, TrendingDown, DollarSign, Users, Package,
  AlertTriangle, MapPin, Car, UserCheck, Building2,
  BarChart3, CheckCircle2, ArrowRight, ShoppingBag,
  Clock, ShieldAlert, Sparkles, HelpCircle, RotateCcw, TrendingUp
} from "lucide-react";
import { ParetoAnalysis, RankedMetric, CommercialManagementOverview } from "@/types/lostSales";
import {
  calculateParetoAnalysis,
  getConversionAnalytics,
  getCommercialManagementOverview
} from "@/lib/argumentationRepository";

interface LostSalesDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Sub-components ────────────────────────────────────────────────────────────

const MetricCard = ({
  icon: Icon,
  label,
  value,
  subtext,
  badge,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  subtext?: string;
  badge?: string;
  color: string;
}) => {
  const colorStyles: Record<string, { bg: string; border: string; iconBg: string; icon: string; text: string }> = {
    rose: { bg: "bg-rose-50/70", border: "border-rose-200", iconBg: "bg-rose-100", icon: "text-rose-600", text: "text-rose-700" },
    amber: { bg: "bg-amber-50/70", border: "border-amber-200", iconBg: "bg-amber-100", icon: "text-amber-600", text: "text-amber-700" },
    blue: { bg: "bg-sky-50/70", border: "border-sky-200", iconBg: "bg-sky-100", icon: "text-sky-600", text: "text-sky-700" },
    emerald: { bg: "bg-emerald-50/70", border: "border-emerald-200", iconBg: "bg-emerald-100", icon: "text-emerald-600", text: "text-emerald-700" },
    indigo: { bg: "bg-indigo-50/70", border: "border-indigo-200", iconBg: "bg-indigo-100", icon: "text-indigo-600", text: "text-indigo-700" },
    purple: { bg: "bg-purple-50/70", border: "border-purple-200", iconBg: "bg-purple-100", icon: "text-purple-600", text: "text-purple-700" },
    slate: { bg: "bg-slate-50/70", border: "border-slate-200", iconBg: "bg-slate-100", icon: "text-slate-600", text: "text-slate-700" },
  };
  const s = colorStyles[color] || colorStyles.slate;

  return (
    <div className={`rounded-xl p-3 sm:p-3.5 border ${s.bg} ${s.border} flex flex-col justify-between shadow-2xs hover:shadow-xs transition-all`}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className={`w-8 h-8 rounded-lg ${s.iconBg} flex items-center justify-center ${s.icon} shrink-0 shadow-2xs`}>
          <Icon className="w-4 h-4" />
        </div>
        {badge && (
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/90 border border-slate-200 text-slate-700 whitespace-nowrap shadow-2xs">
            {badge}
          </span>
        )}
      </div>
      <div>
        <span className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider leading-tight">
          {label}
        </span>
        <div className={`text-xl sm:text-2xl font-black ${s.text} tracking-tight mt-0.5`}>
          {value}
        </div>
        {subtext && (
          <span className="block text-[11px] text-slate-500 font-medium mt-0.5 leading-snug">
            {subtext}
          </span>
        )}
      </div>
    </div>
  );
};

const ParetoBar = ({ item, maxCount }: { item: RankedMetric; maxCount: number }) => {
  const widthPercent = maxCount > 0 ? Math.max(8, (item.count / maxCount) * 100) : 8;
  return (
    <div className="flex items-center gap-3 group">
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-slate-700 truncate pr-2">{item.label}</span>
          <span className="text-xs font-bold text-slate-900 shrink-0">
            {item.count}x ({item.percentage}%)
          </span>
        </div>
        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-rose-500 to-rose-400 rounded-full transition-all duration-500"
            style={{ width: `${widthPercent}%` }}
          />
        </div>
      </div>
      <span className="text-[11px] font-semibold text-slate-500 shrink-0 w-24 text-right">
        R$ {item.value.toLocaleString("pt-BR")}
      </span>
    </div>
  );
};

const RankingTable = ({
  items,
  icon: Icon,
  title,
}: {
  items: RankedMetric[];
  icon: React.ElementType;
  title: string;
}) => {
  if (items.length === 0) return null;
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
        <Icon className="w-4 h-4 text-slate-600" />
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{title}</h4>
      </div>
      <div className="divide-y divide-slate-100">
        {items.slice(0, 5).map((item, i) => (
          <div key={item.label} className="px-4 py-2.5 flex items-center justify-between hover:bg-slate-50 transition">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                i === 0 ? "bg-rose-100 text-rose-700" : i === 1 ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
              }`}>
                {i + 1}
              </span>
              <span className="text-xs font-medium text-slate-700 truncate max-w-[180px]">{item.label}</span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs font-semibold text-slate-900">{item.count} perda{item.count > 1 ? "s" : ""}</span>
              <span className="text-[11px] font-medium text-slate-500">
                R$ {item.value.toLocaleString("pt-BR")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────

export const LostSalesDashboard = ({ isOpen, onClose }: LostSalesDashboardProps) => {
  const [pareto, setPareto] = useState<ParetoAnalysis | null>(null);
  const [commercial, setCommercial] = useState<CommercialManagementOverview | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "funnel" | "products" | "pareto">("overview");

  useEffect(() => {
    if (isOpen) {
      setPareto(calculateParetoAnalysis());
      setCommercial(getCommercialManagementOverview());
    }
  }, [isOpen]);

  useEffect(() => {
    const handleUpdate = () => {
      setPareto(calculateParetoAnalysis());
      setCommercial(getCommercialManagementOverview());
    };
    window.addEventListener("smart_sell_lost_sales_updated", handleUpdate);
    window.addEventListener("smart_sell_argumentation_updated", handleUpdate);
    return () => {
      window.removeEventListener("smart_sell_lost_sales_updated", handleUpdate);
      window.removeEventListener("smart_sell_argumentation_updated", handleUpdate);
    };
  }, []);

  const analytics = useMemo(() => getConversionAnalytics(), [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen || !pareto || !commercial) return null;

  const maxRefusedCount = pareto.topRefusedAccessories.length > 0
    ? pareto.topRefusedAccessories[0].count
    : 1;

  const maxReasonCount = pareto.topLossReasons.length > 0
    ? pareto.topLossReasons[0].count
    : 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="bg-white w-full max-w-[97vw] 2xl:max-w-[1580px] h-[94vh] max-h-[94vh] rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header com identificação executiva e badge demonstrativo */}
        <div className="bg-white text-slate-900 p-5 flex items-center justify-between border-b border-slate-200 shrink-0">
          <div className="flex items-center space-x-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-xs shrink-0">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Painel de Vendas Perdidas &amp; Dashboard Comercial — Análise de Pareto
                </h3>
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-0.5 rounded-full shadow-2xs">
                  DEMO • Visão Gerencial
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 truncate">
                Gestão comercial da operação de acessórios • Concessionária Jeep Campinas
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition cursor-pointer shrink-0 ml-2"
            aria-label="Fechar painel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Pills */}
        <div className="bg-slate-50/90 border-b border-slate-200 px-5 py-2.5 flex items-center gap-2 overflow-x-auto shrink-0">
          {[
            { id: "overview" as const, label: "Visão Geral Executiva" },
            { id: "funnel" as const, label: "Funil do Pipeline" },
            { id: "products" as const, label: "Produtos & Rankings" },
            { id: "pareto" as const, label: "Detalhamento de Perdas" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/70"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/50">
          {/* SEÇÃO 1: MÉTRICAS CONSOLIDADAS DA OPERAÇÃO REESTRUTURADAS */}
          <div className="space-y-3">
            {/* Bloco A: Desempenho Comercial & Vendas Realizadas */}
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Desempenho Comercial &amp; Resultados Faturados
                  </h4>
                </div>
                <span className="text-[11px] text-slate-500">
                  Atendimentos em andamento no ciclo: <strong className="text-slate-800">{commercial.openProposals}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <MetricCard
                  icon={DollarSign}
                  label="Faturamento Realizado"
                  value={`R$ ${commercial.totalRevenue.toLocaleString("pt-BR")}`}
                  subtext={`${commercial.completedSales} propostas faturadas`}
                  badge="Resultado Faturado"
                  color="emerald"
                />
                <MetricCard
                  icon={Package}
                  label="Ticket Médio"
                  value={`R$ ${commercial.avgTicket.toLocaleString("pt-BR")}`}
                  subtext="Por venda convertida"
                  badge="Rentabilidade"
                  color="purple"
                />
                <MetricCard
                  icon={TrendingUp}
                  label="Taxa de Conversão"
                  value={`${commercial.conversionRate}%`}
                  subtext={`${commercial.completedSales} de ${commercial.completedSales + commercial.lostSalesCount} decididas`}
                  badge="Eficácia da Loja"
                  color="indigo"
                />
                <MetricCard
                  icon={Users}
                  label="Atendimentos Totais"
                  value={String(commercial.totalServiceCalls)}
                  subtext={`${commercial.openProposals} em aberto no momento`}
                  badge="Volume no Ciclo"
                  color="blue"
                />
              </div>
            </div>

            {/* Bloco B: Gestão de Perdas & Retargeting */}
            <div className="space-y-2 pt-0.5">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-rose-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Gestão de Perdas &amp; Recuperação (Retargeting)
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <MetricCard
                  icon={TrendingDown}
                  label="Oportunidades Perdidas"
                  value={String(commercial.lostSalesCount)}
                  subtext={`${pareto.totalClientsLost} clientes com recusa registrada`}
                  badge="Perdas no Funil"
                  color="rose"
                />
                <MetricCard
                  icon={DollarSign}
                  label="Valor Total Perdido"
                  value={`R$ ${pareto.totalLostValue.toLocaleString("pt-BR")}`}
                  subtext="Receita potencial não capturada"
                  badge="Impacto Financeiro"
                  color="amber"
                />
                <MetricCard
                  icon={Package}
                  label="Ticket Médio Perdido"
                  value={`R$ ${pareto.avgTicket.toLocaleString("pt-BR")}`}
                  subtext="Por oportunidade não fechada"
                  badge="Média por Recusa"
                  color="rose"
                />
                <MetricCard
                  icon={RotateCcw}
                  label="Taxa de Reaquecimento"
                  value="32.4%"
                  subtext="Média histórica com bônus de montadora"
                  badge="Retargeting Ativo"
                  color="blue"
                />
              </div>
            </div>
          </div>

          {/* VISÃO GERAL EXECUTIVA / FUNIL */}
          {(activeTab === "overview" || activeTab === "funnel") && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Funil de Vendas do Pipeline (Jornada Comercial)
                  </h4>
                </div>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                  Total de Atendimentos no Ciclo: {commercial.totalServiceCalls}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {commercial.pipelineStages.map((stage) => (
                  <div
                    key={stage.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-slate-100/80 transition flex flex-col justify-between space-y-2"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block truncate">
                        {stage.label}
                      </span>
                      <strong className="text-xl font-black text-slate-900 block mt-0.5">
                        {stage.count}
                      </strong>
                    </div>
                    <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
                      <span className="font-mono font-semibold">R$ {(stage.value / 1000).toFixed(0)}k</span>
                      <span className="text-[10px] font-bold text-slate-500">{stage.conversionPercent}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SEÇÃO DE PRODUTOS: MAIS VENDIDOS & COMPARATIVO (RECOMENDADO vs APRESENTADO vs VENDIDO) */}
          {(activeTab === "overview" || activeTab === "products") && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Ranking dos Mais Vendidos */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-2xs">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <ShoppingBag className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Acessórios Mais Vendidos (Top 5)
                  </h4>
                </div>

                <div className="divide-y divide-slate-100">
                  {commercial.topSellingAccessories.map((item) => (
                    <div key={item.name} className="py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                          item.rank === 1 ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700"
                        }`}>
                          {item.rank}
                        </span>
                        <span className="text-xs font-medium text-slate-800 truncate">{item.name}</span>
                      </div>
                      <div className="text-right shrink-0 ml-2">
                        <span className="text-xs font-bold text-slate-900 block">{item.salesCount} un</span>
                        <span className="text-[10px] font-medium text-slate-500">R$ {item.revenue.toLocaleString("pt-BR")}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comparativo de Inteligência Comercial (Recomendado vs Apresentado vs Vendido) */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Conversão de Produtos: Recomendado vs. Apresentado vs. Vendido
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">Inteligência Comercial</span>
                </div>

                <div className="space-y-2.5">
                  {commercial.productConversionComparison.map((p) => (
                    <div key={p.name} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 truncate max-w-[280px]">{p.name}</span>
                        <span className="font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                          {p.conversionRate}% conversão
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                        <span>Recomendado pela IA: <strong>{p.recommendedCount}x</strong></span>
                        <span>Apresentado: <strong>{p.presentedCount}x</strong></span>
                        <span className="text-slate-900 font-bold">Vendido: <strong>{p.soldCount}x</strong></span>
                        <span className="font-semibold text-slate-700">R$ {p.revenue.toLocaleString("pt-BR")}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Oportunidades sem Disponibilidade (DEMO de Demanda Não Atendida) */}
          {(activeTab === "overview" || activeTab === "products") && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-900">
                      Oportunidades sem Disponibilidade (DEMO)
                    </span>
                    <span className="text-[9px] font-bold bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded">
                      Ruptura de Estoque Conceitual
                    </span>
                  </div>
                  <p className="text-xs text-amber-800 mt-0.5">
                    Itens com demanda identificada pelo consultor mas sem estoque físico no momento:
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                {commercial.unavailableDemandDemo.map((item) => (
                  <span key={item.name} className="px-2.5 py-1 bg-white border border-amber-200 rounded-lg text-amber-900 font-medium">
                    {item.name} • <strong>{item.requests} pedidos</strong> (R$ {item.potentialRevenue.toLocaleString("pt-BR")})
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* SEÇÃO 4: ANÁLISE DE PARETO & MOTIVOS DE PERDA (PRESERVADA E APRIMORADA) */}
          {(activeTab === "overview" || activeTab === "pareto") && (
            <div className="space-y-5">
              {/* Pareto Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Acessórios Mais Recusados */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-2xs">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <Package className="w-4 h-4 text-rose-600" />
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Acessórios Mais Recusados
                    </h4>
                  </div>
                  <div className="space-y-3">
                    {pareto.topRefusedAccessories.slice(0, 6).map((item) => (
                      <ParetoBar key={item.label} item={item} maxCount={maxRefusedCount} />
                    ))}
                    {pareto.topRefusedAccessories.length === 0 && (
                      <p className="text-xs text-slate-400 text-center py-4">Sem dados de recusa registrados</p>
                    )}
                  </div>
                </div>

                {/* Principais Motivos de Perda */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-2xs">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Principais Motivos de Perda
                    </h4>
                  </div>
                  <div className="space-y-3">
                    {pareto.topLossReasons.slice(0, 7).map((item) => (
                      <ParetoBar key={item.label} item={item} maxCount={maxReasonCount} />
                    ))}
                    {pareto.topLossReasons.length === 0 && (
                      <p className="text-xs text-slate-400 text-center py-4">Sem dados de motivo registrados</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Ranking Tables Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <RankingTable
                  items={pareto.lossesByVehicle}
                  icon={Car}
                  title="Perdas por Modelo de Veículo"
                />
                <RankingTable
                  items={pareto.lossesByRegion}
                  icon={MapPin}
                  title="Perdas por Região"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <RankingTable
                  items={pareto.lossesBySeller}
                  icon={UserCheck}
                  title="Perdas por Vendedor"
                />
                <RankingTable
                  items={pareto.lossesByDealership}
                  icon={Building2}
                  title="Perdas por Concessionária"
                />
              </div>

              {/* Analytics de Argumentação Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl border border-blue-200 p-4 shadow-2xs">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Analytics de Argumentação — Eficácia dos Modos de Venda
                  </h4>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-white rounded-lg p-3 border border-slate-200 text-center">
                    <span className="block text-lg font-extrabold text-blue-700">{analytics.totalArgumentations}</span>
                    <span className="text-[11px] text-slate-500">Total de Argumentações</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-slate-200 text-center">
                    <span className="block text-lg font-extrabold text-emerald-700">{analytics.won}</span>
                    <span className="text-[11px] text-slate-500">Vendas Convertidas</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-slate-200 text-center">
                    <span className="block text-lg font-extrabold text-rose-700">{analytics.lost}</span>
                    <span className="text-[11px] text-slate-500">Vendas Perdidas</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-slate-200 text-center">
                    <span className="block text-lg font-extrabold text-amber-700">{analytics.pending}</span>
                    <span className="text-[11px] text-slate-500">Em Andamento</span>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-3">
                  {analytics.topWinningModes.map((m) => (
                    <span
                      key={m.mode}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg"
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      {m.mode}: {m.count} conversão{m.count !== 1 ? "ões" : ""}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-400">
            Ambiente de Demonstração Comercial • Concessionária Jeep Campinas
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-lg transition cursor-pointer"
          >
            Fechar Painel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LostSalesDashboard;
