import { CheckCircle, X, PartyPopper } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewSale: () => void;
}

const SuccessModal = ({ isOpen, onClose, onNewSale }: SuccessModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-charcoal/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-card rounded-2xl max-w-md w-full p-8 fade-in" style={{ boxShadow: "var(--shadow-lg)" }}>
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="relative inline-flex mb-6">
            <div className="w-20 h-20 rounded-2xl bg-emerald-50 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
            <div className="absolute -top-2 -right-2">
              <PartyPopper className="w-8 h-8 text-ram-red" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-2 font-display">Venda Registrada!</h2>
          <p className="text-muted-foreground mb-6 text-sm">
            O pacote foi adicionado ao pedido com sucesso.
          </p>

          <div className="space-y-3">
            <button onClick={onNewSale} className="btn-accent w-full py-3.5">
              Iniciar Nova Venda
            </button>
            <button onClick={onClose} className="w-full py-3 text-muted-foreground hover:text-foreground font-medium transition-colors text-sm">
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
