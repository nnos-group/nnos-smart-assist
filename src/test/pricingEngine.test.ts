import { describe, it, expect } from "vitest";
import { calculateQuote, isDiscountAllowedForRole, getItemDiscountedPrice } from "@/lib/pricingEngine";
import { Accessory } from "@/types/accessories";
import { CommercialCampaign } from "@/types/salesJourney";

const mockAccessories: Accessory[] = [
  {
    id: "estribo",
    name: "Estribo Lateral",
    description: "Acesso e proteção",
    price: 2000,
    icon: "🚗",
    selected: true,
    stockStatus: "available",
    stockDays: 30,
    discountPercent: 0,
  },
  {
    id: "protetor",
    name: "Protetor de Caçamba",
    description: "Proteção HD",
    price: 1000,
    icon: "🛡️",
    selected: true,
    stockStatus: "dormant",
    stockDays: 200,
    discountPercent: 10,
  },
  {
    id: "capota",
    name: "Capota Marítima",
    description: "Vedação",
    price: 3000,
    icon: "🔒",
    selected: false,
    stockStatus: "available",
    stockDays: 45,
    discountPercent: 0,
  },
];

describe("Pricing Engine", () => {
  it("calculates original subtotal, stock discounts, and subtotal correctly", () => {
    const quote = calculateQuote({
      accessories: mockAccessories,
      selectedAccessoryIds: ["estribo", "protetor"],
    });

    // estribo: 2000, protetor: 1000 (10% off -> 900)
    expect(quote.originalSubtotal).toBe(3000);
    expect(quote.stockDiscountAmount).toBe(100);
    expect(quote.subtotalAfterStockDiscounts).toBe(2900);
    expect(quote.finalTotal).toBe(2900);
  });

  it("calculates percentage campaigns correctly within limits", () => {
    const campaign: CommercialCampaign = {
      id: "camp-1",
      dealershipId: "matriz",
      name: "10% off",
      description: "Campanha",
      campaignType: "discount",
      startDate: "2026-01-01T00:00:00Z",
      endDate: "2026-12-31T23:59:59Z",
      discountType: "percentage",
      discountValue: 10,
      maximumDiscountValue: 200,
      customerMessage: "Desconto",
      requiresManagerApproval: false,
      active: true,
    };

    const quote = calculateQuote({
      accessories: mockAccessories,
      selectedAccessoryIds: ["estribo"], // 2000 -> 10% seria 200
      campaign,
    });

    expect(quote.campaignDiscount).toBe(200);
    expect(quote.finalTotal).toBe(1800);
  });

  it("calculates CDC and installments correctly", () => {
    const quote = calculateQuote({
      accessories: mockAccessories,
      selectedAccessoryIds: ["estribo"], // 2000
      installmentsCount: 10,
    });

    // 2000 / 10 = 200
    expect(quote.monthlyInstallment).toBe(200);
    // 2000 * 0.0235 = 47
    expect(quote.monthlyCdc).toBe(47);
  });

  it("validates role discount thresholds", () => {
    expect(isDiscountAllowedForRole(4.5, "consultor")).toBe(true);
    expect(isDiscountAllowedForRole(6.0, "consultor")).toBe(false);
    expect(isDiscountAllowedForRole(12.0, "gerente")).toBe(true);
    expect(isDiscountAllowedForRole(18.0, "gerente")).toBe(false);
    expect(isDiscountAllowedForRole(22.0, "administrador")).toBe(true);
    expect(isDiscountAllowedForRole(30.0, "administrador")).toBe(false);
  });
});
