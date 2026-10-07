import { conductorVector } from '../physics/induction'
import { X_MAX, X_MIN, Z0 } from './constants'

export const ROD_ANGLE_MIN = 35
export const ROD_ANGLE_MAX = 145
/** Right-hand end of both rails, in metres. Long enough for a slanted bar. */
export const RAIL_END = 0.52

const CONTACT_MARGIN = 0.025

export function barContacts(x: number, length: number, angleDeg: number) {
  const ell = conductorVector(length, angleDeg)
  return {
    q: { x, z: Z0 },
    p: { x: x + ell.x, z: Z0 + ell.z },
    separation: ell.z,
    offset: ell.x,
  }
}

/** Bottom-contact travel so both ends of PQ stay on the rails. */
export function travelLimits(length: number, angleDeg: number) {
  const offset = conductorVector(length, angleDeg).x
  let lo = CONTACT_MARGIN - Math.min(offset, 0)
  let hi = RAIL_END - CONTACT_MARGIN - Math.max(offset, 0)
  const preferLo = Math.max(lo, X_MIN)
  const preferHi = Math.min(hi, X_MAX)
  if (preferHi >= preferLo + 1e-4) {
    lo = preferLo
    hi = preferHi
  }
  if (hi < lo) hi = lo
  return { lo, hi }
}

export function clampBarX(x: number, length: number, angleDeg: number, snap: boolean) {
  const { lo, hi } = travelLimits(length, angleDeg)
  let next = Math.min(hi, Math.max(lo, x))
  if (snap) next = Math.min(hi, Math.max(lo, Math.round(next / 0.005) * 0.005))
  return next
}
