import { useMemo } from 'react'
import { Billboard } from '@react-three/drei'
import * as THREE from 'three'

function useLabelTexture(text: string, color: string) {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 128
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = color
    ctx.font = '700 72px "Segoe UI", sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, 128, 68)
    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    return texture
  }, [text, color])
}

export function Label({
  text,
  color,
  position,
  width = 0.42,
  height = 0.2,
}: {
  text: string
  color: string
  position: [number, number, number]
  width?: number
  height?: number
}) {
  const map = useLabelTexture(text, color)
  if (!map) return null
  return (
    <Billboard position={position}>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={map} transparent depthWrite={false} toneMapped={false} />
      </mesh>
    </Billboard>
  )
}

export function Arrow({
  x,
  y,
  z,
  length,
  color,
  label,
}: {
  x: number
  y: number
  z: number
  length: number
  color: string
  label?: string
}) {
  const quaternion = useMemo(() => {
    const direction = new THREE.Vector3(x, y, z)
    if (direction.lengthSq() < 1e-8) return new THREE.Quaternion()
    return new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize())
  }, [x, y, z])

  if (length <= 0.02) return null
  const shaft = Math.max(length - 0.12, 0.05)
  return (
    <group quaternion={quaternion}>
      <mesh position={[0, shaft / 2, 0]}>
        <cylinderGeometry args={[0.018, 0.018, shaft, 12]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <mesh position={[0, shaft + 0.06, 0]}>
        <coneGeometry args={[0.045, 0.14, 12]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      {label ? <Label text={label} color={color} position={[0.02, length + 0.16, 0]} width={0.7} height={0.24} /> : null}
    </group>
  )
}
