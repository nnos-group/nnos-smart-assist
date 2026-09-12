import { CheckCircle, X } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewSale: () => void;
}

const SuccessModal = ({ isOpen, onClose, onNewSale }: SuccessModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative cockpit-panel rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 z-10">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer">
          <X className="w-4 h-4" />
        </button>

        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4 bg-emerald-50 border border-emerald-200">
            <CheckCircle className="w-7 h-7 text-emerald-600" />
          </div>

          <h2 className="text-lg font-bold text-slate-900 mb-1">Venda Registrada!</h2>
          <p className="text-xs text-slate-500 mb-5">
            O pacote foi adicionado ao pedido com sucesso.
          </p>

          <div className="space-y-2">
            <button
              onClick={onNewSale}
              className="w-full py-2.5 px-4 rounded-xl bg-[#0077E6] hover:bg-[#0066CC] text-white font-bold text-xs tracking-tight shadow-glow-blue transition-all cursor-pointer"
            >
              Iniciar Nova Venda
            </button>
            <button
              onClick={onClose}
              className="w-full py-2 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 font-semibold text-xs border border-slate-200 transition-all cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
