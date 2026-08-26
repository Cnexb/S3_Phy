import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const OUT_DIR = new URL('../public/summary/', import.meta.url);
const WIDTH = 1400;
const HEIGHT = 2100;

const copy = {
  en: {
    quantities: {
      kicker: 'HKDSE PHYSICS • FOUNDATIONS',
      title: 'Quantities & Units',
      subtitle: 'Measure clearly • write correctly • convert confidently',
      principleTitle: 'A physical quantity needs two parts',
      principle: '<strong>physical quantity</strong> = <strong>numerical value</strong> + <strong>unit</strong>',
      principleExample: 'Example: length = 2.5 m',
      baseTitle: 'Base quantities and SI units',
      baseRows: [
        ['Length', 'metre', 'm'],
        ['Mass', 'kilogram', 'kg'],
        ['Time', 'second', 's'],
        ['Temperature', 'kelvin', 'K'],
        ['Electric current', 'ampere', 'A'],
      ],
      derivedTitle: 'Build derived units from definitions',
      derivedRows: [
        ['speed', 'distance ÷ time', 'm s⁻¹'],
        ['density', 'mass ÷ volume', 'kg m⁻³'],
        ['acceleration', 'speed change ÷ time', 'm s⁻²'],
        ['energy', 'power × time', 'W s = J'],
      ],
      notationTitle: 'Scientific notation',
      notationRule: 'Write numbers as',
      notationFormula: 'a × 10ⁿ',
      notationBound: 'where 1 ≤ a < 10',
      notationRows: [
        ['4600', '4.6 × 10³'],
        ['0.000415', '4.15 × 10⁻⁴'],
        ['0.00000606', '6.06 × 10⁻⁶'],
      ],
      prefixTitle: 'Prefixes are powers of ten',
      prefixRows: [
        ['mega', 'M', '10⁶'],
        ['kilo', 'k', '10³'],
        ['deci', 'd', '10⁻¹'],
        ['centi', 'c', '10⁻²'],
        ['milli', 'm', '10⁻³'],
        ['micro', 'μ', '10⁻⁶'],
      ],
      convertTitle: 'Convert without losing the power',
      convertLines: [
        '<strong>prefix → base:</strong> multiply by the prefix power',
        '65 kV = 65 × 10³ V = <strong>6.5 × 10⁴ V</strong>',
        '122 μm = 122 × 10⁻⁶ m = <strong>1.22 × 10⁻⁴ m</strong>',
      ],
      speedRule: 'km h⁻¹ ÷ 3.6 = m s⁻¹',
      speedExample: '36 km h⁻¹ = 10 m s⁻¹',
      areaTitle: 'Area and volume: convert every factor',
      areaFormula: '1 cm² = (10⁻² m)² = 10⁻⁴ m²',
      checksTitle: 'Quick exam checks',
      checks: [
        'Distinguish the unit name <strong>metre</strong> from its symbol <strong>m</strong>.',
        'Keep capital letters exact: <strong>M</strong> (mega) is not <strong>m</strong> (milli).',
        'Write a space between the number and unit: <strong>10 m s⁻¹</strong>.',
        'Give the final answer in the unit requested.',
      ],
      footer: 'Uni+ Physics • Foundation summary',
    },
    maths: {
      kicker: 'HKDSE PHYSICS • FOUNDATIONS',
      title: 'Useful Mathematics in Physics',
      subtitle: 'Read straight-line graphs and turn equations into information',
      linearTitle: 'The straight-line form',
      linearFormula: 'y = mx + b',
      linearRows: [
        ['m', 'slope / gradient'],
        ['b', 'y-intercept'],
        ['x, y', 'variables plotted on the axes'],
      ],
      slopeTitle: 'Find the slope',
      slopeFormula: 'm = Δy / Δx = (y₂ − y₁) / (x₂ − x₁)',
      slopeTips: [
        'Choose two well-separated points on the straight line.',
        'Read coordinates carefully from the scales.',
        'Include slope units: y-axis unit ÷ x-axis unit.',
        'A line falling left-to-right has a negative slope.',
      ],
      graphTitle: 'Read the graph',
      graphCaption: 'The line crosses the y-axis at b. Its rise/run gives m.',
      exampleTitle: 'Worked example',
      exampleEquation: '8x − 5y + 40 = 0',
      exampleSteps: [
        '−5y = −8x − 40',
        'y = ⁸⁄₅x + 8',
        '<strong>slope m = 1.6</strong>',
        '<strong>y-intercept b = 8</strong>',
      ],
      rearrangeTitle: 'Rearrange before you sketch',
      rearrangeFormula: 'Ax + By + C = 0  →  y = −A/B x − C/B',
      interceptRows: [
        ['y-intercept', 'put x = 0'],
        ['x-intercept', 'put y = 0'],
      ],
      sketchTitle: 'Sketch a straight line in 4 steps',
      sketchSteps: [
        ['1', 'Rewrite as y = mx + b.'],
        ['2', 'Mark the y-intercept b.'],
        ['3', 'Use the slope or find the x-intercept.'],
        ['4', 'Draw a straight line and label both axes.'],
      ],
      physicsTitle: 'Why this matters in physics',
      physicsLines: [
        '<strong>Slope</strong> often represents a physical quantity.',
        'Example: slope of a distance–time graph = speed.',
        '<strong>Intercept</strong> often represents an initial value or correction.',
      ],
      trapsTitle: 'Avoid these common traps',
      traps: [
        'Do not use one point: slope needs a <strong>change</strong> in y and x.',
        'Keep the same point order in numerator and denominator.',
        'A graph sketch still needs correct intercepts, direction and axis labels.',
      ],
      footer: 'Uni+ Physics • Foundation summary',
    },
  },
  zhHant: {
    quantities: {
      kicker: 'HKDSE 物理 • 基礎知識',
      title: '物理量與單位',
      subtitle: '清楚量度 • 正確書寫 • 熟練換算',
      principleTitle: '一個物理量包含兩部分',
      principle: '<strong>物理量</strong> = <strong>數值</strong> + <strong>單位</strong>',
      principleExample: '例：長度 = 2.5 m',
      baseTitle: '基本物理量與 SI 單位',
      baseRows: [
        ['長度', '米（metre）', 'm'],
        ['質量', '千克（kilogram）', 'kg'],
        ['時間', '秒（second）', 's'],
        ['溫度', '開爾文（kelvin）', 'K'],
        ['電流', '安培（ampere）', 'A'],
      ],
      derivedTitle: '由定義組合導出單位',
      derivedRows: [
        ['速率', '距離 ÷ 時間', 'm s⁻¹'],
        ['密度', '質量 ÷ 體積', 'kg m⁻³'],
        ['加速度', '速率變化 ÷ 時間', 'm s⁻²'],
        ['能量', '功率 × 時間', 'W s = J'],
      ],
      notationTitle: '科學記數法',
      notationRule: '把數值寫成',
      notationFormula: 'a × 10ⁿ',
      notationBound: '其中 1 ≤ a < 10',
      notationRows: [
        ['4600', '4.6 × 10³'],
        ['0.000415', '4.15 × 10⁻⁴'],
        ['0.00000606', '6.06 × 10⁻⁶'],
      ],
      prefixTitle: '詞頭代表 10 的冪',
      prefixRows: [
        ['兆（mega）', 'M', '10⁶'],
        ['千（kilo）', 'k', '10³'],
        ['分（deci）', 'd', '10⁻¹'],
        ['厘（centi）', 'c', '10⁻²'],
        ['毫（milli）', 'm', '10⁻³'],
        ['微（micro）', 'μ', '10⁻⁶'],
      ],
      convertTitle: '換算時要保留 10 的冪',
      convertLines: [
        '<strong>詞頭 → 基本單位：</strong>乘以詞頭所代表的 10 的冪',
        '65 kV = 65 × 10³ V = <strong>6.5 × 10⁴ V</strong>',
        '122 μm = 122 × 10⁻⁶ m = <strong>1.22 × 10⁻⁴ m</strong>',
      ],
      speedRule: 'km h⁻¹ ÷ 3.6 = m s⁻¹',
      speedExample: '36 km h⁻¹ = 10 m s⁻¹',
      areaTitle: '面積和體積：每個因子都要換算',
      areaFormula: '1 cm² = (10⁻² m)² = 10⁻⁴ m²',
      checksTitle: '考試快速檢查',
      checks: [
        '分清單位名稱<strong>米（metre）</strong>和單位符號 <strong>m</strong>。',
        '留意大小寫：<strong>M</strong>（兆）並不是 <strong>m</strong>（毫）。',
        '數值和單位之間留空格：<strong>10 m s⁻¹</strong>。',
        '最後答案必須使用題目要求的單位。',
      ],
      footer: 'Uni+ 物理 • 基礎知識總結',
    },
    maths: {
      kicker: 'HKDSE 物理 • 基礎知識',
      title: '物理中常用的數學',
      subtitle: '讀懂直線圖像，從方程找出物理資訊',
      linearTitle: '直線方程的形式',
      linearFormula: 'y = mx + b',
      linearRows: [
        ['m', '斜率'],
        ['b', 'y 軸截距'],
        ['x、y', '兩軸上的變量'],
      ],
      slopeTitle: '計算斜率',
      slopeFormula: 'm = Δy / Δx = (y₂ − y₁) / (x₂ − x₁)',
      slopeTips: [
        '在直線上選取兩個相距較遠的點。',
        '按刻度小心讀取坐標。',
        '斜率單位 = y 軸單位 ÷ x 軸單位。',
        '直線從左至右向下，斜率為負數。',
      ],
      graphTitle: '讀取圖像',
      graphCaption: '直線在 y 軸與 b 相交；上升量 ÷ 水平變化量就是 m。',
      exampleTitle: '例題',
      exampleEquation: '8x − 5y + 40 = 0',
      exampleSteps: [
        '−5y = −8x − 40',
        'y = ⁸⁄₅x + 8',
        '<strong>斜率 m = 1.6</strong>',
        '<strong>y 軸截距 b = 8</strong>',
      ],
      rearrangeTitle: '先移項，再繪圖',
      rearrangeFormula: 'Ax + By + C = 0  →  y = −A/B x − C/B',
      interceptRows: [
        ['y 軸截距', '代入 x = 0'],
        ['x 軸截距', '代入 y = 0'],
      ],
      sketchTitle: '四步繪畫直線圖像',
      sketchSteps: [
        ['1', '改寫成 y = mx + b。'],
        ['2', '標示 y 軸截距 b。'],
        ['3', '利用斜率或求出 x 軸截距。'],
        ['4', '畫直線並標示兩軸。'],
      ],
      physicsTitle: '為甚麼物理學需要它？',
      physicsLines: [
        '<strong>斜率</strong>往往代表一個物理量。',
        '例：距離－時間圖的斜率 = 速率。',
        '<strong>截距</strong>往往代表初始值或修正值。',
      ],
      trapsTitle: '常見錯誤',
      traps: [
        '不能只用一個點；斜率需要 y 和 x 的<strong>變化量</strong>。',
        '分子和分母的兩點次序必須相同。',
        '草圖也要有正確截距、方向和坐標軸標示。',
      ],
      footer: 'Uni+ 物理 • 基礎知識總結',
    },
  },
};

function rows(items, className = '') {
  return `<div class="rows ${className}">${items
    .map((cells) => `<div class="row">${cells.map((cell) => `<span>${cell}</span>`).join('')}</div>`)
    .join('')}</div>`;
}

function bullets(items) {
  return `<ul>${items.map((item) => `<li>${item}</li>`).join('')}</ul>`;
}

function card(title, body, extra = '') {
  return `<section class="card ${extra}"><h2>${title}</h2>${body}</section>`;
}

function graphSvg() {
  return `
    <svg class="graph" viewBox="0 0 520 300" role="img" aria-label="Straight line graph">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#17375e"/>
        </marker>
      </defs>
      <line x1="64" y1="250" x2="490" y2="250" stroke="#17375e" stroke-width="5" marker-end="url(#arrow)"/>
      <line x1="64" y1="264" x2="64" y2="25" stroke="#17375e" stroke-width="5" marker-end="url(#arrow)"/>
      <line x1="64" y1="210" x2="450" y2="54" stroke="#eb5f4a" stroke-width="10" stroke-linecap="round"/>
      <circle cx="166" cy="169" r="9" fill="#17375e"/><circle cx="369" cy="87" r="9" fill="#17375e"/>
      <path d="M166 169 H369 V87" fill="none" stroke="#4e9b94" stroke-width="5" stroke-dasharray="12 10"/>
      <text x="252" y="196" font-size="28" fill="#246b66">Δx</text>
      <text x="382" y="137" font-size="28" fill="#246b66">Δy</text>
      <text x="476" y="288" font-size="30" fill="#17375e">x</text>
      <text x="28" y="38" font-size="30" fill="#17375e">y</text>
      <text x="76" y="205" font-size="30" fill="#17375e">b</text>
    </svg>`;
}

function quantitiesBody(d) {
  return `
    <div class="poster-grid quantities-grid">
      ${card(
        d.principleTitle,
        `<div class="hero-equation">${d.principle}</div><p class="center note">${d.principleExample}</p>`,
        'span-2 principle',
      )}
      ${card(d.baseTitle, rows(d.baseRows, 'three-cols'), 'base')}
      ${card(d.derivedTitle, rows(d.derivedRows, 'three-cols'), 'derived')}
      ${card(
        d.notationTitle,
        `<p class="center">${d.notationRule}</p><div class="formula">${d.notationFormula}</div><p class="center note">${d.notationBound}</p>${rows(d.notationRows, 'two-cols compact')}`,
        'notation',
      )}
      ${card(d.prefixTitle, rows(d.prefixRows, 'three-cols compact'), 'prefixes')}
      ${card(
        d.convertTitle,
        `<div class="stack">${d.convertLines.map((line) => `<p>${line}</p>`).join('')}</div>
         <div class="conversion"><span>${d.speedRule}</span><strong>${d.speedExample}</strong></div>`,
        'span-2 convert',
      )}
      ${card(d.areaTitle, `<div class="formula small">${d.areaFormula}</div>`, 'area')}
      ${card(d.checksTitle, bullets(d.checks), 'checks')}
    </div>`;
}

function mathsBody(d) {
  return `
    <div class="poster-grid maths-grid">
      ${card(
        d.linearTitle,
        `<div class="formula giant">${d.linearFormula}</div>${rows(d.linearRows, 'two-cols compact')}`,
        'linear',
      )}
      ${card(d.graphTitle, `${graphSvg()}<p class="center note">${d.graphCaption}</p>`, 'graph-card')}
      ${card(
        d.slopeTitle,
        `<div class="formula small">${d.slopeFormula}</div>${bullets(d.slopeTips)}`,
        'slope',
      )}
      ${card(
        d.exampleTitle,
        `<div class="example-equation">${d.exampleEquation}</div><div class="steps">${d.exampleSteps
          .map((step) => `<div>${step}</div>`)
          .join('')}</div>`,
        'example',
      )}
      ${card(
        d.rearrangeTitle,
        `<div class="formula tiny">${d.rearrangeFormula}</div>${rows(d.interceptRows, 'two-cols compact')}`,
        'rearrange',
      )}
      ${card(
        d.sketchTitle,
        `<div class="numbered">${d.sketchSteps
          .map(([number, text]) => `<div><span>${number}</span><p>${text}</p></div>`)
          .join('')}</div>`,
        'sketch',
      )}
      ${card(d.physicsTitle, `<div class="stack">${d.physicsLines.map((line) => `<p>${line}</p>`).join('')}</div>`, 'physics')}
      ${card(d.trapsTitle, bullets(d.traps), 'traps')}
    </div>`;
}

function posterHtml(lang, topic) {
  const d = copy[lang][topic];
  const isZh = lang === 'zhHant';
  const body = topic === 'quantities' ? quantitiesBody(d) : mathsBody(d);
  return `<!doctype html>
  <html lang="${isZh ? 'zh-Hant' : 'en'}">
    <head>
      <meta charset="utf-8">
      <style>
        * { box-sizing: border-box; }
        html, body { margin: 0; width: ${WIDTH}px; height: ${HEIGHT}px; overflow: hidden; }
        body {
          font-family: ${isZh ? '"Microsoft JhengHei", "Noto Sans TC",' : ''} "Segoe UI", Arial, sans-serif;
          color: #17375e;
          background: #e8f4f1;
        }
        .poster {
          position: relative;
          width: ${WIDTH}px;
          height: ${HEIGHT}px;
          padding: 54px 58px 44px;
          overflow: hidden;
          background:
            radial-gradient(circle at 8% 12%, rgba(253,190,82,.34) 0 120px, transparent 122px),
            radial-gradient(circle at 94% 8%, rgba(235,95,74,.18) 0 170px, transparent 172px),
            linear-gradient(150deg, #f7fbf8 0%, #e5f4ef 52%, #dbeef3 100%);
        }
        .poster::before, .poster::after {
          content: "";
          position: absolute;
          border: 5px solid rgba(36,107,102,.16);
          border-radius: 999px;
          pointer-events: none;
        }
        .poster::before { width: 290px; height: 290px; left: -120px; bottom: 170px; }
        .poster::after { width: 210px; height: 210px; right: -88px; bottom: 70px; }
        header {
          position: relative;
          z-index: 1;
          min-height: 245px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 34px 48px;
          border-radius: 36px;
          color: white;
          background: linear-gradient(125deg, #17375e 0%, #246b66 72%, #4e9b94 100%);
          box-shadow: 0 18px 38px rgba(23,55,94,.2);
        }
        header::after {
          content: "${topic === 'quantities' ? '10ⁿ  •  SI  •  μ  •  kg' : 'Δy/Δx  •  y = mx + b'}";
          position: absolute;
          right: 42px;
          top: 25px;
          max-width: 420px;
          color: rgba(255,255,255,.18);
          font-size: 40px;
          font-weight: 800;
          letter-spacing: 3px;
          transform: rotate(-7deg);
        }
        .kicker {
          color: #ffd77f;
          font-size: 27px;
          font-weight: 800;
          letter-spacing: 4px;
          text-transform: uppercase;
        }
        h1 { margin: 10px 0 3px; font-size: ${isZh ? 74 : 72}px; line-height: 1.02; letter-spacing: -2px; }
        .subtitle { margin: 8px 0 0; font-size: ${isZh ? 29 : 27}px; color: #d9f3ee; font-weight: 600; }
        .badge {
          position: relative;
          z-index: 1;
          flex: 0 0 156px;
          width: 156px;
          height: 156px;
          border: 5px solid rgba(255,255,255,.72);
          border-radius: 50%;
          display: grid;
          place-items: center;
          font-size: 70px;
          background: rgba(255,255,255,.1);
          box-shadow: inset 0 0 0 10px rgba(255,255,255,.07);
        }
        .poster-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 22px;
          margin-top: 24px;
        }
        .card {
          background: rgba(255,255,255,.95);
          border: 3px solid rgba(36,107,102,.14);
          border-radius: 28px;
          padding: 25px 28px 24px;
          box-shadow: 0 10px 24px rgba(23,55,94,.1);
          overflow: hidden;
        }
        .card:nth-child(4n+1) { border-top: 10px solid #4e9b94; }
        .card:nth-child(4n+2) { border-top: 10px solid #f0ad4e; }
        .card:nth-child(4n+3) { border-top: 10px solid #eb5f4a; }
        .card:nth-child(4n+4) { border-top: 10px solid #487bb4; }
        .span-2 { grid-column: 1 / -1; }
        h2 {
          margin: 0 0 14px;
          font-size: ${isZh ? 33 : 31}px;
          line-height: 1.18;
          color: #17375e;
        }
        p { margin: 9px 0; font-size: ${isZh ? 25 : 23}px; line-height: 1.36; }
        strong { color: #d94d3c; }
        .center { text-align: center; }
        .note { color: #46627f; font-weight: 600; }
        .hero-equation {
          padding: 15px 20px;
          border-radius: 18px;
          text-align: center;
          font-size: ${isZh ? 38 : 36}px;
          font-weight: 800;
          color: #17375e;
          background: #edf7f5;
        }
        .formula, .example-equation {
          margin: 12px 0;
          padding: 16px;
          border-radius: 18px;
          text-align: center;
          color: #17375e;
          background: linear-gradient(120deg, #fff3cf, #ffe2b1);
          border: 2px solid #f3c66a;
          font-size: 48px;
          font-weight: 900;
          letter-spacing: 1px;
        }
        .formula.giant { font-size: 68px; }
        .formula.small { font-size: ${isZh ? 31 : 30}px; }
        .formula.tiny { font-size: ${isZh ? 26 : 25}px; }
        .rows { overflow: hidden; border: 2px solid #d7e7e3; border-radius: 16px; }
        .row { display: grid; min-height: 42px; align-items: center; background: #fbfdfc; }
        .row:nth-child(even) { background: #edf7f5; }
        .row span {
          padding: 9px 11px;
          border-right: 1px solid #d7e7e3;
          font-size: ${isZh ? 23 : 21}px;
          line-height: 1.18;
        }
        .row span:last-child { border-right: none; font-weight: 800; color: #246b66; }
        .three-cols .row { grid-template-columns: 1.12fr 1.45fr .75fr; }
        .two-cols .row { grid-template-columns: 1fr 1.45fr; }
        .compact .row span { padding-top: 7px; padding-bottom: 7px; }
        .stack p {
          padding: 9px 12px;
          border-left: 7px solid #4e9b94;
          border-radius: 4px 12px 12px 4px;
          background: #f0f8f6;
        }
        .conversion {
          margin-top: 13px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 18px;
          padding: 13px 18px;
          border-radius: 16px;
          color: white;
          background: #17375e;
          font-size: 28px;
        }
        .conversion strong { color: #ffd77f; }
        ul { margin: 8px 0 0; padding-left: 30px; }
        li { margin: 8px 0; padding-left: 3px; font-size: ${isZh ? 23 : 21}px; line-height: 1.28; }
        li::marker { color: #eb5f4a; }
        .quantities-grid .principle { min-height: 150px; }
        .quantities-grid { gap: 15px; margin-top: 17px; }
        .quantities-grid .base, .quantities-grid .derived { min-height: 340px; }
        .quantities-grid .notation, .quantities-grid .prefixes { min-height: 415px; }
        .quantities-grid .convert { min-height: 295px; }
        .quantities-grid .area, .quantities-grid .checks { min-height: 275px; }
        .graph { width: 100%; max-height: 285px; display: block; }
        .maths-grid .linear, .maths-grid .graph-card { min-height: 435px; }
        .maths-grid .slope, .maths-grid .example { min-height: 400px; }
        .maths-grid .rearrange, .maths-grid .sketch { min-height: 330px; }
        .maths-grid .physics, .maths-grid .traps { min-height: 290px; }
        .steps { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .steps > div {
          padding: 14px;
          border-radius: 14px;
          text-align: center;
          font-size: ${isZh ? 26 : 24}px;
          background: #edf7f5;
        }
        .numbered { display: grid; gap: 10px; }
        .numbered > div { display: flex; align-items: center; gap: 14px; }
        .numbered span {
          flex: 0 0 42px;
          width: 42px; height: 42px;
          display: grid; place-items: center;
          border-radius: 50%;
          color: white;
          background: #eb5f4a;
          font-size: 24px;
          font-weight: 900;
        }
        .numbered p { margin: 0; }
        footer {
          position: absolute;
          z-index: 1;
          bottom: 13px;
          left: 58px;
          right: 58px;
          display: flex;
          justify-content: space-between;
          color: #46627f;
          font-size: 21px;
          font-weight: 700;
        }
        footer::after { content: "uni+  •  PHYSICS"; color: #246b66; letter-spacing: 2px; }
      </style>
    </head>
    <body>
      <article class="poster">
        <header>
          <div>
            <div class="kicker">${d.kicker}</div>
            <h1>${d.title}</h1>
            <p class="subtitle">${d.subtitle}</p>
          </div>
          <div class="badge">${topic === 'quantities' ? '⚖' : '📈'}</div>
        </header>
        ${body}
        <footer>${d.footer}</footer>
      </article>
    </body>
  </html>`;
}

async function pngToWebp(browser, png) {
  const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT } });
  const base64 = png.toString('base64');
  const webpBase64 = await page.evaluate(
    async ({ source, width, height }) => {
      const image = new Image();
      image.src = `data:image/png;base64,${source}`;
      await image.decode();
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(image, 0, 0);
      return canvas.toDataURL('image/webp', 0.88).split(',')[1];
    },
    { source: base64, width: WIDTH, height: HEIGHT },
  );
  await page.close();
  return Buffer.from(webpBase64, 'base64');
}

await mkdir(OUT_DIR, { recursive: true });
const browser = await chromium.launch({ headless: true });

const jobs = [
  ['en', 'quantities', 'quantities-units-en.webp'],
  ['zhHant', 'quantities', 'quantities-units-zhHant.webp'],
  ['en', 'maths', 'useful-mathematics-en.webp'],
  ['zhHant', 'maths', 'useful-mathematics-zhHant.webp'],
];

for (const [lang, topic, filename] of jobs) {
  const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: 1 });
  await page.setContent(posterHtml(lang, topic), { waitUntil: 'load' });
  const layout = await page.evaluate(() => {
    const grid = document.querySelector('.poster-grid').getBoundingClientRect();
    const footer = document.querySelector('footer').getBoundingClientRect();
    const clippedCards = [...document.querySelectorAll('.card')]
      .map((card) => ({
        title: card.querySelector('h2')?.textContent,
        clipped: card.scrollHeight > card.clientHeight,
        bottom: card.getBoundingClientRect().bottom,
      }))
      .filter((card) => card.clipped || card.bottom > footer.top);
    return { gridBottom: grid.bottom, footerTop: footer.top, clippedCards };
  });
  if (layout.gridBottom > layout.footerTop || layout.clippedCards.length) {
    throw new Error(`Poster layout overflow in ${filename}: ${JSON.stringify(layout)}`);
  }
  const png = await page.locator('.poster').screenshot({ type: 'png' });
  const webp = await pngToWebp(browser, png);
  await writeFile(new URL(filename, OUT_DIR), webp);
  await page.close();
  console.log(`Wrote public/summary/${filename} (${WIDTH}x${HEIGHT}, ${webp.length} bytes)`);
}

await browser.close();
