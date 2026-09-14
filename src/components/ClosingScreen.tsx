import React, { useState } from "react";
import {
  CheckCircle2, ShoppingCart, MessageCircle, ArrowLeft,
  Calendar, Award, Clock, DollarSign, XCircle, Share2,
  FileText, Check, AlertTriangle, Sparkles, Send, Trash2
} from "lucide-react";
import { useSalesJourney } from "@/context/SalesJourneyContext";
import { ClosingStatus, LostSaleDetails, ObjectionCategory } from "@/types/salesJourney";
import { toast } from "sonner";
import { logLostSale } from "@/lib/argumentationRepository";

interface ClosingScreenProps {
  onSaleWon: () => void;
  onOpenReheatedLeads?: () => void;
}

export const ClosingScreen: React.FC<ClosingScreenProps> = ({ onSaleWon }) => {
  const {
    state,
    availableAccessories,
    toggleAccessory,
    finalizeSale,
    prevStep,
  } = useSalesJourney();

  const { clientData, selectedAccessoryIds, quote, selectedCampaign, closingStatus } = state;
  const selectedAccessories = availableAccessories.filter((a) => selectedAccessoryIds.includes(a.id));

  // Modal de Venda Perdida
  const [lostModalOpen, setLostModalOpen] = useState(false);
  const [lostReason, setLostReason] = useState("Orçamento / Preço no Momento");
  const [lostObjection, setLostObjection] = useState<ObjectionCategory>("preco");
  const [suggestedContactDate, setSuggestedContactDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 15);
    return d.toISOString().split("T")[0];
  });
  const [lostNotes, setLostNotes] = useState("");

  // Técnicas de fechamento
  const closingTechniques = [
    {
      title: "Fechamento por Resumo",
      phrase: `“Seu ${clientData.vehicleModel} já sai com ${selectedAccessories.length} acessórios originais instalados e garantia total por R$ ${quote.finalTotal.toLocaleString("pt-BR")}. Vamos confirmar a ordem de serviço para a entrega?”`,
    },
    {
      title: "Fechamento por Alternativa",
      phrase: `“O senhor prefere parcelar em 12 vezes de R$ ${quote.monthlyInstallment.toLocaleString("pt-BR")} sem juros ou prefere a diluição de R$ ${quote.monthlyCdc.toLocaleString("pt-BR")}/mês no financiamento do carro?”`,
    },
    {
      title: "Fechamento por Preservação",
      phrase: `“Mantemos toda a proteção essencial de cárter e carroceria sem impactar o prazo de entrega. Podemos emitir o termo de instalação?”`,
    },
  ];

  // Compartilhamento público no WhatsApp sem expor dados internos
  const handleShareWhatsApp = () => {
    const accList = selectedAccessories.map((a) => `• ${a.name}`).join("\n");
    const basePath = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
    const accIds = selectedAccessories.map((a) => a.id).join(",");
    const interactive3dUrl = `${window.location.origin}${basePath}/visualizacao?client=${encodeURIComponent(clientData.clientName || "Cliente")}&model=${encodeURIComponent(clientData.vehicleModel)}&color=${encodeURIComponent(clientData.vehicleColor)}&acc=${encodeURIComponent(accIds)}&total=${quote.finalTotal}&cdc=${encodeURIComponent(quote.monthlyCdc.toFixed(2))}`;

    const text =
      `Olá ${clientData.clientName || "Cliente"}!\n\n` +
      `Aqui está o resumo da sua proposta oficial Mopar para o seu *${clientData.vehicleModel}* (${clientData.vehicleColor}):\n\n` +
      `*Acessórios Homologados Selecionados:*\n${accList}\n\n` +
      `*Condições Especiais:*\n` +
      `• Total à Vista: R$ ${quote.finalTotal.toLocaleString("pt-BR")}\n` +
      `• Em até 12x s/ juros de R$ ${quote.monthlyInstallment.toLocaleString("pt-BR")}\n` +
      `• Diluição no CDC: apenas + R$ ${quote.monthlyCdc.toFixed(2)}/mês\n` +
      `• Instalação técnica em: ${quote.installationDeadlineDays} dia útil\n\n` +
      `🔗 *Acesse a Visualização 3D do seu veículo montado:* \n${interactive3dUrl}\n\n` +
      `Qualquer dúvida, estou à disposição!`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(interactive3dUrl).catch(() => {});
    }

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
    toast.success("Proposta e link 3D preparados para o WhatsApp!");
  };

  const handleConfirmWon = () => {
    finalizeSale("won");
    toast.success("Venda confirmada com sucesso! Proposta registrada.");
    onSaleWon();
  };

  const handleConfirmLost = () => {
    const details: LostSaleDetails = {
      primaryReason: lostReason,
      mainObjection: lostObjection,
      presentedTotal: quote.finalTotal,
      presentedCondition: `${quote.installmentsCount}x sem juros`,
      refusedAccessoryIds: selectedAccessoryIds,
      canBeReheated: true,
      suggestedContactDate,
      lostNotes,
    };

    finalizeSale("lost", details);

    // Registra no Pareto de vendas perdidas existente
    try {
      logLostSale({
        id: `lost-${Date.now()}`,
        clientName: clientData.clientName || "Cliente",
        vehicleModel: clientData.vehicleModel,
        region: clientData.state,
        dealership: "Concessionária Jeep Campinas",
        seller: "Ricardo Mendes",
        primaryReason: lostReason,
        objection: lostObjection,
        totalValue: quote.finalTotal,
        selectedAccessories: selectedAccessories.map((a) => a.name),
        timestamp: new Date().toISOString(),
        channel: "showroom",
        canReheat: true,
        reheatDate: suggestedContactDate,
        notes: lostNotes,
      });
    } catch {
      // ignore
    }

    setLostModalOpen(false);
    toast.error("Oportunidade perdida registrada. Lead direcionado para a base de reaquecimento.");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* HEADER DE ETAPA */}
      <div className="cockpit-panel rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-2 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Etapa 7 de 7 · Fechamento &amp; Conclusão da Oportunidade</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Fechamento
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Confirme a decisão e registre a conclusão da oportunidade.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Enviar Proposta no WhatsApp</span>
          </button>
        </div>
      </div>

      {/* QUADRO DE CONFIRMAÇÃO INTEGRAL DA PROPOSTA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* RESUMO DOS DADOS CONFIRMADOS */}
        <div className="lg:col-span-8 cockpit-panel rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Conferência dos Termos da Venda
            </h2>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 self-start sm:self-auto whitespace-nowrap">
              Pronto para Faturamento
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-slate-400 font-bold block text-[10px] uppercase">Veículo</span>
              <strong className="text-slate-900 block mt-0.5">{clientData.vehicleModel}</strong>
              <span className="text-slate-600 text-[11px]">{clientData.vehicleColor} · {clientData.vehicleYear}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-slate-400 font-bold block text-[10px] uppercase">Cliente</span>
              <strong className="text-slate-900 block mt-0.5">{clientData.clientName || "Cliente"}</strong>
              <span className="text-slate-600 text-[11px]">{clientData.state} · {clientData.clientGender}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-slate-400 font-bold block text-[10px] uppercase">Oficina &amp; Instalação</span>
              <strong className="text-slate-900 block mt-0.5">{quote.installationDeadlineDays} dia(s) útil</strong>
              <span className="text-slate-600 text-[11px]">{quote.estimatedInstallationHours} horas em box expresso</span>
            </div>
          </div>

          {/* LISTA DE ITENS CONFIRMADOS */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 block">
                Itens confirmados para instalação ({selectedAccessories.length}):
              </span>
              {selectedAccessories.length > 0 && (
                <span className="text-[11px] text-slate-500">Clique na lixeira para retirar</span>
              )}
            </div>

            {selectedAccessories.length === 0 ? (
              <div className="p-4 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500">
                Nenhum item selecionado para faturamento.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedAccessories.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span>{item.icon}</span>
                      <span className="font-semibold text-slate-800 truncate">{item.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <button
                        type="button"
                        onClick={() => {
                          toggleAccessory(item.id);
                          toast.info(`"${item.name}" retirado da proposta.`);
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                        title={`Retirar ${item.name} da proposta`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SUGESTÕES DE TÉCNICAS DE FECHAMENTO */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <span className="text-xs font-bold text-slate-800 block">Técnicas de Fechamento Recomendadas:</span>
            <div className="space-y-2">
              {closingTechniques.map((tech) => (
                <div key={tech.title} className="p-3 rounded-xl bg-sky-50/60 border border-sky-200 text-xs text-slate-800 space-y-0.5">
                  <span className="font-bold block text-[11px] text-sky-700 uppercase tracking-wider">{tech.title}</span>
                  <p className="italic text-slate-600">{tech.phrase}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: VALORES FINAIS & BOTÕES DE DESFECHO */}
        <div className="lg:col-span-4 cockpit-panel rounded-2xl p-6 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Valores Finais</span>
              <div className="text-3xl font-extrabold text-emerald-600 tracking-tight mt-1">
                R$ {quote.finalTotal.toLocaleString("pt-BR")}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                ou <strong className="text-slate-800">{quote.installmentsCount}x de R$ {quote.monthlyInstallment.toLocaleString("pt-BR")}</strong> s/ juros
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1 text-slate-700">
              <div className="flex justify-between">
                <span>Subtotal Tabela:</span>
                <span className="font-semibold text-slate-800">R$ {quote.originalSubtotal.toLocaleString("pt-BR")}</span>
              </div>
              {quote.campaignDiscount > 0 && (
                <div className="flex justify-between text-purple-700 font-bold">
                  <span>Campanha Comercial{selectedCampaign ? ` (${selectedCampaign.title})` : ""}:</span>
                  <span>- R$ {quote.campaignDiscount.toLocaleString("pt-BR")}</span>
                </div>
              )}
              {quote.stockDiscountAmount + quote.sellerDiscount + quote.campaignDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Economia Total:</span>
                  <span>- R$ {(quote.stockDiscountAmount + quote.sellerDiscount + quote.campaignDiscount).toLocaleString("pt-BR")}</span>
                </div>
              )}
            </div>
          </div>

          {/* BOTÕES DE RESULTADO FINAL */}
          <div className="space-y-2.5">
            {/* 1. Concluir Venda (Won) */}
            <button
              type="button"
              onClick={handleConfirmWon}
              className="w-full py-3 px-4 rounded-xl bg-[#0077E6] hover:bg-[#0066CC] text-white font-bold text-xs tracking-tight shadow-glow-blue flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Concluir Venda &amp; Faturar</span>
            </button>

            {/* 2. Proposta Enviada / Analisando */}
            <button
              type="button"
              onClick={() => {
                finalizeSale("proposal-sent");
                toast.info("Proposta registrada como enviada ao cliente.");
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Send className="w-3.5 h-3.5 text-slate-500" />
              <span>Registrar: Proposta Enviada (Aguardando)</span>
            </button>

            {/* 3. Venda Perdida (Lost) */}
            <button
              type="button"
              onClick={() => setLostModalOpen(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs border border-rose-200 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <XCircle className="w-3.5 h-3.5 text-rose-600" />
              <span>Registrar Venda Perdida</span>
            </button>
          </div>
        </div>
      </div>

      {/* BOTÃO VOLTAR */}
      <div className="flex items-center justify-start pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={prevStep}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold cursor-pointer shadow-subtle transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Negociação</span>
        </button>
      </div>

      {/* MODAL DE REGISTRO DE VENDA PERDIDA (PARETO + REAQUECIMENTO) */}
      {lostModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-rose-200">
            <div className="flex items-center justify-between pb-3 border-b border-rose-100">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                <XCircle className="w-5 h-5 text-rose-600" />
                <span>Registro de Oportunidade Perdida &amp; Reaquecimento</span>
              </div>
              <button
                type="button"
                onClick={() => setLostModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1" htmlFor="select-lost-reason">
                  Motivo Principal da Não Compra (Análise de Pareto):
                </label>
                <select
                  id="select-lost-reason"
                  value={lostReason}
                  onChange={(e) => setLostReason(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 bg-slate-50 focus:ring-2 focus:ring-rose-500/20"
                >
                  <option value="Orçamento / Preço no Momento">Orçamento / Preço no Momento</option>
                  <option value="Consulta a Cônjuge / Sócio">Consulta a Cônjuge / Sócio</option>
                  <option value="Decidir Próximo à Entrega / Revisão">Decidir Próximo à Entrega / Revisão</option>
                  <option value="Comprou / Vai Comprar Paralelo Fora">Comprou / Vai Comprar Paralelo Fora</option>
                  <option value="Prazo de Instalação">Prazo de Instalação</option>
                  <option value="Item Indisponível no Momento">Item Indisponível no Momento</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1" htmlFor="input-suggested-contact-date">
                  Data Sugerida para Reaquecimento do Lead:
                </label>
                <input
                  id="input-suggested-contact-date"
                  type="date"
                  value={suggestedContactDate}
                  onChange={(e) => setSuggestedContactDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 bg-slate-50"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1" htmlFor="textarea-lost-notes">
                  Observações e Objeções Registradas:
                </label>
                <textarea
                  id="textarea-lost-notes"
                  rows={3}
                  value={lostNotes}
                  onChange={(e) => setLostNotes(e.target.value)}
                  placeholder="Descreva detalhes para a abordagem futura..."
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setLostModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmLost}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Salvar Perda &amp; Agendar Reaquecimento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
