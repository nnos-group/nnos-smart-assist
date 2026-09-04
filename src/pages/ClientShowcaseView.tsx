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

  const isRenegade = vehicleModel.toUpperCase().includes("RENEGADE");
  const isRampage = vehicleModel.toUpperCase().includes("RAMPAGE");
  const isCompass = vehicleModel.toUpperCase().includes("COMPASS");
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
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 antialiased flex flex-col selection:bg-blue-600 selection:text-white">
      {/* BEGIN: PublicHeader */}
      <header className="bg-[#001E36] text-white border-b border-sky-950 shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative w-9 h-9 rounded-full bg-slate-950 border border-slate-700 shadow-md ring-1 ring-white/20 overflow-hidden flex items-center justify-center shrink-0">
              <img
                src={accessoriesBadge}
                alt="Emblema de Acessórios Jeep & RAM"
                className="w-full h-full object-cover scale-[1.04]"
              />
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold tracking-tight text-white block leading-tight">
                Concessionária Autorizada
              </span>
              <span className="text-[10px] text-sky-300 font-semibold uppercase tracking-wider">
                Acessórios Originais Mopar
              </span>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-200 border border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Apresentação Exclusiva</span>
            <span>Para Você</span>
          </span>
        </div>
      </header>
      {/* END: PublicHeader */}

      {/* BEGIN: MainContent */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Personalized Welcome Banner */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
              <Car className="w-4 h-4" />
              <span>Seu Veículo Personalizado</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Olá, {clientName}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Confira a apresentação interativa do seu <strong className="text-slate-900">{vehicleModel}</strong> ({vehicleColor}) com o pacote especial de acessórios homologados Mopar.
            </p>
          </div>

          <div className="flex flex-col items-start sm:items-end shrink-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pacote Selecionado</span>
            <span className="text-sm font-bold text-slate-800">{packageName}</span>
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mt-1">
              {selectedAccessories.length} acessórios inclusos
            </span>
          </div>
        </div>

        {/* Interactive Vehicle Showcase (Video / 3D) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Video className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Visualização Dinâmica Antes &amp; Depois
                </h3>
                <p className="text-xs text-slate-500">
                  Alterne para ver a transformação do seu carro com os acessórios instalados
                </p>
              </div>
            </div>

            {/* Before / After Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setShowAfter(false)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                  !showAfter
                    ? "font-bold text-slate-900 bg-white shadow-sm border border-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Original de Fábrica
              </button>
              <button
                type="button"
                onClick={() => setShowAfter(true)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                  showAfter
                    ? "font-bold text-slate-900 bg-white shadow-sm border border-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Com Seus Acessórios
              </button>
            </div>
          </div>

          {/* Viewport Box */}
          <div className="relative w-full aspect-[16/9] bg-slate-950 flex items-center justify-center overflow-hidden select-none">
            {hasVideo ? (
              <video
                key={`${isCompass ? "compass" : isRenegade ? "renegade" : "rampage"}-client-video-${showAfter ? "com" : "sem"}`}
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

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

            {/* Top Badge */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
              <span className="inline-flex items-center space-x-2 bg-slate-900/90 text-white backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider border border-white/20 shadow-lg">
                {showAfter ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>COM {selectedAccessories.length} ACESSÓRIOS INSTALADOS</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>ORIGINAL DE FÁBRICA (SEM ACESSÓRIOS)</span>
                  </>
                )}
              </span>
            </div>

            {/* Accessory Tags Overlay */}
            {showAfter && selectedAccessories.length > 0 && (
              <div className="absolute bottom-4 inset-x-0 flex flex-wrap items-center justify-center gap-2 px-4 z-20 pointer-events-none">
                {selectedAccessories.map((acc) => (
                  <span
                    key={acc.id}
                    className="bg-slate-900/90 text-white text-[11px] font-bold px-3 py-1 rounded shadow-lg border border-slate-600 backdrop-blur-sm flex items-center space-x-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    <span>{acc.name}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Two-Column Details: Accessories Grid & Financial Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Accessories List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-base font-bold text-slate-900">
                Itens Inclusos na Sua Configuração
              </h3>
              <span className="text-xs text-slate-500 font-medium">Instalação e garantia inclusas</span>
            </div>

            <div className="space-y-3">
              {selectedAccessories.map((item) => {
                const finalPrice = Math.round(item.price * (1 - item.discountPercent / 100));
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0 mt-0.5 text-lg">
                        {item.icon || "⚙️"}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{item.description}</p>
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mt-2">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          Garantia Oficial Mopar 3 Anos
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs text-slate-400 block">Preço tabela</span>
                      <span className="text-sm font-extrabold text-blue-700 font-mono">
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
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md space-y-5 sticky top-24">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Condição Comercial</span>
                <h3 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">
                  Resumo da Sua Proposta
                </h3>
              </div>

              {/* Total Card */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Total à Vista</span>
                  <span className="text-2xl sm:text-3xl font-black text-blue-600 font-mono">
                    R$ {calculatedTotal.toLocaleString("pt-BR")}
                  </span>
                </div>

                <div className="border-t border-slate-200 pt-2.5 space-y-2">
                  <div className="text-xs text-slate-700 flex justify-between">
                    <span>Parcelamento no Cartão:</span>
                    <span className="font-bold text-slate-900">
                      12x de R$ {Math.ceil(calculatedTotal / 12).toLocaleString("pt-BR")} s/ juros
                    </span>
                  </div>

                  <div className="bg-blue-50/80 p-3 rounded-lg border border-blue-100 flex items-start gap-2">
                    <Zap className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div className="text-xs text-blue-900 leading-tight">
                      <strong className="font-bold">Diluição no Financiamento CDC:</strong>
                      <span className="block mt-0.5 text-blue-800">
                        + apenas <strong>R$ {cdcMonthly} / mês</strong> nas parcelas do seu veículo.
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
                  className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-extrabold text-sm py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-600/25 flex items-center justify-center space-x-2 transition transform active:scale-[0.99] cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Aprovar Proposta no WhatsApp</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Secondary CTA: Tirar Dúvidas */}
                <button
                  type="button"
                  onClick={handleContactConsultant}
                  className="w-full bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs py-2.5 px-4 rounded-xl border border-slate-300 shadow-xs flex items-center justify-center space-x-1.5 transition cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  <span>Falar com o Consultor / Ajustar Itens</span>
                </button>
              </div>

              {/* Quality Guarantee Seal */}
              <div className="bg-slate-900 text-white rounded-xl p-3.5 flex items-center space-x-3 border border-slate-700">
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
