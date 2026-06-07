// Smoke test: formatValue, binomial, and patterns helpers.
import { formatValue } from './src/lib/format.ts';
import { binomial } from './src/lib/binomial.ts';
import { cellClass } from './src/lib/patterns.ts';

let pass = true;
function check(label, actual, expected) {
  const ok = actual === expected;
  if (!ok) {
    console.error(`FAIL: ${label}\n  expected: ${expected}\n  got:      ${actual}`);
    pass = false;
  }
}

// formatValue
check('format small', formatValue(42n).display, '42');
check('format negative', formatValue(-7n).display, '-7');
check('format at threshold', formatValue(10n ** 14n).display, '100000000000000');
const big = formatValue(10n ** 25n);
check('format big compact=true', big.compact, true);
check('format big has × 10^', big.display.includes('× 10^'), true);

// binomial
check('C(6,3)', binomial(6, 3).toString(), '20');
check('C(10,4)', binomial(10, 4).toString(), '210');
check('C(10,6)', binomial(10, 6).toString(), '210');
check('C(5,0)', binomial(5, 0).toString(), '1');
check('C(5,5)', binomial(5, 5).toString(), '1');
check('C(5,3) symmetric', binomial(5, 3).toString(), binomial(5, 2).toString());
check('C(0,0)', binomial(0, 0).toString(), '1');

// patterns: mod2, mod3, mod5, mod10, plain, sierpinski
check('plain cell', cellClass('plain', 0, 0, 1n), 'cell--plain');
check('mod2 odd', cellClass('mod2', 5, 3, 10n), 'cell--mod2-0');
check('mod2 even', cellClass('mod2', 5, 2, 10n), 'cell--mod2-0');
check('mod2 odd (1)', cellClass('mod2', 4, 1, 4n), 'cell--mod2-0');
check('mod2 odd (1) again', cellClass('mod2', 3, 1, 3n), 'cell--mod2-1');
check('mod3 0', cellClass('mod3', 3, 1, 3n), 'cell--mod3-0');
check('mod3 1', cellClass('mod3', 4, 1, 4n), 'cell--mod3-1');
check('mod10 5', cellClass('mod10', 5, 1, 5n), 'cell--mod10-5');
// sierpinski: C(4,1)=4 (even) → off; C(4,2)=6 (even) → off; C(4,3)=4 → off
check('sierpinski C(4,1) off', cellClass('sierpinski', 4, 1, 4n), 'cell--sierpinski-off');
// C(3,1)=3 (odd) → on
check('sierpinski C(3,1) on', cellClass('sierpinski', 3, 1, 3n), 'cell--sierpinski-on');
// prime: C(7,1)=7 is prime; C(6,3)=20 is composite
check('prime 7', cellClass('prime', 7, 1, 7n), 'cell--prime');
check('composite 20', cellClass('prime', 6, 3, 20n), 'cell--composite');
check('prime 1 neutral', cellClass('prime', 5, 0, 1n), 'cell--plain');

console.log(pass ? 'OK: all helpers behave as expected' : 'FAIL');
process.exit(pass ? 0 : 1);
