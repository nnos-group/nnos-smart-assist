import { DiscoveryProfile } from "@/types/salesJourney";

export interface ParsedVoiceDiagnostic {
  usageLocation?: DiscoveryProfile["usageLocation"];
  monthlyKm?: DiscoveryProfile["monthlyKm"];
  dirtRoadFrequency?: DiscoveryProfile["dirtRoadFrequency"];
  cargoUsage?: DiscoveryProfile["cargoUsage"];
  frequentPassengers: DiscoveryProfile["frequentPassengers"];
  tripFrequency?: DiscoveryProfile["tripFrequency"];
  specialNeeds: DiscoveryProfile["specialNeeds"];
  priorities: DiscoveryProfile["priorities"];
  parkingLocation?: DiscoveryProfile["parkingLocation"];
  rawText: string;
  extractedKeywords: string[];
  summaryMessage: string;
}

export function parseVoiceTranscript(transcript: string): ParsedVoiceDiagnostic {
  const text = transcript.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const extractedKeywords: string[] = [];
  const passengers: DiscoveryProfile["frequentPassengers"] = [];
  const specialNeeds: DiscoveryProfile["specialNeeds"] = [];
  const priorities: DiscoveryProfile["priorities"] = [];

  let usageLocation: DiscoveryProfile["usageLocation"] | undefined;
  let dirtRoadFrequency: DiscoveryProfile["dirtRoadFrequency"] | undefined;
  let cargoUsage: DiscoveryProfile["cargoUsage"] | undefined;
  let monthlyKm: DiscoveryProfile["monthlyKm"] | undefined;
  let tripFrequency: DiscoveryProfile["tripFrequency"] | undefined;
  let parkingLocation: DiscoveryProfile["parkingLocation"] | undefined;

  // 1. Uso / Localização
  if (text.includes("misto") || (text.includes("cidade") && (text.includes("sitio") || text.includes("fazenda") || text.includes("terra")))) {
    usageLocation = "uso_misto";
    extractedKeywords.push("Uso misto (cidade + sítio/campo)");
  } else if (text.includes("trilha") || text.includes("off road") || text.includes("off-road") || text.includes("atoleiro")) {
    usageLocation = "off_road";
    extractedKeywords.push("Trilhas / Off-road severo");
  } else if (text.includes("sitio") || text.includes("fazenda") || text.includes("rural") || text.includes("chacara")) {
    usageLocation = "zona_rural";
    extractedKeywords.push("Zona rural");
  } else if (text.includes("rodovia") || text.includes("estrada") || text.includes("viajar")) {
    usageLocation = "rodovia";
    extractedKeywords.push("Rodovias");
  } else if (text.includes("cidade") || text.includes("urbano")) {
    usageLocation = "cidade";
    extractedKeywords.push("Uso urbano");
  }

  // 2. Estrada de terra
  if (text.includes("todo fim de semana") || text.includes("semanal") || text.includes("fim de semana")) {
    dirtRoadFrequency = "semanalmente";
    extractedKeywords.push("Estrada de terra semanal");
  } else if (text.includes("todo dia") || text.includes("diario") || text.includes("mora na fazenda")) {
    dirtRoadFrequency = "diariamente";
    extractedKeywords.push("Estrada de terra diária");
  } else if (text.includes("as vezes") || text.includes("ocasional") || text.includes("raramente na terra")) {
    dirtRoadFrequency = "ocasionalmente";
    extractedKeywords.push("Estrada de terra ocasional");
  } else if (text.includes("nunca terra") || text.includes("so asfalto")) {
    dirtRoadFrequency = "nunca";
    extractedKeywords.push("Apenas asfalto");
  }

  // 3. Passageiros
  if (text.includes("filho") || text.includes("crianca") || text.includes("bebe")) {
    passengers.push("criancas");
    extractedKeywords.push("Transporte de crianças");
  }
  if (text.includes("idoso") || text.includes("pais") || text.includes("avo") || text.includes("mae") || text.includes("pai idoso")) {
    passengers.push("idosos");
    extractedKeywords.push("Transporte de idosos");
  }
  if (text.includes("cachorro") || text.includes("pet") || text.includes("animal")) {
    passengers.push("animais");
    extractedKeywords.push("Transporte de animais");
  }
  if (text.includes("equipe") || text.includes("funcionario") || text.includes("peao") || text.includes("ajudante")) {
    passengers.push("equipe_trabalho");
    extractedKeywords.push("Equipe de trabalho");
  }

  // 4. Carga
  if (text.includes("ferramenta") || text.includes("equipamento") || text.includes("caixa de ferramenta")) {
    cargoUsage = "ferramentas";
    extractedKeywords.push("Transporte de ferramentas");
  } else if (text.includes("pesada") || text.includes("adubo") || text.includes("saco") || text.includes("cimento") || text.includes("grãos")) {
    cargoUsage = "cargas_pesadas";
    extractedKeywords.push("Cargas pesadas");
  } else if (text.includes("material") || text.includes("mostruario") || text.includes("profissional")) {
    cargoUsage = "materiais_profissionais";
    extractedKeywords.push("Materiais profissionais");
  } else if (text.includes("mala") || text.includes("compra") || text.includes("leve")) {
    cargoUsage = "cargas_leves";
    extractedKeywords.push("Cargas leves / compras");
  }

  // 5. Necessidades e Prioridades automáticas sugeridas
  if (cargoUsage === "ferramentas" || cargoUsage === "cargas_pesadas" || text.includes("cacamba")) {
    specialNeeds.push("protecao_cacamba");
    priorities.push("protecao");
  }
  if (passengers.includes("criancas") || passengers.includes("idosos")) {
    specialNeeds.push("acesso_facilitado");
    priorities.push("praticidade");
    priorities.push("seguranca");
  }
  if (dirtRoadFrequency === "semanalmente" || dirtRoadFrequency === "diariamente") {
    priorities.push("protecao");
  }
  if (text.includes("reboque") || text.includes("barco") || text.includes("carretinha") || text.includes("jetski")) {
    specialNeeds.push("reboque");
    priorities.push("praticidade");
  }
  if (text.includes("bicicleta") || text.includes("bike")) {
    specialNeeds.push("transporte_bicicletas");
  }
  if (text.includes("bagagem") || text.includes("falta espaco") || text.includes("mala")) {
    specialNeeds.push("bagagem_extra");
  }

  // Eliminar duplicatas
  const uniqueSpecialNeeds = Array.from(new Set(specialNeeds));
  const uniquePriorities = Array.from(new Set(priorities)).slice(0, 3) as DiscoveryProfile["priorities"];

  const summary = `Identificado uso ${usageLocation ? usageLocation.replace("_", " ") : "misto"}, com ${dirtRoadFrequency || "frequência semanal de terra"}${passengers.length > 0 ? `, passageiros: ${passengers.join(", ")}` : ""}${cargoUsage ? `, carga: ${cargoUsage}` : ""}.`;

  return {
    usageLocation: usageLocation || "uso_misto",
    dirtRoadFrequency: dirtRoadFrequency || "semanalmente",
    cargoUsage: cargoUsage || "ferramentas",
    frequentPassengers: passengers.length > 0 ? passengers : ["criancas"],
    monthlyKm: monthlyKm || "1000_2000",
    tripFrequency: tripFrequency || "quinzenalmente",
    specialNeeds: uniqueSpecialNeeds.length > 0 ? uniqueSpecialNeeds : ["protecao_cacamba", "acesso_facilitado"],
    priorities: uniquePriorities.length > 0 ? uniquePriorities : ["protecao", "praticidade", "seguranca"],
    parkingLocation: parkingLocation || "garagem_fechada",
    rawText: transcript,
    extractedKeywords,
    summaryMessage: summary,
  };
}
