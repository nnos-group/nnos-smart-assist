import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { 
  ShieldCheck, Check, MessageCircle, Video, 
  Sparkles, CheckCircle, Tag, Zap, Car, Award, ChevronRight, Phone
} from "lucide-react";
import ramRampageImage from "@/assets/ram-rampage-rebel.jpg";
import accessoriesBadge from "@/assets/accessories-badge.jpg";
import { getAccessoriesForVehicle, getPackageName } from "@/types/accessories";

const ClientShowcaseView = () => {
  const [searchParams] = useSearchParams();

  // Obter parâmetros passados pela concessionária via link do WhatsApp
  const clientName = searchParams.get("client") || searchParams.get("c") || "Cliente";
  const vehicleModel = searchParams.get("model") || searchParams.get("m") || "JEEP RENEGADE TRAILHAWK";
  const vehicleColor = searchParams.get("color") || searchParams.get("col") || "Verde Recon";
  const accIdsParam = searchParams.get("acc") || searchParams.get("items") || "";
  const totalParam = searchParams.get("total") || searchParams.get("t");
  const cdcParam = searchParams.get("cdc");
  const consultantName = searchParams.get("consultant") || "Consultor da Concessionária";

  const [showAfter, setShowAfter] = useState(true);
  const [viewPerspective, setViewPerspective] = useState<"externo" | "interno">("externo");

  const isRenegade = vehicleModel.toUpperCase().includes("RENEGADE");
  const isRampage = vehicleModel.toUpperCase().includes("RAMPAGE");
  const isCompass = vehicleModel.toUpperCase().includes("COMPASS");
  const hasVideo = isRenegade || isRampage || isCompass;

  const base = (import.meta.env.BASE_URL || "/").endsWith("/")
    ? (import.meta.env.BASE_URL || "/")
    : `${import.meta.env.BASE_URL}/`;

  const getVideoSrc = () => {
    if (viewPerspective === "interno") {
      if (isRenegade) {
        return `${base}videos/${showAfter ? "Jeep_Renegade_interior_cabin_pan_com.mp4" : "Jeep_Renegade_interior_cabin_pan_sem.mp4"}`;
      }
      if (isRampage) {
        return `${base}videos/${showAfter ? "Ram_Rampage_cabin_interior_com.mp4" : "Ram_Rampage_cabin_interior_sem.mp4"}`;
      }
      if (isCompass) {
        return `${base}videos/${showAfter ? "Jeep_Compass_interior_cabin_com.mp4" : "Jeep_Compass_interior_cabin_sem.mp4"}`;
      }
      return null;
    }

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

  // Carregar os acessórios do veículo e filtrar os que foram selecionados na proposta
  const allVehicleAccessories = useMemo(() => getAccessoriesForVehicle(vehicleModel), [vehicleModel]);

  const selectedAccessories = useMemo(() => {
    if (!accIdsParam) {
      // Se não passou parâmetros específicos, pega os selecionados por padrão
      return allVehicleAccessories.filter((a) => a.selected);
    }
    const targetIds = accIdsParam.split(",").map((id) => id.trim().toLowerCase());
    const matched = allVehicleAccessories.filter((a) => targetIds.includes(a.id.toLowerCase()));
    return matched.length > 0 ? matched : allVehicleAccessories.filter((a) => a.selected);
  }, [allVehicleAccessories, accIdsParam]);

  const calculatedTotal = useMemo(() => {
    if (totalParam) return Number(totalParam);
    return selectedAccessories.reduce((sum, item) => {
      const discounted = Math.round(item.price * (1 - item.discountPercent / 100));
      return sum + discounted;
    }, 0);
  }, [selectedAccessories, totalParam]);

  const cdcMonthly = useMemo(() => {
    if (cdcParam) return cdcParam;
    return (calculatedTotal * 0.0235).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, [calculatedTotal, cdcParam]);

  const packageName = getPackageName(vehicleModel);

  const handleApproveProposal = () => {
    const text = encodeURIComponent(
      `Olá ${consultantName}! Acessei a visualização do meu ${vehicleModel} (${vehicleColor}) com o pacote de acessórios Mopar e aprovei a proposta! Como podemos confirmar a instalação?`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handleContactConsultant = () => {
    const text = encodeURIComponent(
      `Olá ${consultantName}! Vi a apresentação do meu ${vehicleModel} e gostaria de tirar uma dúvida sobre os acessórios Mopar.`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 antialiased flex flex-col selection:bg-sky-500 selection:text-white">
      {/* BEGIN: PublicHeader */}
      <header className="bg-white/95 text-slate-900 border-b border-slate-200/80 shadow-xs backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative h-11 w-auto aspect-[2055/1279] flex items-center justify-center shrink-0">
              <img
                src={accessoriesBadge}
                alt="Logomarca Oficial Jeep & RAM"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 block leading-tight font-display">
                Concessionária Autorizada
              </span>
              <span className="text-[10px] text-sky-600 font-bold uppercase tracking-wider">
                Acessórios Originais Mopar
              </span>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200/80">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span className="hidden sm:inline">Apresentação Exclusiva</span>
            <span>Para Você</span>
          </span>
        </div>
      </header>
      {/* END: PublicHeader */}

      {/* BEGIN: MainContent */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Personalized Welcome Banner */}
        <div className="cockpit-panel rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative overflow-hidden bg-gradient-to-br from-white via-white to-sky-50/30">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 uppercase tracking-wider mb-2 bg-sky-50/80 px-2.5 py-1 rounded-md border border-sky-100/80">
              <Car className="w-3.5 h-3.5" />
              <span>Seu Veículo Personalizado</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              Olá, {clientName}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Confira a apresentação interativa do seu <strong className="text-slate-900 font-bold">{vehicleModel}</strong> ({vehicleColor}) com o pacote especial de acessórios homologados Mopar.
            </p>
          </div>

          <div className="flex flex-col items-start sm:items-end shrink-0 p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pacote Selecionado</span>
            <span className="text-sm font-bold text-slate-800 font-display">{packageName}</span>
            <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 mt-1.5 inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {selectedAccessories.length} acessórios inclusos
            </span>
          </div>
        </div>

        {/* Interactive Vehicle Showcase (Video / 3D) */}
        <div className="cockpit-panel rounded-2xl overflow-hidden shadow-card">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 border border-sky-200/80 flex items-center justify-center font-bold shrink-0">
                <Video className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-display">
                  Visualização Dinâmica Antes &amp; Depois
                </h3>
                <p className="text-xs text-slate-500">
                  Alterne para ver a transformação do seu carro com os acessórios instalados
                </p>
              </div>
            </div>

            {/* Controls: Externo/Interno e Antes/Depois Lado a Lado na Mesma Fileira */}
            <div className="flex items-center gap-2.5 shrink-0 flex-nowrap overflow-x-auto self-start xl:self-auto max-w-full">
              {/* Dynamic Perspective Switcher */}
              <div className="flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/80 shrink-0">
                <button
                  type="button"
                  onClick={() => setViewPerspective("externo")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                    viewPerspective === "externo"
                      ? "font-bold text-slate-900 bg-white shadow-xs border border-slate-200"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Externo
                </button>
                <div
                  onClick={() => setViewPerspective(viewPerspective === "externo" ? "interno" : "externo")}
                  className={`w-10 h-5 rounded-full flex items-center p-0.5 cursor-pointer mx-1 transition ${
                    viewPerspective === "interno" ? "bg-slate-900 justify-end" : "bg-slate-300 justify-start"
                  }`}
                  role="switch"
                  aria-checked={viewPerspective === "interno"}
                >
                  <span className="w-4 h-4 bg-white rounded-full shadow-xs transition-transform" />
                </div>
                <button
                  type="button"
                  onClick={() => setViewPerspective("interno")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                    viewPerspective === "interno"
                      ? "font-bold text-slate-900 bg-white shadow-xs border border-slate-200"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Interno
                </button>
              </div>

              {/* Before / After Switcher */}
              <div className="flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/80 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowAfter(false)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                    !showAfter
                      ? "font-bold text-slate-900 bg-white shadow-xs border border-slate-200"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Original de Fábrica
                </button>
                <div
                  onClick={() => setShowAfter(!showAfter)}
                  className={`w-10 h-5 rounded-full flex items-center p-0.5 cursor-pointer mx-1 transition ${
                    showAfter ? "bg-slate-900 justify-end" : "bg-slate-300 justify-start"
                  }`}
                  role="switch"
                  aria-checked={showAfter}
                >
                  <span className="w-4 h-4 bg-white rounded-full shadow-xs transition-transform" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowAfter(true)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                    showAfter
                      ? "font-bold text-slate-900 bg-white shadow-xs border border-slate-200"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Com Seus Acessórios
                </button>
              </div>
            </div>
          </div>

          {/* Viewport Box (Vídeo 100% Limpo sem sobreposições poluindo a imagem) */}
          <div className="relative w-full aspect-[16/9] bg-slate-950 flex items-center justify-center overflow-hidden select-none">
            {hasVideo ? (
              <video
                key={`${isCompass ? "compass" : isRenegade ? "renegade" : "rampage"}-${viewPerspective}-client-${showAfter ? "com" : "sem"}`}
                src={getVideoSrc() || undefined}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover object-center transition-opacity duration-300"
              />
            ) : (
              <img
                src={ramRampageImage}
                alt={vehicleModel}
                className="max-h-full max-w-full object-contain drop-shadow-2xl"
              />
            )}
          </div>
        </div>

        {/* DIFERENCIAIS EXCLUSIVOS DE CONCESSIONÁRIA AUTORIZADA (REDE OFICIAL STELLANTIS MOPAR) */}
        <div className="cockpit-panel rounded-2xl p-6 border border-sky-100 bg-gradient-to-b from-sky-50/40 via-white to-white space-y-4 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center font-bold text-base shrink-0">
                💎
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-display">
                  Diferenciais Exclusivos de Concessionária Autorizada
                </h3>
                <p className="text-xs text-slate-500">
                  Sua tranquilidade e a garantia de fábrica do seu 0km 100% protegidas
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-auto">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Oficina Homologada Mopar
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:border-sky-300 hover:shadow-card transition-all flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200/60 flex items-center justify-center shrink-0 text-base">
                ⭐
              </div>
              <div>
                <strong className="text-xs font-bold text-slate-900 block">
                  100% Originais &amp; Homologados de Fábrica
                </strong>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Você adquire componentes desenvolvidos e testados sob os mais rigorosos padrões de engenharia Mopar / Stellantis, garantindo durabilidade máxima e encaixe perfeito sob medida.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:border-sky-300 hover:shadow-card transition-all flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200/60 flex items-center justify-center shrink-0 text-base">
                🛡️
              </div>
              <div>
                <strong className="text-xs font-bold text-slate-900 block">
                  Garantia Total do Veículo Preservada
                </strong>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  A instalação é executada exclusivamente por técnicos especializados certificados na oficina autorizada. O seu veículo 0km mantém integralmente a garantia total de fábrica, sem qualquer risco elétrico ou estrutural.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:border-sky-300 hover:shadow-card transition-all flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200/60 flex items-center justify-center shrink-0 text-base">
                🔒
              </div>
              <div>
                <strong className="text-xs font-bold text-slate-900 block">
                  Segurança Ativa e Passiva Integradas
                </strong>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Acessórios testados contra impactos e perfeitamente integrados aos módulos e à eletrônica de bordo original do carro, preservando sensores, airbags e sistemas de assistência.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:border-sky-300 hover:shadow-card transition-all flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200/60 flex items-center justify-center shrink-0 text-base">
                📈
              </div>
              <div>
                <strong className="text-xs font-bold text-slate-900 block">
                  Valorização Comprovada na Revenda
                </strong>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Carros equipados com acessórios genuínos de fábrica têm maior procura, maior valor de avaliação nas concessionárias e muito mais liquidez no mercado de seminovos.
                </p>
              </div>
            </div>
          </div>
        </div>

          {/* Two-Column Details: Accessories Grid & Financial Summary (Estrutura idêntica à de Investimento) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Accessories List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-base font-bold text-slate-900 font-display">
                Itens Inclusos na Sua Configuração
              </h3>
              <span className="text-xs text-slate-500 font-medium">Instalação e garantia inclusas</span>
            </div>

            <div className="space-y-3">
              {selectedAccessories.map((item) => {
                const finalPrice = Math.round(item.price * (1 - item.discountPercent / 100));
                const isOutOfStock = item.inStock === false || item.stockQuantity === 0;
                return (
                  <div
                    key={item.id}
                    className={`cockpit-panel rounded-xl p-4 border shadow-xs hover:shadow-card hover:border-sky-300 transition-all flex items-start justify-between gap-3 bg-white group ${
                      isOutOfStock ? "border-amber-200 bg-amber-50/20" : "border-slate-200/80"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-700 flex items-center justify-center shrink-0 mt-0.5 text-xl group-hover:scale-105 transition-transform">
                        {item.icon || "⚙️"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm font-display">{item.name}</h4>
                          {isOutOfStock && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100/90 px-1.5 py-0.5 rounded border border-amber-300">
                              ⚠️ Encomenda CD (2-5d)
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{item.description}</p>
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 mt-2">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          Garantia Oficial Mopar 3 Anos
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs text-slate-400 block font-medium">Preço tabela</span>
                      <span className="text-xs font-bold text-slate-900 font-display">
                        R$ {finalPrice.toLocaleString("pt-BR")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Proposal Summary & Fast Approve CTA */}
          <div className="lg:col-span-5 space-y-4">
            <div className="cockpit-panel rounded-2xl p-6 space-y-5 sticky top-24 shadow-card bg-white">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Condição Comercial</span>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight font-display mt-0.5">
                  Resumo da Sua Proposta
                </h3>
              </div>

              {/* Total Card */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between gap-2 pb-3.5 border-b border-slate-200/90">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Total à Vista
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-[#0077E6] tracking-tight font-display">
                    R$ {calculatedTotal.toLocaleString("pt-BR")}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-700 font-medium">
                    <span className="text-slate-600">Parcelamento no Cartão:</span>
                    <span className="font-bold text-slate-900">
                      12x de R$ {Math.ceil(calculatedTotal / 12).toLocaleString("pt-BR")}{" "}
                      <span className="font-normal text-slate-500">s/ juros</span>
                    </span>
                  </div>

                  <div className="bg-sky-50/90 p-3.5 rounded-xl border border-sky-200/80 flex items-start gap-2.5">
                    <Zap className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <div className="text-xs text-sky-950 leading-relaxed">
                      <strong className="font-bold text-sky-900 block">Diluição no Financiamento CDC:</strong>
                      <span className="block mt-0.5 text-sky-800 text-[11px]">
                        + apenas <strong className="text-sky-950 font-bold">R$ {cdcMonthly} / mês</strong> nas parcelas do seu veículo.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons for Client */}
              <div className="space-y-2.5 pt-1">
                {/* Primary CTA: Approve via WhatsApp */}
                <button
                  type="button"
                  onClick={handleApproveProposal}
                  className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-bold text-sm py-3.5 px-4 rounded-xl shadow-md shadow-emerald-500/20 flex items-center justify-center space-x-2 transition transform active:scale-[0.99] cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Aprovar Proposta no WhatsApp</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Secondary CTA: Tirar Dúvidas */}
                <button
                  type="button"
                  onClick={handleContactConsultant}
                  className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs py-2.5 px-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-center space-x-1.5 transition cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-sky-600" />
                  <span>Falar com o Consultor / Ajustar Itens</span>
                </button>
              </div>

              {/* Quality Guarantee Seal */}
              <div className="bg-slate-900 text-white rounded-xl p-3.5 flex items-center space-x-3 border border-slate-800 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-xs shrink-0">
                  M
                </div>
                <div className="text-[11px] leading-tight text-slate-300">
                  <strong className="font-bold text-white block">Garantia de 3 Anos Preservada</strong>
                  Instalação homologada por técnicos certificados da concessionária oficial.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* END: MainContent */}

      {/* BEGIN: PublicFooter */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-semibold text-slate-700">Concessionária Autorizada</span>
            <span>•</span>
            <span>Rede Oficial Stellantis Mopar</span>
          </div>
          <span className="text-[11px] text-slate-400">
            Ambiente Seguro • Proposta Válida Conforme Disponibilidade
          </span>
        </div>
      </footer>
      {/* END: PublicFooter */}
    </div>
  );
};

export default ClientShowcaseView;
