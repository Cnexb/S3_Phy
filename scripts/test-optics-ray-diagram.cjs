/**
 * Optics ray-diagram tool seams.
 * Does not call UniPlus, Cloudflare, or Supabase.
 *
 * 1. Hub lists the tool immediately after electromagnetic spectrum.
 * 2. The lab is first-party (own files under labs/), not an external website.
 * 3. Embed wiring matches other optics labs. Tracker payloads stay untouched.
 */
const fs = require("fs");
const path = require("path");
const assert = require("assert");

const root = path.join(__dirname, "..");

function read(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

const hub = read("src/strands/opticsHub.js");
const orderMatch = hub.match(/const TOOL_ORDER = \[([^\]]+)\]/);
assert.ok(orderMatch, "TOOL_ORDER missing");
const order = orderMatch[1].match(/'([^']+)'/g).map((s) => s.slice(1, -1));
const emAt = order.indexOf("em");
assert.ok(emAt >= 0, "em tool missing");
assert.equal(order[emAt + 1], "rayDiagram", "rayDiagram must sit directly under electromagnetic spectrum");
assert.ok(hub.includes("createRayDiagramLab"), "hub must load createRayDiagramLab");
assert.ok(hub.includes("tools.rayDiagram.title"), "hub must use rayDiagram label key");

const factory = read("src/tools/rayDiagramLab.js");
assert.match(factory, /slug:\s*'ray-diagram'/);
assert.doesNotMatch(factory, /kw39\.github\.io/);
assert.doesNotMatch(factory, /uni-tracker|uniplus:quizAnswer|postMessage/);

const html = read("labs/ray-diagram/index.html");
assert.match(html, /s3phy-embed-init\.js/);
assert.match(html, /s3phy-embed\.css/);
assert.match(html, /type="module" src="app\.js"/);
assert.doesNotMatch(html, /kw39\.github\.io/);
assert.ok(fs.existsSync(path.join(root, "labs/ray-diagram/app.js")));
assert.ok(fs.existsSync(path.join(root, "labs/ray-diagram/project-schema.mjs")));
assert.ok(fs.existsSync(path.join(root, "labs/ray-diagram/NOTICE")));

const en = read("src/locales/en.js");
const zh = read("src/locales/zhHant.js");
assert.match(en, /'tools\.rayDiagram\.title': 'Image formed by plane mirror'/);
assert.match(zh, /'tools\.rayDiagram\.title':/);
assert.match(read("labs/ray-diagram/index.html"), /\.topbar \{ display: none/);

console.log("ok  optics ray-diagram seams");
