import { useEffect, useState } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useLab } from '../store'
import { useField } from '../physics/useInduction'
import { Galvanometer } from './Galvanometer'
import { barContacts, RAIL_END } from './barPose'
import { FIXED_SPAN, SCALE, sx, V_MAX, Z0 } from './constants'
import { Label } from './markers'

const copper = '#b87333'
const barColor = '#e7eef6'

function pointerToX(event: PointerEvent, camera: THREE.Camera, element: HTMLCanvasElement) {
  const rect = element.getBoundingClientRect()
  if (rect.width < 2 || rect.height < 2) return null
  const ndc = new THREE.Vector2(
    ((event.clientX - rect.left) / rect.width) * 2 - 1,
    -((event.clientY - rect.top) / rect.height) * 2 + 1,
  )
  const raycaster = new THREE.Raycaster()
  raycaster.setFromCamera(ndc, camera)
  const normal = new THREE.Vector3()
  camera.getWorldDirection(normal)
  if (Math.abs(normal.x) > 0.92) return null
  const state = useLab.getState()
  const contacts = barContacts(state.x, state.ell, state.rodAngle)
  const anchor = new THREE.Vector3(
    sx((contacts.q.x + contacts.p.x) / 2),
    0,
    sx((contacts.q.z + contacts.p.z) / 2),
  )
  const hit = new THREE.Vector3()
  const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(normal, anchor)
  if (!raycaster.ray.intersectPlane(plane, hit)) return null
  return hit.x / SCALE
}

function Bar() {
  const x = useLab((state) => state.x)
  const ell = useLab((state) => state.ell)
  const rodAngle = useLab((state) => state.rodAngle)
  const dragging = useLab((state) => state.dragging)
  const camera = useThree((state) => state.camera)
  const gl = useThree((state) => state.gl)
  const [hot, setHot] = useState(false)

  useEffect(() => {
    const element = gl.domElement
    const move = (event: PointerEvent) => {
      const state = useLab.getState()
      if (!state.dragging) return
      const nextX = pointerToX(event, camera, element)
      if (nextX == null) return
      const now = performance.now()
      const dt = (now - state.lastMove) / 1000
      let velocity = 0
      if (dt > 0.012) velocity = (nextX - state.x) / dt
      velocity = Math.min(V_MAX, Math.max(-V_MAX, velocity))
      state.setMotion(nextX, velocity, true)
    }
    const up = (event: PointerEvent) => {
      if (event.button !== 0) return
      if (!useLab.getState().dragging) return
      useLab.getState().endDrag()
      document.body.style.cursor = 'default'
    }
    element.addEventListener('pointermove', move)
    element.addEventListener('pointerup', up)
    return () => {
      element.removeEventListener('pointermove', move)
      element.removeEventListener('pointerup', up)
    }
  }, [camera, gl])

  const contacts = barContacts(x, ell, rodAngle)
  const dir = new THREE.Vector3(sx(contacts.p.x - contacts.q.x), 0, sx(contacts.p.z - contacts.q.z))
  const height = Math.max(dir.length(), 0.02)
  const mid: [number, number, number] = [
    sx((contacts.q.x + contacts.p.x) / 2),
    0,
    sx((contacts.q.z + contacts.p.z) / 2),
  ]
  const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize())
  const lit = hot || dragging
  return (
    <group>
      <group position={mid} quaternion={quaternion}>
      <mesh raycast={() => null}>
        <cylinderGeometry args={[0.055, 0.055, height, 20]} />
        <meshStandardMaterial
          color={lit ? '#ffe8b0' : barColor}
          metalness={0.75}
          roughness={0.22}
          emissive={lit ? '#c47b12' : '#000000'}
          emissiveIntensity={lit ? 0.45 : 0}
        />
      </mesh>
      <mesh
        onPointerOver={(event) => {
          event.stopPropagation()
          setHot(true)
          document.body.style.cursor = 'grab'
        }}
        onPointerOut={() => {
          setHot(false)
          if (!useLab.getState().dragging) document.body.style.cursor = 'default'
        }}
        onPointerDown={(event) => {
          if (event.button !== 0) return
          event.stopPropagation()
          gl.domElement.setPointerCapture(event.nativeEvent.pointerId)
          document.body.style.cursor = 'grabbing'
          useLab.getState().beginDrag()
        }}
      >
        <cylinderGeometry args={[0.12, 0.12, height, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      </group>
      <Label text="P" color="#1f2933" position={[sx(contacts.p.x) + 0.16, -0.22, sx(contacts.p.z)]} width={0.28} height={0.2} />
      <Label text="Q" color="#1f2933" position={[sx(contacts.q.x) + 0.16, -0.22, sx(contacts.q.z)]} width={0.28} height={0.2} />
    </group>
  )
}

function Rails() {
  const ell = useLab((state) => state.ell)
  const rodAngle = useLab((state) => state.rodAngle)
  const contacts = barContacts(0, ell, rodAngle)
  const length = sx(RAIL_END)
  const thick = 0.07
  const zBottom = sx(contacts.q.z)
  const zTop = sx(contacts.q.z + contacts.separation)
  return (
    <group>
      <mesh position={[length / 2, 0, zBottom]}>
        <boxGeometry args={[length, thick, thick]} />
        <meshStandardMaterial color={copper} metalness={0.65} roughness={0.32} />
      </mesh>
      <mesh position={[length / 2, 0, zTop]}>
        <boxGeometry args={[length, thick, thick]} />
        <meshStandardMaterial color={copper} metalness={0.65} roughness={0.32} />
      </mesh>
    </group>
  )
}

function Poles() {
  const B = useField()
  const showField = useLab((state) => state.showField)
  const direction = fieldDirection(B)
  const center = new THREE.Vector3(sx(0.1), 0, sx(Z0 + FIXED_SPAN / 2))
  const gap = 1.35
  const north = center.clone().addScaledVector(direction, -gap)
  const south = center.clone().addScaledVector(direction, gap)
  const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction)
  if (!showField) return null
  return (
    <group>
      <mesh position={north} quaternion={quaternion}>
        <boxGeometry args={[sx(0.12), 0.22, sx(FIXED_SPAN) * 0.82]} />
        <meshStandardMaterial color="#c5363a" roughness={0.5} transparent opacity={0.38} depthWrite={false} />
      </mesh>
      <mesh position={south} quaternion={quaternion}>
        <boxGeometry args={[sx(0.12), 0.22, sx(FIXED_SPAN) * 0.82]} />
        <meshStandardMaterial color="#2a62b5" roughness={0.5} transparent opacity={0.38} depthWrite={false} />
      </mesh>
      <Label
        text="N"
        color="#8f1d22"
        position={[north.x - direction.x * 0.28, north.y - direction.y * 0.28, north.z - direction.z * 0.28]}
      />
      <Label
        text="S"
        color="#1d4e89"
        position={[south.x + direction.x * 0.28, south.y + direction.y * 0.28, south.z + direction.z * 0.28]}
      />
    </group>
  )
}

function fieldDirection(B: { x: number; y: number; z: number }) {
  const length = Math.hypot(B.x, B.y, B.z)
  if (length < 1e-4) return new THREE.Vector3(0, 1, 0)
  return new THREE.Vector3(B.x / length, B.y / length, B.z / length)
}

export function Apparatus() {
  return (
    <group>
      <mesh position={[sx(RAIL_END / 2), 0, 0.012]}>
        <boxGeometry args={[sx(RAIL_END + 0.04), sx(0.22), 0.024]} />
        <meshStandardMaterial color="#ddd6c8" roughness={0.85} />
      </mesh>
      <Rails />
      <Galvanometer />
      <Poles />
      <Bar />
    </group>
  )
}
