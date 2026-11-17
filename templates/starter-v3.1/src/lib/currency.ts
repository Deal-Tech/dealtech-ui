
type CurrencyInput = string | number | readonly string[] | null | undefined;

function parseDecimalCurrencyValue(value: CurrencyInput): string | null {
  if (value === null || value === undefined) return null;
  const raw = String(value).trim();
  if (!raw) return null;
  if (/^-?\d+[.,]\d{1,2}$/.test(raw)) {
    const parsed = Number(raw.replace(',', '.'));
    if (Number.isFinite(parsed)) return String(Math.max(0, Math.round(parsed)));
  }
  return null;
}

export function normalizeCurrencyDigits(value: CurrencyInput): string {
  const parsedDecimal = parseDecimalCurrencyValue(value);
  if (parsedDecimal !== null) return parsedDecimal;
  if (value === null || value === undefined) return '';
  const digits = String(value).replace(/[^\d]/g, '');
  return digits.replace(/^0+(?=\d)/, '');
}

export function formatCurrencyInputValue(value: CurrencyInput): string {
  const digits = normalizeCurrencyDigits(value);
  if (!digits) return '';
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
