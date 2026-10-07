import { useEffect, useState } from 'react'
import { ControlPanel, loadScenarios } from './components/ControlPanel'
import { StatusBar } from './components/StatusBar'
import { ViewportGrid } from './scene/Viewport'
import { travelLimits } from './scene/barPose'
import { useLab } from './store'

const NUDGE_SPEED = 0.08

export default function App() {
  const [online, setOnline] = useState(false)
  const showGrid = useLab((state) => state.showGrid)
  const snap = useLab((state) => state.snap)

  useEffect(() => {
    loadScenarios()
    fetch('/api/health')
      .then((response) => setOnline(response.ok))
      .catch(() => setOnline(false))
  }, [])

  useEffect(() => {
    let frame = 0
    let last = performance.now()
    const tick = () => {
      const now = performance.now()
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      const state = useLab.getState()
      if (state.dragging && now - state.lastMove > 90 && state.v !== 0) {
        state.setV(0)
      }
      if (state.nudge !== 0 && !state.dragging) {
        const speed = NUDGE_SPEED * state.nudge
        const next = state.x + speed * dt
        const limits = travelLimits(state.ell, state.rodAngle)
        const clamped = Math.min(limits.hi, Math.max(limits.lo, next))
        const velocity = clamped === next ? speed : 0
        if (clamped !== state.x || state.v !== velocity) state.setMotion(clamped, velocity, false)
      }
      const playback = useLab.getState().playback
      if (playback && !useLab.getState().dragging && useLab.getState().nudge === 0) {
        const progress = Math.min((performance.now() - playback.started) / (playback.duration * 1000), 1)
        const x = playback.fromX + (playback.toX - playback.fromX) * progress
        const velocity = progress < 1 ? (playback.toX - playback.fromX) / playback.duration : 0
        useLab.getState().setMotion(x, velocity, false)
        if (progress >= 1) useLab.getState().stopPlayback()
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement | null)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (event.key === 'g' || event.key === 'G') useLab.getState().toggle('showGrid')
      if (event.key === 'f' || event.key === 'F') useLab.getState().frame()
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        useLab.getState().setNudge(-1)
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        useLab.getState().setNudge(1)
      }
    }
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' && useLab.getState().nudge === -1) useLab.getState().setNudge(0)
      if (event.key === 'ArrowRight' && useLab.getState().nudge === 1) useLab.getState().setNudge(0)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <strong>Induced current</strong>
          <span>HKDSE · Fleming's right-hand rule</span>
        </div>
        <div className="toolbar">
          <button type="button" className={showGrid ? 'tool on' : 'tool'} onClick={() => useLab.getState().toggle('showGrid')}>
            Grid
          </button>
          <button type="button" className={snap ? 'tool on' : 'tool'} onClick={() => useLab.getState().toggle('snap')}>
            Snap
          </button>
          <button type="button" className="tool" onClick={() => useLab.getState().frame()}>
            Frame
          </button>
          <span className="mouse-hint">Left-drag bar · Right-drag view · Shift+right pan · Wheel zoom · Double-click a title to fill the screen</span>
        </div>
        <span className={online ? 'api on' : 'api'}>{online ? 'Solver on' : 'Solver off'}</span>
      </header>
      <div className="workspace">
        <div className="viewport-wrap">
          <ViewportGrid />
        </div>
        <ControlPanel />
      </div>
      <StatusBar />
    </div>
  )
}
