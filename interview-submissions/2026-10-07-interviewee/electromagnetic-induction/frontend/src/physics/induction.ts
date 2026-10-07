export type Vec3 = { x: number; y: number; z: number }

export type ZeroReason = 'ok' | 'b_zero' | 'v_zero' | 'no_cutting' | 'open'

export type InductionInput = {
  B: Vec3
  v: Vec3
  ell: Vec3
  R: number
  closed: boolean
  /** Distance from the closed end to the bar, in metres. */
  x: number
}

export type InductionResult = {
  emf: number
  current: number
  phi: number
  dphiDt: number
  emfFaraday: number
  lenzForce: Vec3
  zeroReason: ZeroReason
  /** Unit vector along the bar in the direction of conventional current. */
  currentDirection: Vec3
  explanation: string
}

const EPS_B = 1e-4
const EPS_V = 1e-3
const EPS_EMF = 1e-5

export function cross(a: Vec3, b: Vec3): Vec3 {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  }
}

export function dot(a: Vec3, b: Vec3): number {
  return a.x * b.x + a.y * b.y + a.z * b.z
}

export function hypot3(a: Vec3): number {
  return Math.hypot(a.x, a.y, a.z)
}

export function scale(a: Vec3, s: number): Vec3 {
  return { x: a.x * s, y: a.y * s, z: a.z * s }
}

export function normalize(a: Vec3): Vec3 {
  const n = hypot3(a)
  if (n < 1e-12) return { x: 0, y: 0, z: 0 }
  return scale(a, 1 / n)
}

/** Conductor PQ of length `length`, at `angleWithRodsDeg` to the rails. 90° is perpendicular. */
export function conductorVector(length: number, angleWithRodsDeg: number): Vec3 {
  const theta = (angleWithRodsDeg * Math.PI) / 180
  return { x: length * Math.cos(theta), y: 0, z: length * Math.sin(theta) }
}

/** Azimuth 0 points +Y (into the page in the Front view). Elevation rises toward +Z. */
export function bFromAngles(magnitude: number, azimuth: number, elevation: number): Vec3 {
  const ce = Math.cos(elevation)
  return {
    x: magnitude * Math.sin(azimuth) * ce,
    y: magnitude * Math.cos(azimuth) * ce,
    z: magnitude * Math.sin(elevation),
  }
}

export function formatNum(n: number, digits = 3): string {
  if (!Number.isFinite(n)) return '—'
  const abs = Math.abs(n)
  if (abs !== 0 && (abs < 0.0001 || abs >= 1000)) return n.toExponential(2)
  if (abs !== 0 && abs < 0.01) return n.toFixed(Math.max(digits, 4))
  return n.toFixed(digits)
}

function fieldPhrase(B: Vec3): string {
  const ax = Math.abs(B.x)
  const ay = Math.abs(B.y)
  const az = Math.abs(B.z)
  if (ay >= ax && ay >= az && ay > 0) {
    return B.y >= 0 ? 'into the page in the Front view' : 'out of the page in the Front view'
  }
  if (ax >= az && ax > 0) return B.x >= 0 ? 'to the right' : 'to the left'
  if (az > 0) return B.z >= 0 ? 'upward' : 'downward'
  return 'nowhere'
}

function explain(input: InductionInput, partial: Omit<InductionResult, 'explanation'>): string {
  const { B, v, R, ell } = input
  const field = fieldPhrase(B)
  const motion = v.x >= 0 ? 'to the right' : 'to the left'
  const currentWay = partial.emf >= 0 ? 'up the bar, from Q to P' : 'down the bar, from P to Q'
  const emfText = `${formatNum(partial.emf)} V`

  if (partial.zeroReason === 'b_zero') {
    return 'The magnetic field is zero, so the bar cuts no field lines. Induced e.m.f. and current are both zero.'
  }
  if (partial.zeroReason === 'v_zero') {
    return `The field points ${field}, but the bar is stationary. A conductor induces an e.m.f. only while it cuts magnetic field lines, so ε = 0 and no current flows.`
  }
  if (partial.zeroReason === 'no_cutting') {
    return `The bar is moving ${motion} and the field points ${field}. That motion does not cut field lines, because the velocity is parallel to the field or to the bar, so (v × B) · ℓ = 0. There is no induced current for Fleming's right-hand rule to point out.`
  }

  const simple =
    Math.abs(B.x) < 1e-4 &&
    Math.abs(B.z) < 1e-4 &&
    Math.abs(v.y) < 1e-4 &&
    Math.abs(v.z) < 1e-4
  const length = hypot3(ell)
  const sinTheta = length > 1e-9 ? Math.abs(ell.z) / length : 1
  const slanted = Math.abs(ell.x) > 1e-4
  const formula = simple
    ? slanted
      ? `ε = Bℓv sinθ = (${formatNum(B.y, 2)})(${formatNum(length, 2)})(${formatNum(v.x, 2)})(${formatNum(sinTheta, 2)}) = ${emfText}. θ is the angle between PQ and the metal rods, so only ℓ sinθ, the gap between the rods, cuts the field. Faraday's law gives the same number.`
      : `ε = Bℓv = (${formatNum(B.y, 2)})(${formatNum(ell.z, 2)})(${formatNum(v.x, 2)}) = ${emfText}. Faraday's law gives the same number: ε = −dΦ/dt.`
    : `ε = (v × B) · ℓ = ${emfText}. Faraday's law gives the same number: ε = −dΦ/dt = ${formatNum(partial.emfFaraday)} V.`
  const fingers = `Fleming's right-hand rule: thumb ${motion} (motion), first finger ${field} (field), second finger ${currentWay} (induced conventional current).`

  if (partial.zeroReason === 'open') {
    return `${fingers} ${formula} The circuit is open, so charge separates and no current flows. Close the circuit and the current is I = ε/R.`
  }

  return `${fingers} ${formula} The circuit is closed and R = ${formatNum(R, 2)} Ω, so I = ε/R = ${formatNum(partial.current)} A. Lenz's law: the magnetic force on this current opposes the motion of the bar.`
}

export function evaluate(input: InductionInput): InductionResult {
  const { B, v, ell, R, closed, x } = input
  const emf = dot(cross(v, B), ell)
  const current = closed && R > 1e-9 ? emf / R : 0
  const phi = -B.y * ell.z * (x + 0.5 * ell.x)
  const dphiDt = -B.y * v.x * ell.z
  const emfFaraday = -dphiDt
  const lenzForce = {
    x: current * (-ell.z * B.y),
    y: current * (ell.z * B.x - ell.x * B.z),
    z: current * (ell.x * B.y),
  }
  const bMag = hypot3(B)
  const vMag = hypot3(v)
  let zeroReason: ZeroReason = 'ok'
  if (bMag < EPS_B) zeroReason = 'b_zero'
  else if (vMag < EPS_V) zeroReason = 'v_zero'
  else if (Math.abs(emf) < EPS_EMF) zeroReason = 'no_cutting'
  else if (!closed) zeroReason = 'open'

  const currentDirection =
    Math.abs(emf) < EPS_EMF ? { x: 0, y: 0, z: 0 } : scale(normalize(ell), Math.sign(emf))

  const partial = {
    emf,
    current,
    phi,
    dphiDt,
    emfFaraday,
    lenzForce,
    zeroReason,
    currentDirection,
  }
  return { ...partial, explanation: explain(input, partial) }
}

export function shortDirection(result: InductionResult): string {
  if (result.zeroReason === 'b_zero') return 'No induced e.m.f. — magnetic field is zero'
  if (result.zeroReason === 'v_zero') return 'No induced e.m.f. — the bar is stationary'
  if (result.zeroReason === 'no_cutting') return 'No induced e.m.f. — the bar is not cutting field lines'
  if (result.zeroReason === 'open') {
    return result.emf >= 0
      ? 'E.m.f. would drive current up the bar (Q → P) — circuit open'
      : 'E.m.f. would drive current down the bar (P → Q) — circuit open'
  }
  return result.current >= 0
    ? 'Conventional current flows up the bar (Q → P), then left through the resistor'
    : 'Conventional current flows down the bar (P → Q), then right along the bottom rail'
}
