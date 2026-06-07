/**
 * Format a Pascal's triangle cell value for display.
 *
 * - |v| < 10^15  → full decimal string
 * - |v| >= 10^15 → "Mmmmm × 10^e" with 4 fractional digits, bigint-safe
 *
 * The caller is responsible for also showing the C(n, r) label.
 */
const THRESHOLD = 10n ** 15n;

export function formatValue(v: bigint): { display: string; compact: boolean } {
  const abs = v < 0n ? -v : v;
  if (abs < THRESHOLD) {
    return { display: v.toString(), compact: false };
  }
  return { display: toScientific(v), compact: true };
}

function toScientific(v: bigint): string {
  const sign = v < 0n ? '-' : '';
  const abs = v < 0n ? -v : v;
  const s = abs.toString();
  // e.g. "12345" → "1.2345 × 10^4"; "1" → "1 × 10^0".
  if (s.length <= 1) return `${sign}${s} × 10^0`;
  const mantissa = s[0] + (s.length > 5 ? '.' + s.slice(1, 5) : '.' + s.slice(1));
  const exponent = s.length - 1;
  return `${sign}${mantissa} × 10^${exponent}`;
}
