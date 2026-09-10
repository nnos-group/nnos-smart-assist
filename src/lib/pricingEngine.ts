import { Accessory } from "@/types/accessories";
import { CommercialCampaign, QuoteState, UserRole } from "@/types/salesJourney";

export const ROLE_MAX_DISCOUNT_PERCENT: Record<UserRole, number> = {
  consultor: 5,
  gerente: 15,
  administrador: 25,
};

export interface CalculateQuoteParams {
  accessories: Accessory[];
  selectedAccessoryIds: string[];
  sellerDiscount?: number;
  factoryBonus?: number;
  campaign?: CommercialCampaign;
  installmentsCount?: number;
}

export function getItemDiscountedPrice(item: Accessory): number {
  const percent = item.discountPercent || 0;
  return Math.round(item.price * (1 - percent / 100));
}

export function calculateQuote({
  accessories,
  selectedAccessoryIds,
  sellerDiscount = 0,
  factoryBonus = 0,
  campaign,
  installmentsCount = 12,
}: CalculateQuoteParams): QuoteState {
  const selectedItems = accessories.filter((a) => selectedAccessoryIds.includes(a.id));

  const originalSubtotal = selectedItems.reduce((acc, item) => acc + item.price, 0);

  const subtotalAfterStockDiscounts = selectedItems.reduce((acc, item) => {
    return acc + getItemDiscountedPrice(item);
  }, 0);

  const stockDiscountAmount = originalSubtotal - subtotalAfterStockDiscounts;

  // Campanha comercial autorizada
  let campaignDiscount = 0;
  if (campaign && campaign.active) {
    if (campaign.discountType === "percentage" && campaign.discountValue) {
      campaignDiscount = Math.round((subtotalAfterStockDiscounts * campaign.discountValue) / 100);
      if (campaign.maximumDiscountValue) {
        campaignDiscount = Math.min(campaignDiscount, campaign.maximumDiscountValue);
      }
    } else if (campaign.discountType === "fixed" && campaign.discountValue) {
      campaignDiscount = campaign.discountValue;
    }
  }

  // Garantir limites coerentes
  const baseForSellerDiscount = Math.max(0, subtotalAfterStockDiscounts - campaignDiscount);
  const effectiveSellerDiscount = Math.min(sellerDiscount, baseForSellerDiscount);
  const sellerDiscountPercent =
    subtotalAfterStockDiscounts > 0 ? (effectiveSellerDiscount / subtotalAfterStockDiscounts) * 100 : 0;

  const baseForBonus = Math.max(0, baseForSellerDiscount - effectiveSellerDiscount);
  const effectiveFactoryBonus = Math.min(factoryBonus, baseForBonus);

  const finalTotal = Math.max(0, subtotalAfterStockDiscounts - campaignDiscount - effectiveSellerDiscount - effectiveFactoryBonus);

  // CDC factor (taxa bancária Jeep/RAM padrão de 2,35%)
  const monthlyCdc = Math.round(finalTotal * 0.0235 * 100) / 100;

  const validInstallments = Math.max(1, Math.min(installmentsCount, 24));
  const monthlyInstallment = finalTotal > 0 ? Math.ceil(finalTotal / validInstallments) : 0;

  // Estimativa técnica de oficina (0.8h por acessório em média)
  const estimatedInstallationHours = Math.round(selectedItems.length * 0.8 * 10) / 10;
  const installationDeadlineDays = selectedItems.length > 3 ? 2 : 1;

  return {
    originalSubtotal,
    stockDiscountAmount,
    subtotalAfterStockDiscounts,
    sellerDiscount: effectiveSellerDiscount,
    sellerDiscountPercent: Math.round(sellerDiscountPercent * 10) / 10,
    factoryBonus: effectiveFactoryBonus,
    campaignDiscount,
    finalTotal,
    monthlyCdc,
    installmentsCount: validInstallments,
    monthlyInstallment,
    estimatedInstallationHours,
    installationDeadlineDays,
    isPriceRevealed: false,
  };
}

export function isDiscountAllowedForRole(discountPercent: number, role: UserRole): boolean {
  const maxAllowed = ROLE_MAX_DISCOUNT_PERCENT[role] ?? 5;
  return discountPercent <= maxAllowed;
}
