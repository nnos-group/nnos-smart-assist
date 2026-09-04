import { useState } from "react";
import { 
  ShoppingCart, MessageSquare, ArrowRight, 
  ChevronLeft, Video, Share2, BadgePercent, Tag, Award, Check, Zap, XCircle 
} from "lucide-react";
import ramRampageImage from "@/assets/ram-rampage-rebel.jpg";
import { Accessory, ClientData } from "@/types/accessories";
import { toast } from "sonner";
import { ProposalRejectedModal } from "./ProposalRejectedModal";

interface VehicleVisualizationScreenProps {
  accessories: Accessory[];
  clientData: ClientData;
  onAccessoryToggle: (id: string) => void;
  onGenerateScript: () => void;
  onAddToProposal: () => void;
  onBack?: () => void;
}

const VehicleVisualizationScreen = ({
  accessories,
  clientData,
  onAccessoryToggle,
  onGenerateScript,
  onAddToProposal,
  onBack,
}: VehicleVisualizationScreenProps) => {
  const [showAfter, setShowAfter] = useState(true);
  const [sellerDiscount, setSellerDiscount] = useState<number>(0);
  const [factoryBonus, setFactoryBonus] = useState<number>(0);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const isRenegade = clientData.vehicleModel.toUpperCase().includes("RENEGADE");
  const isRampage = clientData.vehicleModel.toUpperCase().includes("RAMPAGE");
  const isCompass = clientData.vehicleModel.toUpperCase().includes("COMPASS");
  const hasVideo = isRenegade || isRampage || isCompass;

  const base = (import.meta.env.BASE_URL || "/").endsWith("/")
    ? (import.meta.env.BASE_URL || "/")
    : `${import.meta.env.BASE_URL}/`;

  const getVideoSrc = () => {
    if (isRenegade) {
      return `${base}videos/${showAfter ? "Jeep_Renegade_com.mp4" : "Jeep_Renegade_sem.mp4"}`;
    }
    if (isRampage) {
      return `${base}videos/${showAfter ? "Ram_Rampage_com.mp4" : "Ram_Rampage_sem.mp4"}`;
    }
    if (isCompass) {
      return `${base}videos/${showAfter ? "Compass_com.mp4" : "Compass_sem.mp4"}`;
    }
    return null;
  };

  const getVehicleShortName = () => {
    if (isRenegade) return "Jeep Renegade";
    if (isRampage) return "RAM Rampage";
    if (isCompass) return "Jeep Compass";
    return clientData.vehicleModel;
  };

  const selectedAccessories = accessories.filter((a) => a.selected);

  const getDiscountedPrice = (item: Accessory) => {
    return Math.round(item.price * (1 - item.discountPercent / 100));
  };

  // Cálculos financeiros idênticos aos da tela de Pacote de Acessórios
  const subtotalWithStockDiscounts = selectedAccessories.reduce(
    (sum, item) => sum + getDiscountedPrice(item), 
    0
  );
  const totalOriginal = selectedAccessories.reduce((sum, item) => sum + item.price, 0);
  const stockSavings = totalOriginal - subtotalWithStockDiscounts;

  const extraDiscount = Math.min(sellerDiscount, subtotalWithStockDiscounts);
  const factoryBonusAmount = Math.min(factoryBonus, Math.max(0, subtotalWithStockDiscounts - extraDiscount));
  const totalFinal = Math.max(0, subtotalWithStockDiscounts - extraDiscount - factoryBonusAmount);
  const totalAllSavings = stockSavings + extraDiscount + factoryBonusAmount;

  const cdcMonthly = (totalFinal * 0.0235).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const handleShareWhatsApp = () => {
    const accessoriesList = selectedAccessories.length > 0
      ? selectedAccessories.map((a) => `• ${a.name} (R$ ${getDiscountedPrice(a).toLocaleString("pt-BR")})`).join("\n")
      : "Nenhum acessório selecionado";

    // Link interativo exclusivo para o cliente visualizar o veículo montado sem necessidade de acesso ao sistema
    const accIds = selectedAccessories.map((a) => a.id).join(",");
    const basePath = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
    const interactive3dUrl = `${window.location.origin}${basePath}/visualizacao?client=${encodeURIComponent(clientData.clientName || "Cliente")}&model=${encodeURIComponent(clientData.vehicleModel)}&color=${encodeURIComponent(clientData.vehicleColor)}&acc=${encodeURIComponent(accIds)}&total=${totalFinal}&cdc=${encodeURIComponent(cdcMonthly)}`;

    const message = 
      `Olá ${clientData.clientName || ""}!\n\n` +
      `Aqui está a proposta e a *Visualização 3D Interativa* do seu *${clientData.vehicleModel}* (${clientData.vehicleColor}) com os acessórios originais Mopar selecionados:\n\n` +
      `*Acessórios Selecionados:*\n${accessoriesList}\n\n` +
      `*Condições Especiais:*\n` +
      `• Total à Vista: R$ ${totalFinal.toLocaleString("pt-BR")}\n` +
      `• Parcelamento Concessionária: 12x de R$ ${Math.ceil(totalFinal / 12).toLocaleString("pt-BR")} s/ juros\n` +
      `• Diluição CDC Jeep: + apenas R$ ${cdcMonthly}/mês na parcela do veículo\n\n` +
      `🔗 *Acesse a Visualização 3D Interativa em tempo real:* \n${interactive3dUrl}\n\n` +
      `Qualquer dúvida ou ajuste que desejar, estou à disposição!`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(interactive3dUrl).catch(() => {});
    }

    const text = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
    toast.success("Link interativo 3D e proposta enviados ao WhatsApp!");
  };

  return (
    <div className="min-h-full flex flex-col font-sans text-slate-800 bg-slate-100 antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* BEGIN: PageContent */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col space-y-4">
        {/* BEGIN: ContextBreadcrumbAndTitle */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              {onBack ? (
                <button
                  type="button"
                  onClick={onBack}
                  className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-800 transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Voltar para Pacote Acessórios
                </button>
              ) : (
                <span className="text-xs font-semibold text-slate-500">
                  Etapa 3 · Visualização
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              {clientData.vehicleModel} — {clientData.vehicleColor}
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-200 text-slate-700">
                {isRampage ? "Turbo Diesel 4x4" : "Tração 4x4 Integral"}
              </span>
            </h1>

            <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>
                Ano: <strong className="text-slate-700">{clientData.vehicleYear || "2025/2026"}</strong>
              </span>
              <span>•</span>
              <span>
                Cliente: <strong className="text-slate-700">{clientData.clientName || "João Silva Sauro"}</strong>
              </span>
              <span>•</span>
              <span>
                Proposta: <strong className="text-slate-700">#RAM-84920-F&amp;I</strong>
              </span>
              <span>•</span>
              <span className="inline-flex items-center text-emerald-600 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" />
                Vídeo Oficial Mopar Conectado
              </span>
            </p>
          </div>
        </div>
        {/* END: ContextBreadcrumbAndTitle */}

        {/* BEGIN: MainShowcaseGrid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* LEFT COLUMN: Interactive Vehicle Viewport & Dynamic Controls (Col 8/12) */}
          <section aria-label="Visualizador Interativo do Veículo" className="lg:col-span-8 flex flex-col space-y-3">
            {/* Main Interactive Visual Container */}
            <div className="relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-300 shadow-xl group">
              {/* Base Vehicle Viewport */}
              <div className="relative w-full aspect-[16/9] bg-slate-950 flex items-center justify-center overflow-hidden select-none">
                {hasVideo ? (
                  /* High-Definition Official Video */
                  <video
                    key={`${isCompass ? "compass" : isRenegade ? "renegade" : "rampage"}-video-${showAfter ? "com" : "sem"}`}
                    src={getVideoSrc() || undefined}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover object-center transition-opacity duration-300"
                  />
                ) : (
                  /* Fallback to vehicle image */
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      src={ramRampageImage}
                      alt={clientData.vehicleModel}
                      className="max-h-full max-w-full object-contain drop-shadow-2xl"
                    />
                  </div>
                )}

                {/* Gradient Overlays for UI readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25 pointer-events-none" />

                {/* Top Overlay Badge: Estado Atual */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
                  <span
                    className="inline-flex items-center space-x-2 bg-slate-900/90 text-white backdrop-blur-md px-5 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider border border-white/20 shadow-lg ring-1 ring-black/40"
                    id="badge-status-stage"
                  >
                    {showAfter ? (
                      <>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>DEPOIS • {selectedAccessories.length} ACESSÓRIOS</span>
                      </>
                    ) : (
                      <>
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                        <span>ORIGINAL DE FÁBRICA • SEM ACESSÓRIOS</span>
                      </>
                    )}
                  </span>
                </div>

                {/* Interactive Hotspot Tags (Pinned to accessories - shown in "Depois" mode) */}
                {showAfter && selectedAccessories.length > 0 && (
                  <div className="absolute bottom-16 inset-x-0 flex flex-wrap items-center justify-center gap-2 px-4 z-20 pointer-events-auto">
                    {selectedAccessories.map((acc) => (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => onAccessoryToggle(acc.id)}
                        className="bg-slate-900/90 hover:bg-blue-600 text-white text-[11px] font-bold px-3 py-1 rounded shadow-lg border border-slate-600 backdrop-blur-sm transition flex items-center space-x-1.5 cursor-pointer"
                        title={`Clique para desmarcar ${acc.name}`}
                      >
                        <span className="w-2 h-2 rounded-full bg-blue-400" />
                        <span>{acc.name}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Bottom Left Floating Quick Pill: Vídeo Oficial */}
                <div className="absolute bottom-4 left-4 z-20">
                  <div className="inline-flex items-center space-x-2 bg-slate-900/90 text-white text-xs font-semibold px-3 py-2 rounded-lg border border-slate-700/80 shadow-md backdrop-blur-sm">
                    <Video className="w-4 h-4 text-blue-400" />
                    <span>Vídeo Oficial {getVehicleShortName()}</span>
                    <span className="bg-blue-600 text-[10px] uppercase px-1.5 py-0.5 rounded font-bold text-white">4K</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Demonstration Switcher Control Bar (Card inferior) */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    Demonstração Dinâmica {getVehicleShortName()}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Alterne "Antes / Depois" para comparar a transformação com o cliente
                  </p>
                </div>
              </div>

              {/* Dynamic Before/After Pill Switcher */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAfter(false)}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                    !showAfter
                      ? "font-bold text-slate-900 bg-white shadow-sm border border-slate-200"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  id="btn-switch-antes"
                >
                  Antes
                </button>

                <div
                  onClick={() => setShowAfter(!showAfter)}
                  className={`w-11 h-6 rounded-full flex items-center p-0.5 cursor-pointer mx-1 transition ${
                    showAfter ? "bg-slate-900 justify-end" : "bg-slate-300 justify-start"
                  }`}
                  id="visual-toggle-rail"
                  role="switch"
                  aria-checked={showAfter}
                  aria-label="Alternar visualização Antes e Depois"
                >
                  <span className="w-5 h-5 bg-white rounded-full shadow-md transition-transform" />
                </div>

                <button
                  type="button"
                  onClick={() => setShowAfter(true)}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                    showAfter
                      ? "font-bold text-slate-900 bg-white shadow-sm border border-slate-200"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  id="btn-switch-depois"
                >
                  Depois
                </button>
              </div>
            </div>
          </section>
          {/* END: Interactive Vehicle Viewport */}

          {/* RIGHT COLUMN: Resumo Comercial & Acessórios Interativos (Mesmo Layout do Pacote de Acessórios) */}
          <aside aria-label="Resumo Comercial e F&I" className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-md sticky top-20 space-y-4">
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

              {/* Lista de Acessórios com Checkboxes Selecionáveis */}
              <div className="space-y-1 text-xs max-h-[280px] overflow-y-auto pr-1">
                {accessories.map((item) => {
                  const isChecked = item.selected;
                  const finalPrice = getDiscountedPrice(item);

                  return (
                    <label
                      key={item.id}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg transition cursor-pointer select-none ${
                        isChecked
                          ? "bg-slate-50/90 hover:bg-slate-100/80"
                          : "opacity-45 hover:opacity-80 hover:bg-slate-50/50"
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => onAccessoryToggle(item.id)}
                          className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer shrink-0"
                        />
                        <span
                          className={`truncate max-w-[210px] text-xs ${
                            !isChecked
                              ? "text-slate-400 line-through"
                              : item.stockStatus === "dormant"
                              ? "text-amber-800 font-semibold"
                              : item.stockStatus === "obsolete"
                              ? "text-rose-800 font-semibold"
                              : "text-slate-700 font-medium"
                          }`}
                          title={item.name}
                        >
                          {item.name}
                        </span>
                      </div>
                      <span
                        className={`font-semibold font-mono text-xs whitespace-nowrap shrink-0 ${
                          !isChecked ? "text-slate-400 line-through" : "text-slate-800"
                        }`}
                      >
                        R$ {finalPrice.toLocaleString("pt-BR")}
                      </span>
                    </label>
                  );
                })}
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
                      htmlFor="vis-seller-discount"
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
                        id="vis-seller-discount"
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
                      htmlFor="vis-factory-bonus"
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
                        id="vis-factory-bonus"
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

              {/* Legenda dos Selos de Estoque */}
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

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-1">
                {/* Primary Action: Adicionar à Proposta */}
                <button
                  type="button"
                  onClick={onAddToProposal}
                  disabled={selectedAccessories.length === 0}
                  className="w-full bg-[#ff6200] hover:bg-[#e65800] disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold text-sm py-3.5 px-4 rounded-xl shadow-lg shadow-orange-500/25 flex items-center justify-center space-x-2 transition transform active:scale-[0.99] cursor-pointer"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Adicionar à Proposta</span>
                </button>

                {/* Secondary Action: Gerar Argumentação Consultiva */}
                <button
                  type="button"
                  onClick={() => {
                    if (selectedAccessories.length === 0) {
                      toast.warning("Selecione ao menos um acessório para gerar a argumentação.");
                      return;
                    }
                    onGenerateScript();
                  }}
                  className="w-full bg-white hover:bg-blue-50/50 text-blue-600 hover:text-blue-700 font-bold text-xs py-2.5 px-4 rounded-xl border border-blue-200 shadow-sm flex items-center justify-center space-x-2 transition cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-blue-500" />
                  <span>Gerar Argumentação Consultiva</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {/* Tertiary Action: Proposta Recusada (Reaquecer Lead) */}
                <button
                  type="button"
                  onClick={() => setShowRejectModal(true)}
                  className="w-full bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-700 font-bold text-xs py-2.5 px-4 rounded-xl border border-slate-200 hover:border-rose-200 shadow-xs flex items-center justify-center space-x-2 transition cursor-pointer"
                  title="Registrar recusa e direcionar este cliente para a base de reaquecimento de leads"
                >
                  <XCircle className="w-4 h-4 text-rose-500" />
                  <span>Proposta Recusada (Reaquecer Lead)</span>
                </button>

                {/* Quick Action: Share to WhatsApp */}
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="w-full text-slate-500 hover:text-slate-800 font-medium text-[11px] py-1 flex items-center justify-center space-x-1.5 transition cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Enviar visualização 3D ao WhatsApp do Cliente</span>
                </button>
              </div>
            </div>

            {/* Modal de Registro de Proposta Recusada */}
            <ProposalRejectedModal
              isOpen={showRejectModal}
              onClose={() => setShowRejectModal(false)}
              clientData={clientData}
              selectedAccessories={selectedAccessories}
              totalProposalValue={totalFinal}
              cdcMonthlyEstimate={cdcMonthly}
            />

            {/* Mopar Certified Quality Seal */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between border border-slate-700 shadow-sm">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center text-xs font-black shadow-inner">
                  M
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Garantia Original Mopar Stellantis</p>
                  <p className="text-[10px] text-slate-400">Instalação certificada preserva garantia de 3 anos</p>
                </div>
              </div>
              <span className="text-[10px] bg-slate-800 border border-slate-700 text-slate-300 px-2 py-0.5 rounded font-mono">
                100% OK
              </span>
            </div>
          </aside>
          {/* END: RIGHT COLUMN */}
        </div>
        {/* END: MainShowcaseGrid */}
      </main>
      {/* END: PageContent */}

      {/* BEGIN: MainFooter */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-3.5 text-xs text-slate-500">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-3">
            <span className="text-slate-400 text-[11px]">Ambiente Seguro Concessionária</span>
          </div>
          <div className="flex items-center space-x-4 text-[11px]">
            <span className="inline-flex items-center text-emerald-700 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5" />
              Sistemas 100% Operacionais (DMS &amp; F&amp;I Integrados)
            </span>
          </div>
        </div>
      </footer>
      {/* END: MainFooter */}
    </div>
  );
};

export default VehicleVisualizationScreen;
