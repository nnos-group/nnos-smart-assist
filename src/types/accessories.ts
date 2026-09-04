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

// Helper: criar acessório com estoque simulado
const acc = (
  id: string, name: string, description: string, price: number, icon: string, 
  selected: boolean, stockDays: number
): Accessory => {
  const info = getStockInfo(stockDays);
  return {
    id, name, description, price, icon, selected,
    stockStatus: info.status,
    stockDays,
    discountPercent: info.discount,
  };
};

// Acessórios específicos por tipo de veículo (com dados de estoque simulados)
export const accessoriesByVehicle: Record<string, Accessory[]> = {
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
  "JEEP COMPASS SPORT": [
    acc("bagageiro", "Bagageiro de Teto Mopar 400L", "Capacidade extra e vedação contra poeira", 2850, "🧳", true, 90),
    acc("estribo", "Estribo Lateral Tubular Integrado", "Acesso facilitado e proteção da carroceria", 2400, "🚗", true, 80),
    acc("protetor", "Protetor de Carter Reforçado", "Proteção vital para o conjunto mecânico", 1200, "🛡️", true, 210),
    acc("friso", "Friso Lateral com Grafia Compass", "Proteção contra pequenos impactos e arranhões", 650, "✨", true, 390),
    acc("rack", "Barras Transversais de Teto Mopar", "Transporte seguro de cargas e bagagens", 1350, "📦", true, 160),
    acc("sensor", "Câmera e Sensores de Estacionamento", "Manobras urbanas precisas e seguras", 1800, "📡", false, 420),
  ],
  "JEEP COMPASS LONGITUDE": [
    acc("bagageiro", "Bagageiro de Teto Mopar Adventure 450L", "Design aerodinâmico e máxima litragem", 3200, "🧳", true, 70),
    acc("estribo", "Estribo Lateral Premium Integrado", "Acabamento elegante e segurança no embarque", 2500, "🚗", true, 95),
    acc("protetor", "Protetor de Carter Reforçado", "Blindagem preventiva sob o assoalho", 1250, "🛡️", true, 260),
    acc("friso", "Friso Lateral na Cor do Veículo", "Estética sofisticada e proteção de portas", 700, "✨", true, 410),
    acc("rack", "Barras Transversais de Teto Mopar", "Versatilidade para viagens e esportes", 1400, "📦", true, 180),
    acc("soleira", "Soleiras de Portas Iluminadas em LED", "Elegância e proteção no acesso à cabine", 1100, "✨", false, 150),
  ],
  "JEEP COMPASS LIMITED": [
    acc("bagageiro", "Bagageiro de Teto Mopar Black 450L", "Elegância executiva com chave de segurança", 3400, "🧳", true, 60),
    acc("estribo", "Estribo Lateral Slim Dark", "Perfil discreto de alta resistência", 2600, "🚗", true, 75),
    acc("protetor", "Protetor de Carter e Câmbio", "Proteção completa de conjunto motriz", 1400, "🛡️", true, 280),
    acc("friso", "Friso Lateral Cromado Compass", "Acabamento nobre combinando com frisos de teto", 780, "✨", true, 380),
    acc("rack", "Rack de Teto Aerodinâmico Mopar", "Baixo ruído de vento e encaixe perfeito", 1550, "📦", true, 140),
    acc("engate", "Engate de Reboque Removível Mopar", "Homologado para reboques e suporte de bicicletas", 2300, "🔗", false, 300),
  ],
  "JEEP COMPASS SERIE S": [
    acc("bagageiro", "Bagageiro de Teto Black Piano Mopar 450L", "Visual Dark Premium com acabamento em preto brilhante", 3500, "🧳", true, 45),
    acc("estribo", "Estribo Lateral Dark Série S", "Design esportivo escurecido exclusivo", 2700, "🚗", true, 65),
    acc("protetor", "Protetor de Carter em Alumínio", "Leveza superior e proteção de impacto", 1450, "🛡️", true, 230),
    acc("friso", "Friso Lateral Série S Black Piano", "Total harmonia com as molduras escuras", 820, "✨", true, 395),
    acc("pneus", "Pneus High Performance 235/45R19", "Aderência superior e precisão nas curvas", 4800, "⚙️", true, 25),
    acc("rack", "Rack de Teto Dark Aero Mopar", "Acabamento escurecido homologado de fábrica", 1650, "📦", true, 120),
    acc("sensor", "Sensores de Estacionamento 360°", "Detecção perimétrica completa de obstáculos", 2500, "📡", false, 460),
  ],
  "JEEP COMPASS TRAILHAWK": [
    acc("bagageiro", "Bagageiro de Teto Mopar Trail 400L", "Estrutura estanque à prova de água e poeira", 3100, "🧳", true, 80),
    acc("estribo", "Estribo Lateral Off-Road Trailhawk", "Aço carbono reforçado para trilhas extremas", 2800, "🚗", true, 110),
    acc("protetor", "Protetor de Carter e Diferencial 4x4", "Blindagem integral do motor e tração 4x4", 1600, "🛡️", true, 240),
    acc("pneus", "Pneus All-Terrain 225/60R17", "Máxima tração off-road e resistência a furos", 3800, "⚙️", true, 45),
    acc("rack", "Rack de Teto Adventure Mopar", "Capacidade estendida para expedições", 1500, "📦", true, 370),
    acc("guincho", "Kit Ganchos e Cabos Trail Rated", "Equipamento autêntico de resgate", 1300, "⚓", false, 200),
  ],
  "JEEP COMPASS BLACKHAWK": [
    acc("bagageiro", "Bagageiro Blackhawk Aerodinâmico 450L", "Acabamento esportivo e linhas aerodinâmicas", 3600, "🧳", true, 40),
    acc("estribo", "Estribo Lateral Blackhawk Performance", "Perfil esportivo reforçado em acabamento fosco", 2900, "🚗", true, 55),
    acc("protetor", "Protetor de Carter de Alta Resistência", "Proteção mecânica para arrancadas e condução dinâmica", 1650, "🛡️", true, 190),
    acc("friso", "Friso Lateral Dark Blackhawk", "Estilo escurecido de alta performance", 850, "✨", true, 310),
    acc("pneus", "Pneus Hurricane Performance 235/45R19", "Direcionabilidade precisa e alta tração", 4900, "⚙️", true, 15),
    acc("rack", "Rack de Teto Shadow Mopar", "Linhas aerodinâmicas e acabamento escurecido", 1700, "📦", true, 110),
  ],
  "JEEP COMMANDER OVERLAND": [
    acc("estribo", "Estribo Lateral Premium", "Elegância e funcionalidade", 3200, "🚗", true, 65),
    acc("protetor", "Protetor de Carter e Caixa", "Proteção completa", 2200, "🛡️", true, 330),
    acc("pneus", "Pneus Highway 235/55R19", "Performance premium", 4200, "⚙️", true, 30),
    acc("rack", "Rack de Teto Integrado", "Design elegante", 1800, "📦", true, 190),
    acc("sensor", "Sensores de Estacionamento 360°", "Segurança total", 2500, "📡", false, 480),
  ],
  "JEEP RENEGADE SPORT": [
    acc("bagageiro", "Bagageiro de Teto Mopar 400L", "Capacidade extra de 400L e vedação contra intempéries", 2850, "🧳", true, 90),
    acc("estribo", "Estribo Lateral Esportivo Mopar", "Acesso facilitado e proteção", 2200, "🚗", true, 85),
    acc("protetor", "Protetor de Carter Reforçado", "Proteção essencial do motor", 950, "🛡️", true, 210),
    acc("friso", "Friso Lateral com Logo Renegade", "Proteção lateral estilizada", 600, "✨", true, 390),
    acc("pneus", "Pneus All-Season 215/65R16", "Durabilidade e conforto urbano", 3400, "⚙️", true, 25),
    acc("rack", "Barras Transversais de Teto Mopar", "Transporte seguro de cargas", 1350, "📦", true, 180),
    acc("sensor", "Câmera e Sensores de Ré", "Manobras com máxima precisão", 1800, "📡", false, 420),
  ],
  "JEEP RENEGADE LONGITUDE": [
    acc("bagageiro", "Bagageiro de Teto Mopar 400L", "Capacidade extra de 400L e fechadura com chave", 2850, "🧳", true, 75),
    acc("estribo", "Estribo Lateral Tubular Integrado", "Design integrado e facilidade de acesso", 2400, "🚗", true, 95),
    acc("protetor", "Protetor de Carter Reforçado", "Proteção contra impactos em valetas", 1100, "🛡️", true, 280),
    acc("friso", "Friso Lateral Pintado na Cor do Veículo", "Estética refinada e proteção", 680, "✨", true, 410),
    acc("pneus", "Pneus Scorpion ATR 215/60R17", "Excelente aderência em piso seco ou molhado", 3800, "⚙️", true, 30),
    acc("rack", "Barras Transversais de Teto Mopar", "Versatilidade e esportividade", 1450, "📦", true, 160),
    acc("engate", "Engate de Reboque Removível Mopar", "Homologado para reboques leves", 2200, "🔗", false, 510),
  ],
  "JEEP RENEGADE SAHARA": [
    acc("bagageiro", "Bagageiro de Teto Mopar Adventure 450L", "Máximo volume para viagens e design aerodinâmico", 3200, "🧳", true, 60),
    acc("estribo", "Estribo Lateral Sahara Premium", "Acabamento exclusivo e antiderrapante", 2500, "🚗", true, 70),
    acc("protetor", "Protetor de Carter Heavy Duty", "Proteção avançada sob o chassi", 1250, "🛡️", true, 195),
    acc("friso", "Friso Lateral Exclusivo Sahara Bronze", "Detalhe premium diferenciado", 720, "✨", true, 380),
    acc("pneus", "Pneus All-Terrain 225/55R18", "Performance para viagens e estradas de terra", 4400, "⚙️", true, 40),
    acc("rack", "Rack de Teto Integrado Preto Fosco", "Design aventureiro e funcional", 1550, "📦", true, 140),
    acc("engate", "Engate de Reboque Removível Mopar", "Robustez e praticidade", 2200, "🔗", false, 290),
  ],
  "JEEP RENEGADE TRAILHAWK": [
    acc("bagageiro", "Bagageiro de Teto Mopar Trail 400L", "Estrutura reforçada à prova de água e poeira", 3100, "🧳", true, 80),
    acc("estribo", "Estribo Lateral Off-Road Trailhawk", "Construção reforçada para trilhas", 2600, "🚗", true, 110),
    acc("protetor", "Protetor de Carter e Diferencial 4x4", "Blindagem completa para off-road severo", 1600, "🛡️", true, 320),
    acc("pneus", "Pneus Pirelli All-Terrain Plus 215/65R17", "Máxima tração e resistência a furos", 4200, "⚙️", true, 35),
    acc("rack", "Rack de Teto Adventure Mopar", "Capacidade estendida de bagagem", 1600, "📦", true, 220),
    acc("guincho", "Kit Ganchos de Reboque Trail Rated", "Equipamento autêntico de resgate", 1200, "⚓", true, 450),
    acc("engate", "Engate de Reboque Reforçado Mopar", "Tração e utilidade extrema", 2400, "🔗", false, 180),
  ],
  "JEEP RENEGADE SERIE S": [
    acc("bagageiro", "Bagageiro de Teto Mopar Black Piano 400L", "Design aerodinâmico premium com chave antifurto", 3300, "🧳", true, 50),
    acc("estribo", "Estribo Lateral Slim Dark", "Design esportivo discreto", 2550, "🚗", true, 80),
    acc("protetor", "Protetor de Carter Alumínio", "Leveza e resistência garantidas", 1300, "🛡️", true, 260),
    acc("friso", "Friso Lateral Série S Black Piano", "Harmonia visual sofisticada", 750, "✨", true, 395),
    acc("pneus", "Pneus High Performance 235/45R19", "Direcionabilidade e esportividade", 4800, "⚙️", true, 20),
    acc("rack", "Rack de Teto Aerodinâmico Mopar", "Baixo ruído aerodinâmico", 1650, "📦", true, 150),
    acc("sensor", "Sensores de Estacionamento 360°", "Segurança total em garagens", 2500, "📡", false, 460),
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
  vehicleColor: "Vermelho Volcano",
  vehicleYear: "2024/2025",
  clientName: "João Silva",
  clientAge: "35",
  clientGender: "Masculino",
  state: "Mato Grosso",
  terrainType: "Estradas de Terra / Rural",
  climateCondition: "Alta Incidência de Chuvas",
};
