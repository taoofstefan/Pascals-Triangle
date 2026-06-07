/**
 * Pascal's triangle — TypeScript port of `pascals_triangle.py` at the repo root.
 *
 * The recurrence is identical: edges are 1, interiors are the sum of the two
 * parents directly above. All math uses `bigint` to mirror Python's unbounded
 * integers and to never silently overflow.
 *
 * If the Python file's algorithm ever changes, mirror the change here. The
 * dev-mode sanity check in App.tsx compares rows 0..5 of this implementation
 * against the Python output as a regression guard.
 */
export function buildTriangle(n: number): bigint[][] {
  const triangle: bigint[][] = [];
  for (let i = 0; i < n; i++) {
    const row: bigint[] = [];
    for (let j = 0; j <= i; j++) {
      if (j === 0 || j === i) {
        row.push(1n);
      } else {
        row.push(triangle[i - 1][j - 1] + triangle[i - 1][j]);
      }
    }
    triangle.push(row);
  }
  return triangle;
}
