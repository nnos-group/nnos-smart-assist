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

export const defaultAccessories: Accessory[] = [
  {
    id: "estribo",
    name: "Estribo Lateral Premium",
    description: "Acesso facilitado e proteção lateral",
    price: 2500,
    icon: "🚗",
    selected: true,
  },
  {
    id: "protetor",
    name: "Protetor de Caçamba HD",
    description: "Proteção contra riscos e impactos",
    price: 1200,
    icon: "🛡️",
    selected: true,
  },
  {
    id: "pneus",
    name: "Pneus All-Terrain 265/70R16",
    description: "Tração superior em qualquer terreno",
    price: 4800,
    icon: "⚙️",
    selected: true,
  },
  {
    id: "friso",
    name: "Friso Lateral Cromado",
    description: "Proteção e estética refinada",
    price: 450,
    icon: "✨",
    selected: true,
  },
];

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
