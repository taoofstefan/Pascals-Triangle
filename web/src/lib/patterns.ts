import { binomial } from './binomial';

export type Mode =
  | 'plain'
  | 'mod2'
  | 'mod3'
  | 'mod5'
  | 'mod10'
  | 'prime'
  | 'sierpinski';

export const MODES: Mode[] = [
  'plain',
  'mod2',
  'mod3',
  'mod5',
  'mod10',
  'prime',
  'sierpinski',
];

export const MODE_LABELS: Record<Mode, string> = {
  plain: 'Plain',
  mod2: 'Mod 2',
  mod3: 'Mod 3',
  mod5: 'Mod 5',
  mod10: 'Mod 10',
  prime: 'Prime',
  sierpinski: 'Sierpinski',
};

/**
 * Returns a CSS class for a cell given the current mode. The CSS classes are
 * defined in `index.css` so the actual colors live there.
 */
export function cellClass(mode: Mode, n: number, r: number, value: bigint): string {
  switch (mode) {
    case 'plain':
      return 'cell--plain';
    case 'mod2':
      return `cell--mod2-${Number(value % 2n)}`;
    case 'mod3':
      return `cell--mod3-${Number(value % 3n)}`;
    case 'mod5':
      return `cell--mod5-${Number(value % 5n)}`;
    case 'mod10':
      return `cell--mod10-${Number(value % 10n)}`;
    case 'prime': {
      // Highlight cells whose binomial value is prime AND > 1.
      // 1 is neither prime nor composite; we render it neutral.
      if (value <= 1n) return 'cell--plain';
      return isPrimeBigint(value) ? 'cell--prime' : 'cell--composite';
    }
    case 'sierpinski': {
      // Odd cells form the Sierpinski gasket.
      return (binomial(n, r) & 1n) === 1n ? 'cell--sierpinski-on' : 'cell--sierpinski-off';
    }
  }
}

function isPrimeBigint(n: bigint): boolean {
  if (n < 2n) return false;
  if (n === 2n) return true;
  if (n % 2n === 0n) return false;
  const limit = BigInt(Math.floor(Math.sqrt(Number(n < 1_000_000n ? n : 1_000_000n))));
  for (let i = 3n; i <= limit; i += 2n) {
    if (n % i === 0n) return false;
  }
  // For very large n where sqrt(Number(n)) underflows, fall back to a
  // reasonable trial bound. Realistically rows are < 50 so this branch is rare.
  if (n > 1_000_000n) {
    // Use the same trial division to a fixed cap; correctness is "best effort"
    // for astronomically large values, which won't appear in normal use.
    for (let i = 1_000_001n; i * i <= n && i < 100_000_000n; i += 2n) {
      if (n % i === 0n) return false;
    }
  }
  return true;
}
