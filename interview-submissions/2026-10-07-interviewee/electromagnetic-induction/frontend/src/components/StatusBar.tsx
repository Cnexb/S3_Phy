import { formatNum } from '../physics/induction'
import { useField, useInduction } from '../physics/useInduction'
import { useLab } from '../store'

export function StatusBar() {
  const result = useInduction()
  const B = useField()
  const velocity = useLab((state) => state.v)
  const ell = useLab((state) => state.ell)
  const rodAngle = useLab((state) => state.rodAngle)
  const closed = useLab((state) => state.closed)
  const x = useLab((state) => state.x)
  const simple = Math.abs(B.x) < 1e-4 && Math.abs(B.z) < 1e-4
  const slanted = Math.abs(rodAngle - 90) > 0.5
  const sinTheta = Math.sin((rodAngle * Math.PI) / 180)
  const emf = simple
    ? slanted
      ? `ε = Bℓv sinθ = (${formatNum(B.y, 2)})(${formatNum(ell, 2)})(${formatNum(velocity, 2)})(${formatNum(sinTheta, 2)}) = ${formatNum(result.emf)} V`
      : `ε = Bℓv = (${formatNum(B.y, 2)})(${formatNum(ell, 2)})(${formatNum(velocity, 2)}) = ${formatNum(result.emf)} V`
    : `ε = (v × B) · ℓ = ${formatNum(result.emf)} V`
  const current = closed ? `I = ε/R = ${formatNum(result.current)} A` : 'I = 0 (open circuit)'

  return (
    <footer className="statusbar">
      <span>{emf}</span>
      <span>{current}</span>
      <span>−dΦ/dt = {formatNum(result.emfFaraday)} V</span>
      <span className="status-note">
        x = {formatNum(x, 3)} m · v = {formatNum(velocity, 2)} m/s · θ = {formatNum(rodAngle, 0)}°
      </span>
    </footer>
  )
}
