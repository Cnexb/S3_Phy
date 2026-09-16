import { useCallback, useMemo, useRef, useState } from 'react';
import { CanvasStage } from '../components/CanvasStage';
import {
  ControlPanel,
  FormulaBlock,
  Fraction,
  Slider,
} from '../components/ControlPanel';
import { drawArrow } from '../components/drawUtils';
import {
  angularSpeed,
  centripetalForce,
  forceToArrowLength,
  period,
} from '../physics/centripetal';

export function CentripetalLab() {
  const [m, setM] = useState(10);
  const [r, setR] = useState(120);
  const [v, setV] = useState(80);

  const angleRef = useRef(0);

  const Fc = useMemo(() => centripetalForce(m, v, r), [m, v, r]);
  const T = useMemo(() => period(r, v), [r, v]);
  const omega = useMemo(() => angularSpeed(v, r), [v, r]);

  const draw = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      dt: number,
    ) => {
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
      const orbitR = Math.min(r, Math.min(width, height) * 0.38);

      angleRef.current += omega * dt;
      const theta = angleRef.current;

      ctx.beginPath();
      ctx.arc(cx, cy, orbitR, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(37, 99, 235, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#6b7280';
      ctx.fill();

      const px = cx + orbitR * Math.cos(theta);
      const py = cy + orbitR * Math.sin(theta);

      ctx.strokeStyle = 'rgba(26, 28, 44, 0.28)';
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(px, py);
      ctx.stroke();

      const bodyR = 8 + Math.cbrt(m) * 2.2;
      const grad = ctx.createRadialGradient(
        px - 3,
        py - 3,
        2,
        px,
        py,
        bodyR,
      );
      grad.addColorStop(0, '#86efac');
      grad.addColorStop(1, '#16a34a');
      ctx.beginPath();
      ctx.arc(px, py, bodyR, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = 'rgba(26, 28, 44, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      const rx = Math.cos(theta);
      const ry = Math.sin(theta);
      const tx = -Math.sin(theta);
      const ty = Math.cos(theta);

      const fLen = forceToArrowLength(Fc);
      drawArrow(
        ctx,
        px - rx * (bodyR + 2),
        py - ry * (bodyR + 2),
        px - rx * (bodyR + 2 + fLen),
        py - ry * (bodyR + 2 + fLen),
        '#dc2626',
        3,
      );

      const vLen = 20 + Math.min(70, v * 0.45);
      drawArrow(
        ctx,
        px + tx * (bodyR + 2),
        py + ty * (bodyR + 2),
        px + tx * (bodyR + 2 + vLen),
        py + ty * (bodyR + 2 + vLen),
        '#2563eb',
        2.5,
      );

      ctx.font = '12px Inter, system-ui, sans-serif';
      ctx.fillStyle = '#dc2626';
      ctx.fillText(
        'Fc',
        px - rx * (bodyR + 2 + fLen * 0.55) + 10,
        py - ry * (bodyR + 2 + fLen * 0.55),
      );
      ctx.fillStyle = '#2563eb';
      ctx.fillText(
        'v',
        px + tx * (bodyR + 2 + vLen * 0.7) + 8,
        py + ty * (bodyR + 2 + vLen * 0.7),
      );

      ctx.fillStyle = '#6b7280';
      ctx.textAlign = 'center';
      ctx.fillText(`r = ${r.toFixed(0)}`, cx, cy + orbitR + 22);
    },
    [m, r, v, omega, Fc],
  );

  return (
    <div className="lab-layout">
      <div className="canvas-wrap">
        <CanvasStage draw={draw} />
      </div>
      <ControlPanel
        title="Centripetal force"
        blurb="Uniform circular motion needs a continuous force toward the centre. Readouts show Fc, T and ω."
      >
        <Slider
          label="Mass m"
          value={m}
          min={1}
          max={40}
          step={0.5}
          unit="u"
          onChange={setM}
        />
        <Slider
          label="Radius r"
          value={r}
          min={50}
          max={180}
          step={1}
          unit="px"
          format={(v) => v.toFixed(0)}
          onChange={setR}
        />
        <Slider
          label="Speed v"
          value={v}
          min={20}
          max={160}
          step={1}
          unit="px/s"
          format={(v) => v.toFixed(0)}
          onChange={setV}
        />

        <FormulaBlock title="Live readout">
          <p className="eq">
            <span>
              F<sub>c</sub> =
            </span>
            <Fraction
              num={
                <>
                  m · v²
                </>
              }
              den="r"
            />
          </p>
          <p className="eq sub">
            <span>
              F<sub>c</sub> =
            </span>
            <Fraction
              num={
                <>
                  {m.toFixed(1)} · {v.toFixed(0)}²
                </>
              }
              den={r.toFixed(0)}
            />
          </p>
          <p className="eq result">
            F<sub>c</sub> ={' '}
            {Number.isFinite(Fc) ? Fc.toFixed(2) : '∞'} force units
          </p>
          <p className="eq sub">
            <span>T =</span>
            <Fraction
              num={
                <>
                  2π · r
                </>
              }
              den="v"
            />
            <span>= {Number.isFinite(T) ? T.toFixed(2) : '∞'} s</span>
          </p>
          <p className="eq sub">
            <span>ω =</span>
            <Fraction num="v" den="r" />
            <span>= {omega.toFixed(3)} rad/s</span>
          </p>
        </FormulaBlock>

        <div className="legend">
          <span>
            <i className="swatch orange" /> F<sub>c</sub> toward centre
          </span>
          <span>
            <i className="swatch cyan" /> velocity tangent
          </span>
        </div>
      </ControlPanel>
    </div>
  );
}
