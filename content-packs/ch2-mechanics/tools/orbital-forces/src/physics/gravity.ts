/** SI gravitational constant. */
export const G = 6.67e-11;

export function gravitationalForce(m1: number, m2: number, r: number): number {
  if (r <= 0) return Infinity;
  return (G * m1 * m2) / (r * r);
}

/** Visual planet radius from mass (volume ~ mass ⇒ radius ~ m^(1/3)). */
export function planetRadiusFromMass(mass: number, scale = 8): number {
  // mass is around 10^24 kg — normalise before cbrt for stable pixels
  const mNorm = mass / 1e24;
  return scale * Math.cbrt(Math.max(mNorm, 0.1));
}

/**
 * Map force to arrow length across the lab's SI force range
 * (log scale so both weak and strong F stay readable).
 */
export function forceToArrowLength(
  force: number,
  minPx = 28,
  maxPx = 110,
): number {
  if (!Number.isFinite(force) || force <= 0) return minPx;
  // Expected F span for m ∈ [1e24,2e25], r ∈ [5e7,4e8]
  const fMin = 4e20;
  const fMax = 1e24;
  const t =
    (Math.log10(force) - Math.log10(fMin)) /
    (Math.log10(fMax) - Math.log10(fMin));
  return minPx + (maxPx - minPx) * Math.min(1, Math.max(0, t));
}

/** Compact scientific notation for readouts. */
export function formatSci(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return '∞';
  return n.toExponential(digits);
}
