export interface Accessory {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  selected: boolean;
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

// Acessórios específicos por tipo de veículo
export const accessoriesByVehicle: Record<string, Accessory[]> = {
  // RAM - Pickups
  "RAM RAMPAGE REBEL": [
    { id: "estribo", name: "Estribo Lateral Premium", description: "Acesso facilitado e proteção lateral", price: 2500, icon: "🚗", selected: true },
    { id: "protetor", name: "Protetor de Caçamba HD", description: "Proteção contra riscos e impactos", price: 1200, icon: "🛡️", selected: true },
    { id: "pneus", name: "Pneus All-Terrain 265/70R16", description: "Tração superior em qualquer terreno", price: 4800, icon: "⚙️", selected: true },
    { id: "friso", name: "Friso Lateral Cromado", description: "Proteção e estética refinada", price: 450, icon: "✨", selected: true },
    { id: "santantonio", name: "Santo Antônio Esportivo", description: "Proteção e estilo para sua pickup", price: 1800, icon: "🏋️", selected: false },
    { id: "capota", name: "Capota Marítima Retrátil", description: "Proteção total da caçamba", price: 3200, icon: "🔒", selected: false },
  ],
  "RAM RAMPAGE LARAMIE": [
    { id: "estribo", name: "Estribo Lateral Premium", description: "Acesso facilitado e proteção lateral", price: 2500, icon: "🚗", selected: true },
    { id: "protetor", name: "Protetor de Caçamba HD", description: "Proteção contra riscos e impactos", price: 1200, icon: "🛡️", selected: true },
    { id: "pneus", name: "Pneus Highway 265/65R17", description: "Conforto e durabilidade no asfalto", price: 3800, icon: "⚙️", selected: true },
    { id: "friso", name: "Friso Lateral Cromado", description: "Proteção e estética refinada", price: 450, icon: "✨", selected: true },
    { id: "capota", name: "Capota Rígida Elétrica", description: "Abertura automática premium", price: 5500, icon: "🔒", selected: false },
  ],
  "RAM 1500 LARAMIE": [
    { id: "estribo", name: "Estribo Lateral Elétrico", description: "Acesso automatizado premium", price: 4500, icon: "🚗", selected: true },
    { id: "protetor", name: "Protetor de Caçamba Spray-On", description: "Proteção permanente profissional", price: 2800, icon: "🛡️", selected: true },
    { id: "pneus", name: "Pneus All-Terrain 275/65R18", description: "Performance em todos os terrenos", price: 6200, icon: "⚙️", selected: true },
    { id: "santantonio", name: "Santo Antônio Off-Road", description: "Proteção e estilo esportivo", price: 3200, icon: "🏋️", selected: true },
    { id: "capota", name: "Capota Rígida Tri-Fold", description: "Abertura em três partes", price: 4800, icon: "🔒", selected: false },
  ],
  "RAM 2500 LARAMIE": [
    { id: "estribo", name: "Estribo Lateral Elétrico", description: "Acesso automatizado premium", price: 4800, icon: "🚗", selected: true },
    { id: "protetor", name: "Protetor de Caçamba Heavy Duty", description: "Para cargas pesadas", price: 3200, icon: "🛡️", selected: true },
    { id: "pneus", name: "Pneus LT275/70R18", description: "Carga extra e durabilidade", price: 7500, icon: "⚙️", selected: true },
    { id: "engate", name: "Engate de Reboque 5ª Roda", description: "Para reboques pesados", price: 5200, icon: "🔗", selected: true },
    { id: "farol", name: "Kit Faróis Auxiliares LED", description: "Iluminação off-road potente", price: 2800, icon: "💡", selected: false },
  ],
  "RAM 3500 LARAMIE": [
    { id: "estribo", name: "Estribo Lateral Elétrico", description: "Acesso automatizado premium", price: 4800, icon: "🚗", selected: true },
    { id: "protetor", name: "Protetor de Caçamba Industrial", description: "Máxima resistência a impactos", price: 3800, icon: "🛡️", selected: true },
    { id: "pneus", name: "Pneus LT285/75R17", description: "Máxima capacidade de carga", price: 8200, icon: "⚙️", selected: true },
    { id: "engate", name: "Engate Gooseneck", description: "Para reboques especiais", price: 4500, icon: "🔗", selected: true },
    { id: "toolbox", name: "Caixa de Ferramentas Embutida", description: "Armazenamento profissional", price: 2200, icon: "🧰", selected: false },
  ],
  // FIAT TORO
  "FIAT TORO RANCH": [
    { id: "estribo", name: "Estribo Lateral Tubular", description: "Design esportivo e funcional", price: 1800, icon: "🚗", selected: true },
    { id: "protetor", name: "Protetor de Caçamba", description: "Proteção contra riscos", price: 850, icon: "🛡️", selected: true },
    { id: "pneus", name: "Pneus All-Terrain 225/65R17", description: "Tração em diversos terrenos", price: 3200, icon: "⚙️", selected: true },
    { id: "santantonio", name: "Santo Antônio Cromado", description: "Estilo e proteção", price: 1500, icon: "🏋️", selected: true },
    { id: "capota", name: "Capota Marítima", description: "Proteção flexível da caçamba", price: 1200, icon: "🔒", selected: false },
  ],
  "FIAT TORO ULTRA": [
    { id: "estribo", name: "Estribo Lateral Premium", description: "Design urbano sofisticado", price: 2200, icon: "🚗", selected: true },
    { id: "protetor", name: "Protetor de Caçamba", description: "Proteção contra riscos", price: 850, icon: "🛡️", selected: true },
    { id: "pneus", name: "Pneus Highway 225/55R18", description: "Conforto e economia", price: 2800, icon: "⚙️", selected: true },
    { id: "friso", name: "Friso Lateral na Cor do Veículo", description: "Visual integrado", price: 650, icon: "✨", selected: true },
    { id: "capota", name: "Capota Rígida Elétrica", description: "Abertura automática", price: 4200, icon: "🔒", selected: false },
  ],
  // JEEP
  "JEEP COMPASS TRAILHAWK": [
    { id: "estribo", name: "Estribo Lateral Off-Road", description: "Para trilhas extremas", price: 2800, icon: "🚗", selected: true },
    { id: "protetor", name: "Protetor de Carter", description: "Proteção do motor", price: 1500, icon: "🛡️", selected: true },
    { id: "pneus", name: "Pneus All-Terrain 225/60R17", description: "Máxima tração off-road", price: 3600, icon: "⚙️", selected: true },
    { id: "rack", name: "Rack de Teto Travessa", description: "Transporte de equipamentos", price: 1200, icon: "📦", selected: true },
    { id: "guincho", name: "Kit Guincho Dianteiro", description: "Recuperação em trilhas", price: 4500, icon: "⚓", selected: false },
  ],
  "JEEP COMMANDER OVERLAND": [
    { id: "estribo", name: "Estribo Lateral Premium", description: "Elegância e funcionalidade", price: 3200, icon: "🚗", selected: true },
    { id: "protetor", name: "Protetor de Carter e Caixa", description: "Proteção completa", price: 2200, icon: "🛡️", selected: true },
    { id: "pneus", name: "Pneus Highway 235/55R19", description: "Performance premium", price: 4200, icon: "⚙️", selected: true },
    { id: "rack", name: "Rack de Teto Integrado", description: "Design elegante", price: 1800, icon: "📦", selected: true },
    { id: "sensor", name: "Sensores de Estacionamento 360°", description: "Segurança total", price: 2500, icon: "📡", selected: false },
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

// Função para obter acessórios do veículo selecionado
export const getAccessoriesForVehicle = (vehicleModel: string): Accessory[] => {
  return accessoriesByVehicle[vehicleModel] || accessoriesByVehicle["RAM RAMPAGE REBEL"];
};

// Função para obter o nome do pacote
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
