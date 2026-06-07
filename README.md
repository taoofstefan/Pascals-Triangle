# Pascal's Triangle

A small project with two ways to look at Pascal's triangle:

1. **`pascals_triangle.py`** — a tiny Python script that prints a 15-row triangle to stdout. The original project.
2. **`web/`** — an interactive React + Vite + TypeScript visualization with clickable cells, pattern overlays (modular coloring, primes, Sierpinski), a math facts panel, and row-by-row animation. The algorithm is a `bigint`-safe TypeScript port of the Python script; the dev console asserts that both produce identical output for the first six rows.

## Run the Python script

```sh
python pascals_triangle.py
```

Prints 15 rows of Pascal's triangle, space-separated, left-aligned. No dependencies.

## Run the web app

```sh
cd web
npm install
npm run dev
```

Then open <http://localhost:5173>.

For a production build:

```sh
npm run build
npm run preview
```

### Features

- **Click cells** to pin them in the side panel. The panel shows `C(n, r)`, the value, the symmetric partner `C(n, n − r)`, and mod 2/3/5.
- **Pattern modes** (top-right buttons): plain, mod 2, mod 3, mod 5, mod 10, prime, Sierpinski. The Sierpinski mode highlights the odd cells, which form the Sierpinski gasket fractal.
- **Row-by-row animation**: play, pause, step, and reset. The speed slider controls the interval between row reveals.
- **Math panel** lists the row sums (each row sums to `2ⁿ`) and a set of identities (Pascal's rule, symmetry, alternating sum).
- **Large values** switch to bigint-safe scientific notation at `|v| ≥ 10¹⁵`; the `C(n, r)` label is always shown.
- **Keyboard shortcuts**: Space (play/pause), → (step), C (clear pin).

### How the two implementations stay in sync

`web/src/lib/pascal.ts` is a manual port of `pascals_triangle.py` using the same recurrence, but in `bigint` arithmetic. On startup, the web app runs an assertion in `App.tsx` comparing the first six rows against the Python output. There is also a CLI smoke test in `web/smoke.mjs` that compares 15 rows against a Python-generated golden file (`web/expected.txt`). If the two ever drift, both checks fail loudly.

To regenerate the golden file from the current Python output:

```sh
python -c "from math import comb
for n in range(15):
    print('[' + ','.join(str(comb(n, r)) for r in range(n+1)) + ']')" > web/expected.txt
```

## Project layout

```
.
├── pascals_triangle.py     # original Python script (unchanged)
├── README.md               # this file
├── .gitignore
└── web/                    # React + Vite + TypeScript app
    ├── src/
    │   ├── App.tsx
    │   ├── main.tsx
    │   ├── types.ts
    │   ├── lib/            # pascal, binomial, patterns, format
    │   ├── state/          # useAppState reducer
    │   └── components/     # Triangle, Cell, Controls, MathPanel, Legend
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── index.html
    ├── expected.txt        # Python-derived golden file for the smoke test
    ├── smoke.mjs           # Node smoke test (run with --experimental-strip-types)
    └── README.md
```

## License

No license is set yet. If you'd like to add one, drop a `LICENSE` file at the repo root and link it here.
