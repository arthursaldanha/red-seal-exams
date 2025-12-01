export function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: currency,
  }).format(price / 100);
}
