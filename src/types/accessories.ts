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
  "JEEP COMPASS TRAILHAWK": "/vehicles/jeep-compass-trailhawk.jpg",
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

// Nomes dos pacotes por tipo de veículo
export const packageNames: Record<string, string> = {
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

export const getAccessoriesForVehicle = (vehicleModel: string): Accessory[] => {
  return accessoriesByVehicle[vehicleModel] || accessoriesByVehicle["RAM RAMPAGE REBEL"];
};

export const getPackageName = (vehicleModel: string): string => {
  return packageNames[vehicleModel] || "Pacote Personalizado";
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
