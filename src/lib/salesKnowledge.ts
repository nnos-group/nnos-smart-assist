import { Accessory, ClientData } from "@/types/accessories";

export interface SalesArgument {
  category: "security" | "value" | "lifestyle";
  icon: string;
  label: string;
  hook: string;
  content: string;
}

export interface CounterArgumentResult {
  arguments: SalesArgument[];
  dialogueScript: string;
  closingPhrase: string;
}

interface AccessoryPillar {
  hook: string;
  content: string;
}

interface AccessoryKnowledgeEntry {
  security: AccessoryPillar;
  value: AccessoryPillar;
  lifestyle: AccessoryPillar;
}

const accessoryKnowledge: Record<string, AccessoryKnowledgeEntry> = {
  estribo: {
    security: {
      hook: "Segurança começa no embarque.",
      content: "O estribo oferece um ponto de apoio firme e seguro para crianças, idosos e pessoas com mobilidade reduzida, prevenindo escorregões e quedas ao entrar e sair de um veículo alto. Em dias de chuva, a superfície antiderrapante faz toda a diferença.",
    },
    value: {
      hook: "Proteção lateral que se paga.",
      content: "Funciona como primeira barreira contra 'portadas' em estacionamentos, protegendo a lataria. Veículos com acessórios originais Mopar têm valorização de até 15% na revenda. É um investimento que retorna.",
    },
    lifestyle: {
      hook: "Uma declaração de chegada.",
      content: "O estribo elétrico se recolhe automaticamente, mantendo o design limpo em movimento e se apresentando ao abrir a porta. É a combinação perfeita de tecnologia e imponência que diferencia seu veículo.",
    },
  },
  protetor: {
    security: {
      hook: "Uma armadura para o coração do seu veículo.",
      content: "Protege motor, câmbio e componentes vitais contra impactos em lombadas, buracos e trilhas. Sem essa proteção, um único impacto pode causar um prejuízo de R$ 15.000 a R$ 25.000 em reparos mecânicos.",
    },
    value: {
      hook: "Prevenir custa centavos, reparar custa milhares.",
      content: "A proteção preventiva evita danos que comprometem a garantia de fábrica e geram custos exponenciais. Na revenda, um veículo com histórico de proteção completa é muito mais valorizado e gera menos desconfiança do comprador.",
    },
    lifestyle: {
      hook: "Liberdade sem limites.",
      content: "Com o protetor instalado, cada estrada vira uma possibilidade. Lombadas, buracos urbanos ou trilhas off-road — você dirige com a tranquilidade de quem sabe que o veículo está blindado por baixo.",
    },
  },
  capota: {
    security: {
      hook: "Sua carga protegida contra tudo e todos.",
      content: "A capota protege contra furto, chuva, sol intenso e poeira. Objetos soltos na caçamba podem se transformar em projéteis perigosos em uma frenagem brusca — a capota elimina esse risco completamente.",
    },
    value: {
      hook: "Investimento que valoriza na revenda.",
      content: "Uma pickup com capota original é significativamente mais desejada no mercado de seminovos. Você investe agora e recupera o valor com juros na hora da troca, além de preservar o estado da caçamba ao longo dos anos.",
    },
    lifestyle: {
      hook: "Versatilidade para cada momento.",
      content: "Da mudança no fim de semana à viagem com a família, a capota transforma sua pickup em um veículo verdadeiramente versátil. Carga protegida, visual limpo e a praticidade que só quem tem sabe valorizar.",
    },
  },
  pneus: {
    security: {
      hook: "Tração é segurança. Ponto final.",
      content: "Pneus adequados reduzem a distância de frenagem em até 30% em piso molhado e oferecem tração superior em terra, cascalho e lama. É o único componente que conecta seu veículo ao chão — não é lugar para economizar.",
    },
    value: {
      hook: "O pneu mais inteligente, não o mais caro.",
      content: "Dura até 40% mais que pneus convencionais em uso misto, economizando com trocas e consertos. Pneus inadequados aceleram o desgaste de suspensão e alinhamento, gerando custos ocultos que superam o investimento inicial.",
    },
    lifestyle: {
      hook: "Qualquer estrada, a qualquer hora.",
      content: "A liberdade de pegar uma estrada de terra sem pensar duas vezes, de enfrentar chuva forte com confiança, de explorar caminhos que outros não conseguem. Esse pneu é o passaporte para a aventura.",
    },
  },
  santantonio: {
    security: {
      hook: "Proteção de cabine em situações extremas.",
      content: "Em caso de capotamento ou tombamento, o santo antônio atua como estrutura de proteção da cabine, podendo preservar vidas. Também protege contra galhos e obstáculos em trilhas fechadas.",
    },
    value: {
      hook: "Acessório original que agrega valor real.",
      content: "Homologado pelo fabricante e com garantia Mopar, mantém a garantia de fábrica intacta. Na revenda, uma pickup equipada com santo antônio original tem apelo visual e prático que atrai compradores dispostos a pagar mais.",
    },
    lifestyle: {
      hook: "Presença e imponência que chamam atenção.",
      content: "O santo antônio transforma a silhueta da pickup, conferindo um visual robusto e aventureiro que reflete o espírito do proprietário. É o acessório que mais impacta visualmente e que mais gera comentários.",
    },
  },
  friso: {
    security: {
      hook: "Proteção invisível contra danos visíveis.",
      content: "Protege as áreas mais vulneráveis da lataria contra batidas de porta em estacionamentos, contato com objetos em manobras e impactos leves do dia a dia que causam amassados e descascados na pintura.",
    },
    value: {
      hook: "Centavos por dia para preservar milhares.",
      content: "Um retoque de pintura automotiva custa entre R$ 300 e R$ 1.500 por painel. O friso evita esses custos repetitivos e mantém a pintura original intacta, preservando o valor de mercado do veículo.",
    },
    lifestyle: {
      hook: "Detalhes que fazem a diferença.",
      content: "O friso cromado ou na cor do veículo adiciona uma linha de design que valoriza a lateral, dando um acabamento premium e personalizado que demonstra cuidado e bom gosto do proprietário.",
    },
  },
  rack: {
    security: {
      hook: "Transporte seguro, sem improvisos perigosos.",
      content: "Equipamentos soltos no interior do veículo são um risco grave em colisões. O rack permite transportar bikes, pranchas, bagagem extra e equipamentos de forma segura, organizada e dentro das normas de trânsito.",
    },
    value: {
      hook: "Multiplica a capacidade sem trocar de veículo.",
      content: "Amplia drasticamente a versatilidade do veículo sem necessidade de upgrade. Acessório original com garantia, que agrega valor na revenda e evita danos ao teto causados por soluções improvisadas.",
    },
    lifestyle: {
      hook: "Aventura sem limites de bagagem.",
      content: "Do surf ao camping, da bike ao caiaque — o rack liberta você das limitações do porta-malas e transforma cada viagem em uma expedição completa. É o passaporte para o estilo de vida outdoor.",
    },
  },
  guincho: {
    security: {
      hook: "Seu seguro pessoal em terrenos extremos.",
      content: "Em situações de atolamento ou travessia difícil, o guincho é literalmente a diferença entre voltar para casa ou ficar preso. É equipamento de resgate que pode salvar vidas em áreas remotas sem sinal de celular.",
    },
    value: {
      hook: "Um resgate pode custar mais que o guincho inteiro.",
      content: "Um serviço de guincho em área rural custa entre R$ 800 e R$ 3.000 por chamado. Com o kit instalado, você tem autonomia total e ainda pode ajudar outros veículos, criando uma rede de confiança.",
    },
    lifestyle: {
      hook: "A coragem de ir além.",
      content: "O guincho é o que separa quem olha a trilha de quem entra nela. É a confiança de explorar territórios selvagens sabendo que você tem capacidade de auto-resgate. Aventura de verdade exige equipamento de verdade.",
    },
  },
  engate: {
    security: {
      hook: "Reboque com segurança certificada.",
      content: "Engate original dimensionado para a capacidade exata do veículo, com pontos de ancoragem certificados. Engates genéricos podem falhar sob carga, causando acidentes graves com o reboque solto em movimento.",
    },
    value: {
      hook: "Capacidade que multiplica utilidade.",
      content: "Transforma seu veículo em uma ferramenta de trabalho e lazer completa. Rebocar trailers, jet-skis, carretas de carga — o engate original mantém a garantia e agrega valor significativo na revenda.",
    },
    lifestyle: {
      hook: "Leve seu mundo com você.",
      content: "Do trailer de camping ao jet-ski no lago, o engate é a conexão entre o seu veículo e o seu estilo de vida. Fins de semana se transformam em aventuras completas quando você pode levar tudo que precisa.",
    },
  },
  sensor: {
    security: {
      hook: "Olhos onde você não consegue ver.",
      content: "Sensores 360° detectam obstáculos, crianças e animais nos pontos cegos do veículo. Em estacionamentos apertados e manobras urbanas, eliminam o risco de colisões que custam caro e podem machucar alguém.",
    },
    value: {
      hook: "Cada batidinha evitada já pagou o sensor.",
      content: "O custo médio de reparo por colisão em manobra é de R$ 1.200 a R$ 3.000. Os sensores se pagam na primeira batida que evitam, além de reduzirem o valor do seguro em muitas seguradoras.",
    },
    lifestyle: {
      hook: "Tecnologia que simplifica seu dia.",
      content: "Estacione com confiança em qualquer vaga, em qualquer cidade. A tecnologia que elimina o estresse das manobras e transforma cada estacionamento apertado em uma operação simples e segura.",
    },
  },
  farol: {
    security: {
      hook: "Ver e ser visto salva vidas.",
      content: "Faróis auxiliares LED iluminam até 3x mais que faróis convencionais, revelando obstáculos, animais e pedestres em estradas escuras. Em rodovias rurais e trilhas noturnas, a diferença de visibilidade é literalmente vital.",
    },
    value: {
      hook: "LEDs duram a vida do veículo.",
      content: "Com vida útil de até 50.000 horas e consumo energético 70% menor, os faróis LED eliminam trocas frequentes e reduzem a carga no alternador. Investimento único com retorno garantido em durabilidade.",
    },
    lifestyle: {
      hook: "Presença imponente de dia e de noite.",
      content: "O visual dos faróis LED transforma a frente do veículo, dando uma presença moderna e agressiva que impõe respeito na estrada. É tecnologia que se vê e se sente a cada quilômetro rodado.",
    },
  },
  toolbox: {
    security: {
      hook: "Ferramentas organizadas, riscos eliminados.",
      content: "Ferramentas e equipamentos soltos na caçamba são um risco em frenagens e curvas. A toolbox mantém tudo organizado, travado e protegido, eliminando o perigo de objetos soltos e o risco de furto.",
    },
    value: {
      hook: "Organização profissional que economiza tempo.",
      content: "Profissionais que usam a pickup como ferramenta de trabalho economizam em média 30 minutos por dia com organização adequada. A toolbox protege ferramentas caras contra roubo, chuva e danos.",
    },
    lifestyle: {
      hook: "Profissionalismo que se vê.",
      content: "Uma pickup com toolbox integrada transmite profissionalismo e organização. Seja para trabalho ou lazer, ter cada coisa no seu lugar transforma a experiência de uso e impressiona clientes e amigos.",
    },
  },
};

type ObjectionType = "price" | "necessity" | "time" | "origin" | "aesthetic" | "generic";

const detectObjectionType = (text: string): ObjectionType => {
  const t = text.toLowerCase();
  if (/caro|preço|prec|dinheiro|custo|valor alto|pagar|cust|orçamento|budget/.test(t)) return "price";
  if (/não preciso|desnecessário|sem necessidade|não necessit|não uso|não vou usar|não vejo/.test(t)) return "necessity";
  if (/pensar|penso|depois|volto|ver depois|decidir|calma|tempo|ainda não/.test(t)) return "time";
  if (/já tenho|compro fora|aftermarket|paralelo|genéric|internet|mercado livre|mais barato fora/.test(t)) return "origin";
  if (/feio|não gost|estética|visual|esposa|mulher|aparência|design/.test(t)) return "aesthetic";
  return "generic";
};

const pillarPriority: Record<ObjectionType, ("security" | "value" | "lifestyle")[]> = {
  price: ["value", "security", "lifestyle"],
  necessity: ["security", "value", "lifestyle"],
  time: ["value", "security", "lifestyle"],
  origin: ["security", "value", "lifestyle"],
  aesthetic: ["lifestyle", "value", "security"],
  generic: ["security", "value", "lifestyle"],
};

const dialogueTemplates: Record<ObjectionType, (firstName: string, genderPrefix: string, accessoryNames: string, vehicleModel: string) => string> = {
  price: (fn, gp, acc, vm) =>
    `Quando o cliente disser "Está muito caro", você pode responder:\n\n"${gp} ${fn}, eu entendo a preocupação com o investimento. Mas vamos fazer uma conta rápida: financiando ${acc} junto ao ${vm}, estamos falando de poucos reais por dia. Agora, sem essa proteção, um único incidente pode custar mais do que o pacote inteiro. O senhor(a) prefere investir um pouco agora ou arriscar um prejuízo muito maior depois?"`,

  necessity: (fn, gp, acc, vm) =>
    `Quando o cliente disser "Não preciso disso", você pode responder:\n\n"${gp} ${fn}, eu entendo — e muitos clientes pensam assim no início. Mas deixa eu compartilhar algo: 8 em cada 10 clientes que optaram pelo ${vm} escolheram ${acc}. Sabe por quê? Porque no dia a dia, esses itens não são luxo, são necessidade prática. Posso mostrar exatamente como cada um vai facilitar a sua rotina?"`,

  time: (fn, gp, acc, vm) =>
    `Quando o cliente disser "Vou pensar", você pode responder:\n\n"${gp} ${fn}, faz todo sentido querer pensar bem. Só quero garantir que o senhor(a) tenha uma informação importante: a condição especial de ${acc} está vinculada à compra do ${vm} hoje. Após a saída da concessionária, a instalação individual pode custar até 40% a mais. Que tal garantirmos agora e, se mudar de ideia, conversamos?"`,

  origin: (fn, gp, acc, vm) =>
    `Quando o cliente disser "Compro mais barato fora", você pode responder:\n\n"${gp} ${fn}, entendo a lógica, mas preciso ser transparente: acessórios não-originais podem comprometer a garantia de fábrica do seu ${vm}. ${acc} originais Mopar têm certificação, encaixe perfeito e garantia própria. Além disso, qualquer problema futuro, a concessionária assume. Com paralelos, o senhor(a) fica sozinho(a)."`,

  aesthetic: (fn, gp, acc, vm) =>
    `Quando o cliente ou acompanhante disser "Não gostei da estética", você pode responder:\n\n"${gp} ${fn}, a estética é super importante e eu respeito muito essa opinião. O que posso dizer é que ${acc} foram projetados pelo mesmo time de design do ${vm} — cada linha, cada acabamento combina perfeitamente. Mas o principal: além do visual, a funcionalidade e segurança que oferecem são incomparáveis. Posso mostrar instalado em outro veículo?"`,

  generic: (fn, gp, acc, vm) =>
    `Para apresentar proativamente, você pode dizer:\n\n"${gp} ${fn}, preparei uma configuração exclusiva de ${acc} para o seu ${vm}. Cada item foi selecionado pensando no seu perfil de uso e na sua região. Me permite 2 minutos para mostrar como isso vai transformar a experiência com o seu veículo?"`,
};

const closingPhrases: Record<ObjectionType, string> = {
  price: "\"Vamos incluir no financiamento? Assim o senhor(a) sai hoje com o veículo completo e protegido, sem sentir no bolso.\"",
  necessity: "\"Posso incluir para o senhor(a) experimentar com a tranquilidade da garantia? Tenho certeza de que em uma semana já não vai querer ficar sem.\"",
  time: "\"Para garantir essa condição especial, posso reservar agora e deixamos tudo pronto para a entrega. O que acha?\"",
  origin: "\"Vamos garantir a instalação original com garantia completa? Assim o senhor(a) tem total tranquilidade e mantém o valor do veículo.\"",
  aesthetic: "\"Que tal vermos juntos como fica no veículo? Muitos clientes mudam de opinião quando veem instalado. E a funcionalidade compensa qualquer dúvida estética.\"",
  generic: "\"Posso incluir o pacote completo na proposta? Garanto que é a melhor decisão para proteger e valorizar seu investimento.\"",
};

export const generateSalesArguments = (
  objectionText: string,
  clientData: ClientData,
  focusedAccessories: Accessory[],
  focusedTotal: number,
  packageName: string
): CounterArgumentResult => {
  const firstName = clientData.clientName.split(" ")[0] || "Cliente";
  const genderPrefix = clientData.clientGender?.toLowerCase().includes("fem") ? "Sra." : "Sr.";
  const objectionType = objectionText.trim() ? detectObjectionType(objectionText) : "generic";
  const priority = pillarPriority[objectionType];
  const accessoryNames = focusedAccessories.map(a => a.name).join(", ");

  const pillarData: Record<"security" | "value" | "lifestyle", { hooks: string[]; contents: string[] }> = {
    security: { hooks: [], contents: [] },
    value: { hooks: [], contents: [] },
    lifestyle: { hooks: [], contents: [] },
  };

  for (const acc of focusedAccessories) {
    const knowledge = accessoryKnowledge[acc.id];
    if (knowledge) {
      for (const cat of ["security", "value", "lifestyle"] as const) {
        pillarData[cat].hooks.push(knowledge[cat].hook);
        pillarData[cat].contents.push(knowledge[cat].content);
      }
    }
  }

  // Add contextual personalization
  const regionContext = clientData.state ? ` na região do ${clientData.state}` : "";
  const terrainContext = clientData.terrainType ? ` para uso em ${clientData.terrainType.toLowerCase()}` : "";
  const climateContext = clientData.climateCondition ? ` Com ${clientData.climateCondition.toLowerCase()}, ` : "";

  const pillarLabels: Record<"security" | "value" | "lifestyle", { label: string; icon: string }> = {
    security: { label: "Segurança e Proteção", icon: "🛡️" },
    value: { label: "Valorização do Bem", icon: "💰" },
    lifestyle: { label: "Estilo de Vida e Exclusividade", icon: "✨" },
  };

  const args: SalesArgument[] = priority.map(cat => {
    const data = pillarData[cat];
    const bestHook = data.hooks[0] || "Proteja seu investimento.";
    const combinedContent = data.contents.length > 0
      ? data.contents.join(" ") + (cat === "security" ? `${climateContext}a proteção se torna ainda mais essencial${regionContext}.` : "")
      : `Para o ${clientData.vehicleModel}${terrainContext}${regionContext}, este pacote oferece o melhor custo-benefício do mercado.`;

    return {
      category: cat,
      icon: pillarLabels[cat].icon,
      label: pillarLabels[cat].label,
      hook: bestHook,
      content: combinedContent,
    };
  });

  const dialogueScript = dialogueTemplates[objectionType](firstName, genderPrefix, accessoryNames, clientData.vehicleModel);
  const closingPhrase = closingPhrases[objectionType];

  return { arguments: args, dialogueScript, closingPhrase };
};
