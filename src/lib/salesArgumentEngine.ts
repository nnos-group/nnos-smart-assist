/**
 * Smart-Sell — Sales Argumentation Engine
 *
 * Engine de geração de argumentação comercial personalizada.
 * Gera blocos "COMO VENDER ESTA RECOMENDAÇÃO" contextualizados com base em:
 * cliente, veículo, região, uso, estoque, descontos, campanhas e canal de atendimento.
 *
 * Dois modos:
 *   1. Preparar a Venda — roteiro proativo antes da apresentação
 *   2. Recuperar a Venda — nova argumentação após recusa
 */

import { Accessory, ClientData, ClientSource, getPackageName } from "@/types/accessories";
import {
  AccessorySellArgument,
  ObjectionResponse,
  PackageNarrative,
  SellRecommendation,
  RecoveryContext,
} from "@/types/salesArgument";

// ─── Accessory Knowledge Base ──────────────────────────────────────────────────
// Dados de argumentação por acessório, organizados por contexto de venda

interface AccessoryArgumentData {
  whyTemplates: string[];
  approachTemplates: string[];
  arguments: { terrain: string[]; climate: string[]; urban: string[]; general: string[] };
  closingTemplates: string[];
  objections: { objection: string; response: string; category: ObjectionResponse["category"] }[];
}

const accessoryArgumentBase: Record<string, AccessoryArgumentData> = {
  estribo: {
    whyTemplates: [
      "Com a altura elevada do {vehicle}, o estribo oferece embarque seguro e ergonômico para {clientName} e seus passageiros, especialmente em dias de chuva quando o piso fica escorregadio.",
      "Na região de {region}, onde {terrainContext}, o estribo é fundamental para acesso seguro ao veículo após percursos em terrenos irregulares.",
    ],
    approachTemplates: [
      "{prefix} {firstName}, já notou como o embarque fica mais confortável com o estribo? Principalmente para a família, faz toda a diferença no dia a dia.",
      "{prefix} {firstName}, pensando na praticidade do seu dia a dia em {region}, o estribo não é apenas estético — é segurança para quem entra e sai do veículo.",
    ],
    arguments: {
      terrain: [
        "Base antiderrapante essencial para embarque em terrenos com lama ou poeira",
        "Proteção lateral contra pedras e galhos em estradas rurais",
      ],
      climate: [
        "Superfície antiderrapante evita escorregões em dias de chuva intensa",
        "Facilita acesso seguro mesmo com calçados molhados",
      ],
      urban: [
        "Facilita embarque em estacionamentos apertados sem danificar portas adjacentes",
        "Proteção lateral contra 'portadas' em vagas estreitas",
      ],
      general: [
        "Reduz esforço de embarque para crianças, idosos e passageiros de baixa estatura",
        "Veículos com estribo original Mopar têm valorização de até 15% na revenda",
        "Design integrado à carroceria com acabamento premium de fábrica",
      ],
    },
    closingTemplates: [
      "Posso incluir o estribo na configuração e garantir a instalação antes da entrega?",
      "O estribo já sai instalado na entrega — posso confirmar para o senhor?",
    ],
    objections: [
      {
        objection: "Acho que não preciso de estribo",
        response: "Entendo, {prefix} {firstName}. Porém, 8 em cada 10 clientes que testam o estribo no {vehicle} relatam que não abrem mão depois. A altura do veículo surpreende no dia a dia, especialmente com crianças e pessoas mais velhas. E na revenda, é um dos itens que mais agrega valor.",
        category: "necessity",
      },
      {
        objection: "O estribo é muito caro",
        response: "Compreendo a preocupação. Considerando que o custo diluído no financiamento fica em poucos reais por dia, e que um estribo paralelo pode comprometer a garantia de fábrica e não ter o encaixe milimétrico original — o investimento se paga rapidamente em proteção e valorização.",
        category: "price",
      },
      {
        objection: "Posso colocar um estribo mais barato fora",
        response: "É uma opção, mas preciso ser transparente: estribos não-originais podem ter folgas, vibrações e até comprometer a garantia lateral do veículo. O Mopar é projetado pelo mesmo time de engenharia do {vehicle}, com encaixe e resistência certificados.",
        category: "origin",
      },
    ],
  },
  protetor: {
    whyTemplates: [
      "Na região de {region}, com {climateContext}, o protetor de carter é literalmente uma armadura para o motor do {vehicle}. Um único impacto sem proteção pode custar R$ 15.000 a R$ 25.000 em reparos.",
      "Para o perfil de uso de {clientName} em {terrainType}, a proteção do conjunto mecânico é essencial. Sem ela, buracos e lombadas representam risco permanente.",
    ],
    approachTemplates: [
      "{prefix} {firstName}, considerando as estradas da sua região, o protetor de carter é provavelmente o acessório com o maior custo-benefício do pacote. Posso explicar por quê?",
      "{prefix} {firstName}, sabe qual é o acessório que mais evita surpresas desagradáveis na oficina? O protetor. E para quem roda em {region}, é praticamente obrigatório.",
    ],
    arguments: {
      terrain: [
        "Blindagem vital contra pedras e obstáculos em estradas de terra",
        "Proteção do cárter, câmbio e diferencial contra impactos severos",
      ],
      climate: [
        "Proteção contra danos por detritos arrastados em enxurradas",
        "Barreira contra lama e água que comprometem componentes mecânicos",
      ],
      urban: [
        "Proteção contra lombadas altas e buracos urbanos não sinalizados",
        "Evita danos por raspagem em rampas de estacionamento",
      ],
      general: [
        "Um reparo de cárter furado custa de R$ 15.000 a R$ 25.000 — o protetor custa uma fração disso",
        "Acessório genuíno desenvolvido para integração com o veículo com garantia contratual Mopar",
        "Veículo protegido tem histórico limpo na revenda",
      ],
    },
    closingTemplates: [
      "Posso incluir o protetor para garantir que o {vehicle} saia blindado desde o km zero?",
      "Com a proteção incluída no financiamento, o senhor roda tranquilo desde o primeiro dia. Incluo?",
    ],
    objections: [
      {
        objection: "Não vejo necessidade de protetor",
        response: "Entendo, {prefix} {firstName}. A verdade é que a maioria dos motoristas só descobre a importância do protetor quando recebe a conta do mecânico. Na região de {region}, com a condição das estradas, um único buraco pode causar um prejuízo 10 vezes maior que o valor do protetor.",
        category: "necessity",
      },
      {
        objection: "Vou pensar sobre o protetor",
        response: "Faz sentido refletir. Só lembro que na compra do zero, o protetor entra no financiamento por poucos reais a mais por mês. Depois, a instalação avulsa pode custar até 40% a mais fora da concessionária. Posso garantir a condição de hoje?",
        category: "time",
      },
    ],
  },
  capota: {
    whyTemplates: [
      "Para {clientName}, que utiliza o {vehicle} para {terrainType}, a capota transforma a caçamba em um compartimento seguro contra furto, chuva e poeira — além de eliminar o risco de objetos soltos se tornarem projéteis em frenagens bruscas.",
      "Com as condições climáticas de {region} ({climateContext}), a capota protege cargas e pertences contra intempéries, mantendo tudo seco e seguro.",
    ],
    approachTemplates: [
      "{prefix} {firstName}, a capota é o acessório que mais transforma a praticidade da pickup. Posso mostrar como ela funciona?",
      "{prefix} {firstName}, já imaginou poder carregar qualquer coisa na caçamba sem se preocupar com chuva ou furto? A capota resolve isso.",
    ],
    arguments: {
      terrain: ["Proteção contra poeira em estradas de terra", "Segurança para cargas em terrenos irregulares"],
      climate: ["Vedação contra chuvas intensas e granizo", "Proteção UV para cargas sensíveis ao calor"],
      urban: ["Segurança anti-furto com trava de segurança", "Visual limpo e integrado para uso urbano"],
      general: [
        "Pickup com capota original é significativamente mais valorizada na revenda",
        "Transforma a caçamba em compartimento versátil para qualquer ocasião",
        "Abertura prática e rápida sem esforço",
      ],
    },
    closingTemplates: [
      "A capota é um dos itens mais comentados por quem já tem. Incluo no pacote?",
      "Posso garantir a instalação da capota junto com a entrega do veículo?",
    ],
    objections: [
      {
        objection: "Não uso muito a caçamba",
        response: "É justamente por isso que a capota faz sentido: ela protege a caçamba de sol, chuva e poeira mesmo quando vazia, preservando o estado da pintura e da superfície. Na revenda, uma caçamba em perfeito estado faz diferença no valor.",
        category: "necessity",
      },
      {
        objection: "Capota é muito cara",
        response: "Entendo. Porém, considerando que ela preserva a caçamba contra danos que custariam muito mais no futuro e que o valor diluído no CDC fica em menos de R$ 5 por dia, é um investimento que se paga em preservação do patrimônio.",
        category: "price",
      },
    ],
  },
  pneus: {
    whyTemplates: [
      "Para quem roda em {region} com {climateContext}, os pneus são literalmente o único ponto de contato entre o {vehicle} e o solo. Pneus adequados reduzem a distância de frenagem em até 30% em piso molhado.",
      "Considerando o perfil de {terrainType} do {clientName}, pneus de qualidade superior são a base de toda a segurança do veículo.",
    ],
    approachTemplates: [
      "{prefix} {firstName}, o pneu é o item de segurança mais subestimado. Posso mostrar a diferença que o pneu correto faz nas estradas de {region}?",
      "{prefix} {firstName}, pensando na sua rotina em {terrainType}, preparamos a configuração de pneus ideal para maximizar tração e durabilidade.",
    ],
    arguments: {
      terrain: [
        "Tração superior em terra, cascalho e lama com composição específica",
        "Resistência reforçada contra furos por pedras e objetos cortantes",
      ],
      climate: [
        "Redução de até 30% na distância de frenagem em piso molhado",
        "Composição especial que mantém performance em variações extremas de temperatura",
      ],
      urban: [
        "Conforto acústico superior para rodagem em asfalto",
        "Durabilidade estendida para uso misto urbano-rodoviário",
      ],
      general: [
        "Dura até 40% mais que pneus convencionais em uso misto, economizando em trocas",
        "Pneus inadequados aceleram desgaste de suspensão e alinhamento — custo oculto",
        "Homologação de fábrica que preserva a garantia do trem de força",
      ],
    },
    closingTemplates: [
      "Posso incluir os pneus adequados para o seu perfil de rodagem desde a entrega?",
      "Com os pneus corretos desde o km zero, o senhor roda com máxima segurança. Confirmo?",
    ],
    objections: [
      {
        objection: "Os pneus que vêm de fábrica servem",
        response: "Os pneus de série são bons para uso genérico, mas para a realidade de {region}, pneus especializados fazem diferença real em segurança e durabilidade. E como entram no financiamento, não há custo extra imediato.",
        category: "necessity",
      },
      {
        objection: "Pneus compro mais barato fora",
        response: "É possível encontrar preços similares, mas aqui o senhor tem garantia Mopar, montagem certificada incluída e a vantagem de diluir no financiamento. Sem contar que a garantia da suspensão e do alinhamento fica 100% preservada.",
        category: "origin",
      },
    ],
  },
  friso: {
    whyTemplates: [
      "O friso protege as áreas mais vulneráveis da lataria do {vehicle} contra batidas de porta em estacionamentos e contatos do dia a dia. Um retoque de pintura custa de R$ 300 a R$ 1.500 por painel — o friso evita isso.",
      "Para preservar a pintura original do {vehicle} {vehicleColor}, o friso é o investimento mais inteligente. Cada risquinho evitado mantém o valor de mercado intacto.",
    ],
    approachTemplates: [
      "{prefix} {firstName}, o friso é o seguro invisível da pintura. Protege contra os danos mais comuns do dia a dia e mantém o carro impecável.",
      "{prefix} {firstName}, pensando na valorização do seu {vehicle} {vehicleColor} na revenda, o friso preserva a lataria como nenhum outro acessório.",
    ],
    arguments: {
      terrain: ["Proteção contra galhos e arbustos em estradas rurais", "Barreira contra impactos laterais em trilhas"],
      climate: ["Proteção contra danos por granizo nas laterais", "Barreira contra projéteis de cascalho em piso molhado"],
      urban: [
        "Proteção em estacionamentos contra batidas de porta de carros vizinhos",
        "Evita riscos de manobra em vagas apertadas",
      ],
      general: [
        "Retoque de pintura custa R$ 300 a R$ 1.500 por painel — o friso evita esses custos",
        "Preserva a pintura original e o valor de mercado do veículo",
        "Acabamento premium que complementa as linhas de design do veículo",
      ],
    },
    closingTemplates: [
      "O friso custa centavos por dia e preserva milhares em valor. Incluo no pacote?",
      "Para manter o {vehicle} impecável, o friso é essencial. Posso confirmar?",
    ],
    objections: [
      {
        objection: "Não acho o friso necessário",
        response: "Entendo. Mas considere que o primeiro risco em estacionamento normalmente acontece nas primeiras semanas. Com o friso instalado na entrega, o carro já sai protegido. E o custo diluído é praticamente imperceptível na parcela.",
        category: "necessity",
      },
    ],
  },
  rack: {
    whyTemplates: [
      "Para o estilo de vida de {clientName} em {region}, o rack amplia drasticamente a versatilidade do {vehicle}. De bikes a bagagens extras, tudo viaja com segurança no teto.",
      "O rack original Mopar para o {vehicle} é aerodinâmico, silencioso e com capacidade certificada — muito diferente de soluções improvisadas que podem danificar o teto.",
    ],
    approachTemplates: [
      "{prefix} {firstName}, o rack libera o porta-malas inteiro para os passageiros. Pensou em como viagens ficam mais confortáveis com espaço extra?",
      "{prefix} {firstName}, para quem gosta de aventura e viagem, o rack é o passaporte para levar tudo que precisa sem abrir mão do conforto interno.",
    ],
    arguments: {
      terrain: ["Capacidade de transporte para equipamentos de trilha e expedição", "Estrutura reforçada para cargas em terrenos irregulares"],
      climate: ["Mantém bagagens protegidas com acessórios de vedação", "Design aerodinâmico que mantém eficiência mesmo em ventos fortes"],
      urban: ["Libera 100% do porta-malas para os passageiros em viagens", "Silencioso em velocidade — sem ruído de vento incômodo"],
      general: [
        "Multiplica a capacidade do veículo sem trocar para um modelo maior",
        "Acessório original com garantia que agrega valor na revenda",
        "Evita danos ao teto causados por soluções improvisadas",
      ],
    },
    closingTemplates: [
      "Com o rack, cada viagem ganha capacidade extra sem perder conforto. Incluo?",
      "Posso incluir o rack na entrega para o senhor já sair equipado?",
    ],
    objections: [
      {
        objection: "Não viajo muito com carga no teto",
        response: "Mesmo para uso ocasional, o rack é muito prático. E uma vez que está lá, o senhor descobre usos que nem imaginava — desde viagens de fim de semana até transportar compras grandes. Além disso, valoriza o veículo na revenda.",
        category: "necessity",
      },
    ],
  },
  bagageiro: {
    whyTemplates: [
      "O bagageiro de teto adiciona até 450L de espaço extra ao {vehicle}, com vedação hermética e chave antifurto. Para {clientName}, que roda em {region}, isso significa viajar com a família sem comprometer o conforto interno.",
      "Com {climateContext} na região, o bagageiro protege bagagens contra chuva, poeira e furto — enquanto libera o interior do {vehicle} para quem viaja com {clientName}.",
    ],
    approachTemplates: [
      "{prefix} {firstName}, imagine viajar com a família sem aquela discussão de 'o que deixar para trás'. O bagageiro resolve isso com 450 litros extras.",
      "{prefix} {firstName}, o bagageiro é a solução definitiva para quem quer conforto total no interior e capacidade de carga sem limites.",
    ],
    arguments: {
      terrain: ["Estrutura reforçada à prova de poeira e água para estradas rurais", "Fixação segura mesmo em terrenos irregulares"],
      climate: ["Vedação hermética contra chuvas intensas e tempestades", "Proteção UV para bagagens sensíveis ao calor"],
      urban: ["Chave antifurto integrada para segurança em estacionamentos", "Design aerodinâmico de baixo arrasto e ruído"],
      general: [
        "Até 450 litros extras sem comprometer espaço interno para passageiros",
        "Evita trocar de veículo apenas por falta de porta-malas em viagens",
        "Interior livre, espaçoso e silencioso para quem viaja com você",
      ],
    },
    closingTemplates: [
      "O bagageiro libera o interior para a família e protege tudo lá em cima. Incluo?",
      "Posso garantir o bagageiro na entrega para as próximas viagens?",
    ],
    objections: [
      {
        objection: "Acho que o porta-malas é suficiente",
        response: "Para o dia a dia talvez seja. Mas na primeira viagem em família ou no feriado, o porta-malas se torna insuficiente rápido. O bagageiro é a solução que o senhor vai agradecer exatamente quando mais precisar.",
        category: "necessity",
      },
    ],
  },
  santantonio: {
    whyTemplates: [
      "O santo antônio adiciona proteção estrutural à cabine do {vehicle} e confere o visual robusto que diferencia a pickup de {clientName}. Em trilhas ou situações de risco, pode literalmente preservar a integridade da cabine.",
      "Para o perfil de {terrainType} em {region}, o santo antônio é funcionalidade e estilo combinados. Proteção real com acabamento premium.",
    ],
    approachTemplates: [
      "{prefix} {firstName}, o santo antônio é o acessório que mais transforma visualmente a pickup. E por dentro, oferece proteção que nenhum outro item entrega.",
      "{prefix} {firstName}, já reparou como uma pickup com santo antônio impõe respeito? E não é só visual — é proteção real da cabine.",
    ],
    arguments: {
      terrain: ["Proteção da cabine contra galhos e obstáculos em trilhas", "Estrutura de proteção em caso de tombamento"],
      climate: ["Ponto de fixação para iluminação auxiliar", "Proteção contra queda de galhos em tempestades"],
      urban: ["Visual robusto e aventureiro que diferencia o veículo", "Imponência e personalidade que chamam atenção"],
      general: [
        "Homologado Mopar com garantia de fábrica preservada",
        "Maior impacto visual entre todos os acessórios — comentários garantidos",
        "Valorização significativa na revenda por ser item original",
      ],
    },
    closingTemplates: [
      "O santo antônio transforma completamente a presença da pickup. Incluo no pacote?",
      "Para quem busca robustez e estilo, o santo antônio é indispensável. Confirmo?",
    ],
    objections: [
      {
        objection: "Não gosto do visual do santo antônio",
        response: "Respeito a opinião. Mas convido o senhor a ver um veículo com ele instalado pessoalmente — muitos clientes mudam de ideia quando veem o acabamento premium ao vivo. E a funcionalidade de proteção é um diferencial que transcende a estética.",
        category: "aesthetic",
      },
    ],
  },
  engate: {
    whyTemplates: [
      "O engate original Mopar é dimensionado exatamente para a capacidade do {vehicle}, com pontos de ancoragem certificados. Para {clientName}, que pode precisar rebocar trailers, jet-skis ou carretas, é um item de utilidade e segurança.",
      "Com o engate homologado, o {vehicle} se torna uma ferramenta completa de trabalho e lazer. E diferente de engates genéricos, este preserva 100% da garantia.",
    ],
    approachTemplates: [
      "{prefix} {firstName}, o engate multiplica as possibilidades do seu {vehicle}. De viagens com trailer a transporte de equipamentos, tudo com segurança certificada.",
      "{prefix} {firstName}, já pensou em poder rebocar um trailer de camping ou levar bicicletas com tranquilidade? O engate original torna tudo isso possível.",
    ],
    arguments: {
      terrain: ["Reboque seguro em terrenos irregulares", "Pontos de ancoragem certificados para cargas pesadas"],
      climate: ["Material anticorrosivo para uso em condições adversas", "Resistência a variações extremas de temperatura"],
      urban: ["Suporte para rack de bicicletas traseiro", "Prático para carretas leves e utilidades"],
      general: [
        "Capacidade de reboque certificada pelo fabricante",
        "Engates genéricos podem falhar sob carga — risco de acidente grave",
        "Versatilidade que transforma o veículo em ferramenta completa",
      ],
    },
    closingTemplates: [
      "O engate transforma o {vehicle} em uma ferramenta completa. Incluo na configuração?",
      "Mesmo que não use hoje, ter o engate pronto é uma comodidade futura. Confirmo?",
    ],
    objections: [
      {
        objection: "Não pretendo rebocar nada",
        response: "Muitos clientes dizem isso inicialmente, mas depois descobrem a utilidade — desde rack de bikes até carrinhos de carga. E como item original, ele valoriza o veículo. Diluído no financiamento, é um investimento mínimo para uma versatilidade enorme.",
        category: "necessity",
      },
    ],
  },
  sensor: {
    whyTemplates: [
      "Os sensores 360° são os olhos extras do {vehicle}, detectando obstáculos, crianças e animais nos pontos cegos. Para {clientName}, que estaciona em {region}, eles eliminam o risco de colisões que custam caro e podem machucar alguém.",
      "Em um veículo do porte do {vehicle}, os pontos cegos são significativos. Os sensores transformam cada manobra em uma operação precisa e segura.",
    ],
    approachTemplates: [
      "{prefix} {firstName}, com um veículo do porte do {vehicle}, os sensores são praticamente obrigatórios para manobras seguras. Posso mostrar como funcionam?",
      "{prefix} {firstName}, já pensou em nunca mais se preocupar com pontos cegos ao estacionar? Os sensores 360° resolvem isso completamente.",
    ],
    arguments: {
      terrain: ["Detecção de obstáculos em terrenos irregulares", "Prevenção de danos em manobras off-road"],
      climate: ["Funcionamento preciso em condições de baixa visibilidade", "Alerta sonoro e visual mesmo com chuva ou neblina"],
      urban: [
        "Estacione com confiança em qualquer vaga, em qualquer cidade",
        "Detecção de crianças e animais nos pontos cegos — segurança familiar",
      ],
      general: [
        "Custo médio de reparo por colisão em manobra: R$ 1.200 a R$ 3.000",
        "Os sensores se pagam na primeira batida que evitam",
        "Redução do valor do seguro em muitas seguradoras",
      ],
    },
    closingTemplates: [
      "Os sensores são o tipo de tecnologia que, uma vez instalada, o senhor nunca mais abre mão. Incluo?",
      "Para estacionar com total confiança, os sensores são essenciais. Confirmo na proposta?",
    ],
    objections: [
      {
        objection: "Já tenho câmera de ré",
        response: "A câmera é ótima, mas cobre apenas uma direção. Os sensores 360° protegem todos os lados simultaneamente — frente, laterais e traseira. É a diferença entre ver e ser avisado automaticamente de qualquer obstáculo ao redor.",
        category: "necessity",
      },
    ],
  },
  guincho: {
    whyTemplates: [
      "Para quem explora trilhas em {region}, o kit de guincho é seguro de vida em terrenos extremos. Em áreas remotas sem sinal de celular, é a diferença entre voltar para casa ou ficar preso.",
      "Com o perfil de {terrainType} do {clientName}, ter capacidade de auto-resgate é uma necessidade real — não um luxo.",
    ],
    approachTemplates: [
      "{prefix} {firstName}, quem explora trilhas de verdade sabe: o guincho é o equipamento que separa aventura de improviso.",
      "{prefix} {firstName}, para trilhas na região de {region}, o kit de guincho é a garantia de que o senhor sempre volta para casa.",
    ],
    arguments: {
      terrain: ["Auto-resgate em atolamentos e travessias difíceis", "Capacidade de ajudar outros veículos em situações de risco"],
      climate: ["Essencial para enxurradas e terrenos encharcados", "Funcionamento confiável em condições adversas"],
      urban: [],
      general: [
        "Um resgate profissional em área rural custa R$ 800 a R$ 3.000 por chamado",
        "Autonomia total em áreas sem sinal de celular",
        "Trail Rated — certificação oficial de capacidade off-road",
      ],
    },
    closingTemplates: [
      "O guincho é o equipamento que o senhor espera nunca usar, mas agradece eternamente quando precisa. Incluo?",
      "Para trilhas sérias, o guincho é item obrigatório. Posso confirmar no pacote?",
    ],
    objections: [
      {
        objection: "Não faço trilhas tão pesadas",
        response: "Mesmo em trilhas leves, condições inesperadas acontecem — uma chuva forte, um atolamento surpresa. O guincho é a tranquilidade de saber que, aconteça o que acontecer, o senhor tem capacidade de sair por conta própria.",
        category: "necessity",
      },
    ],
  },
  farol: {
    whyTemplates: [
      "Os faróis auxiliares LED iluminam até 3x mais que faróis convencionais. Para quem roda em {region}, em estradas escuras com animais e pedestres, a diferença de visibilidade pode salvar vidas.",
      "Em rodovias rurais e trechos sem iluminação, os faróis LED do {vehicle} eliminam zonas escuras e revelam obstáculos a tempo de reagir com segurança.",
    ],
    approachTemplates: [
      "{prefix} {firstName}, em estradas escuras, ver 3 vezes mais longe é ver 3 vezes antes. Os faróis LED fazem exatamente isso.",
      "{prefix} {firstName}, para quem roda em {region}, a iluminação auxiliar não é luxo — é segurança noturna essencial.",
    ],
    arguments: {
      terrain: ["Iluminação potente para trilhas noturnas", "Revelação de obstáculos em estradas não pavimentadas"],
      climate: ["Visibilidade superior em chuva e neblina", "Luz branca que não cansa a vista em viagens longas"],
      urban: [],
      general: [
        "Vida útil de até 50.000 horas sem necessidade de troca",
        "Consumo energético 70% menor que faróis convencionais",
        "Visual moderno e imponente que transforma a frente do veículo",
      ],
    },
    closingTemplates: [
      "Os faróis LED são investimento único com retorno em segurança a cada viagem noturna. Incluo?",
      "Para rodar com máxima visibilidade em qualquer condição, os faróis são essenciais. Confirmo?",
    ],
    objections: [
      {
        objection: "Os faróis originais já são bons",
        response: "São bons para uso padrão, mas em estradas escuras de {region}, a diferença de alcance e intensidade dos LEDs auxiliares é significativa. É um upgrade de segurança real que funciona exatamente quando mais se precisa.",
        category: "necessity",
      },
    ],
  },
  toolbox: {
    whyTemplates: [
      "A caixa de ferramentas embutida organiza e protege equipamentos na caçamba do {vehicle}. Para uso profissional, ela elimina o caos e o risco de ferramentas soltas se tornando projéteis em frenagens.",
      "Para {clientName}, que utiliza o {vehicle} como ferramenta de trabalho, a toolbox é organização, segurança e profissionalismo em um único acessório.",
    ],
    approachTemplates: [
      "{prefix} {firstName}, a toolbox transforma a caçamba em um espaço organizado e profissional. Posso mostrar como otimiza a rotina?",
      "{prefix} {firstName}, para quem usa a pickup como ferramenta de trabalho, a toolbox é o upgrade que mais impacta a produtividade.",
    ],
    arguments: {
      terrain: ["Proteção de ferramentas contra poeira e impactos em estradas rurais", "Organização segura para equipamentos de campo"],
      climate: ["Proteção contra chuva e umidade para ferramentas e equipamentos", "Vedação que preserva contra oxidação"],
      urban: ["Proteção anti-furto com trava de segurança", "Organização profissional que impressiona clientes"],
      general: [
        "Profissionais economizam 30 minutos/dia com organização adequada",
        "Protege ferramentas caras contra furto, chuva e danos",
        "Transmite profissionalismo e organização a clientes e parceiros",
      ],
    },
    closingTemplates: [
      "A toolbox é produtividade e profissionalismo. Incluo na configuração?",
      "Para quem trabalha com a pickup, a toolbox é item obrigatório. Confirmo?",
    ],
    objections: [
      {
        objection: "Não preciso de caixa de ferramentas",
        response: "Mesmo para uso pessoal, a toolbox é o lugar perfeito para manter cabos, ferramentas básicas e utensílios organizados e protegidos. E na revenda, uma pickup com toolbox original é muito mais atrativa.",
        category: "necessity",
      },
    ],
  },
  soleira: {
    whyTemplates: [
      "As soleiras iluminadas em LED protegem a entrada da cabine do {vehicle} contra riscos e desgaste, enquanto adicionam um toque de sofisticação premium a cada abertura de porta.",
      "Para o {vehicle}, a soleira LED não é apenas estética — ela protege a área mais exposta a arranhões e demonstra o nível de cuidado de {clientName} com o veículo.",
    ],
    approachTemplates: [
      "{prefix} {firstName}, as soleiras iluminadas são o detalhe que surpreende quem entra no veículo pela primeira vez. Proteção e estilo combinados.",
      "{prefix} {firstName}, a soleira LED é o tipo de acessório que, uma vez instalado, o senhor não imagina o carro sem ele.",
    ],
    arguments: {
      terrain: [],
      climate: [],
      urban: [
        "Proteção contra arranhões de sapatos e calçados sujos",
        "Iluminação de boas-vindas sofisticada ao abrir as portas",
      ],
      general: [
        "Preserva a área mais vulnerável do acabamento interno",
        "Efeito premium que impressiona em cada embarque",
        "Acabamento original que mantém garantia e valor de revenda",
      ],
    },
    closingTemplates: [
      "As soleiras LED são o toque premium que o senhor vai adorar. Incluo?",
      "Para manter o acabamento impecável, as soleiras são ideais. Confirmo?",
    ],
    objections: [
      {
        objection: "Soleira é supérflua",
        response: "Pode parecer, mas a área da soleira é a mais exposta a riscos de sapato. Sem proteção, após 1 ano o acabamento já mostra desgaste visível. Com a soleira LED, o senhor preserva essa área e adiciona um toque de elegância por poucos reais a mais no financiamento.",
        category: "necessity",
      },
    ],
  },
};

// ─── Context-Aware Helpers ─────────────────────────────────────────────────────

const contextLabels: Record<string, string> = {
  crm: "CRM",
  showroom: "Showroom",
  live: "Showroom",
  delivery: "Entrega Técnica",
  postsale: "Pós-Venda",
};

const resolveTemplate = (
  template: string,
  data: {
    firstName: string;
    clientName: string;
    vehicle: string;
    vehicleColor: string;
    region: string;
    terrainType: string;
    terrainContext: string;
    climateContext: string;
    prefix: string;
  }
): string => {
  return template
    .replace(/\{firstName\}/g, data.firstName)
    .replace(/\{clientName\}/g, data.clientName)
    .replace(/\{vehicle\}/g, data.vehicle)
    .replace(/\{vehicleColor\}/g, data.vehicleColor)
    .replace(/\{region\}/g, data.region)
    .replace(/\{terrainType\}/g, data.terrainType)
    .replace(/\{terrainContext\}/g, data.terrainContext)
    .replace(/\{climateContext\}/g, data.climateContext)
    .replace(/\{prefix\}/g, data.prefix);
};

const getTerrainCategory = (terrainType: string): "terrain" | "urban" | "general" => {
  const t = terrainType.toLowerCase();
  if (/terra|rural|trilha|off-road|misto/.test(t)) return "terrain";
  if (/urbano|cidade|asfalto/.test(t)) return "urban";
  return "general";
};

// ─── Main Generation Functions ─────────────────────────────────────────────────

/**
 * Gera argumentação individual para cada acessório selecionado.
 */
const generateIndividualArguments = (
  accessories: Accessory[],
  clientData: ClientData,
  source: ClientSource
): AccessorySellArgument[] => {
  const firstName = (clientData.clientName || "Cliente").trim().split(" ")[0] || "Cliente";
  const prefix = clientData.clientGender?.toLowerCase().includes("fem") ? "Sra." : "Sr.";
  const region = clientData.state?.replace(/\s*\(.*\)/, "") || "sua região";
  const terrainCategory = getTerrainCategory(clientData.terrainType || "");

  const templateData = {
    firstName,
    clientName: clientData.clientName || "Cliente",
    vehicle: clientData.vehicleModel,
    vehicleColor: clientData.vehicleColor || "",
    region,
    terrainType: clientData.terrainType || "uso misto",
    terrainContext: (clientData.terrainType || "uso misto").toLowerCase(),
    climateContext: (clientData.climateCondition || "condições normais").toLowerCase(),
    prefix,
  };

  return accessories.map((acc): AccessorySellArgument => {
    const knowledge = accessoryArgumentBase[acc.id];

    if (!knowledge) {
      // Fallback para acessórios sem base de conhecimento dedicada
      return {
        accessoryId: acc.id,
        accessoryName: acc.name,
        whyRecommend: `O ${acc.name} é um acessório original Mopar projetado especificamente para o ${clientData.vehicleModel}, garantindo encaixe perfeito e preservação da garantia de fábrica.`,
        approachPhrase: `${prefix} ${firstName}, o ${acc.name} é uma adição inteligente para o seu ${clientData.vehicleModel}. Posso mostrar os benefícios?`,
        mainArguments: [
          acc.description,
          "Acessório original Mopar com garantia de fábrica preservada",
          "Valorização do veículo na revenda",
        ],
        closingQuestion: `Posso incluir o ${acc.name} na configuração do seu veículo?`,
        objections: [
          {
            objection: "Não vejo necessidade",
            response: `Entendo, ${prefix} ${firstName}. Muitos clientes pensam assim inicialmente, mas após experimentar, o ${acc.name} se torna indispensável no dia a dia com o ${clientData.vehicleModel}.`,
            category: "necessity",
          },
        ],
      };
    }

    // Selecionar template com base no contexto
    const whyIndex = Math.min(
      terrainCategory === "terrain" ? 1 : 0,
      knowledge.whyTemplates.length - 1
    );
    const approachIndex = Math.min(
      source === "live" || source === "delivery" ? 0 : 1,
      knowledge.approachTemplates.length - 1
    );

    // Combinar argumentos contextuais
    const contextArgs = knowledge.arguments[terrainCategory] || [];
    const generalArgs = knowledge.arguments.general || [];
    const climateArgs = knowledge.arguments.climate || [];

    // Selecionar 2-4 argumentos mais relevantes
    const selectedArgs: string[] = [];
    if (contextArgs.length > 0) selectedArgs.push(contextArgs[0]);
    if (climateArgs.length > 0 && clientData.climateCondition) selectedArgs.push(climateArgs[0]);
    generalArgs.forEach((a) => {
      if (selectedArgs.length < 4) selectedArgs.push(a);
    });
    if (contextArgs.length > 1 && selectedArgs.length < 4) selectedArgs.push(contextArgs[1]);

    // Adicionar contexto de estoque/desconto quando relevante
    if (acc.stockStatus === "dormant" || acc.stockStatus === "obsolete") {
      selectedArgs.push(
        `⚡ Condição especial: ${acc.discountPercent}% de desconto por giro de estoque — oportunidade exclusiva`
      );
    }

    return {
      accessoryId: acc.id,
      accessoryName: acc.name,
      whyRecommend: resolveTemplate(knowledge.whyTemplates[whyIndex], templateData),
      approachPhrase: resolveTemplate(knowledge.approachTemplates[approachIndex], templateData),
      mainArguments: selectedArgs.slice(0, 4),
      closingQuestion: resolveTemplate(
        knowledge.closingTemplates[Math.min(approachIndex, knowledge.closingTemplates.length - 1)],
        templateData
      ),
      objections: knowledge.objections.map((obj) => ({
        objection: obj.objection,
        response: resolveTemplate(obj.response, templateData),
        category: obj.category,
      })),
    };
  });
};

/**
 * Gera narrativa integrada do pacote completo.
 */
const generatePackageNarrative = (
  accessories: Accessory[],
  clientData: ClientData,
  totalValue: number,
  source: ClientSource
): PackageNarrative => {
  const firstName = (clientData.clientName || "Cliente").trim().split(" ")[0] || "Cliente";
  const prefix = clientData.clientGender?.toLowerCase().includes("fem") ? "Sra." : "Sra.";
  const region = clientData.state?.replace(/\s*\(.*\)/, "") || "sua região";
  const packageName = getPackageName(clientData.vehicleModel);
  const cdcMonthly = (totalValue * 0.0235).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const accessoryNames = accessories.map((a) => a.name).join(", ");
  const terrainContext = (clientData.terrainType || "uso misto").toLowerCase();
  const climateContext = (clientData.climateCondition || "condições normais").toLowerCase();

  // Categorizar os acessórios selecionados
  const hasProtection = accessories.some((a) => ["protetor", "friso", "capota"].includes(a.id));
  const hasPerformance = accessories.some((a) => ["pneus", "estribo", "guincho"].includes(a.id));
  const hasUtility = accessories.some((a) => ["rack", "bagageiro", "toolbox", "engate"].includes(a.id));
  const hasTech = accessories.some((a) => ["sensor", "farol", "soleira"].includes(a.id));

  // Construir narrativa baseada nas categorias presentes
  const themes: string[] = [];
  if (hasProtection) themes.push("proteção e conservação");
  if (hasPerformance) themes.push("performance e segurança");
  if (hasUtility) themes.push("versatilidade e praticidade");
  if (hasTech) themes.push("tecnologia e conforto");

  const themeStr = themes.length > 1
    ? themes.slice(0, -1).join(", ") + " e " + themes[themes.length - 1]
    : themes[0] || "proteção completa";

  const headline = `${packageName} — Solução completa de ${themeStr} para o seu ${clientData.vehicleModel}`;

  const narrative = `${prefix} ${firstName}, considerando o uso frequente do seu ${clientData.vehicleModel} em ${terrainContext} na região de ${region}, com ${climateContext}, montamos uma configuração focada em ${themeStr}. O ${packageName} combina ${accessoryNames} em uma solução integrada que protege seu investimento desde o km zero e maximiza a valorização na revenda futura. Tudo instalado por técnicos certificados Mopar com garantia total de fábrica preservada.`;

  const keyBenefits: string[] = [];
  if (hasProtection) keyBenefits.push("Blindagem completa contra desgaste e danos das condições de uso da região");
  if (hasPerformance) keyBenefits.push("Segurança e performance otimizadas para o perfil de rodagem");
  if (hasUtility) keyBenefits.push("Capacidade e versatilidade maximizadas para trabalho e lazer");
  if (hasTech) keyBenefits.push("Tecnologia de ponta para conforto e manobras precisas");
  keyBenefits.push(`Diluição no financiamento: apenas + R$ ${cdcMonthly}/mês sem impacto no caixa`);
  keyBenefits.push("Acessórios genuínos com instalação pela rede autorizada e garantia contratual Mopar");

  const packageClosing = `${prefix} ${firstName}, com o ${packageName} incluído no financiamento por apenas + R$ ${cdcMonthly} ao mês, o senhor sai com o ${clientData.vehicleModel} completo, protegido e valorizado. Posso confirmar a inclusão e programar a instalação para a entrega?`;

  return { headline, narrative, keyBenefits, packageClosing };
};

/**
 * Gera mensagem argumentativa para WhatsApp (não apenas orçamento).
 */
const generateWhatsAppMessage = (
  accessories: Accessory[],
  clientData: ClientData,
  totalValue: number,
  packageNarrative: PackageNarrative,
  source: ClientSource
): string => {
  const firstName = (clientData.clientName || "Cliente").trim().split(" ")[0] || "Cliente";
  const packageName = getPackageName(clientData.vehicleModel);
  const cdcMonthly = (totalValue * 0.0235).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const region = clientData.state?.replace(/\s*\(.*\)/, "") || "sua região";

  const accessoryList = accessories
    .map((a) => {
      const discounted = Math.round(a.price * (1 - a.discountPercent / 100));
      const suffix = a.discountPercent > 0 ? ` *(${a.discountPercent}% OFF)*` : "";
      return `✅ ${a.name} — R$ ${discounted.toLocaleString("pt-BR")}${suffix}`;
    })
    .join("\n");

  // Selecionar os 2 benefícios mais impactantes
  const topBenefits = packageNarrative.keyBenefits.slice(0, 2).map((b) => `• ${b}`).join("\n");

  return (
    `Olá ${firstName}! Tudo bem? 😊\n\n` +
    `Preparei uma configuração exclusiva de acessórios Mopar para o seu *${clientData.vehicleModel}*, ` +
    `pensada especificamente para as condições de uso em *${region}*.\n\n` +
    `📦 *${packageName}*\n${accessoryList}\n\n` +
    `💡 *Por que essa configuração?*\n${topBenefits}\n\n` +
    `💰 *Investimento:* R$ ${totalValue.toLocaleString("pt-BR")} à vista\n` +
    `📊 *No financiamento:* apenas + R$ ${cdcMonthly}/mês diluído nas parcelas\n\n` +
    `🛡️ Acessórios genuínos com instalação pela rede autorizada e garantia contratual Mopar.\n\n` +
    `Posso reservar essa condição e agendar a instalação? Estou à disposição! 🚗`
  );
};

// ─── Public API ────────────────────────────────────────────────────────────────

/**
 * Modo 1 — Preparar a Venda
 * Gera argumentação completa para preparar o vendedor antes da abordagem.
 */
export const generatePrepareRecommendation = (
  accessories: Accessory[],
  clientData: ClientData,
  source: ClientSource
): SellRecommendation => {
  const selectedAccessories = accessories.filter((a) => a.selected);
  const totalValue = selectedAccessories.reduce(
    (sum, a) => sum + Math.round(a.price * (1 - a.discountPercent / 100)),
    0
  );

  const individualArguments = generateIndividualArguments(selectedAccessories, clientData, source);
  const packageNarrative = generatePackageNarrative(selectedAccessories, clientData, totalValue, source);
  const whatsappMessage = generateWhatsAppMessage(selectedAccessories, clientData, totalValue, packageNarrative, source);

  // Score baseado na quantidade de dados disponíveis e relevância
  let confidenceScore = 70;
  if (clientData.clientName) confidenceScore += 5;
  if (clientData.state) confidenceScore += 5;
  if (clientData.terrainType) confidenceScore += 5;
  if (clientData.climateCondition) confidenceScore += 5;
  if (selectedAccessories.length >= 3) confidenceScore += 5;
  if (selectedAccessories.some((a) => a.discountPercent > 0)) confidenceScore += 5;
  confidenceScore = Math.min(98, confidenceScore);

  const sourceMap: Record<string, SellRecommendation["opportunityContext"]> = {
    crm: "crm",
    live: "showroom",
    delivery: "delivery",
    postsale: "postsale",
  };

  return {
    mode: "prepare",
    individualArguments,
    packageNarrative,
    whatsappMessage,
    confidenceScore,
    opportunityContext: sourceMap[source] || "showroom",
  };
};

/**
 * Modo 2 — Recuperar a Venda
 * Gera nova argumentação após recusa, considerando contexto de perda.
 */
export const generateRecoveryRecommendation = (
  accessories: Accessory[],
  clientData: ClientData,
  source: ClientSource,
  recoveryContext: RecoveryContext
): SellRecommendation => {
  const firstName = (clientData.clientName || "Cliente").trim().split(" ")[0] || "Cliente";
  const prefix = clientData.clientGender?.toLowerCase().includes("fem") ? "Sra." : "Sr.";
  const packageName = getPackageName(clientData.vehicleModel);

  // Filtrar acessórios: manter apenas os não recusados + sugerir alternativas
  const remainingAccessories = accessories.filter(
    (a) => a.selected && !recoveryContext.refusedAccessoryIds.includes(a.id)
  );
  const refusedAccessories = accessories.filter(
    (a) => recoveryContext.refusedAccessoryIds.includes(a.id)
  );

  // Recalcular valor com possível desconto extra
  const extraDiscount = recoveryContext.availableDiscount || 0;
  const newTotalValue = remainingAccessories.reduce(
    (sum, a) => sum + Math.round(a.price * (1 - a.discountPercent / 100)),
    0
  );
  const recoveryTotal = Math.max(0, newTotalValue - extraDiscount);

  // Gerar argumentação para itens remanescentes
  const individualArguments = generateIndividualArguments(remainingAccessories, clientData, source);

  // Narrativa de recuperação
  const cdcMonthly = (recoveryTotal * 0.0235).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const refusedNames = refusedAccessories.map((a) => a.name).join(", ");
  const remainingNames = remainingAccessories.map((a) => a.name).join(", ");

  let recoveryNarrative = "";
  if (recoveryContext.lossReason.toLowerCase().includes("preço") || recoveryContext.lossReason.toLowerCase().includes("orçamento")) {
    recoveryNarrative = `${prefix} ${firstName}, entendo que o valor total anterior estava acima do planejado. Reorganizamos o ${packageName} focando nos itens de maior impacto para a sua rotina: ${remainingNames}. Com essa configuração, o investimento fica em R$ ${recoveryTotal.toLocaleString("pt-BR")} — apenas + R$ ${cdcMonthly}/mês no financiamento. Uma proteção essencial por um valor mais acessível.`;
  } else if (recoveryContext.lossReason.toLowerCase().includes("cônjuge") || recoveryContext.lossReason.toLowerCase().includes("sócio") || recoveryContext.lossReason.toLowerCase().includes("consultar")) {
    recoveryNarrative = `${prefix} ${firstName}, preparei uma versão revisada da proposta para facilitar a conversa em casa. Mantivemos os itens de segurança e proteção que mais agregam ao ${clientData.vehicleModel}: ${remainingNames}. O valor ficou em R$ ${recoveryTotal.toLocaleString("pt-BR")} (+ R$ ${cdcMonthly}/mês). Posso enviar essa apresentação pelo WhatsApp para avaliarem juntos?`;
  } else if (recoveryContext.lossReason.toLowerCase().includes("pensar") || recoveryContext.lossReason.toLowerCase().includes("depois")) {
    recoveryNarrative = `${prefix} ${firstName}, tudo bem? Lembrei que o senhor estava avaliando os acessórios do ${clientData.vehicleModel}. Temos uma condição especial válida esta semana para o ${packageName} com ${remainingNames}. O valor com as condições atuais fica em R$ ${recoveryTotal.toLocaleString("pt-BR")} — apenas + R$ ${cdcMonthly}/mês. Vale a pena garantir antes da alteração de tabela.`;
  } else {
    recoveryNarrative = `${prefix} ${firstName}, revisamos a proposta do ${packageName} considerando suas preferências. A nova configuração com ${remainingNames} fica em R$ ${recoveryTotal.toLocaleString("pt-BR")} (+ R$ ${cdcMonthly}/mês no financiamento). Cada item foi mantido por agregar proteção e valor real ao seu ${clientData.vehicleModel}. Posso confirmar?`;
  }

  const packageNarrative: PackageNarrative = {
    headline: `Nova Proposta — ${packageName} (Revisado)`,
    narrative: recoveryNarrative,
    keyBenefits: [
      `Valor otimizado: R$ ${recoveryTotal.toLocaleString("pt-BR")} (economia de R$ ${(recoveryContext.originalProposalValue - recoveryTotal).toLocaleString("pt-BR")})`,
      `Diluição mínima: + R$ ${cdcMonthly}/mês no financiamento`,
      "Itens de maior impacto mantidos para proteção e valorização",
      "Acessórios genuínos com garantia contratual Mopar",
    ],
    packageClosing: `${prefix} ${firstName}, essa configuração revisada mantém a proteção essencial por um investimento menor. Posso confirmar a inclusão?`,
  };

  // WhatsApp de recuperação
  const accessoryList = remainingAccessories
    .map((a) => {
      const discounted = Math.round(a.price * (1 - a.discountPercent / 100));
      return `✅ ${a.name} — R$ ${discounted.toLocaleString("pt-BR")}`;
    })
    .join("\n");

  const whatsappMessage =
    `Olá ${firstName}! Tudo bem? 😊\n\n` +
    `Lembra dos acessórios que conversamos para o seu *${clientData.vehicleModel}*? ` +
    `Revisamos a proposta com condições especiais:\n\n` +
    `📦 *${packageName} (Revisado)*\n${accessoryList}\n\n` +
    (extraDiscount > 0 ? `🔥 *Desconto especial:* - R$ ${extraDiscount.toLocaleString("pt-BR")}\n` : "") +
    `💰 *Novo valor:* R$ ${recoveryTotal.toLocaleString("pt-BR")}\n` +
    `📊 *No financiamento:* apenas + R$ ${cdcMonthly}/mês\n\n` +
    `Essa condição é válida para esta semana. Posso reservar? 🚗`;

  return {
    mode: "recover",
    individualArguments,
    packageNarrative,
    whatsappMessage,
    confidenceScore: Math.min(92, 65 + remainingAccessories.length * 5 + (extraDiscount > 0 ? 10 : 0)),
    opportunityContext: (source === "live" ? "showroom" : source) as SellRecommendation["opportunityContext"],
  };
};

export { contextLabels };
