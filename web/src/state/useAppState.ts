import { useCallback, useEffect, useReducer } from 'react';
import {
  AppState,
  INITIAL_STATE,
  MAX_DOM_ROWS,
  MIN_DOM_ROWS,
  Pinned,
} from '../types';

type Action =
  | { type: 'SET_N'; n: number }
  | { type: 'SET_MODE'; mode: AppState['mode'] }
  | { type: 'PIN_CELL'; pinned: Pinned }
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'STEP' }
  | { type: 'SET_SPEED'; speedMs: number }
  | { type: 'TICK' }
  | { type: 'RESET_VISIBLE'; visibleRows: number };

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_N': {
      const n = clamp(action.n, MIN_DOM_ROWS, MAX_DOM_ROWS);
      return {
        ...state,
        n,
        // When n shrinks, drop any pinned cell that is now out of range.
        pinned: state.pinned && (state.pinned.n >= n || state.pinned.r >= n) ? null : state.pinned,
        // Snap visibleRows to the new ceiling so the UI never shows beyond n.
        visibleRows: clamp(state.visibleRows, 1, n),
      };
    }
    case 'SET_MODE':
      return { ...state, mode: action.mode };
    case 'PIN_CELL': {
      // Clicking the already-pinned cell clears it.
      if (
        state.pinned &&
        state.pinned.n === action.pinned?.n &&
        state.pinned.r === action.pinned.r
      ) {
        return { ...state, pinned: null };
      }
      return { ...state, pinned: action.pinned };
    }
    case 'PLAY':
      if (state.visibleRows >= state.n) {
        // Already at the bottom — restart from row 1 so play() always does something.
        return { ...state, visibleRows: 1, playing: true };
      }
      return { ...state, playing: true, visibleRows: Math.max(1, state.visibleRows) };
    case 'PAUSE':
      return { ...state, playing: false };
    case 'STEP': {
      if (state.visibleRows >= state.n) return state;
      return { ...state, visibleRows: state.visibleRows + 1 };
    }
    case 'SET_SPEED':
      return { ...state, speedMs: clamp(action.speedMs, 50, 2000) };
    case 'TICK': {
      if (state.visibleRows >= state.n) {
        return { ...state, playing: false };
      }
      return { ...state, visibleRows: state.visibleRows + 1 };
    }
    case 'RESET_VISIBLE':
      return { ...state, visibleRows: clamp(action.visibleRows, 1, state.n), playing: false };
  }
}

export interface AppStateApi {
  state: AppState;
  setN: (n: number) => void;
  setMode: (mode: AppState['mode']) => void;
  pinCell: (pinned: Pinned) => void;
  togglePlay: () => void;
  step: () => void;
  setSpeed: (speedMs: number) => void;
  resetVisible: (visibleRows: number) => void;
}

export function useAppState(): AppStateApi {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  // Animation interval: while playing, dispatch TICK every speedMs.
  useEffect(() => {
    if (!state.playing) return;
    const id = window.setInterval(() => dispatch({ type: 'TICK' }), state.speedMs);
    return () => window.clearInterval(id);
  }, [state.playing, state.speedMs]);

  return {
    state,
    setN: useCallback((n: number) => dispatch({ type: 'SET_N', n }), []),
    setMode: useCallback((mode: AppState['mode']) => dispatch({ type: 'SET_MODE', mode }), []),
    pinCell: useCallback((pinned: Pinned) => dispatch({ type: 'PIN_CELL', pinned }), []),
    togglePlay: useCallback(
      () => dispatch({ type: state.playing ? 'PAUSE' : 'PLAY' }),
      [state.playing],
    ),
    step: useCallback(() => dispatch({ type: 'STEP' }), []),
    setSpeed: useCallback((speedMs: number) => dispatch({ type: 'SET_SPEED', speedMs }), []),
    resetVisible: useCallback(
      (visibleRows: number) => dispatch({ type: 'RESET_VISIBLE', visibleRows }),
      [],
    ),
  };
}
