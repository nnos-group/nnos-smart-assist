import { useState } from "react";
import { X, Flame, ShieldAlert, ArrowRight, Tag } from "lucide-react";
import { Accessory, ClientData } from "@/types/accessories";
import { RejectionReason, ReheatStrategy } from "@/types/leads";
import { saveReheatedLead } from "@/lib/leadsRepository";
import { toast } from "sonner";

interface ProposalRejectedModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientData: ClientData;
  selectedAccessories: Accessory[];
  totalProposalValue: number;
  cdcMonthlyEstimate: string;
  onSuccess?: () => void;
}

const REJECTION_REASONS: RejectionReason[] = [
  "Orçamento / Preço no Momento",
  "Consulta a Cônjuge / Sócio",
  "Decidir Próximo à Entrega / Revisão",
  "Prefere Apenas Uso Básico Urbano",
  "Aguardando Condição Especial / Bônus Montadora",
  "Outro",
];

const REHEAT_STRATEGIES: ReheatStrategy[] = [
  "Campanha Bônus Montadora",
  "Condição Especial CDC Taxa Zero",
  "Aviso de Giro de Estoque (Super Desconto)",
  "Check-in em 7 Dias",
  "Check-in em 15 Dias",
];

export const ProposalRejectedModal = ({
  isOpen,
  onClose,
  clientData,
  selectedAccessories,
  totalProposalValue,
  cdcMonthlyEstimate,
  onSuccess,
}: ProposalRejectedModalProps) => {
  const [reason, setReason] = useState<RejectionReason>("Orçamento / Preço no Momento");
  const [strategy, setStrategy] = useState<ReheatStrategy>("Campanha Bônus Montadora");
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const handleConfirmRejection = () => {
    saveReheatedLead({
      clientName: clientData.clientName || "Cliente Concessionária",
      clientPhone: "(11) 98888-7777",
      clientData,
      vehicleModel: clientData.vehicleModel,
      vehicleColor: clientData.vehicleColor,
      selectedAccessories,
      totalProposalValue,
      cdcMonthlyEstimate,
      rejectionReason: reason,
      rejectionNotes: notes.trim() || undefined,
      reheatStrategy: strategy,
    });

    toast.success("Lead salvo na Base de Reaquecimento com sucesso!");
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-900 to-slate-900 text-white p-5 flex items-center justify-between border-b border-rose-950">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-rose-400 shadow-inner">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Registrar Proposta Recusada
              </h3>
              <p className="text-xs text-rose-200 mt-0.5">
                Mover cliente para a base de reaquecimento inteligente
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

        {/* Content */}
        <div className="p-5 space-y-4 text-xs text-slate-700">
          {/* Client summary pill */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between items-center">
            <div>
              <span className="block font-bold text-slate-800 text-sm">{clientData.clientName || "Cliente"}</span>
              <span className="text-slate-500">{clientData.vehicleModel} • {selectedAccessories.length} acessórios</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Proposta</span>
              <span className="text-sm font-extrabold text-blue-600 font-mono">
                R$ {totalProposalValue.toLocaleString("pt-BR")}
              </span>
            </div>
          </div>

          {/* Reason Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Motivo Principal da Recusa:
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as RejectionReason)}
              className="w-full text-xs font-semibold p-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 cursor-pointer"
            >
              {REJECTION_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Strategy Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-blue-600" />
              Estratégia Recomendada para Reaquecer:
            </label>
            <select
              value={strategy}
              onChange={(e) => setStrategy(e.target.value as ReheatStrategy)}
              className="w-full text-xs font-semibold p-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
            >
              {REHEAT_STRATEGIES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Observações do Vendedor / Objeção Específica (Opcional):
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Achou o valor à vista elevado, mas aceitaria com bônus de R$ 500 ou parcelado no CDC..."
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end space-x-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirmRejection}
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md flex items-center space-x-1.5 transition cursor-pointer"
          >
            <Flame className="w-4 h-4 fill-white/20" />
            <span>Mover para Base de Reaquecimento</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
