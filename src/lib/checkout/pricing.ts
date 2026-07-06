export const GIFT_WRAP_FEE = 39.9;
export const STANDARD_SHIPPING_FEE = 49.9;
export const FREE_SHIPPING_THRESHOLD = 750;

export function calculateShippingFee(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
}

export function calculateGiftWrapFee(isGiftWrapped: boolean): number {
  return isGiftWrapped ? GIFT_WRAP_FEE : 0;
}
