import { useMemo } from 'react'
import { bFromAngles, conductorVector, evaluate, type InductionResult, type Vec3 } from './induction'
import { useLab } from '../store'

export function useField(): Vec3 {
  const bMag = useLab((state) => state.bMag)
  const azimuth = useLab((state) => state.azimuth)
  const elevation = useLab((state) => state.elevation)
  return useMemo(() => bFromAngles(bMag, azimuth, elevation), [bMag, azimuth, elevation])
}

export function useInduction(): InductionResult {
  const B = useField()
  const x = useLab((state) => state.x)
  const v = useLab((state) => state.v)
  const ell = useLab((state) => state.ell)
  const rodAngle = useLab((state) => state.rodAngle)
  const R = useLab((state) => state.R)
  const closed = useLab((state) => state.closed)
  return useMemo(
    () =>
      evaluate({
        B,
        v: { x: v, y: 0, z: 0 },
        ell: conductorVector(ell, rodAngle),
        R,
        closed,
        x,
      }),
    [B, x, v, ell, rodAngle, R, closed],
  )
}
