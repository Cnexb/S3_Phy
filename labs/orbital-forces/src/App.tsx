import { useMemo, useState } from 'react';
import { GravityLab } from './labs/GravityLab';
import { CentripetalLab } from './labs/CentripetalLab';
import './styles.css';

type Mode = 'gravity' | 'centripetal';

function initialMode(): Mode {
  try {
    const q = new URLSearchParams(window.location.search);
    const m = (q.get('mode') || '').toLowerCase();
    if (m === 'centripetal' || m === 'circular') return 'centripetal';
    if (m === 'gravity' || m === 'gravitation') return 'gravity';
  } catch {
    /* ignore */
  }
  return 'gravity';
}

export default function App() {
  const embed = useMemo(() => {
    try {
      return new URLSearchParams(window.location.search).get('embed') === '1';
    } catch {
      return false;
    }
  }, []);
  const [mode, setMode] = useState<Mode>(initialMode);

  return (
    <div className={embed ? 'app app--embed' : 'app'}>
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark" aria-hidden />
          <div>
            <h1>Orbital Forces Lab</h1>
            <p className="tagline">
              Mechanics strand · Gravitational force · Centripetal force
            </p>
          </div>
        </div>
        <nav className="mode-tabs" role="tablist" aria-label="Lab mode">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'gravity'}
            className={mode === 'gravity' ? 'tab active' : 'tab'}
            onClick={() => setMode('gravity')}
          >
            Mode A · Gravity
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'centripetal'}
            className={mode === 'centripetal' ? 'tab active' : 'tab'}
            onClick={() => setMode('centripetal')}
          >
            Mode B · Centripetal
          </button>
        </nav>
      </header>

      <main className="app-main">
        {mode === 'gravity' ? <GravityLab /> : <CentripetalLab />}
      </main>
    </div>
  );
}
