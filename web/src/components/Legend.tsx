import type { Mode } from '../lib/patterns';

interface Props {
  mode: Mode;
}

interface Swatch {
  className: string;
  label: string;
}

function legendFor(mode: Mode): Swatch[] {
  switch (mode) {
    case 'plain':
      return [{ className: 'cell--plain', label: 'Value' }];
    case 'mod2':
      return [
        { className: 'cell--mod2-0', label: 'Even' },
        { className: 'cell--mod2-1', label: 'Odd' },
      ];
    case 'mod3':
      return [
        { className: 'cell--mod3-0', label: '≡ 0 mod 3' },
        { className: 'cell--mod3-1', label: '≡ 1 mod 3' },
        { className: 'cell--mod3-2', label: '≡ 2 mod 3' },
      ];
    case 'mod5':
      return [
        { className: 'cell--mod5-0', label: '≡ 0 mod 5' },
        { className: 'cell--mod5-1', label: '≡ 1 mod 5' },
        { className: 'cell--mod5-2', label: '≡ 2 mod 5' },
        { className: 'cell--mod5-3', label: '≡ 3 mod 5' },
        { className: 'cell--mod5-4', label: '≡ 4 mod 5' },
      ];
    case 'mod10':
      return Array.from({ length: 10 }, (_, k) => ({
        className: `cell--mod10-${k}`,
        label: `≡ ${k} mod 10`,
      }));
    case 'prime':
      return [
        { className: 'cell--prime', label: 'Prime value' },
        { className: 'cell--composite', label: 'Composite value' },
        { className: 'cell--plain', label: '1 / 0' },
      ];
    case 'sierpinski':
      return [
        { className: 'cell--sierpinski-on', label: 'Odd (in gasket)' },
        { className: 'cell--sierpinski-off', label: 'Even (background)' },
      ];
  }
}

export function Legend({ mode }: Props) {
  const swatches = legendFor(mode);
  return (
    <div className="legend">
      <span className="legend__title">Legend</span>
      <div className="legend__swatches">
        {swatches.map((s) => (
          <span key={s.className} className="legend__item">
            <span className={`legend__swatch ${s.className}`} />
            <span className="legend__label">{s.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
