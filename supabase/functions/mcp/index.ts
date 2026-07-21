// MCP Server for Smart-Sell
// Implements MCP Streamable HTTP protocol (JSON-RPC 2.0)
// Public server — no authentication required
// Spec: https://modelcontextprotocol.io/specification/2025-06-18/basic/transports

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, mcp-session-id, mcp-protocol-version",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS, DELETE",
  "Access-Control-Expose-Headers": "mcp-session-id",
};

// =============================================================================
// DATA: mirrored from src/types/accessories.ts and src/lib/salesKnowledge.ts
// =============================================================================

type StockStatus = "available" | "dormant" | "obsolete";

interface Accessory {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  selected: boolean;
  stockStatus: StockStatus;
  stockDays: number;
  discountPercent: number;
}

function getStockInfo(days: number): { status: StockStatus; discount: number; label: string } {
  if (days > 365) {
    return {
      status: "obsolete",
      discount: Math.min(35, 25 + Math.floor((days - 365) / 60) * 3),
      label: "Estoque Obsoleto",
    };
  }
  if (days > 180) {
    return {
      status: "dormant",
      discount: Math.min(20, 10 + Math.floor((days - 180) / 30) * 2),
      label: "Estoque Dormente",
    };
  }
  return { status: "available", discount: 0, label: "Disponível" };
}

function acc(
  id: string,
  name: string,
  description: string,
  price: number,
  icon: string,
  selected: boolean,
  stockDays: number,
): Accessory {
  const info = getStockInfo(stockDays);
  return {
    id,
    name,
    description,
    price,
    icon,
    selected,
    stockStatus: info.status,
    stockDays,
    discountPercent: info.discount,
  };
}

const accessoriesByVehicle: Record<string, Accessory[]> = {
  "RAM RAMPAGE REBEL": [
    acc("estribo", "Estribo Lateral Premium", "Acesso facilitado e proteção lateral", 2500, "🚗", true, 45),
    acc("protetor", "Protetor de Caçamba HD", "Proteção contra riscos e impactos", 1200, "🛡️", true, 210),
    acc("pneus", "Pneus All-Terrain 265/70R16", "Tração superior em qualquer terreno", 4800, "⚙️", true, 30),
    acc("friso", "Friso Lateral Cromado", "Proteção e estética refinada", 450, "✨", true, 400),
    acc("santantonio", "Santo Antônio Esportivo", "Proteção e estilo para sua pickup", 1800, "🏋️", false, 190),
    acc("capota", "Capota Marítima Retrátil", "Proteção total da caçamba", 3200, "🔒", false, 60),
  ],
  "RAM RAMPAGE LARAMIE": [
    acc("estribo", "Estribo Lateral Premium", "Acesso facilitado e proteção lateral", 2500, "🚗", true, 120),
    acc("protetor", "Protetor de Caçamba HD", "Proteção contra riscos e impactos", 1200, "🛡️", true, 380),
    acc("pneus", "Pneus Highway 265/65R17", "Conforto e durabilidade no asfalto", 3800, "⚙️", true, 15),
    acc("friso", "Friso Lateral Cromado", "Proteção e estética refinada", 450, "✨", true, 250),
    acc("capota", "Capota Rígida Elétrica", "Abertura automática premium", 5500, "🔒", false, 90),
  ],
  "RAM 1500 LARAMIE": [
    acc("estribo", "Estribo Lateral Elétrico", "Acesso automatizado premium", 4500, "🚗", true, 60),
    acc("protetor", "Protetor de Caçamba Spray-On", "Proteção permanente profissional", 2800, "🛡️", true, 200),
    acc("pneus", "Pneus All-Terrain 275/65R18", "Performance em todos os terrenos", 6200, "⚙️", true, 25),
    acc("santantonio", "Santo Antônio Off-Road", "Proteção e estilo esportivo", 3200, "🏋️", true, 420),
    acc("capota", "Capota Rígida Tri-Fold", "Abertura em três partes", 4800, "🔒", false, 150),
  ],
  "RAM 2500 LARAMIE": [
    acc("estribo", "Estribo Lateral Elétrico", "Acesso automatizado premium", 4800, "🚗", true, 90),
    acc("protetor", "Protetor de Caçamba Heavy Duty", "Para cargas pesadas", 3200, "🛡️", true, 300),
    acc("pneus", "Pneus LT275/70R18", "Carga extra e durabilidade", 7500, "⚙️", true, 40),
    acc("engate", "Engate de Reboque 5ª Roda", "Para reboques pesados", 5200, "🔗", true, 500),
    acc("farol", "Kit Faróis Auxiliares LED", "Iluminação off-road potente", 2800, "💡", false, 185),
  ],
  "RAM 3500 LARAMIE": [
    acc("estribo", "Estribo Lateral Elétrico", "Acesso automatizado premium", 4800, "🚗", true, 75),
    acc("protetor", "Protetor de Caçamba Industrial", "Máxima resistência a impactos", 3800, "🛡️", true, 220),
    acc("pneus", "Pneus LT285/75R17", "Máxima capacidade de carga", 8200, "⚙️", true, 50),
    acc("engate", "Engate Gooseneck", "Para reboques especiais", 4500, "🔗", true, 365),
    acc("toolbox", "Caixa de Ferramentas Embutida", "Armazenamento profissional", 2200, "🧰", false, 450),
  ],
  "FIAT TORO RANCH": [
    acc("estribo", "Estribo Lateral Tubular", "Design esportivo e funcional", 1800, "🚗", true, 100),
    acc("protetor", "Protetor de Caçamba", "Proteção contra riscos", 850, "🛡️", true, 350),
    acc("pneus", "Pneus All-Terrain 225/65R17", "Tração em diversos terrenos", 3200, "⚙️", true, 20),
    acc("santantonio", "Santo Antônio Cromado", "Estilo e proteção", 1500, "🏋️", true, 195),
    acc("capota", "Capota Marítima", "Proteção flexível da caçamba", 1200, "🔒", false, 270),
  ],
  "FIAT TORO ULTRA": [
    acc("estribo", "Estribo Lateral Premium", "Design urbano sofisticado", 2200, "🚗", true, 80),
    acc("protetor", "Protetor de Caçamba", "Proteção contra riscos", 850, "🛡️", true, 290),
    acc("pneus", "Pneus Highway 225/55R18", "Conforto e economia", 2800, "⚙️", true, 35),
    acc("friso", "Friso Lateral na Cor do Veículo", "Visual integrado", 650, "✨", true, 410),
    acc("capota", "Capota Rígida Elétrica", "Abertura automática", 4200, "🔒", false, 55),
  ],
  "JEEP COMPASS TRAILHAWK": [
    acc("estribo", "Estribo Lateral Off-Road", "Para trilhas extremas", 2800, "🚗", true, 110),
    acc("protetor", "Protetor de Carter", "Proteção do motor", 1500, "🛡️", true, 240),
    acc("pneus", "Pneus All-Terrain 225/60R17", "Máxima tração off-road", 3600, "⚙️", true, 45),
    acc("rack", "Rack de Teto Travessa", "Transporte de equipamentos", 1200, "📦", true, 370),
    acc("guincho", "Kit Guincho Dianteiro", "Recuperação em trilhas", 4500, "⚓", false, 200),
  ],
  "JEEP COMMANDER OVERLAND": [
    acc("estribo", "Estribo Lateral Premium", "Elegância e funcionalidade", 3200, "🚗", true, 65),
    acc("protetor", "Protetor de Carter e Caixa", "Proteção completa", 2200, "🛡️", true, 330),
    acc("pneus", "Pneus Highway 235/55R19", "Performance premium", 4200, "⚙️", true, 30),
    acc("rack", "Rack de Teto Integrado", "Design elegante", 1800, "📦", true, 190),
    acc("sensor", "Sensores de Estacionamento 360°", "Segurança total", 2500, "📡", false, 480),
  ],
};

const packageNames: Record<string, string> = {
  "RAM RAMPAGE REBEL": "Pacote Off-Road Pro",
  "RAM RAMPAGE LARAMIE": "Pacote Premium Urban",
  "RAM 1500 LARAMIE": "Pacote Full Power",
  "RAM 2500 LARAMIE": "Pacote Heavy Duty Pro",
  "RAM 3500 LARAMIE": "Pacote Industrial Max",
  "FIAT TORO RANCH": "Pacote Ranch Adventure",
  "FIAT TORO ULTRA": "Pacote Urban Style",
  "JEEP COMPASS TRAILHAWK": "Pacote Trail Master",
  "JEEP COMMANDER OVERLAND": "Pacote Overland Premium",
};

// =============================================================================
// SALES KNOWLEDGE: 3 pilares (Segurança, Valorização, Estilo de Vida)
// =============================================================================

type PillarKey = "security" | "value" | "lifestyle";

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
      content:
        "O estribo oferece apoio firme e seguro para crianças, idosos e pessoas com mobilidade reduzida, prevenindo escorregões em veículos altos. Em chuva, a superfície antiderrapante é essencial.",
    },
    value: {
      hook: "Proteção lateral que se paga.",
      content:
        "Barreira contra portadas em estacionamentos. Veículos com acessórios originais Mopar valorizam até 15% na revenda.",
    },
    lifestyle: {
      hook: "Uma declaração de chegada.",
      content:
        "O estribo elétrico se recolhe automaticamente e se apresenta ao abrir a porta. Tecnologia e imponência juntas.",
    },
  },
  protetor: {
    security: {
      hook: "Armadura para o coração do veículo.",
      content:
        "Protege motor e câmbio contra impactos em lombadas, buracos e trilhas. Um único impacto pode causar R$ 15.000 a R$ 25.000 em reparos.",
    },
    value: {
      hook: "Prevenir custa centavos, reparar custa milhares.",
      content:
        "Proteção preventiva evita danos que comprometem a garantia. Na revenda, veículos com proteção completa são mais valorizados.",
    },
    lifestyle: {
      hook: "Liberdade sem limites.",
      content:
        "Cada estrada vira uma possibilidade. Lombadas, buracos urbanos ou trilhas — dirija sabendo que está blindado.",
    },
  },
  capota: {
    security: {
      hook: "Carga protegida contra tudo e todos.",
      content:
        "Protege contra furto, chuva, sol e poeira. Objetos soltos podem virar projéteis em frenagens — a capota elimina esse risco.",
    },
    value: {
      hook: "Investimento que valoriza na revenda.",
      content:
        "Pickup com capota original é muito mais desejada no mercado de seminovos. Você recupera o valor com juros.",
    },
    lifestyle: {
      hook: "Versatilidade para cada momento.",
      content: "Da mudança à viagem em família, a capota transforma a pickup em veículo versátil.",
    },
  },
  pneus: {
    security: {
      hook: "Tração é segurança. Ponto final.",
      content:
        "Pneus adequados reduzem distância de frenagem em até 30% em piso molhado e oferecem tração superior em terra e cascalho.",
    },
    value: {
      hook: "O pneu mais inteligente, não o mais caro.",
      content:
        "Dura até 40% mais em uso misto. Pneus inadequados aceleram desgaste de suspensão e alinhamento, gerando custos ocultos.",
    },
    lifestyle: {
      hook: "Qualquer estrada, a qualquer hora.",
      content: "A liberdade de pegar uma estrada de terra sem pensar duas vezes. Passaporte para a aventura.",
    },
  },
  santantonio: {
    security: {
      hook: "Proteção de cabine em situações extremas.",
      content:
        "Em caso de capotamento, atua como estrutura de proteção da cabine. Também protege contra galhos em trilhas fechadas.",
    },
    value: {
      hook: "Acessório original que agrega valor real.",
      content: "Homologado com garantia Mopar. Na revenda, atrai compradores dispostos a pagar mais.",
    },
    lifestyle: {
      hook: "Presença e imponência que chamam atenção.",
      content: "Transforma a silhueta da pickup, conferindo visual robusto e aventureiro.",
    },
  },
  friso: {
    security: {
      hook: "Proteção invisível contra danos visíveis.",
      content:
        "Protege as áreas mais vulneráveis da lataria contra batidas de porta e impactos leves do dia a dia.",
    },
    value: {
      hook: "Centavos por dia para preservar milhares.",
      content:
        "Retoque de pintura custa entre R$ 300 e R$ 1.500 por painel. O friso evita esses custos e preserva o valor de mercado.",
    },
    lifestyle: {
      hook: "Detalhes que fazem a diferença.",
      content: "Adiciona linha de design que valoriza a lateral, dando acabamento premium e personalizado.",
    },
  },
  rack: {
    security: {
      hook: "Transporte seguro, sem improvisos perigosos.",
      content:
        "Equipamentos soltos são risco em colisões. O rack permite transportar bikes, pranchas e bagagem com segurança.",
    },
    value: {
      hook: "Multiplica capacidade sem trocar de veículo.",
      content: "Amplia versatilidade sem upgrade. Acessório original com garantia, agrega valor na revenda.",
    },
    lifestyle: {
      hook: "Aventura sem limites de bagagem.",
      content: "Do surf ao camping, da bike ao caiaque — o rack liberta você do porta-malas.",
    },
  },
  guincho: {
    security: {
      hook: "Seu seguro pessoal em terrenos extremos.",
      content: "Em atolamento ou travessia difícil, é a diferença entre voltar para casa ou ficar preso.",
    },
    value: {
      hook: "Um resgate pode custar mais que o guincho.",
      content:
        "Serviço de guincho em área rural custa R$ 800 a R$ 3.000 por chamado. Autonomia total instalada.",
    },
    lifestyle: {
      hook: "A coragem de ir além.",
      content: "Separa quem olha a trilha de quem entra nela. Aventura de verdade exige equipamento de verdade.",
    },
  },
  engate: {
    security: {
      hook: "Reboque com segurança certificada.",
      content:
        "Dimensionado para a capacidade exata do veículo. Genéricos podem falhar sob carga, causando acidentes graves.",
    },
    value: {
      hook: "Capacidade que multiplica utilidade.",
      content: "Transforma o veículo em ferramenta completa. Original mantém garantia e agrega valor.",
    },
    lifestyle: {
      hook: "Leve seu mundo com você.",
      content: "Do trailer ao jet-ski, é a conexão entre veículo e estilo de vida.",
    },
  },
  sensor: {
    security: {
      hook: "Olhos onde você não consegue ver.",
      content:
        "Sensores 360° detectam obstáculos e crianças nos pontos cegos. Eliminam risco de colisões em manobras.",
    },
    value: {
      hook: "Cada batida evitada já pagou o sensor.",
      content:
        "Custo médio de reparo por colisão em manobra: R$ 1.200 a R$ 3.000. Pagam-se na primeira batida evitada.",
    },
    lifestyle: {
      hook: "Tecnologia que simplifica seu dia.",
      content: "Estacione com confiança em qualquer vaga. Elimina o estresse de manobras apertadas.",
    },
  },
  farol: {
    security: {
      hook: "Ver e ser visto salva vidas.",
      content: "LED ilumina até 3x mais, revelando obstáculos e pedestres em estradas escuras.",
    },
    value: {
      hook: "LEDs duram a vida do veículo.",
      content: "Vida útil de 50.000 horas e consumo 70% menor. Investimento único com retorno garantido.",
    },
    lifestyle: {
      hook: "Presença imponente de dia e de noite.",
      content: "Transforma a frente do veículo com presença moderna e agressiva.",
    },
  },
  toolbox: {
    security: {
      hook: "Ferramentas organizadas, riscos eliminados.",
      content:
        "Ferramentas soltas são risco em frenagens. Toolbox mantém tudo organizado, travado e protegido.",
    },
    value: {
      hook: "Organização profissional que economiza tempo.",
      content:
        "Profissionais economizam 30 minutos por dia com organização adequada. Protege ferramentas caras.",
    },
    lifestyle: {
      hook: "Profissionalismo que se vê.",
      content: "Toolbox integrada transmite profissionalismo e organização.",
    },
  },
};

type ObjectionType = "price" | "necessity" | "time" | "origin" | "aesthetic" | "generic";

function detectObjectionType(text: string): ObjectionType {
  const t = text.toLowerCase();
  if (/caro|preço|prec|dinheiro|custo|valor alto|pagar|cust|orçamento|budget/.test(t)) return "price";
  if (/não preciso|desnecessário|sem necessidade|não necessit|não uso|não vou usar|não vejo/.test(t))
    return "necessity";
  if (/pensar|penso|depois|volto|ver depois|decidir|calma|tempo|ainda não/.test(t)) return "time";
  if (/já tenho|compro fora|aftermarket|paralelo|genéric|internet|mercado livre|mais barato fora/.test(t))
    return "origin";
  if (/feio|não gost|estética|visual|esposa|mulher|aparência|design/.test(t)) return "aesthetic";
  return "generic";
}

const pillarPriority: Record<ObjectionType, PillarKey[]> = {
  price: ["value", "security", "lifestyle"],
  necessity: ["security", "value", "lifestyle"],
  time: ["value", "security", "lifestyle"],
  origin: ["security", "value", "lifestyle"],
  aesthetic: ["lifestyle", "value", "security"],
  generic: ["security", "value", "lifestyle"],
};

const pillarLabels: Record<PillarKey, { label: string; icon: string }> = {
  security: { label: "Segurança e Proteção", icon: "🛡️" },
  value: { label: "Valorização do Bem", icon: "💰" },
  lifestyle: { label: "Estilo de Vida e Exclusividade", icon: "✨" },
};

function generateSalesArguments(
  objectionText: string,
  clientName: string,
  clientGender: string,
  vehicleModel: string,
  vehicleColor: string,
  state: string,
  terrainType: string,
  climateCondition: string,
  focusedAccessoryIds: string[],
) {
  const firstName = clientName.split(" ")[0] || "Cliente";
  const genderPrefix = clientGender?.toLowerCase().includes("fem") ? "Sra." : "Sr.";
  const objectionType = objectionText.trim() ? detectObjectionType(objectionText) : "generic";
  const priority = pillarPriority[objectionType];

  const vehicleAccessories = accessoriesByVehicle[vehicleModel] ?? [];
  const focusedAccessories = vehicleAccessories.filter((a) => focusedAccessoryIds.includes(a.id));
  const accessoryNames = focusedAccessories.map((a) => a.name).join(", ");

  const pillarData: Record<PillarKey, { hooks: string[]; contents: string[] }> = {
    security: { hooks: [], contents: [] },
    value: { hooks: [], contents: [] },
    lifestyle: { hooks: [], contents: [] },
  };

  for (const a of focusedAccessories) {
    const k = accessoryKnowledge[a.id];
    if (k) {
      for (const cat of ["security", "value", "lifestyle"] as PillarKey[]) {
        pillarData[cat].hooks.push(k[cat].hook);
        pillarData[cat].contents.push(k[cat].content);
      }
    }
  }

  const regionContext = state ? ` na região do ${state}` : "";
  const terrainContext = terrainType ? ` para uso em ${terrainType.toLowerCase()}` : "";
  const climateContext = climateCondition ? ` Com ${climateCondition.toLowerCase()}, ` : "";

  const args = priority.map((cat) => {
    const data = pillarData[cat];
    const hook = data.hooks[0] || "Proteja seu investimento.";
    const content =
      data.contents.length > 0
        ? data.contents.join(" ") +
          (cat === "security"
            ? `${climateContext}a proteção se torna ainda mais essencial${regionContext}.`
            : "")
        : `Para o ${vehicleModel}${terrainContext}${regionContext}, este pacote oferece o melhor custo-benefício.`;
    return {
      category: cat,
      icon: pillarLabels[cat].icon,
      label: pillarLabels[cat].label,
      hook,
      content,
    };
  });

  const dialogueTemplates: Record<ObjectionType, string> = {
    price: `Quando o cliente disser "Está muito caro", você pode responder:\n\n"${genderPrefix} ${firstName}, eu entendo a preocupação com o investimento. Financiando ${accessoryNames} junto ao ${vehicleModel}, estamos falando de poucos reais por dia. Sem essa proteção, um único incidente pode custar mais do que o pacote inteiro."`,
    necessity: `Quando o cliente disser "Não preciso disso", você pode responder:\n\n"${genderPrefix} ${firstName}, 8 em cada 10 clientes que optaram pelo ${vehicleModel} escolheram ${accessoryNames}. No dia a dia, esses itens não são luxo, são necessidade prática."`,
    time: `Quando o cliente disser "Vou pensar", você pode responder:\n\n"${genderPrefix} ${firstName}, a condição especial de ${accessoryNames} está vinculada à compra do ${vehicleModel} hoje. Após a saída da concessionária, a instalação individual pode custar até 40% a mais."`,
    origin: `Quando o cliente disser "Compro mais barato fora", você pode responder:\n\n"${genderPrefix} ${firstName}, acessórios não-originais podem comprometer a garantia de fábrica do ${vehicleModel}. ${accessoryNames} originais Mopar têm certificação, encaixe perfeito e garantia própria."`,
    aesthetic: `Quando o cliente disser "Não gostei da estética", você pode responder:\n\n"${genderPrefix} ${firstName}, ${accessoryNames} foram projetados pelo mesmo time de design do ${vehicleModel}. Além do visual, a funcionalidade e segurança são incomparáveis."`,
    generic: `Para apresentar proativamente:\n\n"${genderPrefix} ${firstName}, preparei uma configuração exclusiva de ${accessoryNames} para o seu ${vehicleModel}. Cada item foi selecionado pensando no seu perfil de uso e na sua região."`,
  };

  const closingPhrases: Record<ObjectionType, string> = {
    price: `"Vamos incluir no financiamento? Assim o senhor(a) sai hoje com o veículo completo e protegido."`,
    necessity: `"Posso incluir para o senhor(a) experimentar com a tranquilidade da garantia?"`,
    time: `"Para garantir essa condição especial, posso reservar agora."`,
    origin: `"Vamos garantir a instalação original com garantia completa?"`,
    aesthetic: `"Que tal vermos juntos como fica no veículo?"`,
    generic: `"Posso incluir o pacote completo na proposta?"`,
  };

  return {
    package: packageNames[vehicleModel] ?? "Pacote Personalizado",
    vehicle: `${vehicleModel} ${vehicleColor}`.trim(),
    client: firstName,
    objection_type: objectionType,
    arguments: args,
    dialogue_script: dialogueTemplates[objectionType],
    closing_phrase: closingPhrases[objectionType],
  };
}

// =============================================================================
// MCP TOOLS
// =============================================================================

interface McpTool {
  name: string;
  title: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations?: Record<string, boolean>;
  handler: (args: Record<string, unknown>) => unknown;
}

const tools: McpTool[] = [
  {
    name: "list_vehicles",
    title: "Listar veículos",
    description:
      "Lista todos os modelos de veículos JEEP, RAM e FIAT suportados pelo catálogo Smart-Sell da Stellantis.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
    handler: () => {
      const models = Object.keys(accessoriesByVehicle).map((model) => ({
        model,
        recommended_package: packageNames[model],
        accessory_count: accessoriesByVehicle[model].length,
      }));
      return { count: models.length, vehicles: models };
    },
  },
  {
    name: "get_accessories_for_vehicle",
    title: "Obter acessórios do veículo",
    description:
      "Retorna a lista de acessórios disponíveis para um modelo específico, incluindo status de estoque (disponível, dormente, obsoleto) e desconto sugerido.",
    inputSchema: {
      type: "object",
      properties: {
        vehicle_model: {
          type: "string",
          description:
            "Modelo do veículo (ex.: 'RAM RAMPAGE REBEL', 'JEEP COMPASS TRAILHAWK', 'FIAT TORO RANCH'). Use list_vehicles para ver a lista completa.",
        },
      },
      required: ["vehicle_model"],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
    handler: (args) => {
      const model = String(args.vehicle_model ?? "");
      const list = accessoriesByVehicle[model];
      if (!list) {
        return {
          error: `Modelo '${model}' não encontrado.`,
          available_models: Object.keys(accessoriesByVehicle),
        };
      }
      return {
        vehicle_model: model,
        recommended_package: packageNames[model],
        accessories: list.map((a) => ({
          id: a.id,
          name: a.name,
          description: a.description,
          price_brl: a.price,
          discount_percent: a.discountPercent,
          final_price_brl: Math.round(a.price * (1 - a.discountPercent / 100)),
          stock_status: a.stockStatus,
          stock_days: a.stockDays,
          recommended_by_default: a.selected,
        })),
      };
    },
  },
  {
    name: "get_recommended_package",
    title: "Obter pacote recomendado",
    description:
      "Retorna o nome e o resumo do pacote de acessórios recomendado pela IA para um modelo específico, com preços totais.",
    inputSchema: {
      type: "object",
      properties: {
        vehicle_model: { type: "string", description: "Modelo do veículo." },
      },
      required: ["vehicle_model"],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
    handler: (args) => {
      const model = String(args.vehicle_model ?? "");
      const list = accessoriesByVehicle[model];
      if (!list) {
        return {
          error: `Modelo '${model}' não encontrado.`,
          available_models: Object.keys(accessoriesByVehicle),
        };
      }
      const selected = list.filter((a) => a.selected);
      const originalTotal = selected.reduce((s, a) => s + a.price, 0);
      const finalTotal = selected.reduce(
        (s, a) => s + Math.round(a.price * (1 - a.discountPercent / 100)),
        0,
      );
      return {
        package_name: packageNames[model],
        vehicle_model: model,
        items: selected.map((a) => a.name),
        original_total_brl: originalTotal,
        final_total_brl: finalTotal,
        savings_brl: originalTotal - finalTotal,
        installments_12x_brl: Math.ceil(finalTotal / 12),
      };
    },
  },
  {
    name: "generate_sales_arguments",
    title: "Gerar argumentação de vendas",
    description:
      "Gera argumentação de vendas consultiva baseada nos 3 pilares (Segurança, Valorização, Estilo de Vida) para tratar objeções do cliente. Retorna argumentos personalizados, roteiro de diálogo e frase de fechamento.",
    inputSchema: {
      type: "object",
      properties: {
        vehicle_model: { type: "string", description: "Modelo do veículo (obrigatório)." },
        accessory_ids: {
          type: "array",
          items: { type: "string" },
          description:
            "IDs dos acessórios em foco (ex.: ['estribo', 'pneus']). Use get_accessories_for_vehicle para obter os IDs. Se omitido, usa os acessórios recomendados por padrão.",
        },
        objection: {
          type: "string",
          description:
            "Objeção do cliente em texto livre (opcional). Ex.: 'está muito caro', 'não vejo necessidade', 'vou pensar', 'a esposa não gostou'.",
        },
        client_name: { type: "string", description: "Nome do cliente (opcional)." },
        client_gender: {
          type: "string",
          description: "Gênero do cliente: 'Masculino' ou 'Feminino' (opcional).",
        },
        vehicle_color: { type: "string", description: "Cor do veículo (opcional)." },
        state: { type: "string", description: "Estado brasileiro de uso do veículo (opcional)." },
        terrain_type: {
          type: "string",
          description: "Tipo de terreno de uso (opcional). Ex.: 'Off-Road', 'Urbano'.",
        },
        climate_condition: {
          type: "string",
          description: "Condição climática predominante (opcional).",
        },
      },
      required: ["vehicle_model"],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true, openWorldHint: false },
    handler: (args) => {
      const model = String(args.vehicle_model ?? "");
      const list = accessoriesByVehicle[model];
      if (!list) {
        return {
          error: `Modelo '${model}' não encontrado.`,
          available_models: Object.keys(accessoriesByVehicle),
        };
      }
      let ids = Array.isArray(args.accessory_ids) ? args.accessory_ids.map(String) : null;
      if (!ids || ids.length === 0) {
        ids = list.filter((a) => a.selected).map((a) => a.id);
      }
      return generateSalesArguments(
        String(args.objection ?? ""),
        String(args.client_name ?? "Cliente"),
        String(args.client_gender ?? "Masculino"),
        model,
        String(args.vehicle_color ?? ""),
        String(args.state ?? ""),
        String(args.terrain_type ?? ""),
        String(args.climate_condition ?? ""),
        ids,
      );
    },
  },
];

// =============================================================================
// MCP JSON-RPC 2.0 HANDLER
// =============================================================================

const SERVER_INFO = {
  name: "smart-sell-mcp",
  title: "Smart-Sell — Assistente de Vendas Stellantis",
  version: "1.0.0",
};

const PROTOCOL_VERSION = "2025-06-18";

interface JsonRpcRequest {
  jsonrpc: "2.0";
  id?: string | number | null;
  method: string;
  params?: Record<string, unknown>;
}

interface JsonRpcResponse {
  jsonrpc: "2.0";
  id: string | number | null;
  result?: unknown;
  error?: { code: number; message: string; data?: unknown };
}

function handleRpc(req: JsonRpcRequest): JsonRpcResponse | null {
  const id = req.id ?? null;
  try {
    switch (req.method) {
      case "initialize":
        return {
          jsonrpc: "2.0",
          id,
          result: {
            protocolVersion: PROTOCOL_VERSION,
            capabilities: { tools: { listChanged: false } },
            serverInfo: SERVER_INFO,
            instructions:
              "Servidor MCP do Smart-Sell (Stellantis). Use list_vehicles para listar modelos JEEP/RAM/FIAT, get_accessories_for_vehicle para ver acessórios com estoque e desconto, get_recommended_package para o pacote sugerido, e generate_sales_arguments para gerar argumentação consultiva de vendas nos 3 pilares (Segurança, Valorização, Estilo de Vida) tratando objeções de clientes.",
          },
        };

      case "notifications/initialized":
      case "notifications/cancelled":
        return null;

      case "ping":
        return { jsonrpc: "2.0", id, result: {} };

      case "tools/list":
        return {
          jsonrpc: "2.0",
          id,
          result: {
            tools: tools.map((t) => ({
              name: t.name,
              title: t.title,
              description: t.description,
              inputSchema: t.inputSchema,
              annotations: t.annotations,
            })),
          },
        };

      case "tools/call": {
        const params = req.params ?? {};
        const toolName = String(params.name ?? "");
        const toolArgs = (params.arguments as Record<string, unknown>) ?? {};
        const tool = tools.find((t) => t.name === toolName);
        if (!tool) {
          return {
            jsonrpc: "2.0",
            id,
            error: { code: -32602, message: `Tool '${toolName}' not found` },
          };
        }
        const result = tool.handler(toolArgs);
        return {
          jsonrpc: "2.0",
          id,
          result: {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            structuredContent: result as Record<string, unknown>,
          },
        };
      }

      default:
        return {
          jsonrpc: "2.0",
          id,
          error: { code: -32601, message: `Method '${req.method}' not found` },
        };
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      jsonrpc: "2.0",
      id,
      error: { code: -32603, message: `Internal error: ${message}` },
    };
  }
}

// =============================================================================
// HTTP SERVER
// =============================================================================

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method === "GET") {
    return new Response(
      JSON.stringify(
        {
          server: SERVER_INFO,
          protocol: PROTOCOL_VERSION,
          transport: "streamable-http",
          tools: tools.map((t) => ({ name: t.name, title: t.title, description: t.description })),
        },
        null,
        2,
      ),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({
        jsonrpc: "2.0",
        id: null,
        error: { code: -32700, message: "Parse error" },
      }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const requests = Array.isArray(body) ? body : [body];
  const responses = requests
    .map((r) => handleRpc(r as JsonRpcRequest))
    .filter((r): r is JsonRpcResponse => r !== null);

  if (responses.length === 0) {
    return new Response(null, { status: 202, headers: corsHeaders });
  }

  const payload = Array.isArray(body) ? responses : responses[0];

  return new Response(JSON.stringify(payload), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});