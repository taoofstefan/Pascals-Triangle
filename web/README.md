# Pascal's Triangle — Web Visualization

Interactive React + Vite + TypeScript app for exploring Pascal's triangle.

## Run

```sh
cd web
npm install
npm run dev
```

Open <http://localhost:5173>.

## Features

- Hover/click any cell to inspect `C(n, r)` and its value.
- Switch coloring modes: plain, mod 2, mod 3, mod 5, mod 10, prime, Sierpinski.
- Watch row-by-row animation (play/pause/step, speed slider).
- Side panel shows pinned cell, row sums (`2^n`), and key identities.

## Algorithm

The recurrence in `src/lib/pascal.ts` is a TypeScript port of `pascals_triangle.py`
at the repo root. All math uses `bigint` to match Python's unbounded integers.
