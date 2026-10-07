import { useLayoutEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useLab } from '../store'
import { useInduction } from '../physics/useInduction'
import { barContacts } from './barPose'
import { leadControl, meterPose } from './meterPose'

const copper = '#b87333'
const brass = '#c6a15b'
const caseColor = '#2a2e33'

function useDialTexture() {
  return useMemo(() => {
    const size = 512
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    const center = size / 2
    ctx.clearRect(0, 0, size, size)
    ctx.fillStyle = '#f4f0e6'
    ctx.beginPath()
    ctx.arc(center, center, 248, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#d9d2c3'
    ctx.lineWidth = 18
    ctx.beginPath()
    ctx.arc(center, center, 236, 0, Math.PI * 2)
    ctx.stroke()

    const span = 1.05
    ctx.strokeStyle = '#222'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.arc(center, center, 188, -Math.PI / 2 - span, -Math.PI / 2 + span)
    ctx.stroke()
    for (let mark = -6; mark <= 6; mark += 1) {
      const angle = -Math.PI / 2 + (mark / 6) * span
      const major = mark % 2 === 0
      const inner = major ? 158 : 170
      const outer = 198
      ctx.lineWidth = major ? 4 : 2
      ctx.beginPath()
      ctx.moveTo(center + Math.cos(angle) * inner, center + Math.sin(angle) * inner)
      ctx.lineTo(center + Math.cos(angle) * outer, center + Math.sin(angle) * outer)
      ctx.stroke()
    }
    ctx.fillStyle = '#222'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = '700 54px "Segoe UI", sans-serif'
    ctx.fillText('0', center, center - 118)
    ctx.fillText('+', center + 132, center - 8)
    ctx.fillText('−', center - 132, center - 8)
    ctx.fillStyle = '#5c564c'
    ctx.font = '600 32px "Segoe UI", sans-serif'
    ctx.fillText('G', center, center + 78)

    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.needsUpdate = true
    return texture
  }, [])
}

function Lead({
  from,
  to,
  detached = false,
}: {
  from: [number, number, number]
  to: [number, number, number]
  detached?: boolean
}) {
  const { geometry, tip } = useMemo(() => {
    const start = new THREE.Vector3(from[0], from[1], from[2])
    const rail = new THREE.Vector3(to[0], to[1], to[2])
    const end = rail.clone()
    if (detached) {
      end.lerpVectors(start, rail, 0.58)
      end.x -= 0.14
      end.y -= 0.2
    }
    const curve = new THREE.QuadraticBezierCurve3(start, leadControl(start, end), end)
    return {
      geometry: new THREE.TubeGeometry(curve, 14, 0.02, 6, false),
      tip: detached ? (end.toArray() as [number, number, number]) : null,
    }
  }, [from[0], from[1], from[2], to[0], to[1], to[2], detached])
  useLayoutEffect(() => () => geometry.dispose(), [geometry])
  return (
    <group>
      <mesh geometry={geometry}>
        <meshStandardMaterial color={copper} metalness={0.7} roughness={0.28} />
      </mesh>
      {tip ? (
        <mesh position={tip}>
          <sphereGeometry args={[0.034, 12, 12]} />
          <meshStandardMaterial color={copper} metalness={0.7} roughness={0.28} />
        </mesh>
      ) : null}
    </group>
  )
}

function BindingPost({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry args={[0.026, 0.026, 0.07, 12]} />
        <meshStandardMaterial color={brass} metalness={0.82} roughness={0.28} />
      </mesh>
      <mesh position={[0.045, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.038, 0.028, 12]} />
        <meshStandardMaterial color={brass} metalness={0.78} roughness={0.32} />
      </mesh>
    </group>
  )
}

export function Galvanometer() {
  const ell = useLab((state) => state.ell)
  const rodAngle = useLab((state) => state.rodAngle)
  const closed = useLab((state) => state.closed)
  const separation = barContacts(0, ell, rodAngle).separation
  const result = useInduction()
  const dial = useDialTexture()
  const pose = meterPose(separation)
  const { radius, zMid, centerX, centerY } = pose
  const stem = Math.max(zMid - radius - 0.05, 0.05)
  const deflection = Math.max(-1, Math.min(1, result.current / 0.002)) * 0.95
  const upperLead = pose.upperPost.toArray() as [number, number, number]
  const lowerLead = pose.lowerPost.toArray() as [number, number, number]
  const topRail = pose.topRail.toArray() as [number, number, number]
  const bottomRail = pose.bottomRail.toArray() as [number, number, number]

  return (
    <group>
      <group position={[centerX, centerY, zMid]}>
        <mesh position={[0, 0.04, 0]}>
          <cylinderGeometry args={[radius, radius * 0.97, 0.16, 48, 1, true]} />
          <meshStandardMaterial color={caseColor} metalness={0.58} roughness={0.4} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[radius * 0.97, 40]} />
          <meshStandardMaterial color="#1c2024" metalness={0.45} roughness={0.48} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, -0.09, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[radius * 0.98, 0.03, 12, 48]} />
          <meshStandardMaterial color={brass} metalness={0.84} roughness={0.24} />
        </mesh>
        <mesh position={[0, -0.085, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[radius * 0.9, 48]} />
          {dial ? (
            <meshBasicMaterial map={dial} toneMapped={false} side={THREE.DoubleSide} />
          ) : (
            <meshBasicMaterial color="#f4f0e6" />
          )}
        </mesh>
        <group position={[0, -0.11, 0]} rotation={[0, deflection, 0]}>
          <mesh position={[0, 0, radius * 0.32]}>
            <boxGeometry args={[0.014, 0.01, radius * 0.58]} />
            <meshStandardMaterial color="#161616" metalness={0.25} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, radius * 0.64]}>
            <boxGeometry args={[0.026, 0.012, radius * 0.12]} />
            <meshStandardMaterial color="#c5363a" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, -radius * 0.14]}>
            <sphereGeometry args={[0.028, 12, 12]} />
            <meshStandardMaterial color="#161616" metalness={0.35} roughness={0.4} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.034, 16, 16]} />
            <meshStandardMaterial color={brass} metalness={0.8} roughness={0.25} />
          </mesh>
        </group>
        <mesh position={[0, -0.1, 0]} rotation={[0, 0, Math.PI]} scale={[1, 0.18, 1]}>
          <sphereGeometry args={[radius * 0.9, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial
            color="#e7f2fb"
            transparent
            opacity={0.16}
            roughness={0.04}
            metalness={0.04}
            depthWrite={false}
          />
        </mesh>
        <mesh position={[0, 0.04, -radius - stem / 2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.038, 0.042, stem, 12]} />
          <meshStandardMaterial color={caseColor} metalness={0.5} roughness={0.45} />
        </mesh>
        <mesh position={[0, 0.04, -radius - stem]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[radius * 0.42, radius * 0.46, 0.04, 24]} />
          <meshStandardMaterial color="#1b1e22" metalness={0.4} roughness={0.5} />
        </mesh>
        <BindingPost position={[radius * 0.55, -0.02, radius * 0.62]} />
        <BindingPost position={[radius * 0.55, -0.02, -radius * 0.62]} />
      </group>
      <Lead from={upperLead} to={topRail} detached={!closed} />
      <Lead from={lowerLead} to={bottomRail} />
    </group>
  )
}
