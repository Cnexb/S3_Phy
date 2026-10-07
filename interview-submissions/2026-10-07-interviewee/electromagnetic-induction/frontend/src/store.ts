import { create } from 'zustand'
import scenarioData from '../../shared/fixtures/scenarios.json'
import { clampBarX, ROD_ANGLE_MAX, ROD_ANGLE_MIN, travelLimits } from './scene/barPose'
import { type ViewId } from './scene/constants'

export type Scenario = {
  id: string
  name: string
  summary: string
  bMag: number
  azimuthDeg: number
  elevationDeg: number
  ell: number
  R: number
  closed: boolean
  playback: { fromX: number; toX: number; duration: number }
}

export type { ViewId } from './scene/constants'

export type Playback = {
  fromX: number
  toX: number
  duration: number
  started: number
}

type LabState = {
  bMag: number
  azimuth: number
  elevation: number
  ell: number
  /** Angle between conductor PQ and the metal rods, in degrees. 90° is perpendicular. */
  rodAngle: number
  R: number
  closed: boolean
  x: number
  v: number
  dragging: boolean
  lastMove: number
  /** -1 moves the bar left while held, +1 moves it right, 0 means released. */
  nudge: -1 | 0 | 1
  playback: Playback | null
  showField: boolean
  showExam: boolean
  showVelocity: boolean
  showCurrent: boolean
  showFleming: boolean
  showLenz: boolean
  showFlux: boolean
  showGrid: boolean
  snap: boolean
  active: ViewId
  maximized: ViewId | null
  frameToken: number
  scenarios: Scenario[]
  setBMag: (value: number) => void
  setAzimuthDeg: (degrees: number) => void
  setElevationDeg: (degrees: number) => void
  setEll: (value: number) => void
  setRodAngle: (degrees: number) => void
  setR: (value: number) => void
  setClosed: (closed: boolean) => void
  setMotion: (x: number, v: number, snap: boolean) => void
  setV: (v: number) => void
  beginDrag: () => void
  endDrag: () => void
  setNudge: (direction: -1 | 0 | 1) => void
  applyScenario: (scenario: Scenario) => void
  playSlide: (direction: 1 | -1) => void
  stopPlayback: () => void
  toggle: (key: ToggleKey) => void
  setActive: (view: ViewId) => void
  toggleMaximize: (view: ViewId) => void
  frame: () => void
  resetExperiment: () => void
  setScenarios: (scenarios: Scenario[]) => void
}

type ToggleKey =
  | 'showField'
  | 'showExam'
  | 'showVelocity'
  | 'showCurrent'
  | 'showFleming'
  | 'showLenz'
  | 'showFlux'
  | 'showGrid'
  | 'snap'

const INITIAL = {
  bMag: 0.2,
  azimuth: 0,
  elevation: 0,
  ell: 0.1,
  rodAngle: 90,
  R: 2,
  closed: true,
  x: 0.1,
  v: 0,
  dragging: false,
  lastMove: 0,
  nudge: 0 as -1 | 0 | 1,
  playback: null as Playback | null,
  showField: true,
  showExam: true,
  showVelocity: true,
  showCurrent: true,
  showFleming: true,
  showLenz: true,
  showFlux: true,
  showGrid: true,
  snap: false,
  active: 'front' as ViewId,
  maximized: null as ViewId | null,
  frameToken: 0,
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export const useLab = create<LabState>((set, get) => ({
  ...INITIAL,
  scenarios: scenarioData as Scenario[],
  setBMag: (value) => set({ bMag: clamp(value, 0, 0.5) }),
  setAzimuthDeg: (degrees) => set({ azimuth: (degrees * Math.PI) / 180 }),
  setElevationDeg: (degrees) => set({ elevation: (clamp(degrees, -90, 90) * Math.PI) / 180 }),
  setEll: (value) => {
    const ell = clamp(value, 0.05, 0.2)
    const { x, rodAngle, snap } = get()
    set({ ell, x: clampBarX(x, ell, rodAngle, snap) })
  },
  setRodAngle: (degrees) => {
    const rodAngle = clamp(degrees, ROD_ANGLE_MIN, ROD_ANGLE_MAX)
    const { x, ell, snap } = get()
    set({ rodAngle, x: clampBarX(x, ell, rodAngle, snap) })
  },
  setR: (value) => set({ R: clamp(value, 0.5, 20) }),
  setClosed: (closed) => set({ closed }),
  setMotion: (x, v, snap) => {
    const { ell, rodAngle, snap: snapOn } = get()
    set({ x: clampBarX(x, ell, rodAngle, snap && snapOn), v, lastMove: performance.now() })
  },
  setV: (v) => set({ v }),
  beginDrag: () => set({ dragging: true, playback: null, nudge: 0, v: 0, lastMove: performance.now() }),
  endDrag: () => set({ dragging: false, v: 0 }),
  setNudge: (direction) => {
    const current = get()
    if (current.nudge === direction && (direction === 0 || current.playback === null)) return
    set({
      nudge: direction,
      playback: direction === 0 ? current.playback : null,
      v: direction === 0 ? 0 : current.v,
    })
  },
  applyScenario: (scenario) =>
    set({
      bMag: scenario.bMag,
      azimuth: (scenario.azimuthDeg * Math.PI) / 180,
      elevation: (scenario.elevationDeg * Math.PI) / 180,
      ell: scenario.ell,
      rodAngle: 90,
      R: scenario.R,
      closed: scenario.closed,
      x: scenario.playback.fromX,
      v: 0,
      nudge: 0,
      playback: { ...scenario.playback, started: performance.now() },
    }),
  playSlide: (direction) => {
    const x = get().x
    const { lo, hi } = travelLimits(get().ell, get().rodAngle)
    const toX = direction > 0 ? hi : lo
    const duration = Math.max(0.45, Math.abs(toX - x) / 0.09)
    set({
      playback: { fromX: x, toX, duration, started: performance.now() },
      nudge: 0,
      v: 0,
    })
  },
  stopPlayback: () => set({ playback: null, v: 0 }),
  toggle: (key) => set((state) => ({ [key]: !state[key] })),
  setActive: (view) => set({ active: view }),
  toggleMaximize: (view) =>
    set((state) => ({
      active: view,
      maximized: state.maximized === view ? null : view,
    })),
  frame: () => set((state) => ({ frameToken: state.frameToken + 1 })),
  resetExperiment: () => set({ ...INITIAL, scenarios: get().scenarios, frameToken: get().frameToken + 1 }),
  setScenarios: (scenarios) => set({ scenarios }),
}))
