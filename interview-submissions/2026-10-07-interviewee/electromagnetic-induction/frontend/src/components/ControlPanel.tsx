import { useEffect, useState } from 'react'
import { conductorVector, formatNum, shortDirection } from '../physics/induction'
import { ROD_ANGLE_MAX, ROD_ANGLE_MIN } from '../scene/barPose'
import { useField, useInduction } from '../physics/useInduction'
import { useLab, type Scenario } from '../store'

const PRESETS = [
  { id: 'in', label: 'Into page', azimuth: 0, elevation: 0 },
  { id: 'out', label: 'Out of page', azimuth: 180, elevation: 0 },
  { id: 'right', label: 'Right', azimuth: 90, elevation: 0 },
  { id: 'left', label: 'Left', azimuth: -90, elevation: 0 },
  { id: 'up', label: 'Up', azimuth: 0, elevation: 90 },
  { id: 'down', label: 'Down', azimuth: 0, elevation: -90 },
]

function near(a: number, b: number) {
  const delta = Math.abs(((((a - b) % 360) + 540) % 360) - 180)
  return delta < 3
}

function FieldControl() {
  const bMag = useLab((state) => state.bMag)
  const azimuth = useLab((state) => state.azimuth)
  const elevation = useLab((state) => state.elevation)
  const setBMag = useLab((state) => state.setBMag)
  const setAzimuthDeg = useLab((state) => state.setAzimuthDeg)
  const setElevationDeg = useLab((state) => state.setElevationDeg)
  const az = (azimuth * 180) / Math.PI
  const el = (elevation * 180) / Math.PI

  return (
    <section>
      <h2>Magnetic field</h2>
      <NumberRow label="B" unit="T" min={0} max={0.5} step={0.01} value={bMag} onChange={setBMag} />
      <div className="presets">
        {PRESETS.map((preset) => {
          const vertical = Math.abs(preset.elevation) > 80
          const selected = vertical ? near(el, preset.elevation) : near(az, preset.azimuth) && near(el, preset.elevation)
          return (
            <button
              key={preset.id}
              type="button"
              className={selected && bMag > 0.01 ? 'preset on' : 'preset'}
              onClick={() => {
                if (useLab.getState().bMag < 0.01) setBMag(0.2)
                setAzimuthDeg(preset.azimuth)
                setElevationDeg(preset.elevation)
              }}
            >
              {preset.label}
            </button>
          )
        })}
      </div>
      <NumberRow label="Azimuth" unit="°" min={-180} max={180} step={1} value={az} onChange={setAzimuthDeg} />
      <NumberRow label="Elevation" unit="°" min={-90} max={90} step={1} value={el} onChange={setElevationDeg} />
      <p className="hint">Azimuth 0° points into the page in the Front view. Elevation 90° points up.</p>
    </section>
  )
}

function NumberRow({
  label,
  unit,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string
  unit: string
  min: number
  max: number
  step: number
  value: number
  onChange: (value: number) => void
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={Number(value.toFixed(3))}
        onChange={(event) => {
          const next = Number(event.target.value)
          if (Number.isFinite(next)) onChange(next)
        }}
      />
      <em>{unit}</em>
    </label>
  )
}

function HoldButton({ direction, label }: { direction: -1 | 1; label: string }) {
  const stop = () => useLab.getState().setNudge(0)
  return (
    <button
      type="button"
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId)
        useLab.getState().setNudge(direction)
      }}
      onPointerUp={stop}
      onPointerCancel={stop}
    >
      {label}
    </button>
  )
}

function CircuitControl() {
  const ell = useLab((state) => state.ell)
  const rodAngle = useLab((state) => state.rodAngle)
  const resistance = useLab((state) => state.R)
  const closed = useLab((state) => state.closed)
  return (
    <section>
      <h2>Circuit</h2>
      <NumberRow label="ℓ" unit="m" min={0.05} max={0.2} step={0.01} value={ell} onChange={useLab.getState().setEll} />
      <NumberRow
        label="θ"
        unit="°"
        min={ROD_ANGLE_MIN}
        max={ROD_ANGLE_MAX}
        step={1}
        value={rodAngle}
        onChange={useLab.getState().setRodAngle}
      />
      <p className="hint">
        θ is the angle between conductor PQ and the two metal rods. At 90° the bar is perpendicular to the rods. A smaller angle brings the rods closer, so the bar cuts fewer field lines.
      </p>
      <NumberRow label="R" unit="Ω" min={0.5} max={20} step={0.1} value={resistance} onChange={useLab.getState().setR} />
      <label className="check">
        <input type="checkbox" checked={closed} onChange={(event) => useLab.getState().setClosed(event.target.checked)} />
        Circuit closed
      </label>
      <div className="row-buttons">
        <HoldButton direction={-1} label="Move left" />
        <HoldButton direction={1} label="Move right" />
      </div>
      <p className="hint">
        Hold Move left or Move right, or the Left and Right arrow keys. Release to stop. You can still left-drag the bar in the Front, Top, or Perspective view.
      </p>
      <div className="row-buttons">
        <button type="button" onClick={() => useLab.getState().playSlide(1)}>
          Slide right
        </button>
        <button type="button" onClick={() => useLab.getState().playSlide(-1)}>
          Slide left
        </button>
      </div>
    </section>
  )
}

function Scenarios() {
  const scenarios = useLab((state) => state.scenarios)
  return (
    <section>
      <h2>Scenarios</h2>
      <div className="scenarios">
        {scenarios.map((scenario) => (
          <button key={scenario.id} type="button" onClick={() => useLab.getState().applyScenario(scenario)}>
            <strong>{scenario.name}</strong>
            <span>{scenario.summary}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

const LAYERS: { key: 'showField' | 'showExam' | 'showVelocity' | 'showCurrent' | 'showFleming' | 'showLenz' | 'showFlux' | 'showGrid' | 'snap'; label: string }[] = [
  { key: 'showField', label: 'Magnetic field' },
  { key: 'showExam', label: 'Front view: × and •' },
  { key: 'showVelocity', label: 'Velocity' },
  { key: 'showCurrent', label: 'Induced current' },
  { key: 'showFleming', label: "Fleming's triad" },
  { key: 'showLenz', label: 'Lenz force' },
  { key: 'showFlux', label: 'Flux area' },
  { key: 'showGrid', label: 'Construction grid' },
  { key: 'snap', label: 'Snap drag to 5 mm' },
]

function Layers() {
  const state = useLab()
  return (
    <section>
      <h2>Display</h2>
      {LAYERS.map((layer) => (
        <label key={layer.key} className="check">
          <input type="checkbox" checked={state[layer.key]} onChange={() => state.toggle(layer.key)} />
          {layer.label}
        </label>
      ))}
    </section>
  )
}

function Readings() {
  const result = useInduction()
  const closed = useLab((state) => state.closed)
  return (
    <section>
      <h2>Readings</h2>
      <dl className="readings">
        <div>
          <dt>ε</dt>
          <dd>{formatNum(result.emf)} V</dd>
        </div>
        <div>
          <dt>I</dt>
          <dd>{closed ? `${formatNum(result.current)} A` : '0 (open)'}</dd>
        </div>
        <div>
          <dt>Φ</dt>
          <dd>{formatNum(result.phi, 4)} Wb</dd>
        </div>
        <div>
          <dt>−dΦ/dt</dt>
          <dd>{formatNum(result.emfFaraday)} V</dd>
        </div>
      </dl>
      <p className="direction">{shortDirection(result)}</p>
    </section>
  )
}

function Explanation() {
  const B = useField()
  const x = useLab((state) => state.x)
  const v = useLab((state) => state.v)
  const ell = useLab((state) => state.ell)
  const rodAngle = useLab((state) => state.rodAngle)
  const resistance = useLab((state) => state.R)
  const closed = useLab((state) => state.closed)
  const local = useInduction()
  const ellVec = conductorVector(ell, rodAngle)
  const [remote, setRemote] = useState<{ key: string; text: string; emf: number } | null>(null)
  const [online, setOnline] = useState<'unknown' | 'yes' | 'no'>('unknown')

  const key = JSON.stringify({
    B: [Number(B.x.toFixed(4)), Number(B.y.toFixed(4)), Number(B.z.toFixed(4))],
    v: Number(v.toFixed(4)),
    ell: [Number(ellVec.x.toFixed(4)), 0, Number(ellVec.z.toFixed(4))],
    R: resistance,
    closed,
    x: Number(x.toFixed(4)),
  })

  useEffect(() => {
    const handle = window.setTimeout(() => {
      const body = {
        B: [B.x, B.y, B.z],
        v: [v, 0, 0],
        ell: [ellVec.x, 0, ellVec.z],
        R: resistance,
        closed,
        x,
      }
      fetch('/api/induction/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
        .then((response) => {
          if (!response.ok) throw new Error('solver')
          return response.json() as Promise<{ explanation: string; emf: number }>
        })
        .then((payload) => {
          setOnline('yes')
          setRemote({ key, text: payload.explanation, emf: payload.emf })
        })
        .catch(() => setOnline('no'))
    }, 220)
    return () => window.clearTimeout(handle)
  }, [key, B.x, B.y, B.z, v, ellVec.x, ellVec.z, resistance, closed, x])

  const checked = remote?.key === key
  const mismatch = checked && remote !== null && Math.abs(remote.emf - local.emf) > 1e-4
  const text = checked && remote ? remote.text : local.explanation

  return (
    <section>
      <h2>Why this direction?</h2>
      <p className="explain">{text}</p>
      {mismatch ? <p className="warn">The solver disagreed with the view. Refresh and try again.</p> : null}
      {online === 'no' ? (
        <p className="hint">Explanation service is offline. Numbers above are calculated in the browser. Start the API on port 8000 to cross-check them.</p>
      ) : null}
      {online === 'yes' && checked && !mismatch ? <p className="ok-note">Checked with the solver.</p> : null}
      <p className="note">
        Fleming's left-hand rule is the motor rule: a current produces a force. This lab uses the right hand, because motion produces the current.
      </p>
    </section>
  )
}

function Glossary() {
  const [terms, setTerms] = useState<{ term: string; meaning: string }[]>([])
  useEffect(() => {
    fetch('/api/glossary')
      .then((response) => response.json())
      .then((data: { term: string; meaning: string }[]) => setTerms(data))
      .catch(() =>
        setTerms([
          {
            term: "Fleming's right-hand rule",
            meaning: 'Thumb = motion, first finger = field, second finger = induced conventional current.',
          },
          {
            term: "Faraday's law",
            meaning: 'ε = −dΦ/dt. For this bar it matches Bℓv.',
          },
          {
            term: "Lenz's law",
            meaning: 'The induced current opposes the motion that caused it.',
          },
        ]),
      )
  }, [])
  return (
    <section>
      <h2>Glossary</h2>
      <dl className="glossary">
        {terms.map((item) => (
          <div key={item.term}>
            <dt>{item.term}</dt>
            <dd>{item.meaning}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

export function loadScenarios() {
  fetch('/api/scenarios')
    .then((response) => response.json())
    .then((data: Scenario[]) => {
      if (Array.isArray(data) && data.length > 0) useLab.getState().setScenarios(data)
    })
    .catch(() => undefined)
}

export function ControlPanel() {
  return (
    <aside className="panel">
      <Readings />
      <FieldControl />
      <CircuitControl />
      <Scenarios />
      <Layers />
      <Explanation />
      <Glossary />
      <button type="button" className="reset" onClick={() => useLab.getState().resetExperiment()}>
        Reset experiment
      </button>
    </aside>
  )
}
