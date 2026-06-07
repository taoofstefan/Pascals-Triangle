/**
 * Binomial coefficient C(n, r) computed via the multiplicative recurrence
 *   C(n, 0) = 1
 *   C(n, r) = C(n, r - 1) * (n - r + 1) / r
 * which produces exact integer values at every step. Uses bigint.
 *
 * Returns 0n for r < 0 or r > n (a convention used by MathPanel for the
 * "no symmetric partner" case).
 */
export function binomial(n: number, r: number): bigint {
  if (r < 0 || r > n) return 0n;
  if (r === 0 || r === n) return 1n;
  // Use the shorter side of the symmetry: C(n, r) = C(n, n - r).
  const k = r > n - r ? n - r : r;
  let result = 1n;
  for (let i = 1; i <= k; i++) {
    result = (result * BigInt(n - k + i)) / BigInt(i);
  }
  return result;
}
