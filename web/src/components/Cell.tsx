import type { Mode } from '../lib/patterns';
import { cellClass } from '../lib/patterns';
import { formatValue } from '../lib/format';

interface Props {
  n: number;
  r: number;
  value: bigint;
  mode: Mode;
  isPinned: boolean;
  isVisible: boolean;
  onPin: (n: number, r: number) => void;
}

export function Cell({ n, r, value, mode, isPinned, isVisible, onPin }: Props) {
  const { display, compact } = formatValue(value);
  const cls = cellClass(mode, n, r, value);
  const classes = [
    'cell',
    cls,
    isPinned ? 'cell--pinned' : '',
    isVisible ? '' : 'cell--hidden',
    compact ? 'cell--compact' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classes}
      onClick={() => onPin(n, r)}
      aria-label={`C(${n}, ${r}) = ${display}`}
    >
      <span className="cell__value">{display}</span>
      <span className="cell__formula">C({n},{r})</span>
    </button>
  );
}
