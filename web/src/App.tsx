import { useEffect, useMemo } from 'react';
import { Controls } from './components/Controls';
import { Legend } from './components/Legend';
import { MathPanel } from './components/MathPanel';
import { Triangle } from './components/Triangle';
import { buildTriangle } from './lib/pascal';
import { useAppState } from './state/useAppState';

/**
 * Sanity check: rows 0..5 of buildTriangle(15) must match the Python output
 * of pascals_triangle.py. Any mismatch throws on first load so a regression
 * is impossible to miss.
 */
function sanityCheck(): void {
  const t = buildTriangle(15);
  const expected: string[] = [
    '[1]',
    '[1,1]',
    '[1,2,1]',
    '[1,3,3,1]',
    '[1,4,6,4,1]',
    '[1,5,10,10,5,1]',
  ];
  for (let i = 0; i < 6; i++) {
    const got = '[' + t[i].map((v) => v.toString()).join(',') + ']';
    if (got !== expected[i]) {
      throw new Error(
        `Pascal regression at row ${i}: expected ${expected[i]}, got ${got}. ` +
          `The TypeScript port in src/lib/pascal.ts has drifted from pascals_triangle.py.`,
      );
    }
  }
}

export function App() {
  const api = useAppState();
  const triangle = useMemo(() => buildTriangle(api.state.n), [api.state.n]);

  useEffect(() => {
    sanityCheck();
  }, []);

  // Keyboard shortcuts: space = play/pause, → = step, c = clear pin.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      // Don't capture keys while typing in a form control.
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
      if (e.key === ' ') {
        e.preventDefault();
        api.togglePlay();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        api.step();
      } else if (e.key === 'c' || e.key === 'C') {
        api.state.pinned && api.pinCell(api.state.pinned);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [api]);

  return (
    <div className="app">
      <header className="app__header">
        <h1>Pascal's Triangle</h1>
        <p className="app__subtitle">
          Interactive visualization of binomial coefficients. Hover or click any cell to inspect
          it. Try the pattern buttons to see the Sierpinski gasket, modular colorings, and primes.
        </p>
      </header>

      <Controls state={api.state} api={api} />

      <Legend mode={api.state.mode} />

      <div className="app__body">
        <div className="app__triangle-wrap">
          <Triangle state={api.state} api={api} triangle={triangle} />
        </div>
        <MathPanel state={api.state} triangle={triangle} />
      </div>

      <footer className="app__footer">
        <span>Shortcuts: Space = play/pause · → = step · C = clear pin</span>
      </footer>
    </div>
  );
}
