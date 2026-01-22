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
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-charcoal/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-card rounded-2xl shadow-2xl max-w-md w-full p-8 fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          {/* Success Icon */}
          <div className="relative inline-flex mb-6">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <div className="absolute -top-2 -right-2">
              <PartyPopper className="w-8 h-8 text-ram-red" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-2">
            Venda Registrada!
          </h2>
          <p className="text-muted-foreground mb-6">
            O pacote <strong className="text-stellantis-blue">Off-Road Pro</strong> foi 
            adicionado ao pedido de <strong>João Silva</strong>.
          </p>

          {/* Summary */}
          <div className="bg-secondary/50 rounded-xl p-4 mb-6 text-left">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Valor Total</span>
              <span className="text-xl font-bold text-ram-red">R$ 8.950</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Veículo</span>
              <span className="text-sm font-medium text-foreground">RAM RAMPAGE REBEL</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={onNewSale}
              className="btn-accent w-full"
            >
              Iniciar Nova Venda
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 text-muted-foreground hover:text-foreground font-medium transition-colors"
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
