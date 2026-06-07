import { useMemo } from 'react';
import type { AppState } from '../types';
import type { AppStateApi } from '../state/useAppState';
import { MODES, MODE_LABELS } from '../lib/patterns';
import { MAX_DOM_ROWS, MAX_SPEED_MS, MIN_SPEED_MS } from '../types';

interface Props {
  state: AppState;
  api: AppStateApi;
}

export function Controls({ state, api }: Props) {
  const speedLabel = useMemo(() => `${state.speedMs} ms`, [state.speedMs]);
  return (
    <div className="controls">
      <div className="controls__row">
        <label className="control">
          <span className="control__label">Rows (n): {state.n}</span>
          <input
            type="range"
            min={1}
            max={MAX_DOM_ROWS}
            value={state.n}
            onChange={(e) => api.setN(parseInt(e.target.value, 10))}
          />
        </label>
        <label className="control">
          <span className="control__label">Animation speed: {speedLabel}</span>
          <input
            type="range"
            min={MIN_SPEED_MS}
            max={MAX_SPEED_MS}
            step={50}
            value={state.speedMs}
            onChange={(e) => api.setSpeed(parseInt(e.target.value, 10))}
          />
        </label>
      </div>

      <div className="controls__row">
        <div className="control">
          <span className="control__label">Pattern</span>
          <div className="mode-buttons">
            {MODES.map((m) => (
              <button
                key={m}
                type="button"
                className={`mode-button${state.mode === m ? ' mode-button--active' : ''}`}
                onClick={() => api.setMode(m)}
              >
                {MODE_LABELS[m]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="controls__row">
        <div className="control">
          <span className="control__label">Animation</span>
          <div className="anim-buttons">
            <button type="button" onClick={api.togglePlay}>
              {state.playing ? 'Pause' : 'Play'}
            </button>
            <button type="button" onClick={api.step} disabled={state.playing || state.visibleRows >= state.n}>
              Step
            </button>
            <button
              type="button"
              onClick={() => api.resetVisible(1)}
              disabled={state.visibleRows === 1 && !state.playing}
            >
              Reset
            </button>
            <span className="anim-status">
              Showing {state.visibleRows} / {state.n} rows
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
