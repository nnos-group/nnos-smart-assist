import { Mic, MicOff, Loader2 } from "lucide-react";
import { useState, useCallback } from "react";
import { ClientData } from "@/types/accessories";
import { toast } from "sonner";

interface VoiceInputButtonProps {
  onDataExtracted: (data: Partial<ClientData>) => void;
}

// Simple NLP to extract data from speech
const extractDataFromSpeech = (transcript: string): Partial<ClientData> => {
  const data: Partial<ClientData> = {};
  const lowerText = transcript.toLowerCase();

  // Extract vehicle model
  const vehiclePatterns = [
    /ram\s*(rampage|1500|2500|3500|classic|rebel|laramie|limited|bighorn)/i,
    /fiat\s*(strada|toro|pulse|fastback|argo|cronos|mobi)/i,
    /jeep\s*(compass|renegade|commander|wrangler|gladiator)/i,
    /peugeot\s*(208|2008|3008|408|508|partner)/i,
    /citroën\s*(c3|c4|c5|aircross|berlingo)/i,
  ];

  for (const pattern of vehiclePatterns) {
    const match = transcript.match(pattern);
    if (match) {
      data.vehicleModel = match[0].toUpperCase();
      break;
    }
  }

  // Extract color
  const colorPatterns: Record<string, string> = {
    "vermelho": "Vermelho Volcano",
    "preto": "Preto Onyx",
    "branco": "Branco Polar",
    "prata": "Prata Billet",
    "cinza": "Cinza Granite",
    "azul": "Azul Hydro",
    "marrom": "Marrom Canyon",
    "laranja": "Laranja Omaha",
    "verde": "Verde Recon",
  };

  for (const [key, value] of Object.entries(colorPatterns)) {
    if (lowerText.includes(key)) {
      data.vehicleColor = value;
      break;
    }
  }

  // Extract year
  const yearMatch = transcript.match(/20(2[0-9])\/?(?:20)?(2[0-9])?/);
  if (yearMatch) {
    if (yearMatch[2]) {
      data.vehicleYear = `20${yearMatch[1]}/20${yearMatch[2]}`;
    } else {
      data.vehicleYear = `20${yearMatch[1]}`;
    }
  }

  // Extract client name
  const namePatterns = [
    /(?:cliente|nome|chamado?|chama)\s+(?:é\s+)?([A-Za-zÀ-ÿ]+(?:\s+[A-Za-zÀ-ÿ]+)?)/i,
    /(?:senhor|senhora|sr\.?|sra\.?)\s+([A-Za-zÀ-ÿ]+(?:\s+[A-Za-zÀ-ÿ]+)?)/i,
  ];

  for (const pattern of namePatterns) {
    const match = transcript.match(pattern);
    if (match && match[1]) {
      // Capitalize first letter of each word
      data.clientName = match[1]
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
      break;
    }
  }

  // Extract age
  const ageMatch = transcript.match(/(\d{1,2})\s*anos?/i);
  if (ageMatch) {
    data.clientAge = ageMatch[1];
  }

  // Extract gender
  if (lowerText.includes("masculino") || lowerText.includes("homem")) {
    data.clientGender = "Masculino";
  } else if (lowerText.includes("feminino") || lowerText.includes("mulher")) {
    data.clientGender = "Feminino";
  }

  // Extract state/region
  const states: Record<string, string> = {
    "mato grosso do sul": "Mato Grosso do Sul",
    "mato grosso": "Mato Grosso",
    "são paulo": "São Paulo",
    "rio de janeiro": "Rio de Janeiro",
    "minas gerais": "Minas Gerais",
    "rio grande do sul": "Rio Grande do Sul",
    "rio grande do norte": "Rio Grande do Norte",
    paraná: "Paraná",
    bahia: "Bahia",
    goiás: "Goiás",
    pernambuco: "Pernambuco",
    ceará: "Ceará",
    pará: "Pará",
    maranhão: "Maranhão",
    amazonas: "Amazonas",
    "santa catarina": "Santa Catarina",
    paraíba: "Paraíba",
    "espírito santo": "Espírito Santo",
    piauí: "Piauí",
    alagoas: "Alagoas",
    sergipe: "Sergipe",
    rondônia: "Rondônia",
    tocantins: "Tocantins",
    acre: "Acre",
    amapá: "Amapá",
    roraima: "Roraima",
    "distrito federal": "Distrito Federal",
  };

  for (const [key, value] of Object.entries(states)) {
    if (lowerText.includes(key)) {
      data.state = value;
      break;
    }
  }

  // Extract terrain type
  const terrainPatterns: Record<string, string> = {
    "estrada de terra": "Estradas de Terra",
    "terra batida": "Estradas de Terra",
    asfalto: "Asfalto",
    "off-road": "Off-Road",
    offroad: "Off-Road",
    rural: "Estradas Rurais",
    urbano: "Urbano",
    cidade: "Urbano",
  };

  for (const [key, value] of Object.entries(terrainPatterns)) {
    if (lowerText.includes(key)) {
      data.terrainType = value;
      break;
    }
  }

  // Extract climate
  const climatePatterns: Record<string, string> = {
    chuva: "Alta Incidência de Chuvas",
    chuvoso: "Alta Incidência de Chuvas",
    seco: "Clima Seco",
    quente: "Clima Quente",
    frio: "Clima Frio",
    tropical: "Clima Tropical",
    úmido: "Alta Umidade",
  };

  for (const [key, value] of Object.entries(climatePatterns)) {
    if (lowerText.includes(key)) {
      data.climateCondition = value;
      break;
    }
  }

  return data;
};

const VoiceInputButton = ({ onDataExtracted }: VoiceInputButtonProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const startListening = useCallback(() => {
    // Check browser support
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("Seu navegador não suporta reconhecimento de voz");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "pt-BR";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      toast.info("🎤 Ouvindo... Fale o veículo, cliente e região", {
        duration: 5000,
      });
    };

    recognition.onresult = (event: any) => {
      setIsProcessing(true);
      const transcript = event.results[0][0].transcript;
      console.log("Transcript:", transcript);

      const extractedData = extractDataFromSpeech(transcript);
      const fieldsFound = Object.keys(extractedData).length;

      if (fieldsFound > 0) {
        onDataExtracted(extractedData);
        toast.success(`✅ ${fieldsFound} campo(s) preenchido(s) automaticamente!`);
      } else {
        toast.warning("Não foi possível identificar os dados. Tente novamente.");
      }

      setIsProcessing(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      setIsProcessing(false);

      if (event.error === "not-allowed") {
        toast.error("Permissão de microfone negada. Habilite nas configurações do navegador.");
      } else if (event.error === "no-speech") {
        toast.warning("Nenhuma fala detectada. Tente novamente.");
      } else {
        toast.error("Erro no reconhecimento de voz");
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }, [onDataExtracted]);

  return (
    <div className="relative">
      <button
        onClick={startListening}
        disabled={isListening || isProcessing}
        className={`
          w-14 h-14 rounded-full flex items-center justify-center
          transition-all duration-300 shadow-lg
          ${
            isListening
              ? "bg-ram-red animate-pulse scale-110"
              : isProcessing
              ? "bg-stellantis-blue"
              : "bg-gradient-to-br from-stellantis-blue to-ram-red hover:scale-105 hover:shadow-xl"
          }
        `}
        title="Clique para falar"
      >
        {isProcessing ? (
          <Loader2 className="w-6 h-6 text-white animate-spin" />
        ) : isListening ? (
          <MicOff className="w-6 h-6 text-white" />
        ) : (
          <Mic className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Ripple effect when listening */}
      {isListening && (
        <>
          <span className="absolute inset-0 rounded-full bg-ram-red/40 animate-ping" />
          <span
            className="absolute inset-0 rounded-full bg-ram-red/20 animate-ping"
            style={{ animationDelay: "0.2s" }}
          />
        </>
      )}

      {/* Label */}
      <p className="text-xs text-center mt-2 text-muted-foreground font-medium">
        {isListening ? "Ouvindo..." : isProcessing ? "Processando..." : "Falar dados"}
      </p>
    </div>
  );
};

export default VoiceInputButton;
