import { CommercialArgument, ObjectionCategory, SalesJourneyState } from "@/types/salesJourney";

export const APPROVED_COMMERCIAL_ARGUMENTS: CommercialArgument[] = [
  {
    id: "arg-preco-geral",
    objection: "preco",
    objectionLabel: "Achei o pacote / valor elevado",
    appropriateStep: "negotiation",
    mainArgument:
      "Os itens foram selecionados estrategicamente considerando a sua utilização em estradas de terra e transporte frequente. Além do conforto e estética, eles preservam o veículo 0km desde o primeiro dia de uso, evitando desvalorização severa e avarias caras.",
    alternativeArgument:
      "Quando diluído no financiamento ou parcelado no cartão da concessionária em até 12x sem juros, o impacto diário é inferior a um cafezinho e você já sai da concessionária com garantia total Mopar de até 3 anos.",
    deepeningQuestion:
      "O valor total à vista ou o impacto na parcela mensal é o ponto mais sensível para o senhor neste momento?",
    closingProposal:
      "Podemos manter os itens essenciais com a condição exclusiva deste mês e parcelar a diferença em 12 vezes sem juros?",
    authorizedCondition: "Parcelamento estendido em 12x sem juros ou desconto de até 5% com autorização do consultor",
    maxAuthorizedDiscountPercent: 5,
    approvedVersion: "v2.4-2026",
    approvedAt: "2026-01-15",
    dealershipGroup: "Grupo Concessionária Stellantis",
    brand: "Mopar",
    active: true,
  },
  {
    id: "arg-nao-preciso",
    objection: "nao_preciso",
    objectionLabel: "Não vejo necessidade imediata desses acessórios",
    appropriateStep: "negotiation",
    mainArgument:
      "Entendo perfeitamente. Por isso mesmo nós não oferecemos pacotes genéricos: cada um desses itens foi mapeado para a sua rotina real, como o embarque das crianças e a proteção da caçamba contra as ferramentas.",
    alternativeArgument:
      "Muitos clientes que optam por sair sem os acessórios acabam tendo pequenas avarias na lataria ou desconforto de embarque na primeira semana e retornam pagando mão de obra separada e perdendo tempo de oficina.",
    deepeningQuestion:
      "Desses itens apresentados, qual deles o senhor considera que tem menor impacto na sua rotina imediata?",
    closingProposal:
      "Se retirarmos apenas o item complementar e garantirmos a proteção essencial com instalação imediata antes da entrega do carro?",
    authorizedCondition: "Retirada de item complementar preservando bônus no pacote essencial",
    maxAuthorizedDiscountPercent: 5,
    approvedVersion: "v2.4-2026",
    approvedAt: "2026-01-15",
    dealershipGroup: "Grupo Concessionária Stellantis",
    brand: "Mopar",
    active: true,
  },
  {
    id: "arg-instalar-depois",
    objection: "vou_instalar_depois",
    objectionLabel: "Vou deixar para instalar depois / em outra revisão",
    appropriateStep: "negotiation",
    mainArgument:
      "Instalar agora garante que o seu veículo já saia faturado e entregue pronto da concessionária, com o custo de mão de obra absorvido no pacote e sem necessidade de agendar uma parada técnica do carro depois.",
    alternativeArgument:
      "Após o faturamento, as tabelas de peças sofrem reajustes periódicos e os benefícios de bônus da montadora ou diluição no CDC do veículo não podem mais ser incorporados.",
    deepeningQuestion:
      "O que o senhor gostaria de avaliar antes de realizarmos a instalação agora na preparação de entrega?",
    closingProposal:
      "Podemos deixar o agendamento da instalação confirmado para o processo de entrega técnica com o valor congelado de hoje?",
    authorizedCondition: "Reserva de peças no estoque com garantia de preço de tabela faturada",
    maxAuthorizedDiscountPercent: 5,
    approvedVersion: "v2.4-2026",
    approvedAt: "2026-01-15",
    dealershipGroup: "Grupo Concessionária Stellantis",
    brand: "Mopar",
    active: true,
  },
  {
    id: "arg-comprar-fora",
    objection: "vou_comprar_fora",
    objectionLabel: "Encontrei mais barato no mercado paralelo / internet",
    appropriateStep: "negotiation",
    mainArgument:
      "Acessórios paralelos não possuem os testes de colisão (crash-test) e integridade eletrônica homologados pela engenharia Stellantis. Na concessionária, o acessório é 100% Mopar e mantém a garantia de fábrica do veículo intacta.",
    alternativeArgument:
      "Itens elétricos ou de tração instalados fora da rede podem causar curto-circuito na rede CAN-bus ou danos estruturais que invalidam a garantia geral de 3 anos do seu veículo.",
    deepeningQuestion:
      "O senhor sabia que peças paralelas podem comprometer a garantia de fábrica dos sistemas eletrônicos e de suspensão?",
    closingProposal:
      "Para garantir a sua tranquilidade e a garantia total do carro, consigo equiparar a mão de obra especializada da nossa oficina.",
    authorizedCondition: "Mão de obra com cortesia técnica homologada Mopar",
    maxAuthorizedDiscountPercent: 8,
    approvedVersion: "v2.4-2026",
    approvedAt: "2026-01-15",
    dealershipGroup: "Grupo Concessionária Stellantis",
    brand: "Mopar",
    active: true,
  },
  {
    id: "arg-outra-pessoa",
    objection: "preciso_falar_outra_pessoa",
    objectionLabel: "Preciso falar com meu cônjuge / sócio / sócia",
    appropriateStep: "negotiation",
    mainArgument:
      "A decisão conjunta é fundamental. inclusive, os itens de estribo e conforto interno foram pensados exatamente para quem viaja com o senhor, garantindo facilidade no embarque e ergonomia para toda a família.",
    alternativeArgument:
      "Posso enviar o link oficial da visualização interativa do veículo direto no seu WhatsApp para que vocês vejam juntos exatamente como o carro fica montado.",
    deepeningQuestion:
      "O que você acredita que o seu cônjuge ou sócio mais valoriza no carro: a estética, a segurança ou o conforto?",
    closingProposal:
      "Que tal eu enviar o link agora pelo WhatsApp e mantermos a reserva dos itens no estoque até o final da tarde?",
    authorizedCondition: "Envio de visualização pública 3D e reserva de estoque temporária por 24h",
    maxAuthorizedDiscountPercent: 5,
    approvedVersion: "v2.4-2026",
    approvedAt: "2026-01-15",
    dealershipGroup: "Grupo Concessionária Stellantis",
    brand: "Mopar",
    active: true,
  },
  {
    id: "arg-duvida-garantia",
    objection: "duvida_garantia",
    objectionLabel: "Tenho dúvida sobre o tempo e cobertura da garantia",
    appropriateStep: "negotiation",
    mainArgument:
      "Todos os acessórios genuínos Mopar instalados na concessionária acompanham a garantia contratual de até 3 anos com respaldo direto da montadora em qualquer autorizada do país.",
    alternativeArgument:
      "Caso ocorra qualquer inconformidade, a troca é realizada imediatamente por peça nova original com mão de obra coberta, sem burocracia de fornecedores terceirizados.",
    deepeningQuestion:
      "Existe algum componente em específico cuja cobertura o senhor gostaria de checar em detalhe no certificado?",
    closingProposal:
      "Emitiremos o certificado de garantia genuína Mopar anexado diretamente à nota fiscal de entrega do veículo.",
    authorizedCondition: "Certificado de garantia de 3 anos Mopar anexado à proposta",
    maxAuthorizedDiscountPercent: 0,
    approvedVersion: "v2.4-2026",
    approvedAt: "2026-01-15",
    dealershipGroup: "Grupo Concessionária Stellantis",
    brand: "Mopar",
    active: true,
  },
  {
    id: "arg-duvida-instalacao",
    objection: "duvida_instalacao",
    objectionLabel: "Dúvida sobre alteração na fiação ou furação do veículo",
    appropriateStep: "negotiation",
    mainArgument:
      "Nenhuma furação ou corte de chicote elétrico é realizado. Os acessórios Mopar utilizam as furações roscadas e conectores 'plug-and-play' originais projetados na concepção da plataforma do veículo.",
    alternativeArgument:
      "Nossos técnicos realizam treinamentos periódicos com a Stellantis e utilizam torquímetros calibrados para cada parafuso de fixação.",
    deepeningQuestion:
      "A sua preocupação é com relação à originalidade da fiação ou com ruídos e vibrações?",
    closingProposal:
      "O senhor pode acompanhar o checklist de conferência técnica na entrega para atestar o acabamento perfeito de fábrica.",
    authorizedCondition: "Acompanhamento presencial da Entrega Técnica com chefe de oficina",
    maxAuthorizedDiscountPercent: 0,
    approvedVersion: "v2.4-2026",
    approvedAt: "2026-01-15",
    dealershipGroup: "Grupo Concessionária Stellantis",
    brand: "Mopar",
    active: true,
  },
  {
    id: "arg-prazo",
    objection: "prazo",
    objectionLabel: "A instalação vai atrasar a entrega do meu carro novo?",
    appropriateStep: "negotiation",
    mainArgument:
      "Não haverá atraso. As peças já estão separadas no nosso almoxarifado e o tempo de instalação é executado em paralelo durante a preparação estética e emplacamento do veículo.",
    alternativeArgument:
      "Temos equipe de box rápido dedicada exclusivamente a acessórios para faturamento de 0km, garantindo a entrega exatamente na data combinada.",
    deepeningQuestion:
      "Qual é a sua data limite de preferência para retirar o carro pronto?",
    closingProposal:
      "Inserimos o compromisso formal de entrega com os acessórios prontos na data acordada na ordem de serviço.",
    authorizedCondition: "Compromisso de entrega em box expresso sem postergação de data",
    maxAuthorizedDiscountPercent: 0,
    approvedVersion: "v2.4-2026",
    approvedAt: "2026-01-15",
    dealershipGroup: "Grupo Concessionária Stellantis",
    brand: "Mopar",
    active: true,
  },
  {
    id: "arg-retirar-itens",
    objection: "retirar_itens",
    objectionLabel: "Gostaria de retirar alguns itens para diminuir a conta",
    appropriateStep: "negotiation",
    mainArgument:
      "Podemos sim ajustar o pacote. Minha recomendação técnica é preservarmos os itens classificados como essenciais, que protegem o cárter e a caçamba, e retirarmos os complementares estéticos.",
    alternativeArgument:
      "Ao manter o conjunto de segurança e proteção, o senhor assegura a integridade mecânica nas viagens sem estourar o planejamento financeiro.",
    deepeningQuestion:
      "Podemos focar a economia nos itens de acabamento e manter a proteção mecânica ativa?",
    closingProposal:
      "Vamos reconfigurar a proposta preservando o protetor e o estribo, alcançando o valor ideal para você?",
    authorizedCondition: "Reconfiguração flexível de pacote com preservação de bônus nos itens essenciais",
    maxAuthorizedDiscountPercent: 5,
    approvedVersion: "v2.4-2026",
    approvedAt: "2026-01-15",
    dealershipGroup: "Grupo Concessionária Stellantis",
    brand: "Mopar",
    active: true,
  },
  {
    id: "arg-impacto-parcela",
    objection: "impacto_parcela",
    objectionLabel: "Preocupado com o aumento no valor da parcela mensal",
    appropriateStep: "negotiation",
    mainArgument:
      "Quando incluído no financiamento do veículo, o pacote completo representa um acréscimo de apenas R$ 2 a R$ 4 por dia na parcela, valor insignificante perto do benefício de conforto e proteção do carro.",
    alternativeArgument:
      "Além disso, se preferir, podemos desvincular do financiamento bancário e passar o valor em até 12 vezes sem juros no cartão de crédito da concessionária.",
    deepeningQuestion:
      "O senhor prefere a diluição de longo prazo no CDC ou o parcelamento direto em até 12x no cartão sem juros?",
    closingProposal:
      "Vamos simular a opção de 12x sem juros direto na nossa maquininha sem impactar o contrato do veículo?",
    authorizedCondition: "Parcelamento direto em 12x s/ juros no cartão de crédito",
    maxAuthorizedDiscountPercent: 5,
    approvedVersion: "v2.4-2026",
    approvedAt: "2026-01-15",
    dealershipGroup: "Grupo Concessionária Stellantis",
    brand: "Mopar",
    active: true,
  },
];

export function getApprovedArgumentForObjection(
  objection: ObjectionCategory,
  state?: Partial<SalesJourneyState>
): CommercialArgument {
  const found = APPROVED_COMMERCIAL_ARGUMENTS.find((arg) => arg.objection === objection);
  if (found) return found;

  // Fallback padrão seguro
  return APPROVED_COMMERCIAL_ARGUMENTS[0];
}

export function generateCustomizedArgumentContext(
  argument: CommercialArgument,
  clientName: string,
  vehicleModel: string,
  usageSummary: string
): {
  customizedIntro: string;
  mainPitch: string;
  suggestedAction: string;
} {
  return {
    customizedIntro: `Para o ${clientName || "cliente"} e seu ${vehicleModel || "veículo"}, considerando ${usageSummary || "a sua rotina de utilização"}:`,
    mainPitch: argument.mainArgument,
    suggestedAction: argument.closingProposal,
  };
}
