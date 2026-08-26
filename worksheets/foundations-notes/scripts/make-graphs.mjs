import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = join(dirname(fileURLToPath(import.meta.url)), "..", "assets");
mkdirSync(outDir, { recursive: true });

function graphSvg({ xmin, xmax, ymin, ymax, pts, labels }) {
  const W = 340;
  const H = 340;
  const pad = 36;
  const x = (v) => pad + ((v - xmin) / (xmax - xmin)) * (W - 2 * pad);
  const y = (v) => H - pad - ((v - ymin) / (ymax - ymin)) * (H - 2 * pad);
  const x0 = xmin <= 0 && xmax >= 0 ? x(0) : null;
  const y0 = ymin <= 0 && ymax >= 0 ? y(0) : null;
  const ticks = [];
  for (let i = Math.ceil(xmin); i <= Math.floor(xmax); i += 1) {
    if (i === 0) continue;
    ticks.push(
      `<line x1="${x(i)}" y1="${y0 ?? H - pad}" x2="${x(i)}" y2="${(y0 ?? H - pad) + 4}" stroke="#727784" stroke-width="1"/>` +
        `<text x="${x(i)}" y="${(y0 ?? H - pad) + 16}" text-anchor="middle" font-size="10" fill="#414753">${i}</text>`,
    );
  }
  for (let j = Math.ceil(ymin); j <= Math.floor(ymax); j += 1) {
    if (j === 0) continue;
    ticks.push(
      `<line x1="${(x0 ?? pad) - 4}" y1="${y(j)}" x2="${x0 ?? pad}" y2="${y(j)}" stroke="#727784" stroke-width="1"/>` +
        `<text x="${(x0 ?? pad) - 8}" y="${y(j) + 4}" text-anchor="end" font-size="10" fill="#414753">${j}</text>`,
    );
  }
  const [p1, p2] = pts;
  const pointMarks = pts
    .map((p, idx) => {
      const name = labels[idx];
      return `<circle cx="${x(p[0])}" cy="${y(p[1])}" r="4" fill="#004e9f"/>
        <text x="${x(p[0]) + 8}" y="${y(p[1]) - 8}" font-size="13" font-weight="700" fill="#004e9f">${name}(${p[0]}, ${p[1]})</text>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <rect width="100%" height="100%" fill="#f7f9fb"/>
  <line x1="${pad}" y1="${H - pad}" x2="${W - pad}" y2="${H - pad}" stroke="#191c1e" stroke-width="1.5"/>
  <line x1="${pad}" y1="${pad}" x2="${pad}" y2="${H - pad}" stroke="#191c1e" stroke-width="1.5"/>
  ${x0 != null ? `<line x1="${x0}" y1="${pad}" x2="${x0}" y2="${H - pad}" stroke="#191c1e" stroke-width="1.5"/>` : ""}
  ${y0 != null ? `<line x1="${pad}" y1="${y0}" x2="${W - pad}" y2="${y0}" stroke="#191c1e" stroke-width="1.5"/>` : ""}
  <text x="${W - pad + 4}" y="${(y0 ?? H - pad) - 6}" font-size="14" fill="#191c1e">x</text>
  <text x="${(x0 ?? pad) + 6}" y="${pad - 6}" font-size="14" fill="#191c1e">y</text>
  ${ticks.join("\n")}
  <line x1="${x(p1[0])}" y1="${y(p1[1])}" x2="${x(p2[0])}" y2="${y(p2[1])}" stroke="#004e9f" stroke-width="2"/>
  ${pointMarks}
</svg>
`;
}

const graphs = {
  "um-q1.svg": { xmin: -1, xmax: 5, ymin: -1, ymax: 5, pts: [[3, 3], [0, 0]], labels: ["A", "B"] },
  "um-q2.svg": { xmin: -5, xmax: 1, ymin: -1, ymax: 6, pts: [[-3, 4], [-1, 1]], labels: ["A", "B"] },
  "um-q3.svg": { xmin: -5, xmax: 4, ymin: -4, ymax: 4, pts: [[-4, 2], [2, -2]], labels: ["A", "B"] },
  "um-q4.svg": { xmin: -5, xmax: 4, ymin: -4, ymax: 4, pts: [[2, 3], [-4, -3]], labels: ["A", "B"] },
  "um-q5a.svg": { xmin: -1, xmax: 8, ymin: -1, ymax: 6, pts: [[0, 1], [6, 4]], labels: ["", ""] },
  "um-q5b.svg": { xmin: -1, xmax: 7, ymin: -1, ymax: 5, pts: [[0, 3], [5, 0]], labels: ["", ""] },
  "um-q6a.svg": { xmin: -1, xmax: 5, ymin: -1, ymax: 6, pts: [[0, 4], [3, 0]], labels: ["", ""] },
  "um-q6b.svg": { xmin: -1, xmax: 13, ymin: -1, ymax: 10, pts: [[0, 8], [6, 0]], labels: ["", ""] },
};

for (const [name, spec] of Object.entries(graphs)) {
  writeFileSync(join(outDir, name), graphSvg(spec));
}
console.log("wrote", Object.keys(graphs).length, "graphs");
