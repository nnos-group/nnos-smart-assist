import { useState } from "react";
import { 
  Package, Check, Sparkles, Eye, ArrowRight, User, MapPin, Car, 
  Clock, TrendingUp, Zap, ChevronLeft, BadgePercent, Tag, Award 
} from "lucide-react";
import { Accessory, ClientData, getPackageName } from "@/types/accessories";

interface PackageSuggestionScreenProps {
  accessories: Accessory[];
  clientData: ClientData;
  onAccessoryToggle: (id: string) => void;
  onVisualize: () => void;
  onBack?: () => void;
}

const getColorHex = (colorName: string): string => {
  const map: Record<string, string> = {
    "Verde Recon": "#2d4a3e",
    "Preto Carbon": "#1a1a1a",
    "Branco Polar": "#f3f4f6",
    "Cinza Granite": "#5a5a5a",
    "Vermelho Volcano": "#b91c1c",
    "Azul Patriot": "#1e3a5f",
  };
  return map[colorName] || "#2d4a3e";
};

const getInstallationTime = (id: string): string => {
  switch (id) {
    case "bagageiro":
      return "40 min";
    case "estribo":
      return "60 min";
    case "protetor":
      return "30 min";
    case "friso":
      return "20 min";
    case "rack":
      return "35 min";
    case "pneus":
      return "50 min";
    case "sensor":
      return "45 min";
    default:
      return "40 min";
  }
};

const StockBadge = ({ status, days }: { status: string; days: number }) => {
  if (status === "dormant") {
    return (
      <span
        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
        style={{
          backgroundColor: "#fef3c7",
          color: "#92400e",
          border: "1px solid #fcd34d",
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#f59e0b" }} />
        ⚡ DORMENTE • {days}D
      </span>
    );
  }
  if (status === "obsolete") {
    return (
      <span
        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
        style={{
          backgroundColor: "#ffe4e6",
          color: "#9f1239",
          border: "1px solid #fda4af",
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#f43f5e" }} />
        🔥 OBSOLETO • {Math.round(days / 30)}M
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
      style={{
        backgroundColor: "#ecfdf5",
        color: "#065f46",
        border: "1px solid #a7f3d0",
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#10b981" }} />
      EM ESTOQUE
    </span>
  );
};

const PackageSuggestionScreen = ({
  accessories,
  clientData,
  onAccessoryToggle,
  onVisualize,
  onBack,
}: PackageSuggestionScreenProps) => {
  // Estados para negociação do vendedor
  const [sellerDiscount, setSellerDiscount] = useState<number>(0);
  const [factoryBonus, setFactoryBonus] = useState<number>(0);

  const selectedAccessories = accessories.filter((item) => item.selected);

  const getDiscountedPrice = (item: Accessory) => {
    return Math.round(item.price * (1 - item.discountPercent / 100));
  };

  // Subtotal com desconto de giro de estoque
  const subtotalWithStockDiscounts = selectedAccessories.reduce(
    (sum, item) => sum + getDiscountedPrice(item), 
    0
  );
  const totalOriginal = selectedAccessories.reduce((sum, item) => sum + item.price, 0);
  const stockSavings = totalOriginal - subtotalWithStockDiscounts;

  // Aplicação dos descontos comerciais do vendedor e montadora
  const extraDiscount = Math.min(sellerDiscount, subtotalWithStockDiscounts);
  const factoryBonusAmount = Math.min(factoryBonus, Math.max(0, subtotalWithStockDiscounts - extraDiscount));
  const totalFinal = Math.max(0, subtotalWithStockDiscounts - extraDiscount - factoryBonusAmount);
  const totalAllSavings = stockSavings + extraDiscount + factoryBonusAmount;

  const packageName = getPackageName(clientData.vehicleModel);

  const dormantCount = accessories.filter((a) => a.stockStatus === "dormant").length;
  const obsoleteCount = accessories.filter((a) => a.stockStatus === "obsolete").length;

  const vehicleColorHex = getColorHex(clientData.vehicleColor);
  const cdcMonthly = (totalFinal * 0.0235).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="min-h-full flex flex-col font-sans text-slate-800 bg-slate-50 antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* BEGIN: MainContentContainer */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        {/* Top Action Breadcrumb & Back button */}
        <div className="flex items-center justify-between">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors group cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-0.5" />
              Voltar para Etapa Anterior (Dados do Cliente)
            </button>
          ) : (
            <span className="text-xs font-semibold text-slate-500">
              Etapa 2 · Pacote de Acessórios
            </span>
          )}
          <span className="text-xs font-medium text-slate-400">
            Proposta ID: <span className="font-mono text-slate-600">STE-2025-08491</span>
          </span>
        </div>

        {/* BEGIN: ContextAndClientSummaryBar */}
        <section aria-label="Informações do Cliente e Veículo" className="space-y-3">
          <div>
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/80 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-blue-600" />
              RECOMENDAÇÃO PERSONALIZADA
            </span>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              Pacote de Acessórios Recomendado
            </h1>
          </div>

          {/* Context Ribbon Cards */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 lg:p-4 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            {/* Cliente */}
            <div className="flex items-center space-x-3 pt-2 sm:pt-0 sm:px-2 first:pl-0">
              <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 border border-slate-200">
                <User className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider">Cliente</span>
                <span className="font-bold text-slate-800 text-sm">{clientData.clientName || "João Silva Sauro"}</span>
              </div>
            </div>

            {/* Veículo */}
            <div className="flex items-center space-x-3 pt-3 sm:pt-0 sm:px-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 border border-slate-200">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider">Veículo Configurado</span>
                <div className="flex items-center space-x-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block ring-2 ring-emerald-200"
                    style={{ backgroundColor: vehicleColorHex }}
                    title={`Cor: ${clientData.vehicleColor}`}
                  />
                  <span className="font-bold text-slate-800 text-sm uppercase">{clientData.vehicleModel}</span>
                </div>
              </div>
            </div>

            {/* Região & Uso */}
            <div className="flex items-center space-x-3 pt-3 sm:pt-0 sm:px-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 border border-slate-200">
                <MapPin className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <span className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider">Região & Perfil de Rodagem</span>
                <span className="font-bold text-slate-800 text-sm">
                  {clientData.state?.replace(/\s*\(.*\)/, "") || "Mato Grosso"}{" "}
                  <span className="text-xs font-normal text-slate-500">
                    ({clientData.terrainType || "Uso Misto Rural/Urbano"})
                  </span>
                </span>
              </div>
            </div>

            {/* Propensão / IA Match */}
            <div className="flex items-center space-x-3 pt-3 sm:pt-0 sm:pl-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200">
                <span className="text-xs font-extrabold">94%</span>
              </div>
              <div>
                <span className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider">Score de Aderência IA</span>
                <span className="font-bold text-emerald-600 text-sm flex items-center">
                  Alta Propensão de Aceite
                  <TrendingUp className="w-3.5 h-3.5 ml-1" />
                </span>
              </div>
            </div>
          </div>
        </section>
        {/* END: ContextAndClientSummaryBar */}

        {/* BEGIN: DealershipInventoryAlertBanner */}
        {(dormantCount > 0 || obsoleteCount > 0) && (
          <div className="rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/80 p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center space-x-3.5">
              <div className="p-2 bg-amber-500 text-white rounded-lg shadow-sm shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  Otimização Inteligente de Estoque da Concessionária
                  <span className="bg-amber-200/70 text-amber-900 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    Desconto Automático
                  </span>
                </h4>
                <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                  Identificamos{" "}
                  {dormantCount > 0 && (
                    <>
                      <strong className="font-bold">
                        {dormantCount} {dormantCount === 1 ? "item em estoque dormente" : "itens em estoque dormente"} (&gt;180 dias)
                      </strong>
                    </>
                  )}
                  {dormantCount > 0 && obsoleteCount > 0 && " e "}
                  {obsoleteCount > 0 && (
                    <>
                      <strong className="font-bold">
                        {obsoleteCount} {obsoleteCount === 1 ? "item obsoleto" : "itens obsoletos"} (&gt;1 ano)
                      </strong>
                    </>
                  )}{" "}
                  elegíveis para este chassi — Descontos comerciais agressivos aplicados automaticamente pelo algoritmo para aceleração de giro.
                </p>
              </div>
            </div>
            <div className="shrink-0 flex items-center self-end sm:self-center">
              <span className="text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300 px-3 py-1.5 rounded-md whitespace-nowrap shadow-xs">
                Margem Preservada: +14.2%
              </span>
            </div>
          </div>
        )}
        {/* END: DealershipInventoryAlertBanner */}

        {/* BEGIN: Main2ColumnGridLayout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Acessórios Selecionáveis (8 cols) */}
          <section aria-label="Catálogo de Acessórios do Veículo" className="lg:col-span-8 space-y-4">
            {/* Package Hero Recommendation Card */}
            <div className="bg-gradient-to-br from-blue-900 to-slate-900 rounded-xl p-5 text-white shadow-md border border-blue-800/60 relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-start space-x-4 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center shrink-0 shadow-inner">
                  <Package className="w-6 h-6 text-blue-300" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold text-white tracking-tight">{packageName}</h2>
                    <span className="bg-blue-500/30 text-blue-200 border border-blue-400/40 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      Recomendação IA #1
                    </span>
                  </div>
                  <p className="text-xs text-blue-200/90 mt-1 leading-relaxed">
                    Região: <span className="text-white font-medium">{clientData.state?.replace(/\s*\(.*\)/, "") || "Brasil"}</span> • {clientData.terrainType || "Uso Misto (Urbano/Estradas de Terra)"} • Foco prioritário em durabilidade mecânica e proteção integral da garantia de fábrica Mopar.
                  </p>
                </div>
              </div>
            </div>

            {/* Selection Controls Header */}
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Selecione os Acessórios Disponíveis — {clientData.vehicleModel}
              </h3>
              <span className="text-xs text-slate-500 font-medium">Preços com mão-de-obra inclusa</span>
            </div>

            {/* Accessories Checklist */}
            <div className="space-y-3" id="accessories-list">
              {accessories.map((item) => {
                const discountedPrice = getDiscountedPrice(item);
                const hasDiscount = item.discountPercent > 0;
                const savings = item.price - discountedPrice;
                const installTime = getInstallationTime(item.id);

                let cardClasses = "group relative flex items-start p-4 rounded-xl cursor-pointer transition-all ";
                if (item.selected) {
                  if (item.stockStatus === "obsolete") {
                    cardClasses += "bg-rose-50/50 border border-rose-300 ring-1 ring-rose-400/30 shadow-sm hover:border-rose-400 hover:shadow";
                  } else if (item.stockStatus === "dormant") {
                    cardClasses += "bg-amber-50/50 border border-amber-300 ring-1 ring-amber-400/30 shadow-sm hover:border-amber-400 hover:shadow";
                  } else {
                    cardClasses += "bg-white border border-blue-200 ring-1 ring-blue-500/10 shadow-sm hover:border-blue-300 hover:shadow";
                  }
                } else {
                  cardClasses += "bg-white/70 border border-slate-200 shadow-xs hover:border-slate-300 hover:bg-white";
                }

                return (
                  <label
                    key={item.id}
                    className={cardClasses}
                    onClick={(e) => {
                      // Evitar duplo disparo caso clique direto no checkbox ou em inputs
                      if ((e.target as HTMLElement).tagName.toLowerCase() !== "input") {
                        onAccessoryToggle(item.id);
                      }
                    }}
                  >
                    <div className="flex items-center h-5 mt-0.5">
                      <input
                        type="checkbox"
                        checked={item.selected}
                        onChange={() => onAccessoryToggle(item.id)}
                        className={`w-5 h-5 rounded ${
                          item.stockStatus === "obsolete"
                            ? "border-rose-400 text-rose-600 focus:ring-rose-500"
                            : item.stockStatus === "dormant"
                            ? "border-amber-400 text-amber-600 focus:ring-amber-500"
                            : "border-slate-300 text-blue-600 focus:ring-blue-500"
                        } focus:ring-offset-0 cursor-pointer`}
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div className="flex items-center space-x-2 flex-wrap">
                          <span
                            className={`text-base font-bold transition-colors ${
                              item.selected ? "text-slate-900 group-hover:text-blue-600" : "text-slate-700 group-hover:text-slate-900"
                            }`}
                          >
                            {item.name}
                          </span>
                          
                          {/* Selo de Estoque em cores distintas */}
                          <StockBadge status={item.stockStatus} days={item.stockDays} />
                          
                          {/* Destaque evidente do percentual de desconto */}
                          {hasDiscount && (
                            <span
                              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-black tracking-wide shadow-sm"
                              style={{
                                backgroundColor: "#059669",
                                color: "#ffffff",
                                border: "1px solid #047857",
                              }}
                            >
                              🔥 -{item.discountPercent}% OFF
                            </span>
                          )}
                        </div>
                        <div className="text-right sm:text-right">
                          {hasDiscount ? (
                            <div>
                              <div className="flex items-center justify-end gap-1.5">
                                <span className="text-xs text-slate-400 line-through">
                                  R$ {item.price.toLocaleString("pt-BR")}
                                </span>
                                <span
                                  className="text-[11px] font-black px-1.5 py-0.5 rounded"
                                  style={{
                                    backgroundColor: "#d1fae5",
                                    color: "#065f46",
                                    border: "1px solid #a7f3d0",
                                  }}
                                >
                                  -{item.discountPercent}%
                                </span>
                              </div>
                              <div className="text-base font-extrabold text-blue-700">
                                R$ {discountedPrice.toLocaleString("pt-BR")}
                              </div>
                            </div>
                          ) : (
                            <div className="text-base font-extrabold text-slate-900">
                              R$ {item.price.toLocaleString("pt-BR")}
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 max-w-xl">{item.description}</p>
                      
                      {/* Meta information & benefits */}
                      <div className="mt-2 flex items-center space-x-4 text-[11px]">
                        {item.stockStatus === "dormant" ? (
                          <span className="text-amber-800 font-medium flex items-center gap-1">
                            <span>⚡ Economia automática de R$ {savings.toLocaleString("pt-BR")} aplicada pelo giro de estoque</span>
                          </span>
                        ) : item.stockStatus === "obsolete" ? (
                          <span className="text-rose-800 font-medium flex items-center gap-1">
                            <span>🔥 Super desconto de R$ {savings.toLocaleString("pt-BR")} para liquidação de lote</span>
                          </span>
                        ) : (
                          <div className="flex items-center space-x-3 text-slate-400">
                            <span className="flex items-center">
                              <Clock className="w-3.5 h-3.5 text-slate-400 mr-1" />
                              Instalação homologada: {installTime}
                            </span>
                            <span>•</span>
                            <span>Garantia de 12 meses Mopar</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </section>

          {/* RIGHT COLUMN: Resumo Financeiro & Totais / F&I Calculator (4 cols) */}
          <aside aria-label="Resumo Comercial e F&I" className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-md sticky top-24 space-y-4">
              {/* Header do Resumo */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm tracking-tight uppercase">Resumo do Pacote</h3>
                  <p className="text-xs text-slate-400 font-medium">Condição especial balcão / CDC</p>
                </div>
                <span className="inline-flex items-center px-2 py-1 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                  {selectedAccessories.length} selecionados
                </span>
              </div>

              {/* Mini Lista de Itens Ativos */}
              <div className="space-y-2 text-xs">
                {selectedAccessories.length === 0 ? (
                  <p className="text-slate-400 italic text-center py-2">Nenhum acessório selecionado</p>
                ) : (
                  selectedAccessories.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-slate-600">
                      <span
                        className={`truncate max-w-[210px] ${
                          item.stockStatus === "dormant"
                            ? "text-amber-800 font-medium"
                            : item.stockStatus === "obsolete"
                            ? "text-rose-800 font-medium"
                            : ""
                        }`}
                        title={item.name}
                      >
                        {item.name}
                      </span>
                      <span className="font-semibold text-slate-800 font-mono">
                        R$ {getDiscountedPrice(item).toLocaleString("pt-BR")}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Ajustes Comerciais: Desconto Concessionária & Bônus Montadora */}
              <div className="bg-slate-50/90 rounded-xl p-3.5 border border-slate-200/90 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <BadgePercent className="w-4 h-4 text-blue-600" />
                    Condições Comerciais do Vendedor
                  </span>
                  {(sellerDiscount > 0 || factoryBonus > 0) && (
                    <button
                      type="button"
                      onClick={() => {
                        setSellerDiscount(0);
                        setFactoryBonus(0);
                      }}
                      className="text-[10px] font-semibold text-slate-400 hover:text-red-500 transition cursor-pointer"
                      title="Zerar descontos manuais"
                    >
                      Limpar
                    </button>
                  )}
                </div>

                <div className="space-y-2.5">
                  {/* Campo Desconto Vendedor / Concessionária */}
                  <div>
                    <label
                      htmlFor="seller-discount"
                      className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1"
                    >
                      <Tag className="w-3 h-3 text-blue-600" />
                      Desconto Adicional Concessionária
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                        R$
                      </span>
                      <input
                        id="seller-discount"
                        type="number"
                        min="0"
                        max={subtotalWithStockDiscounts}
                        step="50"
                        value={sellerDiscount || ""}
                        onChange={(e) => {
                          const val = Math.max(0, Number(e.target.value));
                          setSellerDiscount(val);
                        }}
                        placeholder="0,00"
                        className="w-full pl-8 pr-2.5 py-1.5 text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg shadow-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-300"
                      />
                    </div>
                  </div>

                  {/* Campo Bônus da Montadora */}
                  <div>
                    <label
                      htmlFor="factory-bonus"
                      className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1"
                    >
                      <Award className="w-3 h-3 text-purple-600" />
                      Bônus da Montadora (Stellantis)
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                        R$
                      </span>
                      <input
                        id="factory-bonus"
                        type="number"
                        min="0"
                        max={subtotalWithStockDiscounts}
                        step="50"
                        value={factoryBonus || ""}
                        onChange={(e) => {
                          const val = Math.max(0, Number(e.target.value));
                          setFactoryBonus(val);
                        }}
                        placeholder="0,00"
                        className="w-full pl-8 pr-2.5 py-1.5 text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg shadow-xs focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder:text-slate-300"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Detalhamento de Descontos e Economias */}
              {(stockSavings > 0 || extraDiscount > 0 || factoryBonusAmount > 0) && (
                <div className="border-t border-dashed border-slate-200 pt-3 space-y-1.5 text-xs">
                  {stockSavings > 0 && (
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="font-medium text-emerald-700 flex items-center">
                        <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                        Giro de Estoque
                      </span>
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        - R$ {stockSavings.toLocaleString("pt-BR")}
                      </span>
                    </div>
                  )}
                  {extraDiscount > 0 && (
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="font-medium text-blue-700 flex items-center">
                        <Tag className="w-3.5 h-3.5 mr-1 text-blue-600" />
                        Desc. Concessionária
                      </span>
                      <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        - R$ {extraDiscount.toLocaleString("pt-BR")}
                      </span>
                    </div>
                  )}
                  {factoryBonusAmount > 0 && (
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="font-medium text-purple-700 flex items-center">
                        <Award className="w-3.5 h-3.5 mr-1 text-purple-600" />
                        Bônus Montadora
                      </span>
                      <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        - R$ {factoryBonusAmount.toLocaleString("pt-BR")}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 font-bold text-emerald-800">
                    <span>Economia Total:</span>
                    <span>- R$ {totalAllSavings.toLocaleString("pt-BR")}</span>
                  </div>
                </div>
              )}

              {/* Totalizador */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Total à Vista</span>
                  <span className="text-2xl lg:text-3xl font-black text-blue-600 tracking-tight">
                    R$ {totalFinal.toLocaleString("pt-BR")}
                  </span>
                </div>
                <div className="border-t border-slate-200/80 pt-2 space-y-1">
                  <div className="text-xs text-slate-700 flex justify-between">
                    <span>Parcelamento Cartão Concessionária:</span>
                    <span className="font-bold text-slate-900">
                      12x de R$ {Math.ceil(totalFinal / 12).toLocaleString("pt-BR")}{" "}
                      <span className="font-normal text-[10px] text-slate-500">s/ juros</span>
                    </span>
                  </div>
                  <div className="text-xs text-blue-800 bg-blue-50/70 p-2 rounded-lg border border-blue-100 flex items-start gap-1.5 mt-1.5">
                    <Zap className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div className="leading-tight">
                      <strong className="font-bold">Diluição CDC Jeep Financiamento:</strong>
                      <span className="block text-[11px] text-blue-900 mt-0.5">
                        + apenas <strong>R$ {cdcMonthly} / mês</strong> nas parcelas do carro.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Legenda de Badges com cores distintas */}
              <div className="bg-slate-50/90 rounded-xl p-3.5 border border-slate-200/90 space-y-2 text-[11px] text-slate-600">
                <span className="block font-bold text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                  Legenda dos Selos de Estoque
                </span>
                <div className="flex items-center space-x-2.5">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: "#10b981", boxShadow: "0 0 0 2px #a7f3d0" }}
                  />
                  <span><strong>Disponível (Verde):</strong> Preço regular de tabela Mopar</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: "#f59e0b", boxShadow: "0 0 0 2px #fde68a" }}
                  />
                  <span><strong>Dormente (&gt;180d - Âmbar):</strong> Desconto de 10% a 20% aplicado</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: "#f43f5e", boxShadow: "0 0 0 2px #fecdd3" }}
                  />
                  <span><strong>Obsoleto (&gt;1 ano - Vermelho):</strong> Desconto agressivo 25% a 35%</span>
                </div>
              </div>

              {/* Primary CTA Button */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={onVisualize}
                  disabled={selectedAccessories.length === 0}
                  className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <Eye className="w-5 h-5 text-blue-200" />
                  <span>Visualizar no Veículo 3D</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
                <p className="text-center text-[11px] text-slate-400 font-medium">
                  Gera render interativo em tempo real com os {selectedAccessories.length} itens instalados
                </p>
              </div>
            </div>
          </aside>
        </div>
        {/* END: Main2ColumnGridLayout */}
      </main>
      {/* END: MainContentContainer */}

      {/* BEGIN: GlobalFooter */}
      <footer className="mt-auto border-t border-slate-200 bg-white text-slate-500 text-xs py-5">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800">Smart-Sell</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-400">Versão de Produção 4.9.2</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-slate-600 font-medium">Sistemas 100% Operacionais (DMS &amp; F&amp;I Integrados)</span>
          </div>
        </div>
      </footer>
      {/* END: GlobalFooter */}
    </div>
  );
};

export default PackageSuggestionScreen;