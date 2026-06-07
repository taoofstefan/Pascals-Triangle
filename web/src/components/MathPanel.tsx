import type { AppState } from '../types';
import { formatValue } from '../lib/format';
import { binomial } from '../lib/binomial';

interface Props {
  state: AppState;
  triangle: bigint[][];
}

const IDENTITIES: { title: string; body: string }[] = [
  {
    title: 'Edges',
    body: 'C(n, 0) = C(n, n) = 1',
  },
  {
    title: 'Symmetry',
    body: 'C(n, r) = C(n, n − r)',
  },
  {
    title: "Pascal's rule",
    body: 'C(n, r) = C(n − 1, r − 1) + C(n − 1, r)',
  },
  {
    title: 'Row sum',
    body: 'Σ C(n, r) for r = 0..n = 2ⁿ',
  },
  {
    title: 'Alternating sum',
    body: 'Σ (−1)ʳ C(n, r) for r = 0..n = 0  (for n ≥ 1)',
  },
];

export function MathPanel({ state, triangle }: Props) {
  const pinned = state.pinned;
  const pinnedValue = pinned ? triangle[pinned.n]?.[pinned.r] : null;

  return (
    <aside className="math-panel">
      <section className="math-panel__section">
        <h2>Pinned cell</h2>
        {pinned && pinnedValue != null ? (
          <PinnedDetails n={pinned.n} r={pinned.r} value={pinnedValue} />
        ) : (
          <p className="math-panel__hint">Click any cell to pin it.</p>
        )}
      </section>

      <section className="math-panel__section">
        <h2>Row sums (2ⁿ)</h2>
        <ul className="math-panel__rowsums">
          {Array.from({ length: state.visibleRows }, (_, i) => {
            const sum = 2n ** BigInt(i);
            return (
              <li key={i}>
                <span className="math-panel__rowsum-label">row {i}</span>
                <span className="math-panel__rowsum-value">{sum.toString()}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="math-panel__section">
        <h2>Identities</h2>
        <dl className="math-panel__identities">
          {IDENTITIES.map((id) => (
            <div key={id.title} className="math-panel__identity">
              <dt>{id.title}</dt>
              <dd>{id.body}</dd>
            </div>
          ))}
        </dl>
      </section>
    </aside>
  );
}

function PinnedDetails({ n, r, value }: { n: number; r: number; value: bigint }) {
  const { display, compact } = formatValue(value);
  const symmetricR = n - r;
  const symmetricValue = binomial(n, symmetricR);
  return (
    <div className="pinned">
      <div className="pinned__line">
        <span className="pinned__label">C(n, r)</span>
        <span className="pinned__value">C({n}, {r})</span>
      </div>
      <div className="pinned__line">
        <span className="pinned__label">Value</span>
        <span className={`pinned__value${compact ? ' pinned__value--compact' : ''}`}>
          {display}
        </span>
      </div>
      <div className="pinned__line">
        <span className="pinned__label">Symmetric partner</span>
        <span className="pinned__value">
          C({n}, {symmetricR}) = {symmetricValue.toString()}
        </span>
      </div>
      <div className="pinned__line">
        <span className="pinned__label">Mod 2 / 3 / 5</span>
        <span className="pinned__value">
          {Number(value % 2n)} / {Number(value % 3n)} / {Number(value % 5n)}
        </span>
      </div>
    </div>
  );
}
