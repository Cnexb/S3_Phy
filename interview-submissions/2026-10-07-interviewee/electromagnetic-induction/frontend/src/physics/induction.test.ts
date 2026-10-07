import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { dot, evaluate, type Vec3 } from './induction'

type Fixture = {
  name: string
  B: [number, number, number]
  v: [number, number, number]
  ell: [number, number, number]
  R: number
  closed: boolean
  x: number
  emf: number
  current: number
  phi: number
  emfFaraday: number
  force?: [number, number, number]
  zeroReason: string
}

const here = dirname(fileURLToPath(import.meta.url))
const fixtures = JSON.parse(
  readFileSync(resolve(here, '../../../shared/fixtures/vectors.json'), 'utf8'),
) as { cases: Fixture[] }

function vec(t: [number, number, number]): Vec3 {
  return { x: t[0], y: t[1], z: t[2] }
}

describe('motional emf fixtures', () => {
  for (const testCase of fixtures.cases) {
    it(testCase.name, () => {
      const result = evaluate({
        B: vec(testCase.B),
        v: vec(testCase.v),
        ell: vec(testCase.ell),
        R: testCase.R,
        closed: testCase.closed,
        x: testCase.x,
      })
      expect(result.emf).toBeCloseTo(testCase.emf, 6)
      expect(result.current).toBeCloseTo(testCase.current, 6)
      expect(result.phi).toBeCloseTo(testCase.phi, 6)
      expect(result.emfFaraday).toBeCloseTo(testCase.emfFaraday, 6)
      expect(result.emf).toBeCloseTo(result.emfFaraday, 6)
      expect(result.zeroReason).toBe(testCase.zeroReason)
      expect(dot(result.lenzForce, vec(testCase.v))).toBeLessThanOrEqual(1e-9)
      if (testCase.force) {
        expect(result.lenzForce.x).toBeCloseTo(testCase.force[0], 6)
        expect(result.lenzForce.y).toBeCloseTo(testCase.force[1], 6)
        expect(result.lenzForce.z).toBeCloseTo(testCase.force[2], 6)
      }
    })
  }
})
