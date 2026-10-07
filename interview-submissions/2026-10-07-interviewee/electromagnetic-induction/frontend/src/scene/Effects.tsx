import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useLab, type ViewId } from '../store'
import { useField, useInduction } from '../physics/useInduction'
import { barContacts } from './barPose'
import { FIXED_SPAN, SCALE, sx, Z0 } from './constants'
import { circuitPath } from './meterPose'
import { Arrow, Label } from './markers'

const PARTICLE_COUNT = 48

function FieldArrows({ view }: { view: ViewId }) {
  const B = useField()
  const showField = useLab((state) => state.showField)
  const showExam = useLab((state) => state.showExam)
  const shaftRef = useRef<THREE.InstancedMesh>(null)
  const headRef = useRef<THREE.InstancedMesh>(null)
  const magnitude = Math.hypot(B.x, B.y, B.z)
  const intoPage = Math.abs(B.y) > 0.02
  const symbols = showField && showExam && view === 'front' && intoPage
  const arrows = showField && magnitude > 1e-4 && !symbols

  const points = useMemo(() => {
    const list: [number, number, number][] = []
    const xs = [0.045, 0.09, 0.135, 0.17]
    const zs = [0.25, 0.55, 0.85]
    const ys = [-0.04, 0, 0.04]
    for (const x of xs) {
      for (const z of zs) {
        for (const y of ys) list.push([sx(x), sx(y), sx(Z0) + sx(FIXED_SPAN) * z])
      }
    }
    return list
  }, [])

  const shaftGeo = useMemo(() => {
    const geometry = new THREE.CylinderGeometry(0.012, 0.012, 0.2, 7)
    geometry.translate(0, 0.1, 0)
    return geometry
  }, [])
  const headGeo = useMemo(() => {
    const geometry = new THREE.ConeGeometry(0.034, 0.09, 7)
    geometry.translate(0, 0.245, 0)
    return geometry
  }, [])

  useLayoutEffect(() => {
    if (!arrows || !shaftRef.current || !headRef.current) return
    const direction = new THREE.Vector3(B.x, B.y, B.z).normalize()
    const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction)
    const dummy = new THREE.Object3D()
    const stretch = 0.85 + Math.min(magnitude, 0.5) * 1.1
    points.forEach((point, index) => {
      dummy.position.set(point[0], point[1], point[2])
      dummy.quaternion.copy(quaternion)
      dummy.scale.set(1, stretch, 1)
      dummy.updateMatrix()
      shaftRef.current?.setMatrixAt(index, dummy.matrix)
      headRef.current?.setMatrixAt(index, dummy.matrix)
    })
    shaftRef.current.count = points.length
    headRef.current.count = points.length
    shaftRef.current.instanceMatrix.needsUpdate = true
    headRef.current.instanceMatrix.needsUpdate = true
  }, [arrows, B.x, B.y, B.z, magnitude, points])

  return (
    <group>
      {arrows ? (
        <>
          <instancedMesh ref={shaftRef} args={[shaftGeo, undefined, points.length]}>
            <meshBasicMaterial color="#2f6fed" transparent opacity={0.85} toneMapped={false} />
          </instancedMesh>
          <instancedMesh ref={headRef} args={[headGeo, undefined, points.length]}>
            <meshBasicMaterial color="#2f6fed" transparent opacity={0.9} toneMapped={false} />
          </instancedMesh>
        </>
      ) : null}
      {showField ? (
        <mesh position={[sx(0.1), 0, sx(Z0 + FIXED_SPAN / 2)]}>
          <boxGeometry args={[sx(0.16), 0.5, sx(FIXED_SPAN * 0.92)]} />
          <meshBasicMaterial color="#8eb4e0" transparent opacity={0.08} depthWrite={false} toneMapped={false} />
        </mesh>
      ) : null}
      {symbols ? <ExamSymbols /> : null}
    </group>
  )
}

function symbolTexture(kind: 'cross' | 'dot') {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  ctx.strokeStyle = '#1d4e89'
  ctx.fillStyle = '#1d4e89'
  ctx.lineWidth = 14
  ctx.lineCap = 'round'
  if (kind === 'cross') {
    ctx.beginPath()
    ctx.moveTo(30, 30)
    ctx.lineTo(98, 98)
    ctx.moveTo(98, 30)
    ctx.lineTo(30, 98)
    ctx.stroke()
  } else {
    ctx.beginPath()
    ctx.arc(64, 64, 18, 0, Math.PI * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(64, 64, 8, 0, Math.PI * 2)
    ctx.fill()
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

function ExamSymbols() {
  const B = useField()
  const kind = B.y >= 0 ? 'cross' : 'dot'
  const map = useMemo(() => symbolTexture(kind), [kind])
  const points = useMemo(() => {
    const list: [number, number][] = []
    for (const x of [0.05, 0.09, 0.13, 0.17]) {
      for (let step = 1; step <= 3; step += 1) list.push([x, Z0 + (FIXED_SPAN * step) / 4])
    }
    return list
  }, [])
  if (!map) return null
  return (
    <group>
      {points.map(([x, z]) => (
        <mesh key={`${x}-${z}`} position={[sx(x), sx(-0.08), sx(z)]} rotation={[Math.PI / 2, 0, 0]} renderOrder={2}>
          <planeGeometry args={[0.22, 0.22]} />
          <meshBasicMaterial map={map} transparent depthWrite={false} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

function CurrentParticles() {
  const showCurrent = useLab((state) => state.showCurrent)
  const x = useLab((state) => state.x)
  const ell = useLab((state) => state.ell)
  const rodAngle = useLab((state) => state.rodAngle)
  const result = useInduction()
  const mesh = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const visible = showCurrent && Math.abs(result.current) > 1e-5

  useFrame(() => {
    if (!mesh.current || !visible) return
    const contacts = barContacts(x, ell, rodAngle)
    const path = circuitPath(contacts.q, contacts.p, contacts.separation)
    const speed = Math.sign(result.current) * Math.min(Math.abs(result.current) * 14, 2.2) * SCALE
    const phase = (performance.now() / 1000) * speed
    for (let index = 0; index < PARTICLE_COUNT; index += 1) {
      const sample = path.point(phase + (index / PARTICLE_COUNT) * path.perimeter)
      dummy.position.copy(sample)
      dummy.scale.setScalar(1)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(index, dummy.matrix)
    }
    mesh.current.instanceMatrix.needsUpdate = true
  })

  if (!visible) return null
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, PARTICLE_COUNT]}>
      <sphereGeometry args={[0.038, 10, 10]} />
      <meshBasicMaterial color="#f0b429" toneMapped={false} />
    </instancedMesh>
  )
}

function FluxSheet() {
  const showFlux = useLab((state) => state.showFlux)
  const x = useLab((state) => state.x)
  const ell = useLab((state) => state.ell)
  const rodAngle = useLab((state) => state.rodAngle)
  const geometry = useMemo(() => {
    const contacts = barContacts(x, ell, rodAngle)
    const shape = new THREE.Shape()
    shape.moveTo(0, sx(contacts.q.z))
    shape.lineTo(sx(contacts.q.x), sx(contacts.q.z))
    shape.lineTo(sx(contacts.p.x), sx(contacts.p.z))
    shape.lineTo(0, sx(contacts.p.z))
    shape.closePath()
    return new THREE.ShapeGeometry(shape)
  }, [x, ell, rodAngle])
  useLayoutEffect(() => () => geometry.dispose(), [geometry])
  if (!showFlux) return null
  return (
    <mesh geometry={geometry} position={[0, 0.01, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <meshBasicMaterial color="#e3b341" transparent opacity={0.28} depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  )
}

function VectorEffects() {
  const showVelocity = useLab((state) => state.showVelocity)
  const showLenz = useLab((state) => state.showLenz)
  const showFleming = useLab((state) => state.showFleming)
  const showCurrent = useLab((state) => state.showCurrent)
  const closed = useLab((state) => state.closed)
  const x = useLab((state) => state.x)
  const v = useLab((state) => state.v)
  const ell = useLab((state) => state.ell)
  const rodAngle = useLab((state) => state.rodAngle)
  const contacts = barContacts(x, ell, rodAngle)
  const B = useField()
  const result = useInduction()
  const midX = sx((contacts.q.x + contacts.p.x) / 2)
  const midZ = sx((contacts.q.z + contacts.p.z) / 2)
  const showTriad = showFleming && Math.abs(result.emf) > 1e-5
  const showCharges = showCurrent && !closed && Math.abs(result.emf) > 1e-5

  return (
    <group>
      {showVelocity && Math.abs(v) > 0.02 ? (
        <group position={[midX, -0.28, midZ]}>
          <Arrow x={Math.sign(v)} y={0} z={0} length={Math.min(0.28 + Math.abs(v) * 0.2, 0.7)} color="#2f9e44" label="v" />
        </group>
      ) : null}
      {showLenz && result.zeroReason === 'ok' ? (
        <group position={[midX, -0.28, midZ + 0.22]}>
          <Arrow
            x={result.lenzForce.x}
            y={result.lenzForce.y}
            z={result.lenzForce.z}
            length={0.42}
            color="#e07a2f"
            label="F"
          />
        </group>
      ) : null}
      {showTriad ? (
        <group position={[sx(0.22), -0.7, midZ]} scale={0.62}>
          <mesh>
            <sphereGeometry args={[0.035, 12, 12]} />
            <meshBasicMaterial color="#222222" />
          </mesh>
          <Arrow x={Math.sign(v) || 1} y={0} z={0} length={0.55} color="#2f9e44" label="Motion" />
          <Arrow x={B.x} y={B.y} z={B.z} length={0.55} color="#2f6fed" label="Field" />
          <Arrow
            x={result.currentDirection.x}
            y={result.currentDirection.y}
            z={result.currentDirection.z}
            length={0.55}
            color="#d64545"
            label="Current"
          />
        </group>
      ) : null}
      {showCharges ? (
        <group>
          <Label
            text={result.emf >= 0 ? '+' : '−'}
            color={result.emf >= 0 ? '#c5363a' : '#1d4e89'}
            position={[sx(contacts.p.x), -0.24, sx(contacts.p.z) + 0.08]}
            width={0.28}
            height={0.28}
          />
          <Label
            text={result.emf >= 0 ? '−' : '+'}
            color={result.emf >= 0 ? '#1d4e89' : '#c5363a'}
            position={[sx(contacts.q.x), -0.24, sx(contacts.q.z) - 0.08]}
            width={0.28}
            height={0.28}
          />
        </group>
      ) : null}
    </group>
  )
}

export function Effects({ view }: { view: ViewId }) {
  return (
    <group>
      <FieldArrows view={view} />
      <FluxSheet />
      <CurrentParticles />
      <VectorEffects />
    </group>
  )
}
