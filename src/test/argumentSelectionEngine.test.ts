import { describe, it, expect } from "vitest";
import {
  APPROVED_COMMERCIAL_ARGUMENTS,
  getApprovedArgumentForObjection,
  generateCustomizedArgumentContext,
} from "@/lib/argumentSelectionEngine";

describe("Argument Selection Engine", () => {
  it("contains all 12 mapped objection categories", () => {
    const categories = APPROVED_COMMERCIAL_ARGUMENTS.map((a) => a.objection);
    expect(categories).toContain("preco");
    expect(categories).toContain("nao_preciso");
    expect(categories).toContain("vou_instalar_depois");
    expect(categories).toContain("vou_comprar_fora");
    expect(categories).toContain("preciso_falar_outra_pessoa");
    expect(categories).toContain("duvida_garantia");
    expect(categories).toContain("duvida_instalacao");
    expect(categories).toContain("prazo");
    expect(categories).toContain("retirar_itens");
    expect(categories).toContain("impacto_parcela");
  });

  it("retrieves approved argument with deepening question and closing proposal", () => {
    const argument = getApprovedArgumentForObjection("preco");
    expect(argument).toBeDefined();
    expect(argument.mainArgument).toContain("Os itens foram selecionados estrategicamente");
    expect(argument.deepeningQuestion).toBeDefined();
    expect(argument.closingProposal).toBeDefined();
    expect(argument.maxAuthorizedDiscountPercent).toBeLessThanOrEqual(5);
  });

  it("generates contextualized conversation prompt", () => {
    const argument = getApprovedArgumentForObjection("preciso_falar_outra_pessoa");
    const context = generateCustomizedArgumentContext(
      argument,
      "Carlos Alberto",
      "RAM Rampage Rebel",
      "uso rural e transporte de família"
    );

    expect(context.customizedIntro).toContain("Carlos Alberto");
    expect(context.customizedIntro).toContain("RAM Rampage Rebel");
    expect(context.mainPitch).toBeDefined();
  });
});
