import * as THREE from 'three'
import { FIXED_SPAN, sx, Z0 } from './constants'

/** Where the meter leads meet the rails, in scene units. */
export const RAIL_JOIN_X = 0.04

export function meterPose(separation: number) {
  const radius = Math.min(Math.max(sx(FIXED_SPAN) * 0.46, 0.24), 0.52)
  const zMid = sx(Z0 + FIXED_SPAN / 2)
  const centerX = -radius - 0.16
  const centerY = -0.2
  const upperPost = new THREE.Vector3(centerX + radius * 0.62, centerY - 0.02, zMid + radius * 0.62)
  const lowerPost = new THREE.Vector3(centerX + radius * 0.62, centerY - 0.02, zMid - radius * 0.62)
  const topRail = new THREE.Vector3(RAIL_JOIN_X, 0, sx(Z0 + separation))
  const bottomRail = new THREE.Vector3(RAIL_JOIN_X, 0, sx(Z0))
  return { radius, zMid, centerX, centerY, upperPost, lowerPost, topRail, bottomRail }
}

export function leadControl(from: THREE.Vector3, to: THREE.Vector3) {
  const mid = from.clone().lerp(to, 0.5)
  mid.y -= 0.08
  return mid
}

function lineSegment(from: THREE.Vector3, to: THREE.Vector3) {
  const length = Math.max(from.distanceTo(to), 1e-4)
  return { length, at: (t: number) => from.clone().lerp(to, t) }
}

function curveSegment(curve: THREE.QuadraticBezierCurve3) {
  return { length: Math.max(curve.getLength(), 1e-4), at: (t: number) => curve.getPoint(t) }
}

/** Closed current path in scene units. Positive distance runs toward the bar, up PQ, back along the top rod, then through the galvanometer. */
export function circuitPath(q: { x: number; z: number }, p: { x: number; z: number }, separation: number) {
  const pose = meterPose(separation)
  const railY = -0.05
  const bottomJoin = pose.bottomRail.clone()
  bottomJoin.y = railY
  const topJoin = pose.topRail.clone()
  topJoin.y = railY
  const qPoint = new THREE.Vector3(sx(q.x), railY, sx(q.z))
  const pPoint = new THREE.Vector3(sx(p.x), railY, sx(p.z))
  const faceY = pose.centerY - 0.22
  const dialRadius = pose.radius * 0.62
  const dial: THREE.Vector3[] = []
  const dialSteps = 10
  for (let step = 0; step <= dialSteps; step += 1) {
    const angle = Math.PI / 4 + (step / dialSteps) * Math.PI * 1.5
    dial.push(
      new THREE.Vector3(
        pose.centerX + Math.cos(angle) * dialRadius,
        faceY,
        pose.zMid + Math.sin(angle) * dialRadius,
      ),
    )
  }
  const ontoFace = lineSegment(pose.upperPost, dial[0])
  const offFace = lineSegment(dial[dial.length - 1], pose.lowerPost)
  const acrossFace = dial.slice(1).map((point, index) => lineSegment(dial[index], point))
  const segments = [
    lineSegment(bottomJoin, qPoint),
    lineSegment(qPoint, pPoint),
    lineSegment(pPoint, topJoin),
    curveSegment(new THREE.QuadraticBezierCurve3(topJoin, leadControl(topJoin, pose.upperPost), pose.upperPost)),
    ontoFace,
    ...acrossFace,
    offFace,
    curveSegment(new THREE.QuadraticBezierCurve3(pose.lowerPost, leadControl(pose.lowerPost, bottomJoin), bottomJoin)),
  ]
  const perimeter = segments.reduce((sum, segment) => sum + segment.length, 0)
  return {
    perimeter,
    point(distance: number) {
      let along = distance % perimeter
      if (along < 0) along += perimeter
      for (const segment of segments) {
        if (along <= segment.length) return segment.at(along / segment.length)
        along -= segment.length
      }
      return bottomJoin
    },
  }
}
