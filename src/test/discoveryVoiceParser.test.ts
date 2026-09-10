import { describe, it, expect } from "vitest";
import { parseVoiceTranscript } from "@/lib/discoveryVoiceParser";

describe("Discovery Voice Parser", () => {
  it("correctly extracts mixed usage, weekly dirt road, children, tools and protection priorities", () => {
    const input =
      "Ele usa o carro durante a semana na cidade, mas todo fim de semana vai para o sítio. Leva os dois filhos e algumas ferramentas na caçamba.";

    const result = parseVoiceTranscript(input);

    expect(result.usageLocation).toBe("uso_misto");
    expect(result.dirtRoadFrequency).toBe("semanalmente");
    expect(result.cargoUsage).toBe("ferramentas");
    expect(result.frequentPassengers).toContain("criancas");
    expect(result.specialNeeds).toContain("protecao_cacamba");
    expect(result.specialNeeds).toContain("acesso_facilitado");
    expect(result.priorities).toContain("protecao");
    expect(result.extractedKeywords.length).toBeGreaterThan(0);
    expect(result.summaryMessage).toBeDefined();
  });

  it("extracts heavy rural and off-road phrases", () => {
    const input = "Mora na fazenda, roda todo dia na terra com trator, carga pesada e funcionários.";
    const result = parseVoiceTranscript(input);

    expect(result.dirtRoadFrequency).toBe("diariamente");
    expect(result.cargoUsage).toBe("cargas_pesadas");
    expect(result.frequentPassengers).toContain("equipe_trabalho");
  });
});
