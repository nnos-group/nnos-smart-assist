/**
 * LostSalesDashboard — Painel Pareto de Vendas Perdidas
 *
 * Modal com análise gerencial de Pareto sobre oportunidades perdidas.
 * Permite identificar padrões de recusa, acessórios mais recusados,
 * motivos de perda e métricas por vendedor/concessionária/região/veículo.
 */

import { useState, useEffect, useMemo } from "react";
import {
  X, TrendingDown, DollarSign, Users, Package,
  AlertTriangle, MapPin, Car, UserCheck, Building2,
  BarChart3,
} from "lucide-react";
import { ParetoAnalysis, RankedMetric } from "@/types/lostSales";
import { calculateParetoAnalysis, getConversionAnalytics } from "@/lib/argumentationRepository";

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
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  subtext?: string;
  color: string;
}) => {
  const colorStyles: Record<string, { bg: string; border: string; icon: string; text: string }> = {
    rose: { bg: "bg-rose-50", border: "border-rose-200", icon: "text-rose-600", text: "text-rose-700" },
    amber: { bg: "bg-amber-50", border: "border-amber-200", icon: "text-amber-600", text: "text-amber-700" },
    blue: { bg: "bg-blue-50", border: "border-blue-200", icon: "text-blue-600", text: "text-blue-700" },
    emerald: { bg: "bg-emerald-50", border: "border-emerald-200", icon: "text-emerald-600", text: "text-emerald-700" },
    slate: { bg: "bg-slate-50", border: "border-slate-200", icon: "text-slate-600", text: "text-slate-700" },
  };
  const s = colorStyles[color] || colorStyles.slate;

  return (
    <div className={`${s.bg} ${s.border} border rounded-xl p-4 flex items-center gap-3.5`}>
      <div className={`w-10 h-10 rounded-lg ${s.bg} ${s.border} border flex items-center justify-center ${s.icon} shrink-0`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <span className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider">{label}</span>
        <span className={`block text-lg font-extrabold ${s.text} tracking-tight`}>{value}</span>
        {subtext && <span className="block text-[11px] text-slate-500">{subtext}</span>}
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
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
        <Icon className="w-4 h-4 text-slate-600" />
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{title}</h4>
      </div>
      <div className="divide-y divide-slate-100">
        {items.slice(0, 5).map((item, i) => (
          <div key={item.label} className="px-4 py-2.5 flex items-center justify-between hover:bg-slate-50 transition">
            <div className="flex items-center gap-2.5">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                i === 0 ? "bg-rose-100 text-rose-700" : i === 1 ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
              }`}>
                {i + 1}
              </span>
              <span className="text-xs font-medium text-slate-700 truncate max-w-[180px]">{item.label}</span>
            </div>
            <div className="flex items-center gap-3">
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

  useEffect(() => {
    if (isOpen) {
      setPareto(calculateParetoAnalysis());
    }
  }, [isOpen]);

  useEffect(() => {
    const handleUpdate = () => setPareto(calculateParetoAnalysis());
    window.addEventListener("smart_sell_lost_sales_updated", handleUpdate);
    return () => window.removeEventListener("smart_sell_lost_sales_updated", handleUpdate);
  }, []);

  const analytics = useMemo(() => getConversionAnalytics(), [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen || !pareto) return null;

  const maxRefusedCount = pareto.topRefusedAccessories.length > 0
    ? pareto.topRefusedAccessories[0].count
    : 1;

  const maxReasonCount = pareto.topLossReasons.length > 0
    ? pareto.topLossReasons[0].count
    : 1;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 bg-slate-900/70 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white p-5 flex items-center justify-between border-b border-rose-950 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-rose-400 shadow-inner">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Painel de Vendas Perdidas — Análise de Pareto
              </h3>
              <p className="text-xs text-rose-200 mt-0.5">
                Transforme perdas em decisões gerenciais • Dados da concessionária
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-rose-200 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Scrollable */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* KPI Cards Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <MetricCard
              icon={TrendingDown}
              label="Oportunidades Perdidas"
              value={String(pareto.totalOpportunities)}
              subtext={`${pareto.totalClientsLost} clientes únicos`}
              color="rose"
            />
            <MetricCard
              icon={DollarSign}
              label="Valor Total Perdido"
              value={`R$ ${pareto.totalLostValue.toLocaleString("pt-BR")}`}
              subtext="Receita não capturada"
              color="amber"
            />
            <MetricCard
              icon={Package}
              label="Ticket Médio Perdido"
              value={`R$ ${pareto.avgTicket.toLocaleString("pt-BR")}`}
              subtext="Por oportunidade"
              color="blue"
            />
            <MetricCard
              icon={Users}
              label="Taxa de Conversão"
              value={`${analytics.conversionRate}%`}
              subtext={`${analytics.won} ganhas / ${analytics.won + analytics.lost} decididas`}
              color="emerald"
            />
          </div>

          {/* Pareto Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Acessórios Mais Recusados */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
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

            {/* Motivos de Perda */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Principais Motivos de Perda
                </h4>
              </div>
              <div className="space-y-3">
                {pareto.topLossReasons.slice(0, 6).map((item) => (
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

          {/* Conversion Analytics Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl border border-blue-200 p-4">
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

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-400">
            Dados de demonstração — Concessionária Jeep Campinas
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
