import type { Mode } from './lib/patterns';

export type Pinned = { n: number; r: number } | null;

export interface AppState {
  /** Total rows in the triangle. */
  n: number;
  /** Number of rows currently rendered. Animates from 0 to n. */
  visibleRows: number;
  /** Active color/pattern mode. */
  mode: Mode;
  /** Pinned cell for the math panel. */
  pinned: Pinned;
  /** Whether the row-by-row animation is running. */
  playing: boolean;
  /** Milliseconds between row reveals while playing. */
  speedMs: number;
}

export const MAX_DOM_ROWS = 50;
export const MIN_DOM_ROWS = 1;
export const MIN_SPEED_MS = 50;
export const MAX_SPEED_MS = 2000;

export const INITIAL_STATE: AppState = {
  n: 15,
  visibleRows: 15,
  mode: 'plain',
  pinned: null,
  playing: false,
  speedMs: 400,
};
