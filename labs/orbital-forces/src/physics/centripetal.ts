export function centripetalForce(m: number, v: number, r: number): number {
  if (r <= 0) return Infinity;
  return (m * v * v) / r;
}

export function period(r: number, v: number): number {
  if (v <= 0) return Infinity;
  return (2 * Math.PI * r) / v;
}

export function angularSpeed(v: number, r: number): number {
  if (r <= 0) return 0;
  return v / r;
}

/**
 * Map centripetal force to arrow pixel length with log clamp.
 */
export function forceToArrowLength(
  force: number,
  minPx = 28,
  maxPx = 90,
): number {
  if (!Number.isFinite(force) || force <= 0) return minPx;
  const t = Math.log10(1 + force) / Math.log10(1 + 800);
  return minPx + (maxPx - minPx) * Math.min(1, Math.max(0, t));
}
