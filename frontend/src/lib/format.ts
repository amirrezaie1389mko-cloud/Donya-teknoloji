const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toPersianDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => PERSIAN_DIGITS[parseInt(d)]);
}

export function formatToman(price: number): string {
  const formatted = new Intl.NumberFormat('en-US').format(price);
  return `${toPersianDigits(formatted)} تومان`;
}

export function formatTomanShort(price: number): string {
  if (price >= 1000000000) return `${toPersianDigits((price / 1000000000).toFixed(1))} میلیارد تومان`;
  if (price >= 1000000) return `${toPersianDigits((price / 1000000).toFixed(0))} میلیون تومان`;
  return formatToman(price);
}
