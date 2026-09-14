import { Accessory, ClientData } from "@/types/accessories";
import { DiscoveryProfile, AccessoryRecommendation, RecommendationTier } from "@/types/salesJourney";
import { getRegionalTelemetryInsight } from "./regionalIntelligence";

export interface AccessoryMetadata {
  id: string;
  compatibleModels: string[]; // ["RAMPAGE", "TORO", "RENEGADE", "COMPASS", "COMMANDER"]
  usageProfiles: string[];
  terrains: string[];
  climates: string[];
  specialNeeds: string[];
  priorities: string[];
  passengers: string[];
  cargoTypes: string[];
  primaryBenefit: string;
  problemSolved: string;
  practicalBenefit: string;
  protectionBenefit: string;
  safetyBenefit: string;
  convenienceBenefit: string;
  locationOnVehicle: string;
  installationHours: number;
  warrantyYears: number;
}

export const ACCESSORY_METADATA_DATABASE: Record<string, AccessoryMetadata> = {
  estribo: {
    id: "estribo",
    compatibleModels: ["RAMPAGE", "TORO", "RENEGADE", "COMPASS", "COMMANDER", "RAM 1500", "RAM 2500", "RAM 3500"],
    usageProfiles: ["cidade", "rodovia", "zona_rural", "uso_misto", "off_road"],
    terrains: ["Predominância Rural / Estradas de Terra", "Uso Misto (Urbano / Rural)", "Trilhas Off-Road / Severo"],
    climates: ["Alta Incidência de Chuvas & Poeira", "Secura Extrema & Particulados de Minério"],
    specialNeeds: ["acesso_facilitado", "protecao_cacamba"],
    priorities: ["praticidade", "seguranca", "conforto", "protecao"],
    passengers: ["criancas", "idosos", "equipe_trabalho"],
    cargoTypes: ["ferramentas", "materiais_profissionais", "cargas_pesadas"],
    primaryBenefit: "Facilita o embarque e desembarque seguro e protege a lateral da carroceria",
    problemSolved: "Dificuldade de acesso devido à altura livre do solo e impactos de cascalho na pintura lateral",
    practicalBenefit: "Apoio antiderrapante largo com capacidade técnica de até 150 kg por pisante",
    protectionBenefit: "Barreira física robusta contra batidas de pedras, cascalhos e portas de outros veículos",
    safetyBenefit: "Prevenção de quedas e escorregões durante chuva ou terreno barrento",
    convenienceBenefit: "Ergonomia diária imediata para crianças e idosos",
    locationOnVehicle: "Soleiras e base lateral das portas",
    installationHours: 1.0,
    warrantyYears: 3,
  },
  protetor: {
    id: "protetor",
    compatibleModels: ["RAMPAGE", "TORO", "RENEGADE", "COMPASS", "COMMANDER", "RAM 1500", "RAM 2500", "RAM 3500"],
    usageProfiles: ["zona_rural", "uso_misto", "off_road", "rodovia"],
    terrains: ["Predominância Rural / Estradas de Terra", "Trilhas Off-Road / Severo", "Uso Misto (Urbano / Rural)"],
    climates: ["Alta Incidência de Chuvas & Poeira", "Secura Extrema & Particulados de Minério"],
    specialNeeds: ["protecao_cacamba", "organizacao_carga"],
    priorities: ["protecao", "seguranca", "valorizacao_revenda"],
    passengers: ["equipe_trabalho", "apenas_motorista"],
    cargoTypes: ["ferramentas", "materiais_profissionais", "cargas_pesadas", "cargas_leves"],
    primaryBenefit: "Blindagem estrutural contra impactos severos no conjunto motriz ou na caçamba",
    problemSolved: "Risco de perfuração de cárter, avaria de câmbio ou riscos e amassados profundos na lata",
    practicalBenefit: "Aço estampado de alta resistência com pintura eletrostática anticorrosiva",
    protectionBenefit: "Proteção total contra pedras pontiagudas, erosões e atrito de cargas abrasivas",
    safetyBenefit: "Evita vazamento súbito de óleo lubrificante que causaria perda total do motor",
    convenienceBenefit: "Manutenção facilitada com janelas técnicas de acesso para troca de filtro",
    locationOnVehicle: "Subchassi inferior dianteiro / Área interna da caçamba",
    installationHours: 0.8,
    warrantyYears: 3,
  },
  bagageiro: {
    id: "bagageiro",
    compatibleModels: ["RENEGADE", "COMPASS", "COMMANDER"],
    usageProfiles: ["rodovia", "uso_misto", "cidade", "zona_rural"],
    terrains: ["100% Urbano / Rodovias Pavimentadas", "Uso Misto (Urbano / Rural)", "Litoral / Areia & Maresia Intensa"],
    climates: ["Alta Incidência de Chuvas & Poeira", "Clima Temperado / Chuvoso Moderado"],
    specialNeeds: ["bagagem_extra", "transporte_bicicletas", "organizacao_carga"],
    priorities: ["praticidade", "conforto", "seguranca"],
    passengers: ["criancas", "idosos", "animais"],
    cargoTypes: ["cargas_leves", "materiais_profissionais"],
    primaryBenefit: "Ampliação de até 450 litros de capacidade de carga com vedação impermeável",
    problemSolved: "Falta de espaço no porta-malas para viagens em família ou transporte de artigos volumosos",
    practicalBenefit: "Abertura bilateral e sistema aerodinâmico silencioso",
    protectionBenefit: "Vedação estanque de classe IP55 que bloqueia chuva torrencial e poeira fina",
    safetyBenefit: "Carga acomodada e travada no teto sem obstruir o campo de visão do retrovisor traseiro",
    convenienceBenefit: "Fechadura centralizada com chave unificada antifurto",
    locationOnVehicle: "Teto do veículo sobre as barras longitudinais / caçamba",
    installationHours: 0.7,
    warrantyYears: 2,
  },
  rack: {
    id: "rack",
    compatibleModels: ["RAMPAGE", "TORO", "RENEGADE", "COMPASS", "COMMANDER", "RAM 1500"],
    usageProfiles: ["rodovia", "uso_misto", "off_road", "cidade"],
    terrains: ["100% Urbano / Rodovias Pavimentadas", "Uso Misto (Urbano / Rural)"],
    climates: ["Alta Incidência de Chuvas & Poeira", "Clima Temperado / Chuvoso Moderado"],
    specialNeeds: ["transporte_bicicletas", "bagagem_extra"],
    priorities: ["praticidade", "estetica", "esportividade"],
    passengers: ["criancas", "animais"],
    cargoTypes: ["cargas_leves"],
    primaryBenefit: "Suporte homologado em alumínio estrutural para maleiros e suportes de bike",
    problemSolved: "Impossibilidade de fixação de equipamentos esportivos e bagageiros de teto",
    practicalBenefit: "Perfil em asa de avião de baixo arrasto e sem zumbido em rodovia",
    protectionBenefit: "Encaixe emborrachado que preserva os trilhos originais sem marcas na pintura",
    safetyBenefit: "Certificação técnica de ancoragem estática de até 75 kg",
    convenienceBenefit: "Instalação por engate rápido com chave Allen codificada",
    locationOnVehicle: "Barras longitudinais de teto ou caçamba",
    installationHours: 0.5,
    warrantyYears: 3,
  },
  capota: {
    id: "capota",
    compatibleModels: ["RAMPAGE", "TORO", "RAM 1500", "RAM 2500", "RAM 3500"],
    usageProfiles: ["cidade", "rodovia", "zona_rural", "uso_misto"],
    terrains: ["Predominância Rural / Estradas de Terra", "Uso Misto (Urbano / Rural)", "100% Urbano / Rodovias Pavimentadas"],
    climates: ["Alta Incidência de Chuvas & Poeira", "Calor Extremo & Radiação Solar Intensa"],
    specialNeeds: ["protecao_cacamba", "seguranca", "organizacao_carga"],
    priorities: ["protecao", "seguranca", "praticidade"],
    passengers: ["equipe_trabalho", "apenas_motorista"],
    cargoTypes: ["ferramentas", "materiais_profissionais", "cargas_leves"],
    primaryBenefit: "Proteção contra intempéries e segurança antifurto do conteúdo da caçamba",
    problemSolved: "Exposição de bagagens à chuva, poeira e furto em paradas urbanas ou rodoviárias",
    practicalBenefit: "Transforma a caçamba aberta em um porta-malas fechado de mais de 900 litros",
    protectionBenefit: "Lona reforçada com trama náutica impermeabilizada ou lâminas de alumínio",
    safetyBenefit: "Travamento acoplado ao acionamento elétrico da tampa traseira",
    convenienceBenefit: "Enrolamento suave com trava de acionamento por botão",
    locationOnVehicle: "Borda superior de caçamba",
    installationHours: 1.2,
    warrantyYears: 2,
  },
  santantonio: {
    id: "santantonio",
    compatibleModels: ["RAMPAGE", "TORO", "RAM 1500"],
    usageProfiles: ["zona_rural", "uso_misto", "off_road"],
    terrains: ["Predominância Rural / Estradas de Terra", "Trilhas Off-Road / Severo"],
    climates: ["Alta Incidência de Chuvas & Poeira"],
    specialNeeds: ["protecao_cacamba", "organizacao_carga"],
    priorities: ["estetica", "protecao", "desempenho"],
    passengers: ["equipe_trabalho"],
    cargoTypes: ["materiais_profissionais", "cargas_pesadas"],
    primaryBenefit: "Reforço estético robusto e ponto de amarração elevado de cargas",
    problemSolved: "Dificuldade de amarrar cargas compridas e proteção contra estilhaço de vidro traseiro",
    practicalBenefit: "Tubo de aço carbono curvado com grade de proteção de vidro traseiro",
    protectionBenefit: "Resguardo do teto e da vigia traseira em manuseio de carga rústica",
    safetyBenefit: "Ancoragem firme para cintas catraca em transporte rural ou profissional",
    convenienceBenefit: "Compatibilidade integral com capotas marítimas homologadas Mopar",
    locationOnVehicle: "Bordas dianteiras da caçamba junto à cabine",
    installationHours: 1.0,
    warrantyYears: 3,
  },
  pneus: {
    id: "pneus",
    compatibleModels: ["RAMPAGE", "TORO", "RENEGADE", "COMPASS", "COMMANDER", "RAM 1500", "RAM 2500", "RAM 3500"],
    usageProfiles: ["zona_rural", "off_road", "uso_misto"],
    terrains: ["Predominância Rural / Estradas de Terra", "Trilhas Off-Road / Severo", "Litoral / Areia & Maresia Intensa"],
    climates: ["Alta Incidência de Chuvas & Poeira", "Secura Extrema & Particulados de Minério"],
    specialNeeds: ["seguranca", "tracao"],
    priorities: ["desempenho", "seguranca", "protecao"],
    passengers: ["equipe_trabalho", "apenas_motorista"],
    cargoTypes: ["cargas_pesadas", "materiais_profissionais"],
    primaryBenefit: "Aderência mecânica superior e flancos reforçados contra cortes e perfurações",
    problemSolved: "Perda de tração em lama, atoleiros, pedras soltas e furos frequentes em estradas de chão",
    practicalBenefit: "Sulcos profundos autolimpantes com expulsão contínua de lama e cascalho",
    protectionBenefit: "Laterais com tripla lona de reforço resistentes a choques em pontas de pedra",
    safetyBenefit: "Redução drástica de hidroplanagem e distâncias de frenagem em piso molhado",
    convenienceBenefit: "Rodar silencioso homologado em asfalto com índice de carga superior",
    locationOnVehicle: "4 rodas e estepe",
    installationHours: 1.5,
    warrantyYears: 5,
  },
  friso: {
    id: "friso",
    compatibleModels: ["RAMPAGE", "TORO", "RENEGADE", "COMPASS", "COMMANDER"],
    usageProfiles: ["cidade", "uso_misto", "rodovia"],
    terrains: ["100% Urbano / Rodovias Pavimentadas", "Uso Misto (Urbano / Rural)"],
    climates: ["Calor Extremo & Radiação Solar Intensa"],
    specialNeeds: ["estacionamento_aberto", "rua"],
    priorities: ["estetica", "protecao", "valorizacao_revenda"],
    passengers: ["criancas", "apenas_motorista"],
    cargoTypes: ["cargas_leves"],
    primaryBenefit: "Proteção perimétrica das portas contra batidas em vagas estreitas de garagem",
    problemSolved: "Pequenos amassados e riscos laterais causados por abertura descuidada de portas vizinhas",
    practicalBenefit: "Poliuretano injetado flexível com acabamento na cor exata da carroceria",
    protectionBenefit: "Absorção elástica de energia de impacto sem transferência de força à lata",
    safetyBenefit: "Preservação da pintura original de fábrica livre de retoques futuros",
    convenienceBenefit: "Instalação sem perfurações com fita estrutural 3M automotiva",
    locationOnVehicle: "Linha de cintura das portas laterais",
    installationHours: 0.5,
    warrantyYears: 3,
  },
  engate: {
    id: "engate",
    compatibleModels: ["RAMPAGE", "TORO", "RENEGADE", "COMPASS", "COMMANDER", "RAM 1500", "RAM 2500", "RAM 3500"],
    usageProfiles: ["zona_rural", "uso_misto", "rodovia", "off_road"],
    terrains: ["Uso Misto (Urbano / Rural)", "Predominância Rural / Estradas de Terra", "Litoral / Areia & Maresia Intensa"],
    climates: ["Alta Incidência de Chuvas & Poeira"],
    specialNeeds: ["reboque", "transporte_bicicletas"],
    priorities: ["praticidade", "seguranca"],
    passengers: ["apenas_motorista", "equipe_trabalho"],
    cargoTypes: ["cargas_pesadas", "ferramentas"],
    primaryBenefit: "Capacidade de tracionar carretas, reboques náuticos e suportes de bicicleta",
    problemSolved: "Incapacidade de tracionar cargas externas pesadas ou jetski/barcos",
    practicalBenefit: "Desenvolvido sob padrões de engenharia com ponteira removível e tomada elétrica completa",
    protectionBenefit: "Fixação direta nas longarinas do chassi sem sobrecarregar a suspensão",
    safetyBenefit: "Atende integralmente às resoluções do CONTRAN sem anular garantia elétrica",
    convenienceBenefit: "Ponteira removível rápida com pino de trava de segurança",
    locationOnVehicle: "Estrutura do chassi traseiro sob o para-choque",
    installationHours: 1.0,
    warrantyYears: 3,
  },
  sensor: {
    id: "sensor",
    compatibleModels: ["RAMPAGE", "TORO", "RENEGADE", "COMPASS", "COMMANDER"],
    usageProfiles: ["cidade", "uso_misto"],
    terrains: ["100% Urbano / Rodovias Pavimentadas"],
    climates: ["Calor Extremo & Radiação Solar Intensa"],
    specialNeeds: ["estacionamento_aberto", "rua"],
    priorities: ["seguranca", "tecnologia", "praticidade"],
    passengers: ["criancas", "idosos"],
    cargoTypes: ["cargas_leves"],
    primaryBenefit: "Detecção perimétrica de pedestres, meio-fios e obstáculos ocultos",
    problemSolved: "Pontos cegos traseiros e risco de colisões em manobras de estacionamento apertadas",
    practicalBenefit: "Sinalização acústica e visual integrada à central multimídia Uconnect",
    protectionBenefit: "Evita arranhões e quebra cara de para-choques em balizas",
    safetyBenefit: "Alerta em frações de segundo sobre crianças ou animais atrás do veículo",
    convenienceBenefit: "Ativação automática ao engatar a marcha ré",
    locationOnVehicle: "Para-choque dianteiro e traseiro",
    installationHours: 1.5,
    warrantyYears: 2,
  },
  toolbox: {
    id: "toolbox",
    compatibleModels: ["RAMPAGE", "TORO", "RAM 1500", "RAM 2500", "RAM 3500"],
    usageProfiles: ["zona_rural", "uso_misto"],
    terrains: ["Predominância Rural / Estradas de Terra", "Trilhas Off-Road / Severo"],
    climates: ["Alta Incidência de Chuvas & Poeira"],
    specialNeeds: ["organizacao_carga", "protecao_cacamba"],
    priorities: ["praticidade", "seguranca"],
    passengers: ["equipe_trabalho"],
    cargoTypes: ["ferramentas", "materiais_profissionais"],
    primaryBenefit: "Caixa metálica selada para armazenamento seguro e organizado de ferramentas",
    problemSolved: "Ferramentas e objetos soltos batendo na caçamba e expostos a furtos",
    practicalBenefit: "Chapa de alumínio naval xadrez com amortecedores a gás na tampa",
    protectionBenefit: "Vedação contra água e lama mantendo ferramentas secas e sem ferrugem",
    safetyBenefit: "Fechadura com chave reforçada e ancoragem parafusada no assoalho",
    convenienceBenefit: "Divisórias internas modulares para organização rápida",
    locationOnVehicle: "Fundo da caçamba atrás da cabine",
    installationHours: 0.8,
    warrantyYears: 3,
  },
  guincho: {
    id: "guincho",
    compatibleModels: ["RENEGADE", "COMPASS", "RAMPAGE"],
    usageProfiles: ["off_road", "zona_rural"],
    terrains: ["Trilhas Off-Road / Severo", "Predominância Rural / Estradas de Terra"],
    climates: ["Alta Incidência de Chuvas & Poeira"],
    specialNeeds: ["reboque"],
    priorities: ["seguranca", "desempenho"],
    passengers: ["apenas_motorista"],
    cargoTypes: ["cargas_pesadas"],
    primaryBenefit: "Kit autêntico de resgate Trail Rated para atoleiros e terrenos críticos",
    problemSolved: "Falta de ponto seguro de ancoragem para desencalhe em trilhas e expedições",
    practicalBenefit: "Aço forjado de alta tenacidade com capacidade nominal de até 4 toneladas",
    protectionBenefit: "Evita deformações perigosas no monobloco por puxões em pontos impróprios",
    safetyBenefit: "Homologado para resgates seguros sem ruptura súbita de material",
    convenienceBenefit: "Pintura vermelha ou bronze de alta visibilidade e engate rápido",
    locationOnVehicle: "Longarinas frontais e traseiras",
    installationHours: 0.6,
    warrantyYears: 5,
  },
  farol: {
    id: "farol",
    compatibleModels: ["RAMPAGE", "TORO", "RENEGADE", "RAM 1500", "RAM 2500", "RAM 3500"],
    usageProfiles: ["zona_rural", "off_road"],
    terrains: ["Predominância Rural / Estradas de Terra", "Trilhas Off-Road / Severo"],
    climates: ["Alta Incidência de Chuvas & Poeira", "Secura Extrema & Particulados de Minério"],
    specialNeeds: ["iluminacao_adicional"],
    priorities: ["seguranca", "desempenho"],
    passengers: ["apenas_motorista", "equipe_trabalho"],
    cargoTypes: ["ferramentas"],
    primaryBenefit: "Iluminação de longo alcance e facho amplo para estradas noturnas sem iluminação",
    problemSolved: "Baixa visibilidade noturna em trechos rurais com animais na pista e valetas",
    practicalBenefit: "LEDs automotivos Cree de alta luminosidade com baixo consumo elétrico",
    protectionBenefit: "Lentes de policarbonato à prova de pedras e carcaça de alumínio blindada",
    safetyBenefit: "Antecipação de obstáculos e desníveis a mais de 300 metros de distância",
    convenienceBenefit: "Chave interna discreta integrada ao painel com chicote original",
    locationOnVehicle: "Grade dianteira ou barra de teto",
    installationHours: 1.2,
    warrantyYears: 3,
  },
  soleira: {
    id: "soleira",
    compatibleModels: ["COMPASS", "RENEGADE", "COMMANDER", "RAMPAGE"],
    usageProfiles: ["cidade", "uso_misto"],
    terrains: ["100% Urbano / Rodovias Pavimentadas"],
    climates: ["Clima Temperado / Chuvoso Moderado"],
    specialNeeds: ["acesso_facilitado"],
    priorities: ["estetica", "conforto"],
    passengers: ["criancas", "idosos"],
    cargoTypes: ["cargas_leves"],
    primaryBenefit: "Iluminação de boas-vindas com proteção do verniz nas soleiras de porta",
    problemSolved: "Riscos causados por calçados e salto alto no assoalho ao embarcar",
    practicalBenefit: "Aço escovado com grafia do veículo retroiluminada em LED branco",
    protectionBenefit: "Blindagem do batente metálico contra marcas irreversíveis de sola",
    safetyBenefit: "Iluminação auxiliar do piso ao abrir a porta em locais escuros",
    convenienceBenefit: "Alimentação sem fio por baterias de longa duração e indução magnética",
    locationOnVehicle: "Soleira das 4 portas",
    installationHours: 0.5,
    warrantyYears: 2,
  },
  tapete_borracha: {
    id: "tapete_borracha",
    compatibleModels: ["RAMPAGE", "TORO", "RENEGADE", "COMPASS", "COMMANDER", "RAM 1500", "RAM 2500", "RAM 3500"],
    usageProfiles: ["cidade", "rodovia", "zona_rural", "uso_misto", "off_road", "litoral"],
    terrains: ["Predominância Rural / Estradas de Terra", "Trilhas Off-Road / Severo", "Uso Misto (Urbano / Rural)", "Litoral / Areia & Maresia Intensa"],
    climates: ["Alta Incidência de Chuvas & Poeira", "Secura Extrema & Particulados de Minério"],
    specialNeeds: ["protecao_cacamba", "organizacao_carga"],
    priorities: ["praticidade", "protecao", "conforto"],
    passengers: ["criancas", "animais", "equipe_trabalho"],
    cargoTypes: ["ferramentas", "cargas_leves"],
    primaryBenefit: "Proteção total do carpete com bordas elevadas que retêm líquidos, lama e areia",
    problemSolved: "Sujeira irreversível, mau cheiro e umidade no assoalho original do veículo",
    practicalBenefit: "Lavagem rápida com água e sabão e secagem imediata",
    protectionBenefit: "Borda tipo bandeja que impede vazamentos para o carpete",
    safetyBenefit: "Travas de fixação originais que impedem o deslizamento sob os pedais",
    convenienceBenefit: "Encaixe milimétrico 3D específico para o assoalho do modelo",
    locationOnVehicle: "Assoalho dianteiro e traseiro",
    installationHours: 0.2,
    warrantyYears: 3,
  },
  parafuso_antifurto: {
    id: "parafuso_antifurto",
    compatibleModels: ["RAMPAGE", "TORO", "RENEGADE", "COMPASS", "COMMANDER", "RAM 1500", "RAM 2500", "RAM 3500"],
    usageProfiles: ["cidade", "rodovia", "uso_misto"],
    terrains: ["100% Urbano / Rodovias Pavimentadas", "Uso Misto (Urbano / Rural)"],
    climates: ["Calor Extremo & Radiação Solar Intensa"],
    specialNeeds: ["rua", "estacionamento_aberto"],
    priorities: ["seguranca", "protecao", "praticidade"],
    passengers: ["apenas_motorista"],
    cargoTypes: ["cargas_leves"],
    primaryBenefit: "Proteção mecânica antifurto das 4 rodas de liga leve e estepe com segredo único",
    problemSolved: "Risco de furto de rodas e pneus em estacionamentos de rua ou shoppings",
    practicalBenefit: "Chave codificada exclusiva com milhares de combinações possíveis",
    protectionBenefit: "Cabeça giratória cônica de aço temperado que impede ferramentas convencionais",
    safetyBenefit: "Homologado pelas seguradoras com padrão de aperto e balanceamento original",
    convenienceBenefit: "Chave adaptadora compacta guardada junto às ferramentas de bordo",
    locationOnVehicle: "Cubos de roda",
    installationHours: 0.3,
    warrantyYears: 3,
  },
  pelicula_solar: {
    id: "pelicula_solar",
    compatibleModels: ["RAMPAGE", "TORO", "RENEGADE", "COMPASS", "COMMANDER", "RAM 1500", "RAM 2500", "RAM 3500"],
    usageProfiles: ["cidade", "rodovia", "uso_misto", "zona_rural"],
    terrains: ["100% Urbano / Rodovias Pavimentadas", "Uso Misto (Urbano / Rural)", "Litoral / Areia & Maresia Intensa"],
    climates: ["Calor Extremo & Radiação Solar Intensa", "Alta Incidência de Chuvas & Poeira", "Secura Extrema & Particulados de Minério", "Clima Temperado / Chuvoso Moderado"],
    specialNeeds: ["acesso_facilitado", "organizacao_carga"],
    priorities: ["conforto", "protecao", "seguranca", "estetica"],
    passengers: ["criancas", "idosos", "animais", "apenas_motorista", "equipe_trabalho"],
    cargoTypes: ["cargas_leves"],
    primaryBenefit: "Redução de até 60% da energia solar térmica com proteção de 99% contra raios UV",
    problemSolved: "Superaquecimento da cabine, degradação do painel/bancos e desconforto térmico de passageiros",
    practicalBenefit: "Camada nano-cerâmica de alta visibilidade óptica sem interferência no sinal de GPS ou celular",
    protectionBenefit: "Barreira contra desbotamento prematuro do couro e ressecamento dos plásticos internos",
    safetyBenefit: "Retenção de estilhaços de vidro em tentativas de intrusão ou colisões laterais",
    convenienceBenefit: "Maior eficiência do ar-condicionado com economia de combustível e temperatura agradável",
    locationOnVehicle: "Vidros laterais dianteiros, traseiros e vigia",
    installationHours: 1.5,
    warrantyYears: 5,
  },
  iluminacao_led: {
    id: "iluminacao_led",
    compatibleModels: ["RAMPAGE", "TORO", "RENEGADE", "COMPASS", "COMMANDER", "RAM 1500", "RAM 2500", "RAM 3500"],
    usageProfiles: ["cidade", "rodovia", "uso_misto", "zona_rural"],
    terrains: ["100% Urbano / Rodovias Pavimentadas", "Uso Misto (Urbano / Rural)"],
    climates: ["Clima Temperado / Chuvoso Moderado", "Calor Extremo & Radiação Solar Intensa"],
    specialNeeds: ["iluminacao_adicional", "organizacao_carga"],
    priorities: ["estetica", "conforto", "tecnologia"],
    passengers: ["criancas", "idosos", "animais", "equipe_trabalho"],
    cargoTypes: ["cargas_leves"],
    primaryBenefit: "Iluminação ambiente premium de alta fidelidade óptica para teto, portas e assoalho",
    problemSolved: "Visibilidade precária da cabine à noite e dificuldade de localizar objetos no interior",
    practicalBenefit: "LEDs de baixo consumo energético que substituem lâmpadas halógenas incandescentes",
    protectionBenefit: "Chicotes elétricos originais homologados sem corte de fios ou sobrecarga no sistema BCM",
    safetyBenefit: "Luz de cortesia de desembarque que sinaliza a abertura de portas para outros motoristas",
    convenienceBenefit: "Ativação inteligente sincronizada com o destravamento e abertura das portas",
    locationOnVehicle: "Plafoniers de teto, console central, portas e área de pés",
    installationHours: 0.8,
    warrantyYears: 3,
  },
  organizador_console: {
    id: "organizador_console",
    compatibleModels: ["RAMPAGE", "TORO", "RENEGADE", "COMPASS", "COMMANDER"],
    usageProfiles: ["cidade", "rodovia", "uso_misto"],
    terrains: ["100% Urbano / Rodovias Pavimentadas", "Uso Misto (Urbano / Rural)"],
    climates: ["Clima Temperado / Chuvoso Moderado"],
    specialNeeds: ["organizacao_carga"],
    priorities: ["praticidade", "conforto", "estetica"],
    passengers: ["apenas_motorista", "equipe_trabalho"],
    cargoTypes: ["cargas_leves", "ferramentas"],
    primaryBenefit: "Divisórias modulares milimétricas para aproveitamento integral do console central",
    problemSolved: "Desordem na cabine com celulares, chaves, moedas e cabos soltos durante a condução",
    practicalBenefit: "Bandejas removíveis com fundo emborrachado antirruído",
    protectionBenefit: "Preservação da forração interna do console contra riscos e vazamento de líquidos",
    safetyBenefit: "Objetos mantidos seguros sem risco de rolarem para baixo dos pedais em frenagens",
    convenienceBenefit: "Passagem integrada para cabos USB de carregamento rápido de smartphones",
    locationOnVehicle: "Compartimento central sob o apoio de braço dianteiro",
    installationHours: 0.1,
    warrantyYears: 2,
  },
  capa_banco: {
    id: "capa_banco",
    compatibleModels: ["COMPASS", "RENEGADE", "RAMPAGE", "TORO"],
    usageProfiles: ["cidade", "zona_rural", "uso_misto", "off_road"],
    terrains: ["Predominância Rural / Estradas de Terra", "Uso Misto (Urbano / Rural)", "Litoral / Areia & Maresia Intensa"],
    climates: ["Alta Incidência de Chuvas & Poeira", "Calor Extremo & Radiação Solar Intensa"],
    specialNeeds: ["protecao_cacamba", "organizacao_carga"],
    priorities: ["protecao", "conforto", "valorizacao_revenda"],
    passengers: ["criancas", "animais", "equipe_trabalho"],
    cargoTypes: ["ferramentas", "cargas_leves"],
    primaryBenefit: "Revestimento sob medida que protege o estofamento original contra sujeira, líquidos e desgaste",
    problemSolved: "Manchas irreversíveis causadas por crianças, pets, suor ou areia nos bancos originais",
    practicalBenefit: "Material sintético impermeável de fácil higienização com pano úmido",
    protectionBenefit: "Blindagem do tecido e espumas originais mantendo o valor de revenda do veículo",
    safetyBenefit: "Costuras programadas homologadas para abertura sem obstrução dos airbags laterais",
    convenienceBenefit: "Encaixe anatômico com elásticos e presilhas ocultas sem folgas ou rugas",
    locationOnVehicle: "Bancos dianteiros e traseiros",
    installationHours: 1.0,
    warrantyYears: 3,
  },
  protetor_porta_int: {
    id: "protetor_porta_int",
    compatibleModels: ["COMPASS", "RENEGADE", "RAMPAGE", "TORO"],
    usageProfiles: ["cidade", "uso_misto", "rodovia"],
    terrains: ["100% Urbano / Rodovias Pavimentadas", "Uso Misto (Urbano / Rural)"],
    climates: ["Clima Temperado / Chuvoso Moderado"],
    specialNeeds: ["acesso_facilitado"],
    priorities: ["protecao", "estetica", "valorizacao_revenda"],
    passengers: ["criancas", "animais", "idosos"],
    cargoTypes: ["cargas_leves"],
    primaryBenefit: "Película protetora transparente ou texturizada nas forrações internas de porta",
    problemSolved: "Arranhões de sola de calçado e marcas de chute na parte plástica interna das portas",
    practicalBenefit: "Polímero autotermoplástico que absorve atritos mecânicos de calçados",
    protectionBenefit: "Evita aspecto esbranquiçado e desgastado no plástico inferior das portas",
    safetyBenefit: "Acabamento não refletivo e seguro sem descolamento em calor extremo",
    convenienceBenefit: "Limpeza facilitada e substituição rápida sem resíduos de adesivo",
    locationOnVehicle: "Painéis inferiores internos das 4 portas",
    installationHours: 0.4,
    warrantyYears: 3,
  },
  tapete_logomania: {
    id: "tapete_logomania",
    compatibleModels: ["COMPASS", "RENEGADE", "RAMPAGE", "TORO"],
    usageProfiles: ["cidade", "rodovia", "uso_misto"],
    terrains: ["100% Urbano / Rodovias Pavimentadas", "Uso Misto (Urbano / Rural)"],
    climates: ["Clima Temperado / Chuvoso Moderado"],
    specialNeeds: ["organizacao_carga"],
    priorities: ["estetica", "conforto", "valorizacao_revenda"],
    passengers: ["criancas", "idosos", "apenas_motorista"],
    cargoTypes: ["cargas_leves"],
    primaryBenefit: "Tapetes em carpete de alta gramatura com grafia 3D em relevo e acabamento bordado",
    problemSolved: "Falta de refinamento visual e desgaste acelerado do assoalho original",
    practicalBenefit: "Toque macio aveludado e isolamento acústico superior de ruído de rolagem",
    protectionBenefit: "Base emborrachada pinada antiderrapante com reforço no calcanhar do motorista",
    safetyBenefit: "Ilhoses de fixação originais que mantêm o tapete 100% travado longe dos pedais",
    convenienceBenefit: "Design exclusivo e acabamento nobre que complementa a estética interior",
    locationOnVehicle: "Assoalho dianteiro e traseiro",
    installationHours: 0.1,
    warrantyYears: 3,
  },
};

export function isAccessoryTechnicallyCompatible(accessoryId: string, vehicleModel: string): boolean {
  const meta = ACCESSORY_METADATA_DATABASE[accessoryId];
  if (!meta) return true;
  const upperModel = vehicleModel.toUpperCase();
  return meta.compatibleModels.some((m) => upperModel.includes(m));
}

export function calculateAccessoryMatchScore(
  accessory: Accessory,
  clientData: ClientData,
  discovery: DiscoveryProfile
): {
  score: number;
  reason: string;
  relatedAnswers: string[];
  problemSolved: string;
  benefitDelivered: string;
  regionalInfluence: string;
  hasExplicitDemandMatch: boolean;
  explicitDemandLabel?: string;
} {
  const meta = ACCESSORY_METADATA_DATABASE[accessory.id];
  const relatedAnswers: string[] = [];

  // Compatibilidade técnica obrigatória
  if (!isAccessoryTechnicallyCompatible(accessory.id, clientData.vehicleModel)) {
    return {
      score: 0,
      reason: "Incompatível tecnicamente com este modelo de veículo.",
      relatedAnswers: [],
      problemSolved: "N/A",
      benefitDelivered: "N/A",
      regionalInfluence: "N/A",
      hasExplicitDemandMatch: false,
    };
  }

  if (!meta) {
    return {
      score: 60,
      reason: "Item original homologado Mopar para valorização do conjunto.",
      relatedAnswers: ["Compatibilidade de catálogo"],
      problemSolved: "Personalização original de fábrica",
      benefitDelivered: accessory.description,
      regionalInfluence: "Padrão Brasil",
      hasExplicitDemandMatch: false,
    };
  }

  // 0. Demanda Explícita Direta do Cliente (Prioridade Absoluta IA)
  let explicitDemandBonus = 0;
  let hasExplicitDemandMatch = false;
  let explicitDemandLabel: string | undefined = undefined;

  if (discovery.specialNeeds.includes("reboque") && (accessory.id === "engate" || meta.specialNeeds.includes("reboque"))) {
    explicitDemandBonus = 45;
    hasExplicitDemandMatch = true;
    explicitDemandLabel = "Necessidade Direta: Reboque / Carreta";
    relatedAnswers.unshift("🎯 Demanda Primária: Reboque / Carreta");
  } else if (discovery.specialNeeds.includes("bagagem_extra") && (accessory.id === "bagageiro" || accessory.id === "rack" || meta.specialNeeds.includes("bagagem_extra"))) {
    explicitDemandBonus = 45;
    hasExplicitDemandMatch = true;
    explicitDemandLabel = "Necessidade Direta: Bagagem Extra";
    relatedAnswers.unshift("🎯 Demanda Primária: Bagagem Extra");
  } else if (discovery.specialNeeds.includes("transporte_bicicletas") && (accessory.id === "rack" || accessory.id === "engate")) {
    explicitDemandBonus = 40;
    hasExplicitDemandMatch = true;
    explicitDemandLabel = "Necessidade Direta: Transporte de Bicicletas";
    relatedAnswers.unshift("🎯 Demanda Primária: Suporte de Bikes");
  } else if (discovery.specialNeeds.includes("protecao_cacamba") && (accessory.id === "capota" || accessory.id === "protetor" || accessory.id === "santantonio")) {
    explicitDemandBonus = 35;
    hasExplicitDemandMatch = true;
    explicitDemandLabel = "Necessidade Direta: Proteção de Caçamba";
    relatedAnswers.unshift("🎯 Demanda Primária: Proteção de Caçamba");
  } else if (discovery.specialNeeds.includes("acesso_facilitado") && (accessory.id === "estribo" || accessory.id === "soleira")) {
    explicitDemandBonus = 35;
    hasExplicitDemandMatch = true;
    explicitDemandLabel = "Necessidade Direta: Acesso Facilitado";
    relatedAnswers.unshift("🎯 Demanda Primária: Acesso Fácil");
  } else if (discovery.specialNeeds.includes("iluminacao_adicional") && accessory.id === "farol") {
    explicitDemandBonus = 40;
    hasExplicitDemandMatch = true;
    explicitDemandLabel = "Necessidade Direta: Iluminação Extra";
    relatedAnswers.unshift("🎯 Demanda Primária: Iluminação Noturna");
  } else if (discovery.specialNeeds.includes("organizacao_carga") && (accessory.id === "toolbox" || accessory.id === "bagageiro" || accessory.id === "tapete_borracha" || accessory.id === "organizador_console")) {
    explicitDemandBonus = 40;
    hasExplicitDemandMatch = true;
    explicitDemandLabel = "Necessidade Direta: Organização da Cabine / Carga";
    relatedAnswers.unshift("🎯 Demanda Primária: Organização");
  } else if (discovery.priorities.includes("conforto") && (accessory.id === "pelicula_solar" || accessory.id === "iluminacao_led" || accessory.id === "capa_banco")) {
    explicitDemandBonus = 35;
    hasExplicitDemandMatch = true;
    explicitDemandLabel = "Necessidade Direta: Conforto Interno da Cabine";
    relatedAnswers.unshift("🛋️ Foco Consultivo: Conforto & Climatização");
  } else if ((discovery.frequentPassengers.includes("criancas") || discovery.frequentPassengers.includes("animais")) && (accessory.id === "capa_banco" || accessory.id === "protetor_porta_int" || accessory.id === "pelicula_solar")) {
    explicitDemandBonus = 35;
    hasExplicitDemandMatch = true;
    explicitDemandLabel = "Necessidade Direta: Proteção para Crianças e Família";
    relatedAnswers.unshift("👶 Proteção Familiar & Pets");
  }

  // 1. Utilização declarada (30 pontos máx)
  let usageScore = 15;
  if (meta.usageProfiles.includes(discovery.usageLocation)) {
    usageScore = 30;
    relatedAnswers.push(`Uso frequente: ${discovery.usageLocation.replace("_", " ").toUpperCase()}`);
  }

  // 2. Terreno e clima (25 pontos máx)
  let terrainScore = 10;
  const hasTerrainMatch =
    (discovery.dirtRoadFrequency !== "nunca" && meta.terrains.some((t) => t.includes("Rural") || t.includes("Misto"))) ||
    (discovery.dirtRoadFrequency === "diariamente" && meta.terrains.some((t) => t.includes("Severo")));
  if (hasTerrainMatch) {
    terrainScore = 25;
    relatedAnswers.push(`Frequência de terra: ${discovery.dirtRoadFrequency.toUpperCase()}`);
  }

  // 3. Prioridades (20 pontos máx)
  let priorityScore = 5;
  const matchedPriorities = discovery.priorities.filter((p) => meta.priorities.includes(p));
  if (matchedPriorities.length >= 2) {
    priorityScore = 20;
    relatedAnswers.push(`Prioridades: ${matchedPriorities.join(", ")}`);
  } else if (matchedPriorities.length === 1) {
    priorityScore = 12;
    relatedAnswers.push(`Prioridade: ${matchedPriorities[0]}`);
  }

  // 4. Carga, passageiros e viagens (15 pontos máx)
  let passengersCargoScore = 5;
  const hasPassengerMatch = discovery.frequentPassengers.some((p) => meta.passengers.includes(p));
  const hasCargoMatch = meta.cargoTypes.includes(discovery.cargoUsage);

  if (hasPassengerMatch || hasCargoMatch) {
    passengersCargoScore = 15;
    if (hasPassengerMatch) {
      relatedAnswers.push(`Transporte frequente: ${discovery.frequentPassengers.join(", ")}`);
    }
    if (hasCargoMatch && discovery.cargoUsage !== "nao") {
      relatedAnswers.push(`Carga: ${discovery.cargoUsage.replace("_", " ")}`);
    }
  }

  // 5. Inteligência Regional (10 pontos máx)
  let regionalScore = 5;
  const regionalInsight = getRegionalTelemetryInsight(
    clientData.state,
    clientData.terrainType || "",
    clientData.climateCondition || "",
    clientData.vehicleModel
  );
  const focusSummary = regionalInsight?.packageName || regionalInsight?.macroRegion || "Proteção e Conforto";
  const regionalInfluence = `Região ${clientData.state}: foco em ${focusSummary}`;
  if (focusSummary.toLowerCase().includes("proteção") && meta.priorities.includes("protecao")) {
    regionalScore = 10;
  } else if (focusSummary.toLowerCase().includes("praticidade") && meta.priorities.includes("praticidade")) {
    regionalScore = 10;
  }

  const baseCalculatedScore = usageScore + terrainScore + priorityScore + passengersCargoScore + regionalScore;
  const finalScore = Math.min(100, Math.round(baseCalculatedScore * (hasExplicitDemandMatch ? 0.65 : 1) + explicitDemandBonus));

  // Síntese da razão consultiva
  const reason = hasExplicitDemandMatch && explicitDemandLabel
    ? `Item priorizado pela inteligência da plataforma para atender diretamente à ${explicitDemandLabel.replace("Necessidade Direta: ", "")} declarada pelo cliente. ${meta.problemSolved}.`
    : `Recomendado para o perfil de ${clientData.clientName || "cliente"} com ${discovery.usageLocation.replace("_", " ")} e ${discovery.dirtRoadFrequency !== "nunca" ? `estradas de terra (${discovery.dirtRoadFrequency})` : "rodovias"}. ${meta.problemSolved}.`;

  return {
    score: finalScore,
    reason,
    relatedAnswers,
    problemSolved: meta.problemSolved,
    benefitDelivered: meta.primaryBenefit,
    regionalInfluence,
    hasExplicitDemandMatch,
    explicitDemandLabel,
  };
}

export function generateRecommendations(
  availableAccessories: Accessory[],
  clientData: ClientData,
  discovery: DiscoveryProfile
): AccessoryRecommendation[] {
  // 1. Filtrar compatibilidade técnica e calcular pontuação
  const evaluated = availableAccessories
    .filter((acc) => isAccessoryTechnicallyCompatible(acc.id, clientData.vehicleModel))
    .map((accessory) => {
      const match = calculateAccessoryMatchScore(accessory, clientData, discovery);
      return {
        accessoryId: accessory.id,
        accessory,
        matchScore: match.score,
        reason: match.reason,
        relatedAnswers: match.relatedAnswers,
        problemSolved: match.problemSolved,
        benefitDelivered: match.benefitDelivered,
        regionalInfluence: match.regionalInfluence,
        hasExplicitDemandMatch: match.hasExplicitDemandMatch,
        explicitDemandLabel: match.explicitDemandLabel,
      };
    })
    // Ordenação inteligente:
    // 1º itens com demanda explícita declarada pelo cliente
    // 2º score decrescente
    .sort((a, b) => {
      if (a.hasExplicitDemandMatch && !b.hasExplicitDemandMatch) return -1;
      if (!a.hasExplicitDemandMatch && b.hasExplicitDemandMatch) return 1;
      return b.matchScore - a.matchScore;
    });

  // 2. Classificar em cotas determinísticas:
  // - Até 3 essenciais (priorizando demandas explícitas ou score >= 75)
  // - Até 3 recomendados (score >= 50)
  // - Até 2 complementares (restantes com melhor pontuação do catálogo)
  const results: AccessoryRecommendation[] = [];
  let essentialCount = 0;
  let recommendedCount = 0;
  let complementaryCount = 0;

  for (const item of evaluated) {
    let tier: RecommendationTier;

    if (essentialCount < 3 && (item.hasExplicitDemandMatch || item.matchScore >= 70)) {
      tier = "essential";
      essentialCount++;
    } else if (recommendedCount < 3 && item.matchScore >= 45) {
      tier = "recommended";
      recommendedCount++;
    } else if (complementaryCount < 2) {
      tier = "complementary";
      complementaryCount++;
    } else {
      continue;
    }

    results.push({
      ...item,
      tier,
    });
  }

  return results;
}
