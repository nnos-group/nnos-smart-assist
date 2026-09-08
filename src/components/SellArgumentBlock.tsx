/**
 * SellArgumentBlock — Bloco "COMO VENDER ESTA RECOMENDAÇÃO"
 *
 * Componente reutilizável que exibe argumentação de vendas para cada acessório
 * e para o pacote completo. Usado na tela de Pacote (Step 2) e pode ser
 * reutilizado em qualquer ponto do fluxo.
 */

import { useState, useMemo } from "react";
import {
  Sparkles, ChevronDown, ChevronUp, MessageSquare, Copy, Check,
  Target, Shield, Zap, HelpCircle, Share2, RefreshCw, Package,
  Lightbulb, MessageCircle, ArrowRight,
} from "lucide-react";
import { Accessory, ClientData, ClientSource } from "@/types/accessories";
import { SellRecommendation, RecoveryContext } from "@/types/salesArgument";
import { generatePrepareRecommendation, generateRecoveryRecommendation } from "@/lib/salesArgumentEngine";
import { saveArgumentationLog } from "@/lib/argumentationRepository";
import { toast } from "sonner";

interface SellArgumentBlockProps {
  accessories: Accessory[];
  clientData: ClientData;
  clientSource: ClientSource;
  /** Contexto de recuperação (quando modo = recover) */
  recoveryContext?: RecoveryContext;
  /** Callback quando uma argumentação é gerada (para registrar externamente) */
  onArgumentGenerated?: (recommendation: SellRecommendation) => void;
}

const SellArgumentBlock = ({
  accessories,
  clientData,
  clientSource,
  recoveryContext,
  onArgumentGenerated,
}: SellArgumentBlockProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<"individual" | "package">("package");
  const [expandedAccessoryIds, setExpandedAccessoryIds] = useState<Set<string>>(new Set());
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);
  const [isRoteiroPrepared, setIsRoteiroPrepared] = useState(false);

  const selectedAccessories = useMemo(
    () => accessories.filter((a) => a.selected),
    [accessories]
  );

  const recommendation = useMemo<SellRecommendation | null>(() => {
    if (selectedAccessories.length === 0) return null;

    if (recoveryContext) {
      return generateRecoveryRecommendation(
        accessories,
        clientData,
        clientSource,
        recoveryContext
      );
    }
    return generatePrepareRecommendation(accessories, clientData, clientSource);
  }, [accessories, clientData, clientSource, recoveryContext, selectedAccessories.length]);

  if (!recommendation || selectedAccessories.length === 0) return null;

  const toggleAccessoryExpand = (id: string) => {
    setExpandedAccessoryIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handlePrepareRoteiro = () => {
    setIsRoteiroPrepared(true);
    setIsExpanded(true);

    // Registrar argumentação
    saveArgumentationLog({
      clientName: clientData.clientName || "Cliente",
      vehicleModel: clientData.vehicleModel,
      region: clientData.state?.replace(/\s*\(.*\)/, "") || "Brasil",
      accessoryIds: selectedAccessories.map((a) => a.id),
      accessoryNames: selectedAccessories.map((a) => a.name),
      mode: recommendation.mode,
      argumentSummary: recommendation.packageNarrative.headline,
      proposalValue: selectedAccessories.reduce(
        (sum, a) => sum + Math.round(a.price * (1 - a.discountPercent / 100)),
        0
      ),
      opportunityContext: recommendation.opportunityContext,
      seller: "Consultor Ativo",
      dealership: "Concessionária Jeep Campinas",
    });

    if (onArgumentGenerated) {
      onArgumentGenerated(recommendation);
    }

    toast.success(
      recommendation.mode === "recover"
        ? "Nova argumentação de recuperação gerada!"
        : "Roteiro de abordagem preparado pela IA!"
    );
  };

  const handleCopyWhatsApp = () => {
    navigator.clipboard.writeText(recommendation.whatsappMessage);
    setCopiedWhatsApp(true);
    toast.success("Mensagem argumentativa copiada!");
    setTimeout(() => setCopiedWhatsApp(false), 2500);
  };

  const handleSendWhatsApp = () => {
    const text = encodeURIComponent(recommendation.whatsappMessage);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handleRegenerate = () => {
    setIsRoteiroPrepared(false);
    setTimeout(() => {
      setIsRoteiroPrepared(true);
      toast.success("Nova abordagem gerada!");
    }, 300);
  };

  return (
    <section className="bg-white border border-blue-200/80 rounded-2xl shadow-sm overflow-hidden">
      {/* Header Colapsável */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-blue-50/30 transition-colors cursor-pointer group"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-4.5 h-4.5" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              COMO VENDER ESTA RECOMENDAÇÃO
              <span className="text-[10px] font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                IA Smart-Sell
              </span>
              {recommendation.mode === "recover" && (
                <span className="text-[10px] font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">
                  RECUPERAÇÃO
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Argumentação personalizada para {selectedAccessories.length} acessório{selectedAccessories.length > 1 ? "s" : ""} • Confiança IA: {recommendation.confidenceScore}%
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 hidden sm:inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Pronta para uso
          </span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
          )}
        </div>
      </button>

      {/* Conteúdo Expandido */}
      {isExpanded && (
        <div className="border-t border-blue-100 px-5 py-5 space-y-5">
          {/* Botão Preparar / Recuperar */}
          {!isRoteiroPrepared && (
            <div className="flex flex-col items-center gap-3 py-4">
              <button
                type="button"
                onClick={handlePrepareRoteiro}
                className="inline-flex items-center gap-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                <Target className="w-5 h-5 text-blue-200" />
                <span>
                  {recommendation.mode === "recover"
                    ? "Criar nova argumentação"
                    : "Preparar minha abordagem"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-xs text-slate-500 text-center max-w-md">
                {recommendation.mode === "recover"
                  ? "A IA vai gerar uma nova estratégia de argumentação considerando os motivos da recusa e alternativas disponíveis."
                  : "A IA vai preparar um roteiro rápido de negociação personalizado para o perfil do cliente e veículo."}
              </p>
            </div>
          )}

          {/* Conteúdo da Argumentação */}
          {isRoteiroPrepared && (
            <>
              {/* Toggle Individual / Pacote */}
              <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setViewMode("package")}
                  className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-md transition-all cursor-pointer ${
                    viewMode === "package"
                      ? "bg-white text-blue-700 shadow-sm border border-slate-200"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Package className="w-3.5 h-3.5" />
                  Argumento do Pacote
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("individual")}
                  className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-md transition-all cursor-pointer ${
                    viewMode === "individual"
                      ? "bg-white text-blue-700 shadow-sm border border-slate-200"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  Por Acessório ({recommendation.individualArguments.length})
                </button>
              </div>

              {/* Visão Pacote */}
              {viewMode === "package" && (
                <div className="space-y-4">
                  {/* Headline */}
                  <div className="bg-gradient-to-br from-[#0a1e3f] via-[#0a3277] to-slate-900 rounded-xl p-5 text-white relative overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-56 h-56 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
                    <div className="relative z-10 space-y-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-blue-300" />
                        <span className="text-[11px] font-semibold text-blue-300 uppercase tracking-wider">
                          Narrativa do Pacote Completo
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white leading-snug">
                        {recommendation.packageNarrative.headline}
                      </h4>
                      <p className="text-sm text-slate-200 leading-relaxed italic">
                        "{recommendation.packageNarrative.narrative}"
                      </p>
                    </div>
                  </div>

                  {/* Benefícios-chave */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
                    <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                      Benefícios-Chave do Pacote
                    </h5>
                    <ul className="space-y-1.5">
                      {recommendation.packageNarrative.keyBenefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Fechamento */}
                  <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                    <h5 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      Pergunta de Fechamento
                    </h5>
                    <p className="text-sm text-emerald-900 font-medium italic">
                      "{recommendation.packageNarrative.packageClosing}"
                    </p>
                  </div>
                </div>
              )}

              {/* Visão Individual */}
              {viewMode === "individual" && (
                <div className="space-y-3">
                  {recommendation.individualArguments.map((arg) => {
                    const isOpen = expandedAccessoryIds.has(arg.accessoryId);
                    return (
                      <div
                        key={arg.accessoryId}
                        className="border border-slate-200 rounded-xl overflow-hidden"
                      >
                        {/* Accessory Header */}
                        <button
                          type="button"
                          onClick={() => toggleAccessoryExpand(arg.accessoryId)}
                          className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-slate-50 transition cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-sm">
                              {selectedAccessories.find((a) => a.id === arg.accessoryId)?.icon || "📦"}
                            </div>
                            <span className="text-sm font-bold text-slate-800">{arg.accessoryName}</span>
                          </div>
                          {isOpen ? (
                            <ChevronUp className="w-4 h-4 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          )}
                        </button>

                        {/* Accessory Detail */}
                        {isOpen && (
                          <div className="border-t border-slate-100 px-4 py-4 bg-slate-50/50 space-y-4">
                            {/* Por que recomendar */}
                            <div>
                              <h6 className="text-[11px] font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1 mb-1.5">
                                <Target className="w-3 h-3" /> Por que recomendar
                              </h6>
                              <p className="text-xs text-slate-700 leading-relaxed">{arg.whyRecommend}</p>
                            </div>

                            {/* Como abordar */}
                            <div>
                              <h6 className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1 mb-1.5">
                                <MessageSquare className="w-3 h-3" /> Como abordar o cliente
                              </h6>
                              <p className="text-xs text-slate-700 leading-relaxed italic bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                                "{arg.approachPhrase}"
                              </p>
                            </div>

                            {/* Argumentos Principais */}
                            <div>
                              <h6 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1 mb-1.5">
                                <Zap className="w-3 h-3 text-amber-600" /> Argumentos principais
                              </h6>
                              <ul className="space-y-1.5">
                                {arg.mainArguments.map((a, i) => (
                                  <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                                    <span>{a}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Pergunta de Fechamento */}
                            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                              <h6 className="text-[11px] font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1 mb-1">
                                <MessageCircle className="w-3 h-3" /> Pergunta de fechamento
                              </h6>
                              <p className="text-xs text-blue-900 font-medium italic">
                                "{arg.closingQuestion}"
                              </p>
                            </div>

                            {/* Objeções e Respostas */}
                            {arg.objections.length > 0 && (
                              <div>
                                <h6 className="text-[11px] font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1 mb-2">
                                  <HelpCircle className="w-3 h-3" /> Possíveis objeções e como responder
                                </h6>
                                <div className="space-y-2">
                                  {arg.objections.map((obj, i) => (
                                    <div key={i} className="bg-white rounded-lg border border-slate-200 p-3 space-y-2">
                                      <div className="flex items-start gap-2">
                                        <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded shrink-0">
                                          OBJEÇÃO
                                        </span>
                                        <span className="text-xs text-slate-700 italic">"{obj.objection}"</span>
                                      </div>
                                      <div className="flex items-start gap-2 pl-2 border-l-2 border-blue-300 ml-1">
                                        <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded shrink-0">
                                          RESPOSTA
                                        </span>
                                        <span className="text-xs text-slate-700">{obj.response}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Ações: WhatsApp + Regenerar */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                  Gerar mensagem para o cliente
                </h5>
                <div className="bg-white rounded-lg border border-slate-200 p-3 max-h-36 overflow-y-auto">
                  <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed">
                    {recommendation.whatsappMessage}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleCopyWhatsApp}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white border border-slate-300 text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-50 transition active:scale-95 cursor-pointer"
                  >
                    {copiedWhatsApp ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedWhatsApp ? "Copiado!" : "Copiar mensagem"}
                  </button>
                  <button
                    type="button"
                    onClick={handleSendWhatsApp}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-lg shadow-sm transition active:scale-95 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    Enviar pelo WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={handleRegenerate}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold bg-slate-100 border border-slate-300 text-slate-600 px-3 py-2 rounded-lg hover:bg-slate-200 transition active:scale-95 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Gerar nova abordagem
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
};

export default SellArgumentBlock;
