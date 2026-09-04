import { useState, useEffect } from "react";
import { 
  X, Flame, MessageCircle, RotateCcw, Trash2, Search, 
  Calendar, Car, Tag, Clock, CheckCircle, RefreshCw, AlertCircle
} from "lucide-react";
import { ReheatedLead } from "@/types/leads";
import { 
  getReheatedLeads, deleteReheatedLead, 
  updateReheatedLeadStatus, resetModelLeads 
} from "@/lib/leadsRepository";
import { toast } from "sonner";

interface ReheatedLeadsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResumeLead: (lead: ReheatedLead) => void;
}

export const ReheatedLeadsModal = ({
  isOpen,
  onClose,
  onResumeLead,
}: ReheatedLeadsModalProps) => {
  const [leads, setLeads] = useState<ReheatedLead[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const loadLeads = () => {
    setLeads(getReheatedLeads());
  };

  useEffect(() => {
    if (isOpen) {
      loadLeads();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleUpdate = () => loadLeads();
    window.addEventListener("smart_sell_leads_updated", handleUpdate);
    return () => window.removeEventListener("smart_sell_leads_updated", handleUpdate);
  }, []);

  if (!isOpen) return null;

  const filteredLeads = leads.filter((lead) => {
    const matchSearch =
      lead.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.rejectionReason.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedFilter === "all") return matchSearch;
    if (selectedFilter === "pending") return matchSearch && lead.status === "pending_reheat";
    if (selectedFilter === "contacted") return matchSearch && lead.status === "contacted";
    return matchSearch;
  });

  const handleWhatsAppReheat = (lead: ReheatedLead) => {
    const firstName = lead.clientName.split(" ")[0];
    const accessoriesNames = lead.selectedAccessories.map((a) => a.name).join(", ");
    
    // Link interativo exclusivo para o cliente visualizar o veículo montado sem necessidade de acesso ao sistema
    const accIds = lead.selectedAccessories.map((a) => a.id).join(",");
    const basePath = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
    const interactive3dUrl = `${window.location.origin}${basePath}/visualizacao?client=${encodeURIComponent(lead.clientName)}&model=${encodeURIComponent(lead.vehicleModel)}&color=${encodeURIComponent(lead.vehicleColor)}&acc=${encodeURIComponent(accIds)}&total=${lead.totalProposalValue}&cdc=${encodeURIComponent(lead.cdcMonthlyEstimate)}`;
    
    let specialHook = "Temos uma condição exclusiva autorizada para esta semana.";
    if (lead.reheatStrategy.includes("Bônus")) {
      specialHook = "Conseguimos liberar um bônus da montadora Stellantis que reduz significativamente o valor dos acessórios.";
    } else if (lead.reheatStrategy.includes("CDC") || lead.reheatStrategy.includes("Taxa")) {
      specialHook = "Conseguimos incluir o pacote no CDC Jeep com taxa diferenciada, diluindo em parcelas muito acessíveis.";
    } else if (lead.reheatStrategy.includes("Giro")) {
      specialHook = "Um dos itens do seu interesse entrou em liquidação de estoque de fábrica com super desconto.";
    }

    const message = 
      `Olá ${firstName}! Tudo bem? Aqui é da Concessionária.\n\n` +
      `Estou retomando nosso contato sobre o seu *${lead.vehicleModel}* e o pacote de acessórios Mopar que você gostou (${accessoriesNames}).\n\n` +
      `${specialHook}\n\n` +
      `Total: R$ ${lead.totalProposalValue.toLocaleString("pt-BR")} (ou a partir de +R$ ${lead.cdcMonthlyEstimate}/mês no CDC).\n\n` +
      `🔗 *Acesse aqui a Visualização 3D Interativa do seu veículo com os acessórios:*\n${interactive3dUrl}\n\n` +
      `Podemos conversar sobre essa oportunidade?`;

    const encoded = encodeURIComponent(message);
    const cleanPhone = lead.clientPhone.replace(/\D/g, "");
    const whatsappUrl = cleanPhone.length >= 10
      ? `https://api.whatsapp.com/send?phone=55${cleanPhone}&text=${encoded}`
      : `https://api.whatsapp.com/send?text=${encoded}`;

    window.open(whatsappUrl, "_blank");
    updateReheatedLeadStatus(lead.id, "contacted");
    toast.success(`Mensagem de reaquecimento gerada para ${firstName}!`);
  };

  const handleDelete = (id: string, name: string) => {
    deleteReheatedLead(id);
    toast.info(`Lead de ${name} removido da base.`);
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
    } catch {
      return "Recente";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-[#001E36] text-white p-5 flex items-center justify-between border-b border-sky-950">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-400/30 flex items-center justify-center text-orange-400 shadow-inner">
              <Flame className="w-5 h-5 text-orange-400 fill-orange-400/20" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Base de Leads para Reaquecimento (CRM Retargeting)
                </h3>
                <span className="text-[11px] font-bold bg-orange-500 text-white px-2 py-0.5 rounded-full">
                  {leads.length} leads
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Clientes que recusaram a proposta inicial e possuem alto potencial de conversão com bônus ou nova abordagem
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={resetModelLeads}
              title="Restaurar leads modelo de exemplo"
              className="text-xs text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 transition flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Restaurar Exemplos</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer"
              aria-label="Fechar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por cliente, veículo ou motivo..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-xs"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setSelectedFilter("all")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                selectedFilter === "all"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              Todos ({leads.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter("pending")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                selectedFilter === "pending"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              A Reaquecer
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter("contacted")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                selectedFilter === "contacted"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              Contatados
            </button>
          </div>
        </div>

        {/* Leads Cards List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-100/70">
          {filteredLeads.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300 p-8">
              <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">Nenhum lead encontrado</p>
              <p className="text-xs text-slate-500 mt-1">
                Ao clicar em "Proposta Recusada" em uma negociação, o cliente será listado aqui para retargeting.
              </p>
            </div>
          ) : (
            filteredLeads.map((lead) => (
              <div
                key={lead.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-2.5 flex-wrap">
                    <span className="font-extrabold text-sm text-slate-900">{lead.clientName}</span>
                    <span className="text-xs text-slate-500 font-mono">({lead.clientPhone})</span>
                    <span className="text-xs text-slate-300">•</span>
                    <span className="inline-flex items-center text-xs font-semibold text-slate-700 gap-1">
                      <Car className="w-3.5 h-3.5 text-blue-600" />
                      {lead.vehicleModel} ({lead.vehicleColor})
                    </span>
                    {lead.status === "contacted" ? (
                      <span className="inline-flex items-center text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Reaquecimento Iniciado
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                        <Flame className="w-3 h-3 mr-1 text-orange-500" />
                        Aguardando Reaquecimento
                      </span>
                    )}
                  </div>

                  {/* Accessories breakdown & refusal reason */}
                  <div className="text-xs text-slate-600 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="flex items-center gap-1 text-rose-700 font-medium bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                      <strong>Motivo:</strong> {lead.rejectionReason}
                    </span>
                    <span className="flex items-center gap-1 text-blue-700 font-medium bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      <Tag className="w-3 h-3 text-blue-500" />
                      <strong>Estratégia:</strong> {lead.reheatStrategy}
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <Calendar className="w-3 h-3" />
                      Recusado em {formatDate(lead.rejectedAt)}
                    </span>
                  </div>

                  {lead.rejectionNotes && (
                    <p className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded border border-slate-100">
                      "{lead.rejectionNotes}"
                    </p>
                  )}

                  <div className="text-xs text-slate-700 flex items-center gap-2">
                    <span className="font-semibold text-slate-500">Pacote ({lead.selectedAccessories.length} itens):</span>
                    <span className="truncate max-w-md text-slate-600">
                      {lead.selectedAccessories.map((a) => a.name).join(", ")}
                    </span>
                  </div>
                </div>

                {/* Proposal Value & Action Buttons */}
                <div className="flex md:flex-col items-end justify-between md:justify-center gap-3 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Proposta Total</span>
                    <span className="text-base font-extrabold text-blue-600 font-mono">
                      R$ {lead.totalProposalValue.toLocaleString("pt-BR")}
                    </span>
                    <span className="block text-[10px] text-emerald-700 font-medium">
                      CDC: +R$ {lead.cdcMonthlyEstimate}/mês
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Botão Reaquecer via WhatsApp */}
                    <button
                      type="button"
                      onClick={() => handleWhatsAppReheat(lead)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5 transition cursor-pointer"
                      title="Enviar roteiro de reaquecimento com link 3D no WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Reaquecer</span>
                    </button>

                    {/* Botão Retomar Proposta */}
                    <button
                      type="button"
                      onClick={() => {
                        onResumeLead(lead);
                        onClose();
                        toast.success(`Proposta de ${lead.clientName} carregada no sistema!`);
                      }}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition cursor-pointer"
                      title="Carregar este cliente e proposta no sistema"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Retomar</span>
                    </button>

                    {/* Botão Excluir */}
                    <button
                      type="button"
                      onClick={() => handleDelete(lead.id, lead.clientName)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                      title="Remover lead da base"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1 text-slate-500">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            Taxa média de conversão em reaquecimento com bônus de montadora: <strong>32.4%</strong>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
