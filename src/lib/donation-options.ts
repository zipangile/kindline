export const DONATION_CURRENCIES = ['ZMW', 'USD', 'GBP', 'CAD', 'EUR'] as const;
export const DONATION_SUGGESTIONS = ['10', '20', '30'] as const;

export function donationAmountLabel(currency: string, amount: string): string {
  return currency === 'ZMW' ? `K${amount}` : `${currency} ${amount}`;
}

export function isPositiveDonationAmount(amount: string): boolean {
  return /^\d+(?:\.\d{1,2})?$/.test(amount) && Number.isFinite(Number(amount)) && Number(amount) > 0;
}
