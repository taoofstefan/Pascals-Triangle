import { useMemo } from 'react';
import type { AppState } from '../types';
import { Cell } from './Cell';
import type { AppStateApi } from '../state/useAppState';

interface Props {
  state: AppState;
  api: AppStateApi;
  triangle: bigint[][];
}

/**
 * Renders the triangle. Each row is its own flex container so the diagonal
 * "staircase" layout is automatic. Cells past `visibleRows` are rendered with
 * visibility:hidden so they take up space but stay invisible during animation.
 */
export function Triangle({ state, api, triangle }: Props) {
  const rows = useMemo(() => triangle.slice(0, state.visibleRows), [triangle, state.visibleRows]);
  const pinned = state.pinned;

  // The Cell-level handler takes (n, r); the reducer expects a Pinned object.
  // Adapt the signature here so the components stay composable.
  const handlePin = (n: number, r: number) => api.pinCell({ n, r });

  return (
    <div className="triangle" role="grid" aria-label="Pascal's triangle">
      {triangle.map((row, n) => (
        <div className="triangle__row" role="row" key={n}>
          {row.map((value, r) => {
            const isVisible = n < rows.length;
            const isPinned = !!pinned && pinned.n === n && pinned.r === r;
            return (
              <Cell
                key={r}
                n={n}
                r={r}
                value={value}
                mode={state.mode}
                isPinned={isPinned}
                isVisible={isVisible}
                onPin={handlePin}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
