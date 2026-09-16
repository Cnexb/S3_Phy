import type { ReactNode } from 'react';

type SliderProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  format?: (v: number) => string;
  onChange: (v: number) => void;
};

export function Slider({
  label,
  value,
  min,
  max,
  step = 0.1,
  unit = '',
  format,
  onChange,
}: SliderProps) {
  const display = format ? format(value) : value.toFixed(1);
  return (
    <label className="slider">
      <div className="slider-head">
        <span>{label}</span>
        <span className="slider-value">
          {display}
          {unit ? ` ${unit}` : ''}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}

type FractionProps = {
  num: ReactNode;
  den: ReactNode;
  className?: string;
};

/** Stacked fraction with a horizontal vinculum (fraction line). */
export function Fraction({ num, den, className }: FractionProps) {
  return (
    <span className={`frac${className ? ` ${className}` : ''}`}>
      <span className="frac-num">{num}</span>
      <span className="frac-bar" aria-hidden="true" />
      <span className="frac-den">{den}</span>
    </span>
  );
}

type FormulaBlockProps = {
  title: string;
  children: ReactNode;
};

export function FormulaBlock({ title, children }: FormulaBlockProps) {
  return (
    <div className="formula-block">
      <h3>{title}</h3>
      <div className="formula-body">{children}</div>
    </div>
  );
}

type ControlPanelProps = {
  title: string;
  blurb: string;
  children: ReactNode;
};

export function ControlPanel({ title, blurb, children }: ControlPanelProps) {
  return (
    <aside className="control-panel">
      <header className="panel-header">
        <h2>{title}</h2>
        <p>{blurb}</p>
      </header>
      <div className="panel-body">{children}</div>
    </aside>
  );
}
