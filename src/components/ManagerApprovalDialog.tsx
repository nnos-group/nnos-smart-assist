import React, { useState } from "react";
import { ShieldCheck, Lock, AlertCircle, Check } from "lucide-react";

interface ManagerApprovalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: (managerName: string) => void;
  requestedDiscountPercent: number;
  requestedDiscountValue: number;
}

export const ManagerApprovalDialog: React.FC<ManagerApprovalDialogProps> = ({
  isOpen,
  onClose,
  onApprove,
  requestedDiscountPercent,
  requestedDiscountValue,
}) => {
  const [managerCode, setManagerCode] = useState("");
  const [managerName, setManagerName] = useState("Eduardo Ramos (Gerente Geral)");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!managerCode.trim()) {
      setError("Insira a matrícula ou código do gerente para liberar a alçada.");
      return;
    }
    setError("");
    onApprove(managerName);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-sky-800 font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-sky-600" />
            <span>Autorização de Alçada Gerencial</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 text-xs font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 space-y-1 text-xs text-amber-900">
          <div className="font-bold flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>Desconto solicitado acima de 5% (Alçada de Consultor)</span>
          </div>
          <p>
            Desconto solicitado: <strong>{requestedDiscountPercent}%</strong> (R$ {requestedDiscountValue.toLocaleString("pt-BR")}).
          </p>
          <p className="text-[11px] text-amber-700">
            Requer autenticação do Gerente de Vendas ou Diretor Comercial.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="input-manager-select">
              Gerente Responsável
            </label>
            <select
              id="input-manager-select"
              value={managerName}
              onChange={(e) => setManagerName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 bg-slate-50 focus:ring-2 focus:ring-sky-500/20"
            >
              <option value="Eduardo Ramos (Gerente Geral)">Eduardo Ramos (Gerente Geral)</option>
              <option value="Mariana Castro (Gerente de Novos Jeep/RAM)">Mariana Castro (Gerente de Novos Jeep/RAM)</option>
              <option value="Diretoria Comercial Matriz">Diretoria Comercial Matriz</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="input-manager-code">
              Matrícula / Código de Liberação
            </label>
            <input
              id="input-manager-code"
              type="password"
              value={managerCode}
              onChange={(e) => setManagerCode(e.target.value)}
              placeholder="Digite o código gerencial..."
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-sky-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="input-approval-notes">
              Observação da Aprovação (Opcional)
            </label>
            <input
              id="input-approval-notes"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Fechamento de venda de veículo 0km à vista..."
              className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-800"
            />
          </div>

          {error && <p className="text-xs text-rose-600 font-semibold">{error}</p>}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              Aprovar Alçada
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
