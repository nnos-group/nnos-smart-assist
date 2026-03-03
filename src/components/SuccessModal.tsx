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
      <div className="absolute inset-0 bg-foreground/40" onClick={onClose} />

      <div className="relative bg-card rounded border border-border max-w-sm w-full p-6 fade-in" style={{ boxShadow: "var(--shadow-lg)" }}>
        <button onClick={onClose} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-4 h-4" />
        </button>

        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4" style={{ background: "hsl(var(--emerald) / 0.1)" }}>
            <CheckCircle className="w-7 h-7" style={{ color: "hsl(var(--emerald))" }} />
          </div>

          <h2 className="text-lg font-bold text-foreground mb-1">Venda Registrada!</h2>
          <p className="text-sm text-muted-foreground mb-5">
            O pacote foi adicionado ao pedido com sucesso.
          </p>

          <div className="space-y-2">
            <button onClick={onNewSale} className="btn-primary w-full h-9 text-sm">
              Iniciar Nova Venda
            </button>
            <button onClick={onClose} className="w-full h-9 text-sm text-muted-foreground hover:text-foreground font-medium transition-colors">
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
