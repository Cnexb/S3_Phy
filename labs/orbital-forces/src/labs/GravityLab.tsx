import { useCallback, useMemo, useRef, useState } from 'react';
import { CanvasStage } from '../components/CanvasStage';
import {
  ControlPanel,
  FormulaBlock,
  Fraction,
  Slider,
} from '../components/ControlPanel';
import { drawArrow, drawPlanet } from '../components/drawUtils';
import {
  forceToArrowLength,
  formatSci,
  gravitationalForce,
  planetRadiusFromMass,
} from '../physics/gravity';

/** Default masses (kg) and centre-to-centre distance (m). */
const DEFAULTS = {
  m1: 6e24, // ~Earth-scale
  m2: 2e24,
  r: 2e8, // 200 000 km
};

/** Map physical separation (m) → pixel gap on canvas. */
function rToPixels(r: number, width: number): number {
  const minPx = 100;
  const maxPx = Math.min(width * 0.72, 420);
  const t = (r - 5e7) / (4e8 - 5e7);
  return minPx + (maxPx - minPx) * Math.min(1, Math.max(0, t));
}

export function GravityLab() {
  const [m1, setM1] = useState(DEFAULTS.m1);
  const [m2, setM2] = useState(DEFAULTS.m2);
  const [r, setR] = useState(DEFAULTS.r);
  const [running, setRunning] = useState(false);

  const sepRef = useRef(DEFAULTS.r);
  const vRelRef = useRef(0);
  const uiTickRef = useRef(0);
  const stopPendingRef = useRef(false);
  const runningRef = useRef(false);
  const [liveR, setLiveR] = useState(DEFAULTS.r);

  // Always show the same r as the canvas (liveR stays synced with sepRef / slider)
  const displayR = liveR;
  const Fg = useMemo(
    () => gravitationalForce(m1, m2, displayR),
    [m1, m2, displayR],
  );

  const resetMotion = useCallback(() => {
    setRunning(false);
    runningRef.current = false;
    stopPendingRef.current = false;
    sepRef.current = r;
    vRelRef.current = 0;
    setLiveR(r);
  }, [r]);

  const onRChange = (value: number) => {
    setR(value);
    if (!runningRef.current) {
      sepRef.current = value;
      setLiveR(value);
    }
  };

  const draw = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      dt: number,
    ) => {
      // Light lab canvas (S3_Phy strand)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(26, 28, 44, 0.06)';
      ctx.lineWidth = 1;
      const step = 40;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const cx = width / 2;
      const cy = height / 2;
      const rad1 = planetRadiusFromMass(m1, 10);
      const rad2 = planetRadiusFromMass(m2, 10);

      let sepM = sepRef.current;

      if (runningRef.current) {
        const force = gravitationalForce(
          m1,
          m2,
          Math.max(sepM, 1e6),
        );
        const mu = (m1 * m2) / (m1 + m2);
        const a = force / mu;
        // Lab time-scale: real SI a is tiny; boost so approach is clear in ~3–5 s
        const VISUAL_A = 1.5e9;
        vRelRef.current += a * VISUAL_A * dt;
        sepM -= vRelRef.current * dt;
        const minSep = 5e7;
        if (sepM <= minSep) {
          sepM = minSep;
          vRelRef.current = 0;
          if (!stopPendingRef.current) {
            stopPendingRef.current = true;
            sepRef.current = sepM;
            queueMicrotask(() => {
              setLiveR(sepRef.current);
              setRunning(false);
              runningRef.current = false;
            });
          }
        }
        sepRef.current = sepM;
        uiTickRef.current += dt;
        if (uiTickRef.current >= 0.05) {
          uiTickRef.current = 0;
          setLiveR(sepM);
        }
      }

      const sepPx = rToPixels(sepM, width);
      // Place about centre of mass (correct free-body geometry)
      const x1 = cx - (m2 / (m1 + m2)) * sepPx;
      const x2 = cx + (m1 / (m1 + m2)) * sepPx;
      const y1 = cy;
      const y2 = cy;

      ctx.strokeStyle = 'rgba(26, 28, 44, 0.28)';
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.setLineDash([]);

      // CM mark
      ctx.beginPath();
      ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#6b7280';
      ctx.fill();
      ctx.fillStyle = '#6b7280';
      ctx.font = '11px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('CM', cx, cy + 16);

      ctx.fillStyle = '#6b7280';
      ctx.font = '12px Inter, system-ui, sans-serif';
      ctx.fillText(
        `r = ${formatSci(sepM, 2)} m`,
        cx,
        cy - Math.max(rad1, rad2) - 36,
      );

      drawPlanet(ctx, x1, y1, rad1, '#fbbf24', '#d97706');
      drawPlanet(ctx, x2, y2, rad2, '#38bdf8', '#0284c7');

      ctx.fillStyle = '#1a1c2c';
      ctx.font = '600 13px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('m₁', x1, y1 + rad1 + 18);
      ctx.fillText('m₂', x2, y2 + rad2 + 18);

      const force = gravitationalForce(m1, m2, Math.max(sepM, 1));
      const arrowLen = forceToArrowLength(force);

      // Equal & opposite forces (Newton’s 3rd law) — from each surface toward the other
      drawArrow(
        ctx,
        x1 + rad1 + 2,
        y1,
        x1 + rad1 + 2 + arrowLen,
        y1,
        '#dc2626',
        3,
      );
      drawArrow(
        ctx,
        x2 - rad2 - 2,
        y2,
        x2 - rad2 - 2 - arrowLen,
        y2,
        '#dc2626',
        3,
      );

      ctx.fillStyle = '#dc2626';
      ctx.font = '12px Inter, system-ui, sans-serif';
      ctx.fillText('F₁₂', x1 + rad1 + 2 + arrowLen * 0.5, y1 - 12);
      ctx.fillText('F₂₁', x2 - rad2 - 2 - arrowLen * 0.5, y2 - 12);
    },
    [m1, m2],
  );

  return (
    <div className="lab-layout">
      <div className="canvas-wrap">
        <CanvasStage draw={draw} />
      </div>
      <ControlPanel
        title="Gravitational force"
        blurb="Newton’s law of universal gravitation. The two forces are equal in magnitude and opposite in direction (Newton’s 3rd law)."
      >
        <Slider
          label="Mass m₁"
          value={m1 / 1e24}
          min={1}
          max={20}
          step={0.5}
          unit="× 10²⁴ kg"
          format={(v) => v.toFixed(1)}
          onChange={(v) => setM1(v * 1e24)}
        />
        <Slider
          label="Mass m₂"
          value={m2 / 1e24}
          min={1}
          max={20}
          step={0.5}
          unit="× 10²⁴ kg"
          format={(v) => v.toFixed(1)}
          onChange={(v) => setM2(v * 1e24)}
        />
        <Slider
          label="Separation r"
          value={r / 1e8}
          min={0.5}
          max={4}
          step={0.05}
          unit="× 10⁸ m"
          format={(v) => v.toFixed(2)}
          onChange={(v) => onRChange(v * 1e8)}
        />

        <div className="btn-row">
          <button
            type="button"
            className="btn primary"
            disabled={running}
            onClick={() => {
              sepRef.current = r;
              vRelRef.current = 0;
              stopPendingRef.current = false;
              uiTickRef.current = 0;
              setLiveR(r);
              runningRef.current = true;
              setRunning(true);
            }}
          >
            {running ? 'Approaching…' : 'Release'}
          </button>
          <button type="button" className="btn" onClick={resetMotion}>
            Reset
          </button>
        </div>

        <FormulaBlock title="Live readout">
          <p className="eq">
            <span>
              F<sub>g</sub> =
            </span>
            <Fraction
              num={
                <>
                  G · m₁ · m₂
                </>
              }
              den={<>r²</>}
            />
          </p>
          <p className="eq sub">
            <span>G = 6.67 × 10⁻¹¹</span>
            <Fraction num={<>N·m²</>} den={<>kg²</>} />
          </p>
          <p className="eq sub">
            m₁ = {formatSci(m1)} kg · m₂ = {formatSci(m2)} kg
          </p>
          <p className="eq sub">
            r = {formatSci(displayR)} m
          </p>
          <p className="eq result">
            |F₁₂| = |F₂₁| ={' '}
            {Number.isFinite(Fg) ? formatSci(Fg) : '∞'} N
          </p>
        </FormulaBlock>
      </ControlPanel>
    </div>
  );
}
