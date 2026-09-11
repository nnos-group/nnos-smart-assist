/** Canal de origem do atendimento ao cliente */
export type ClientSource = "crm" | "live" | "delivery" | "postsale";

export type StockStatus = "available" | "dormant" | "obsolete";

export interface Accessory {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  selected: boolean;
  stockStatus: StockStatus;
  stockDays: number; // dias em estoque
  discountPercent: number; // desconto aplicado (0 se disponível)
  category: string; // ex: "interior", "exterior", "proteção", "tecnologia", "utilitário"
  inStock?: boolean; // disponibilidade imediata no estoque local da concessionária
  stockQuantity?: number; // quantidade física disponível em estoque
}

export interface ClientData {
  vehicleModel: string;
  vehicleColor: string;
  vehicleYear: string;
  clientName: string;
  clientAge: string;
  clientGender: string;
  state: string;
  terrainType: string;
  climateCondition: string;
}

// Calcular status e desconto baseado nos dias em estoque
export const getStockInfo = (days: number): { status: StockStatus; discount: number; label: string } => {
  if (days > 365) {
    return { status: "obsolete", discount: Math.min(35, 25 + Math.floor((days - 365) / 60) * 3), label: "Estoque Obsoleto" };
  }
  if (days > 180) {
    return { status: "dormant", discount: Math.min(20, 10 + Math.floor((days - 180) / 30) * 2), label: "Estoque Dormente" };
  }
  return { status: "available", discount: 0, label: "Disponível" };
};

// Imagens dos veículos por modelo
export const vehicleImages: Record<string, string> = {
  "RAM RAMPAGE REBEL": "/vehicles/ram-rampage-rebel.jpg",
  "RAM RAMPAGE LARAMIE": "/vehicles/ram-rampage-laramie.jpg",
  "RAM 1500 LARAMIE": "/vehicles/ram-1500-laramie.jpg",
  "RAM 2500 LARAMIE": "/vehicles/ram-2500-laramie.jpg",
  "RAM 3500 LARAMIE": "/vehicles/ram-3500-laramie.jpg",
  "FIAT TORO RANCH": "/vehicles/fiat-toro-ranch.jpg",
  "FIAT TORO ULTRA": "/vehicles/fiat-toro-ultra.jpg",
  "JEEP RENEGADE SPORT": "/vehicles/jeep-renegade-sport.jpg",
  "JEEP RENEGADE LONGITUDE": "/vehicles/jeep-renegade-longitude.jpg",
  "JEEP RENEGADE SAHARA": "/vehicles/jeep-renegade-sahara.jpg",
  "JEEP RENEGADE TRAILHAWK": "/vehicles/jeep-renegade-trailhawk.jpg",
  "JEEP RENEGADE SERIE S": "/vehicles/jeep-renegade-serie-s.jpg",
  "JEEP COMPASS SPORT": "/vehicles/jeep-compass-sport.jpg",
  "JEEP COMPASS LONGITUDE": "/vehicles/jeep-compass-longitude.jpg",
  "JEEP COMPASS LIMITED": "/vehicles/jeep-compass-limited.jpg",
  "JEEP COMPASS SERIE S": "/vehicles/jeep-compass-serie-s.jpg",
  "JEEP COMPASS TRAILHAWK": "/vehicles/jeep-compass-trailhawk.jpg",
  "JEEP COMPASS BLACKHAWK": "/vehicles/jeep-compass-blackhawk.jpg",
  "JEEP COMMANDER OVERLAND": "/vehicles/jeep-commander-overland.jpg",
};

// Inferir categoria a partir do ID do acessório (para compatibilidade retroativa)
const inferCategory = (id: string): string => {
  if (['tapete_borracha', 'tapete_premium', 'soleira', 'iluminacao_led', 'organizador_console',
       'pelicula_solar', 'capa_banco', 'protetor_porta_int', 'tapete_logomania'].some(k => id.includes(k)))
    return 'interior';
  if (['estribo', 'friso', 'rack', 'bagageiro', 'capota', 'santantonio'].some(k => id.includes(k)))
    return 'exterior';
  if (['protetor', 'pneus', 'parafuso_antifurto', 'guincho'].some(k => id.includes(k)))
    return 'proteção';
  if (['sensor', 'camera', 'farol'].some(k => id.includes(k)))
    return 'tecnologia';
  if (['engate', 'toolbox'].some(k => id.includes(k)))
    return 'utilitário';
  return 'acessório';
};

// Helper: criar acessório com estoque simulado
const acc = (
  id: string, name: string, description: string, price: number, icon: string,
  selected: boolean, stockDays: number, category?: string, stockQty?: number
): Accessory => {
  const info = getStockInfo(stockDays);
  // Simular que engate e película solar tem estoque zerado por padrão em alguns modelos para validação
  const defaultQuantity = stockQty !== undefined ? stockQty : (id.includes("engate") ? 0 : 3);
  return {
    id, name, description, price, icon, selected,
    stockStatus: info.status,
    stockDays,
    discountPercent: info.discount,
    category: category || inferCategory(id),
    stockQuantity: defaultQuantity,
    inStock: defaultQuantity > 0,
  };
};

// Acessórios específicos por tipo de veículo (com dados de estoque simulados)
export const accessoriesByVehicle: Record<string, Accessory[]> = {
  "RAM RAMPAGE REBEL": [
    acc("estribo", "Estribo Lateral Tubular Off-Road", "Acesso facilitado e proteção lateral contra pedras", 2500, "🚗", true, 45, "exterior"),
    acc("protetor", "Protetor de Caçamba HD Mopar", "Proteção de alta densidade contra impactos", 1200, "🛡️", true, 210, "proteção"),
    acc("pneus", "Pneus All-Terrain 265/70R16", "Tração superior em qualquer terreno", 4800, "⚙️", true, 30, "proteção"),
    acc("capota", "Capota Marítima Retrátil", "Proteção impermeável da caçamba", 3200, "🔒", false, 60, "exterior"),
    acc("santantonio", "Santo Antônio Esportivo Rebel", "Proteção e estilo robusto para a pickup", 1800, "🏋️", false, 190, "exterior"),
    acc("engate", "Engate de Reboque Removível Mopar", "Capacidade de tração homologada de até 1.500 kg com tomada elétrica", 2450, "🔗", false, 40, "utilitário"),
    acc("rack", "Barras Transversais de Caçamba / Teto Mopar", "Suporte em alumínio para maleiros e bicicletas", 1650, "📦", false, 35, "exterior"),
    acc("friso", "Friso Lateral na Cor do Veículo", "Proteção perimétrica contra batidas de porta", 450, "✨", false, 400, "exterior"),
    acc("tapete_borracha", "Tapetes All-Weather de Borda Elevada", "Retenção total de lama, areia e líquidos", 890, "🛡️", false, 20, "interior"),
    acc("parafuso_antifurto", "Kit Parafusos Antifurto das Rodas Mopar", "Segurança máxima com chave codificada exclusiva", 480, "🔒", false, 15, "proteção"),
    acc("soleira", "Soleiras de Porta Mopar em Alumínio", "Elegância e proteção no acesso à cabine", 650, "✨", false, 30, "interior"),
    acc("iluminacao_led", "Iluminação Interna LED Mopar (Kit Completo)", "Iluminação ambiente no teto, porta-luvas e bagageiro com LEDs de alta durabilidade", 890, "💡", false, 55, "interior"),
    acc("organizador_console", "Organizador de Console Central Mopar", "Divisórias modulares para organizar cabos, documentos e acessórios dentro da cabine", 480, "📋", false, 40, "interior"),
    acc("pelicula_solar", "Película Solar Nano-Cerâmica 3M (Vidros Laterais)", "Reduz em até 60% o calor solar interno, protege o painel e preserva a cabine", 1380, "🌞", false, 30, "interior"),
  ],
  "RAM RAMPAGE LARAMIE": [
    acc("estribo", "Estribo Lateral Premium Laramie", "Acesso facilitado com acabamento escovado", 2500, "🚗", true, 120, "exterior"),
    acc("protetor", "Protetor de Caçamba HD Mopar", "Proteção contra riscos e impactos", 1200, "🛡️", true, 380, "proteção"),
    acc("pneus", "Pneus Highway 265/65R17", "Conforto e durabilidade no asfalto", 3800, "⚙️", true, 15, "proteção"),
    acc("capota", "Capota Rígida Elétrica Mopar", "Abertura automática com controle", 5500, "🔒", false, 90, "exterior"),
    acc("engate", "Engate de Reboque Removível Mopar", "Homologado para carretas náuticas e reboques", 2450, "🔗", false, 65, "utilitário"),
    acc("rack", "Barras Transversais de Caçamba / Teto Mopar", "Versatilidade para viagens e esportes", 1650, "📦", false, 30, "exterior"),
    acc("friso", "Friso Lateral Cromado", "Proteção e estética refinada", 450, "✨", false, 250, "exterior"),
    acc("tapete_borracha", "Tapetes All-Weather de Borda Elevada", "Proteção total do carpete", 890, "🛡️", false, 25, "interior"),
    acc("parafuso_antifurto", "Kit Parafusos Antifurto das Rodas Mopar", "Segurança codificada antifurto", 480, "🔒", false, 15, "proteção"),
    acc("soleira", "Soleiras de Porta Mopar em Alumínio", "Acabamento nobre e proteção", 650, "✨", false, 40, "interior"),
    acc("iluminacao_led", "Iluminação Interna LED Mopar (Kit Completo)", "Iluminação ambiente no teto, porta-luvas e áreas de carga com LEDs de longa duração", 890, "💡", false, 50, "interior"),
    acc("organizador_console", "Organizador de Console Premium Mopar", "Divisórias modulares forradas em couro sintético para organização interna", 580, "📋", false, 35, "interior"),
    acc("pelicula_solar", "Película Solar Nano-Cerâmica 3M (Vidros Laterais)", "Bloqueia até 60% do calor solar preservando a cabine premium", 1380, "🌞", false, 28, "interior"),
    acc("capa_banco", "Capas de Banco em Couro Sintético Mopar", "Proteção premium do banco original com acabamento soft-touch e costura exclusiva", 2200, "🪑", false, 70, "interior"),
  ],
  "RAM 1500 LARAMIE": [
    acc("estribo", "Estribo Lateral Elétrico Automatizado", "Acesso automatizado premium", 4500, "🚗", true, 60),
    acc("protetor", "Protetor de Caçamba Spray-On", "Proteção permanente profissional", 2800, "🛡️", true, 200),
    acc("pneus", "Pneus All-Terrain 275/65R18", "Performance em todos os terrenos", 6200, "⚙️", true, 25),
    acc("capota", "Capota Rígida Tri-Fold", "Abertura em três partes com trava", 4800, "🔒", false, 150),
    acc("santantonio", "Santo Antônio Off-Road", "Proteção e estilo esportivo", 3200, "🏋️", false, 420),
    acc("engate", "Engate de Reboque Heavy Duty Mopar", "Capacidade pesada de tração homologada", 3200, "🔗", false, 90),
    acc("tapete_borracha", "Tapetes All-Weather de Borda Elevada", "Proteção total de assoalho", 980, "🛡️", false, 20),
    acc("parafuso_antifurto", "Kit Parafusos Antifurto das Rodas", "Proteção das rodas cromadas", 520, "🔒", false, 15),
  ],
  "RAM 2500 LARAMIE": [
    acc("estribo", "Estribo Lateral Elétrico", "Acesso automatizado premium", 4800, "🚗", true, 90),
    acc("protetor", "Protetor de Caçamba Heavy Duty", "Para cargas pesadas", 3200, "🛡️", true, 300),
    acc("pneus", "Pneus LT275/70R18", "Carga extra e durabilidade", 7500, "⚙️", true, 40),
    acc("engate", "Engate de Reboque 5ª Roda", "Para reboques pesados", 5200, "🔗", true, 500),
    acc("farol", "Kit Faróis Auxiliares LED", "Iluminação off-road potente", 2800, "💡", false, 185),
    acc("tapete_borracha", "Tapetes All-Weather de Borda Elevada", "Proteção robusta", 980, "🛡️", false, 30),
  ],
  "RAM 3500 LARAMIE": [
    acc("estribo", "Estribo Lateral Elétrico", "Acesso automatizado premium", 4800, "🚗", true, 75),
    acc("protetor", "Protetor de Caçamba Industrial", "Máxima resistência a impactos", 3800, "🛡️", true, 220),
    acc("pneus", "Pneus LT285/75R17", "Máxima capacidade de carga", 8200, "⚙️", true, 50),
    acc("engate", "Engate Gooseneck", "Para reboques especiais", 4500, "🔗", true, 365),
    acc("toolbox", "Caixa de Ferramentas Embutida", "Armazenamento profissional", 2200, "🧰", false, 450),
    acc("tapete_borracha", "Tapetes All-Weather", "Proteção industrial", 980, "🛡️", false, 40),
  ],
  "FIAT TORO RANCH": [
    acc("estribo", "Estribo Lateral Tubular", "Design esportivo e funcional", 1800, "🚗", true, 100, "exterior"),
    acc("protetor", "Protetor de Caçamba HD", "Proteção contra riscos", 850, "🛡️", true, 350, "proteção"),
    acc("pneus", "Pneus All-Terrain 225/65R17", "Tração em diversos terrenos", 3200, "⚙️", true, 20, "proteção"),
    acc("santantonio", "Santo Antônio Cromado", "Estilo e proteção", 1500, "🏋️", false, 195, "exterior"),
    acc("capota", "Capota Marítima", "Proteção flexível da caçamba", 1200, "🔒", false, 270, "exterior"),
    acc("engate", "Engate de Reboque Removível Mopar", "Para carretas e transbikes", 2100, "🔗", false, 80, "utilitário"),
    acc("rack", "Barras Transversais de Teto Mopar", "Suporte de cargas de teto", 1350, "📦", false, 40, "exterior"),
    acc("tapete_borracha", "Tapetes de Borda Elevada", "Proteção do carpete", 690, "🛡️", false, 20, "interior"),
    acc("parafuso_antifurto", "Kit Parafusos Antifurto", "Segurança das rodas", 450, "🔒", false, 15, "proteção"),
    acc("soleira", "Soleiras de Porta Toro Mopar", "Proteção e elegância no acesso", 550, "✨", false, 30, "interior"),
    acc("iluminacao_led", "Iluminação Interna LED Mopar (Kit Completo)", "Iluminação de teto e portas com LEDs de alta durabilidade", 790, "💡", false, 45, "interior"),
    acc("organizador_console", "Organizador de Console Central Mopar", "Bandejas organizadoras para console central", 420, "📋", false, 30, "interior"),
    acc("pelicula_solar", "Película Solar Nano-Cerâmica 3M", "Redução de até 60% do calor interno na cabine", 1280, "🌞", false, 20, "interior"),
  ],
  "FIAT TORO ULTRA": [
    acc("estribo", "Estribo Lateral Premium", "Design urbano sofisticado", 2200, "🚗", true, 80, "exterior"),
    acc("protetor", "Protetor de Caçamba HD", "Proteção contra riscos", 850, "🛡️", true, 290, "proteção"),
    acc("pneus", "Pneus Highway 225/55R18", "Conforto e economia", 2800, "⚙️", true, 35, "proteção"),
    acc("capota", "Capota Rígida Elétrica", "Abertura automática", 4200, "🔒", false, 55, "exterior"),
    acc("engate", "Engate de Reboque Removível Mopar", "Homologado para reboques", 2100, "🔗", false, 90, "utilitário"),
    acc("rack", "Barras Transversais de Teto Mopar", "Transporte aerodinâmico", 1350, "📦", false, 45, "exterior"),
    acc("friso", "Friso Lateral na Cor do Veículo", "Visual integrado", 650, "✨", false, 410, "exterior"),
    acc("tapete_borracha", "Tapetes de Borda Elevada", "Limpeza facilitada", 690, "🛡️", false, 15, "interior"),
    acc("parafuso_antifurto", "Kit Parafusos Antifurto", "Segurança antifurto", 450, "🔒", false, 10, "proteção"),
    acc("soleira", "Soleiras de Porta Toro Mopar", "Proteção e acabamento esportivo", 550, "✨", false, 25, "interior"),
    acc("iluminacao_led", "Iluminação Interna LED Mopar (Kit Completo)", "Iluminação ambiente na cabine com LEDs brancos", 790, "💡", false, 40, "interior"),
    acc("organizador_console", "Organizador de Console Central Mopar", "Divisórias sob medida para o console", 420, "📋", false, 35, "interior"),
    acc("pelicula_solar", "Película Solar Nano-Cerâmica 3M", "Proteção térmica de alta eficiência para vidros laterais", 1280, "🌞", false, 15, "interior"),
  ],
  "JEEP COMPASS SPORT": [
    acc("bagageiro", "Bagageiro de Teto Mopar 400L", "Capacidade extra de 400L e vedação contra poeira", 2850, "🧳", true, 90, "exterior"),
    acc("estribo", "Estribo Lateral Tubular Integrado", "Acesso facilitado e proteção da carroceria", 2400, "🚗", true, 80, "exterior"),
    acc("protetor", "Protetor de Carter Reforçado", "Proteção vital para o conjunto mecânico", 1200, "🛡️", true, 210, "proteção"),
    acc("rack", "Barras Transversais de Teto Mopar", "Transporte seguro de cargas e bagagens", 1350, "📦", true, 160, "exterior"),
    acc("engate", "Engate de Reboque Removível Mopar", "Capacidade de tração homologada e tomada elétrica", 2300, "🔗", false, 70, "utilitário"),
    acc("friso", "Friso Lateral com Grafia Compass", "Proteção contra pequenos impactos e arranhões", 650, "✨", false, 390, "exterior"),
    acc("sensor", "Câmera e Sensores de Estacionamento", "Manobras urbanas precisas e seguras", 1800, "📡", false, 420, "tecnologia"),
    acc("tapete_borracha", "Tapetes All-Weather de Borda Elevada", "Proteção do assoalho contra lama e água", 790, "🛡️", false, 25, "interior"),
    acc("parafuso_antifurto", "Kit Parafusos Antifurto das Rodas Mopar", "Segurança mecânica com segredo exclusivo", 480, "🔒", false, 15, "proteção"),
    acc("soleira", "Soleiras de Porta Mopar em Alumínio", "Elegância e proteção no acesso à cabine", 650, "✨", false, 30, "interior"),
    acc("iluminacao_led", "Iluminação Interna LED Mopar (Kit Completo)", "Iluminação de boas-vindas no teto, portas e bagageiro — cria atmosfera premium", 890, "💡", false, 45, "interior"),
    acc("organizador_console", "Organizador de Console Central Mopar", "Divisórias práticas para celular, documentos e cabos dentro da cabine", 450, "📋", false, 38, "interior"),
    acc("pelicula_solar", "Película Solar Nano-Cerâmica 3M (Vidros Laterais)", "Protege passageiros da radiação solar, reduz o calor interno em até 60%", 1380, "🌞", false, 22, "interior"),
    acc("protetor_porta_int", "Kit Protetor de Porta Interno (4 peças)", "Evita arranhões e amassados nas laterais internas das portas ao abrir em espaços apertados", 380, "🛡️", false, 60, "interior"),
  ],
  "JEEP COMPASS LONGITUDE": [
    acc("bagageiro", "Bagageiro de Teto Mopar Adventure 450L", "Design aerodinâmico e máxima litragem", 3200, "🧳", true, 70, "exterior"),
    acc("estribo", "Estribo Lateral Premium Integrado", "Acabamento elegante e segurança no embarque", 2500, "🚗", true, 95, "exterior"),
    acc("protetor", "Protetor de Carter Reforçado", "Blindagem preventiva sob o assoalho", 1250, "🛡️", true, 260, "proteção"),
    acc("rack", "Barras Transversais de Teto Mopar", "Versatilidade para viagens e esportes", 1400, "📦", true, 180, "exterior"),
    acc("engate", "Engate de Reboque Removível Mopar", "Homologado para reboques e suporte de bikes", 2300, "🔗", false, 85, "utilitário"),
    acc("soleira", "Soleiras de Portas Iluminadas em LED", "Elegância e proteção no acesso à cabine", 1100, "✨", false, 150, "interior"),
    acc("friso", "Friso Lateral na Cor do Veículo", "Estética sofisticada e proteção de portas", 700, "✨", false, 410, "exterior"),
    acc("tapete_borracha", "Tapetes All-Weather de Borda Elevada", "Proteção durável contra sujeira", 790, "🛡️", false, 20, "interior"),
    acc("parafuso_antifurto", "Kit Parafusos Antifurto Mopar", "Segurança para rodas de liga leve", 480, "🔒", false, 15, "proteção"),
    acc("iluminacao_led", "Iluminação Interna LED Mopar (Kit Completo)", "Iluminação ambiente premium no teto, portas e bagageiro com LEDs de alta durabilidade", 890, "💡", false, 42, "interior"),
    acc("organizador_console", "Organizador de Console Central Mopar", "Divisórias modulares para organização otimizada da cabine", 480, "📋", false, 36, "interior"),
    acc("pelicula_solar", "Película Solar Nano-Cerâmica 3M (Vidros Laterais)", "Bloqueia radiação UV e reduz calor solar em até 60% na cabine", 1380, "🌞", false, 18, "interior"),
    acc("protetor_porta_int", "Kit Protetor de Porta Interno (4 peças)", "Proteção interna das portas contra arranhões em manobras urbanas", 380, "🛡️", false, 55, "interior"),
    acc("tapete_logomania", "Tapetes Logomania Personalizados Mopar", "Tapetes personalizados com logotipo Jeep em relevo 3D e borda elevada", 990, "🛡️", false, 28, "interior"),
  ],
  "JEEP COMPASS LIMITED": [
    acc("bagageiro", "Bagageiro de Teto Mopar Black 450L", "Elegância executiva com chave de segurança", 3400, "🧳", true, 60, "exterior"),
    acc("estribo", "Estribo Lateral Slim Dark", "Perfil discreto de alta resistência", 2600, "🚗", true, 75, "exterior"),
    acc("protetor", "Protetor de Carter e Câmbio", "Proteção completa de conjunto motriz", 1400, "🛡️", true, 280, "proteção"),
    acc("rack", "Rack de Teto Aerodinâmico Mopar", "Baixo ruído de vento e encaixe perfeito", 1550, "📦", true, 140, "exterior"),
    acc("engate", "Engate de Reboque Removível Mopar", "Homologado para reboques e suporte de bicicletas", 2300, "🔗", false, 300, "utilitário"),
    acc("friso", "Friso Lateral Cromado Compass", "Acabamento nobre combinando com frisos de teto", 780, "✨", false, 380, "exterior"),
    acc("tapete_borracha", "Tapetes All-Weather Mopar", "Bordas elevadas anti-derramamento", 790, "🛡️", false, 30, "interior"),
    acc("parafuso_antifurto", "Kit Parafusos Antifurto das Rodas", "Proteção das rodas aro 19", 480, "🔒", false, 15, "proteção"),
    acc("soleira", "Soleiras de Portas Iluminadas em LED", "Iluminação de boas-vindas", 1100, "✨", false, 50, "interior"),
    acc("iluminacao_led", "Iluminação Interna LED Mopar (Kit Premium)", "Iluminação ambiente LED com regulagem de intensidade no teto, portas e bagageiro", 1290, "💡", false, 38, "interior"),
    acc("organizador_console", "Organizador de Console em Couro Genuíno Mopar", "Acabamento em couro natural com divisórias modulares para organização premium", 780, "📋", false, 32, "interior"),
    acc("pelicula_solar", "Película Solar Nano-Cerâmica 3M (Vidros Laterais)", "Máxima proteção UV com alta transparência, reduz calor em até 60%", 1380, "🌞", false, 20, "interior"),
    acc("capa_banco", "Capas de Banco em Couro Sintético Premium", "Proteção total dos bancos originais com costuras exclusivas e soft-touch", 2400, "🪑", false, 65, "interior"),
    acc("protetor_porta_int", "Kit Protetor de Porta Premium (4 peças)", "Protege o interior das portas contra arranhões com acabamento carbonado", 480, "🛡️", false, 45, "interior"),
    acc("tapete_logomania", "Tapetes Logomania Premium Mopar", "Tapetes personalizados com bordado 3D e borda elevada antiderrapante", 1190, "🛡️", false, 25, "interior"),
  ],
  "JEEP COMPASS SERIE S": [
    acc("bagageiro", "Bagageiro de Teto Black Piano Mopar 450L", "Visual Dark Premium com acabamento em preto brilhante", 3500, "🧳", true, 45),
    acc("estribo", "Estribo Lateral Dark Série S", "Design esportivo escurecido exclusivo", 2700, "🚗", true, 65),
    acc("protetor", "Protetor de Carter em Alumínio", "Leveza superior e proteção de impacto", 1450, "🛡️", true, 230),
    acc("rack", "Rack de Teto Dark Aero Mopar", "Acabamento escurecido homologado de fábrica", 1650, "📦", true, 120),
    acc("engate", "Engate de Reboque Removível Dark Mopar", "Ponteira removível e tomada elétrica", 2400, "🔗", false, 95),
    acc("friso", "Friso Lateral Série S Black Piano", "Total harmonia com as molduras escuras", 820, "✨", false, 395),
    acc("pneus", "Pneus High Performance 235/45R19", "Aderência superior e precisão nas curvas", 4800, "⚙️", false, 25),
    acc("sensor", "Sensores de Estacionamento 360°", "Detecção perimétrica completa de obstáculos", 2500, "📡", false, 460),
    acc("tapete_borracha", "Tapetes All-Weather Série S", "Visual exclusivo escurecido", 820, "🛡️", false, 20),
    acc("parafuso_antifurto", "Kit Parafusos Antifurto Mopar", "Segurança das rodas aro 19 Black", 480, "🔒", false, 15),
  ],
  "JEEP COMPASS TRAILHAWK": [
    acc("bagageiro", "Bagageiro de Teto Mopar Trail 400L", "Estrutura estanque à prova de água e poeira", 3100, "🧳", true, 80),
    acc("estribo", "Estribo Lateral Off-Road Trailhawk", "Aço carbono reforçado para trilhas extremas", 2800, "🚗", true, 110),
    acc("protetor", "Protetor de Carter e Diferencial 4x4", "Blindagem integral do motor e tração 4x4", 1600, "🛡️", true, 240),
    acc("pneus", "Pneus All-Terrain 225/60R17", "Máxima tração off-road e resistência a furos", 3800, "⚙️", true, 45),
    acc("rack", "Rack de Teto Adventure Mopar", "Capacidade estendida para expedições", 1500, "📦", true, 370),
    acc("engate", "Engate de Reboque Reforçado Trail Rated", "Tração pesada homologada", 2400, "🔗", false, 140),
    acc("guincho", "Kit Ganchos e Cabos Trail Rated", "Equipamento autêntico de resgate", 1300, "⚓", false, 200),
    acc("tapete_borracha", "Tapetes All-Weather Trailhawk", "Máxima proteção contra lama", 790, "🛡️", false, 30),
  ],
  "JEEP COMPASS BLACKHAWK": [
    acc("bagageiro", "Bagageiro Blackhawk Aerodinâmico 450L", "Acabamento esportivo e linhas aerodinâmicas", 3600, "🧳", true, 40),
    acc("estribo", "Estribo Lateral Blackhawk Performance", "Perfil esportivo reforçado em acabamento fosco", 2900, "🚗", true, 55),
    acc("protetor", "Protetor de Carter de Alta Resistência", "Proteção mecânica para arrancadas e condução dinâmica", 1650, "🛡️", true, 190),
    acc("rack", "Rack de Teto Shadow Mopar", "Linhas aerodinâmicas e acabamento escurecido", 1700, "📦", true, 110),
    acc("engate", "Engate Removível Shadow Mopar", "Tração homologada com acabamento dark", 2400, "🔗", false, 80),
    acc("friso", "Friso Lateral Dark Blackhawk", "Estilo escurecido de alta performance", 850, "✨", false, 310),
    acc("pneus", "Pneus Hurricane Performance 235/45R19", "Direcionabilidade precisa e alta tração", 4900, "⚙️", false, 15),
    acc("tapete_borracha", "Tapetes All-Weather Blackhawk", "Proteção esportiva", 820, "🛡️", false, 25),
  ],
  "JEEP COMMANDER OVERLAND": [
    acc("estribo", "Estribo Lateral Premium Commander", "Elegância e funcionalidade para 7 lugares", 3200, "🚗", true, 65),
    acc("protetor", "Protetor de Carter e Caixa", "Proteção mecânica completa", 2200, "🛡️", true, 330),
    acc("pneus", "Pneus Highway 235/55R19", "Performance premium silenciosa", 4200, "⚙️", true, 30),
    acc("rack", "Rack de Teto Integrado Commander", "Design elegante", 1800, "📦", true, 190),
    acc("bagageiro", "Bagageiro de Teto Mopar 450L", "Espaço extra para 7 passageiros", 3400, "🧳", false, 80),
    acc("engate", "Engate de Reboque Removível Mopar", "Capacidade para reboque e carretas", 2500, "🔗", false, 120),
    acc("sensor", "Sensores de Estacionamento 360°", "Segurança total em manobras", 2500, "📡", false, 480),
    acc("tapete_borracha", "Tapetes de Borda Elevada Commander", "Proteção para as 3 fileiras", 990, "🛡️", false, 35),
    acc("parafuso_antifurto", "Kit Parafusos Antifurto das Rodas", "Segurança das rodas aro 19", 480, "🔒", false, 20),
  ],
  "JEEP RENEGADE SPORT": [
    acc("bagageiro", "Bagageiro de Teto Mopar 400L", "Capacidade extra de 400L e vedação contra intempéries", 2850, "🧳", true, 90, "exterior"),
    acc("estribo", "Estribo Lateral Esportivo Mopar", "Acesso facilitado e proteção", 2200, "🚗", true, 85, "exterior"),
    acc("protetor", "Protetor de Carter Reforçado", "Proteção essencial do motor", 950, "🛡️", true, 210, "proteção"),
    acc("rack", "Barras Transversais de Teto Mopar", "Transporte seguro de cargas", 1350, "📦", true, 180, "exterior"),
    acc("engate", "Engate de Reboque Removível Mopar", "Homologado para reboques e bikes", 2200, "🔗", false, 110, "utilitário"),
    acc("friso", "Friso Lateral com Logo Renegade", "Proteção lateral estilizada", 600, "✨", false, 390, "exterior"),
    acc("pneus", "Pneus All-Season 215/65R16", "Durabilidade e conforto urbano", 3400, "⚙️", false, 25, "proteção"),
    acc("sensor", "Câmera e Sensores de Ré", "Manobras com máxima precisão", 1800, "📡", false, 420, "tecnologia"),
    acc("tapete_borracha", "Tapetes All-Weather Renegade", "Proteção de carpete", 690, "🛡️", false, 25, "interior"),
    acc("parafuso_antifurto", "Kit Parafusos Antifurto", "Segurança das rodas", 450, "🔒", false, 15, "proteção"),
    acc("soleira", "Soleiras de Porta Renegade Mopar", "Proteção de acesso à cabine", 590, "✨", false, 35, "interior"),
    acc("iluminacao_led", "Iluminação Interna LED Mopar (Kit Completo)", "Kit de iluminação LED de cortesia para cabine", 890, "💡", false, 40, "interior"),
    acc("organizador_console", "Organizador de Console Central Mopar", "Divisórias para itens de uso diário", 450, "📋", false, 30, "interior"),
    acc("pelicula_solar", "Película Solar Nano-Cerâmica 3M", "Redução térmica e bloqueio de radiação UV", 1380, "🌞", false, 22, "interior"),
  ],
  "JEEP RENEGADE LONGITUDE": [
    acc("bagageiro", "Bagageiro de Teto Mopar 400L", "Capacidade extra de 400L e fechadura com chave", 2850, "🧳", true, 75, "exterior"),
    acc("estribo", "Estribo Lateral Tubular Integrado", "Design integrado e facilidade de acesso", 2400, "🚗", true, 95, "exterior"),
    acc("protetor", "Protetor de Carter Reforçado", "Proteção contra impactos em valetas", 1100, "🛡️", true, 280, "proteção"),
    acc("rack", "Barras Transversais de Teto Mopar", "Versatilidade e esportividade", 1450, "📦", true, 160, "exterior"),
    acc("engate", "Engate de Reboque Removível Mopar", "Homologado para reboques leves", 2200, "🔗", false, 510, "utilitário"),
    acc("friso", "Friso Lateral Pintado na Cor do Veículo", "Estética refinada e proteção", 680, "✨", false, 410, "exterior"),
    acc("pneus", "Pneus Scorpion ATR 215/60R17", "Excelente aderência em piso seco ou molhado", 3800, "⚙️", false, 30, "proteção"),
    acc("tapete_borracha", "Tapetes All-Weather Renegade", "Proteção de carpete", 690, "🛡️", false, 20, "interior"),
    acc("parafuso_antifurto", "Kit Parafusos Antifurto", "Segurança das rodas", 450, "🔒", false, 15, "proteção"),
    acc("soleira", "Soleiras de Portas Iluminadas em LED", "Elegância e proteção no embarque", 1050, "✨", false, 45, "interior"),
    acc("iluminacao_led", "Iluminação Interna LED Mopar (Kit Completo)", "Iluminação de teto, portas e assoalho", 890, "💡", false, 35, "interior"),
    acc("organizador_console", "Organizador de Console Central Mopar", "Aproveitamento inteligente do console", 450, "📋", false, 28, "interior"),
    acc("pelicula_solar", "Película Solar Nano-Cerâmica 3M", "Conforto térmico avançado para toda a família", 1380, "🌞", false, 20, "interior"),
  ],
  "JEEP RENEGADE SAHARA": [
    acc("bagageiro", "Bagageiro de Teto Mopar Adventure 450L", "Máximo volume para viagens e design aerodinâmico", 3200, "🧳", true, 60, "exterior"),
    acc("estribo", "Estribo Lateral Sahara Premium", "Acabamento exclusivo e antiderrapante", 2500, "🚗", true, 70, "exterior"),
    acc("protetor", "Protetor de Carter Heavy Duty", "Proteção avançada sob o chassi", 1250, "🛡️", true, 195, "proteção"),
    acc("rack", "Rack de Teto Integrado Preto Fosco", "Design aventureiro e funcional", 1550, "📦", true, 140, "exterior"),
    acc("engate", "Engate de Reboque Removível Mopar", "Robustez e praticidade", 2200, "🔗", false, 290, "utilitário"),
    acc("friso", "Friso Lateral Exclusivo Sahara Bronze", "Detalhe premium diferenciado", 720, "✨", false, 380, "exterior"),
    acc("pneus", "Pneus All-Terrain 225/55R18", "Performance para viagens e estradas de terra", 4400, "⚙️", false, 40, "proteção"),
    acc("tapete_borracha", "Tapetes All-Weather Sahara", "Proteção de carpete", 720, "🛡️", false, 25, "interior"),
    acc("soleira", "Soleiras de Porta Sahara Bronze Mopar", "Acabamento exclusivo em bronze escovado", 750, "✨", false, 40, "interior"),
    acc("iluminacao_led", "Iluminação Interna LED Mopar", "Atmosfera sofisticada e moderna na cabine", 890, "💡", false, 35, "interior"),
    acc("pelicula_solar", "Película Solar Nano-Cerâmica 3M", "Redução de radiação solar e temperatura interna", 1380, "🌞", false, 18, "interior"),
  ],
  "JEEP RENEGADE TRAILHAWK": [
    acc("bagageiro", "Bagageiro de Teto Mopar Trail 400L", "Estrutura reforçada à prova de água e poeira", 3100, "🧳", true, 80, "exterior"),
    acc("estribo", "Estribo Lateral Off-Road Trailhawk", "Construção reforçada para trilhas", 2600, "🚗", true, 110, "exterior"),
    acc("protetor", "Protetor de Carter e Diferencial 4x4", "Blindagem completa para off-road severo", 1600, "🛡️", true, 320, "proteção"),
    acc("pneus", "Pneus Pirelli All-Terrain Plus 215/65R17", "Máxima tração e resistência a furos", 4200, "⚙️", true, 35, "proteção"),
    acc("rack", "Rack de Teto Adventure Mopar", "Capacidade estendida de bagagem", 1600, "📦", true, 220, "exterior"),
    acc("engate", "Engate de Reboque Reforçado Mopar", "Tração e utilidade extrema", 2400, "🔗", false, 180, "utilitário"),
    acc("guincho", "Kit Ganchos de Reboque Trail Rated", "Equipamento autêntico de resgate", 1200, "⚓", false, 450, "utilitário"),
    acc("tapete_borracha", "Tapetes All-Weather Trailhawk", "Máxima proteção contra barro", 750, "🛡️", false, 25, "interior"),
    acc("soleira", "Soleiras de Porta em Alumínio Escovado Trailhawk", "Proteção e estilo Trail Rated na entrada da cabine", 750, "✨", false, 60, "interior"),
    acc("iluminacao_led", "Iluminação Interna LED Trail Rated Mopar", "Kit de iluminação LED para cabine e bagageiro com resistência a umidade", 890, "💡", false, 50, "interior"),
    acc("organizador_console", "Organizador de Console Trail Mopar", "Suporte modular para equipamentos de trilha — cabos, ferramentas e GPS", 520, "📋", false, 40, "interior"),
    acc("pelicula_solar", "Película Solar Nano-Cerâmica 3M (Vidros Laterais)", "Proteção solar avançada para expedições em regiões de alta insolação", 1380, "🌞", false, 25, "interior"),
    acc("protetor_porta_int", "Kit Protetor de Porta Interno Trail Rated (4 peças)", "Protege o interior das portas do barro e desgaste das trilhas", 420, "🛡️", false, 55, "interior"),
  ],
  "JEEP RENEGADE SERIE S": [
    acc("bagageiro", "Bagageiro de Teto Mopar Black Piano 400L", "Design aerodinâmico premium com chave antifurto", 3300, "🧳", true, 50, "exterior"),
    acc("estribo", "Estribo Lateral Slim Dark", "Design esportivo discreto", 2550, "🚗", true, 80, "exterior"),
    acc("protetor", "Protetor de Carter Alumínio", "Leveza e resistência garantidas", 1300, "🛡️", true, 260, "proteção"),
    acc("rack", "Rack de Teto Aerodinâmico Mopar", "Baixo ruído aerodinâmico", 1650, "📦", true, 150, "exterior"),
    acc("engate", "Engate de Reboque Removível Dark Mopar", "Ponteira removível e tomada", 2300, "🔗", false, 120, "utilitário"),
    acc("friso", "Friso Lateral Série S Black Piano", "Harmonia visual sofisticada", 750, "✨", false, 395, "exterior"),
    acc("pneus", "Pneus High Performance 235/45R19", "Direcionabilidade e esportividade", 4800, "⚙️", false, 20, "proteção"),
    acc("sensor", "Sensores de Estacionamento 360°", "Segurança total em garagens", 2500, "📡", false, 460, "tecnologia"),
    acc("tapete_borracha", "Tapetes All-Weather Série S", "Proteção estilizada", 750, "🛡️", false, 25, "interior"),
    acc("parafuso_antifurto", "Kit Parafusos Antifurto", "Segurança das rodas aro 19", 480, "🔒", false, 15, "proteção"),
    acc("soleira", "Soleiras Iluminadas Dark Série S", "Visual exclusivo dark no embarque", 1100, "✨", false, 30, "interior"),
    acc("iluminacao_led", "Iluminação Interna LED Série S", "LEDs brancos frios para cabine e porta-malas", 890, "💡", false, 25, "interior"),
    acc("pelicula_solar", "Película Solar Nano-Cerâmica 3M", "Proteção solar e visual dark nos vidros", 1380, "🌞", false, 15, "interior"),
  ],
};

// Nomes dos pacotes por tipo de veículo
export const packageNames: Record<string, string> = {
  "RAM RAMPAGE REBEL": "Pacote Off-Road Pro",
  "RAM RAMPAGE LARAMIE": "Pacote Premium Urban",
  "RAM 1500 LARAMIE": "Pacote Full Power",
  "RAM 2500 LARAMIE": "Pacote Heavy Duty Pro",
  "RAM 3500 LARAMIE": "Pacote Industrial Max",
  "FIAT TORO RANCH": "Pacote Ranch Adventure",
  "FIAT TORO ULTRA": "Pacote Urban Style",
  "JEEP RENEGADE SPORT": "Pacote Sport Essential Protection",
  "JEEP RENEGADE LONGITUDE": "Pacote Longitude Tech & Urban",
  "JEEP RENEGADE SAHARA": "Pacote Sahara Adventure Edition",
  "JEEP RENEGADE TRAILHAWK": "Pacote Trailhawk Trail Rated 4x4",
  "JEEP RENEGADE SERIE S": "Pacote Série S Dark Style",
  "JEEP COMPASS SPORT": "Pacote Sport Essential Protection",
  "JEEP COMPASS LONGITUDE": "Pacote Longitude Elegance & Tech",
  "JEEP COMPASS LIMITED": "Pacote Limited Premium Executive",
  "JEEP COMPASS SERIE S": "Pacote Série S Dark Style",
  "JEEP COMPASS TRAILHAWK": "Pacote Trail Master 4x4",
  "JEEP COMPASS BLACKHAWK": "Pacote Blackhawk Performance",
  "JEEP COMMANDER OVERLAND": "Pacote Overland Premium",
};

export const getAccessoriesForVehicle = (vehicleModel: string): Accessory[] => {
  if (accessoriesByVehicle[vehicleModel]) {
    return accessoriesByVehicle[vehicleModel];
  }
  if (vehicleModel.toUpperCase().includes("COMPASS")) {
    return accessoriesByVehicle["JEEP COMPASS TRAILHAWK"];
  }
  return accessoriesByVehicle["RAM RAMPAGE REBEL"];
};

export const getPackageName = (vehicleModel: string): string => {
  if (packageNames[vehicleModel]) {
    return packageNames[vehicleModel];
  }
  if (vehicleModel.toUpperCase().includes("COMPASS")) {
    return "Pacote Compass Adventure & Tech";
  }
  return "Pacote Personalizado";
};

export const defaultAccessories: Accessory[] = accessoriesByVehicle["RAM RAMPAGE REBEL"];

export const defaultClientData: ClientData = {
  vehicleModel: "RAM RAMPAGE REBEL",
  vehicleColor: "Vermelho Colorado",
  vehicleYear: "2024/2025",
  clientName: "João Silva",
  clientAge: "35",
  clientGender: "Masculino",
  state: "Mato Grosso",
  terrainType: "Estradas de Terra / Rural",
  climateCondition: "Alta Incidência de Chuvas",
};
