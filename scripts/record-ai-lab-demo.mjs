/**
 * Record a silent ~5-minute 1080p demo: Prison Break slider → TIR, then vacuum flask.
 *
 * Usage: node scripts/record-ai-lab-demo.mjs
 * Optional: DEMO_SPEED=10 for a faster dry run (timings divided by 10).
 */
import { spawn, execFileSync, execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const viteBin = path.join(root, 'node_modules', 'vite', 'bin', 'vite.js');
const PORT = 5178;
const BASE = `http://127.0.0.1:${PORT}`;
const SPEED = Math.max(0.25, Number(process.env.DEMO_SPEED || 1));
const ms = (n) => Math.max(40, Math.round(n / SPEED));
const N1 = 1.33;
const N2 = 1.00;
const START_ANGLE = 20;
const TIR_ANGLE = 56;
const THETA_C = (Math.asin(N2 / N1) * 180) / Math.PI;
const VIEWPORT = { width: 1920, height: 1080 };
const outDir = path.join(root, 'exports');
const tmpVideoDir = path.join(outDir, '_demo-video-tmp');
const outMp4 = path.join(outDir, 'ai-lab-demo-5min.mp4');
const outWebm = path.join(outDir, 'ai-lab-demo-5min.webm');

const CURSOR_INIT = `(() => {
  if (window.__s3phyDemoCursor) return;
  window.__s3phyDemoCursor = true;
  const style = document.createElement('style');
  style.textContent = \`
    #s3phy-demo-cursor {
      position: fixed;
      left: 0;
      top: 0;
      width: 28px;
      height: 28px;
      pointer-events: none;
      z-index: 2147483647;
      transform: translate(-2px, -2px);
      filter: drop-shadow(0 1px 2px rgba(0,0,0,.45));
    }
    #s3phy-demo-cursor svg { display: block; width: 28px; height: 28px; }
  \`;
  const cursor = document.createElement('div');
  cursor.id = 's3phy-demo-cursor';
  cursor.innerHTML = '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M4 2.5 L4 26.5 L11.2 20.2 L15.8 30.2 L19.8 28.4 L15.4 18.8 L24.5 18.8 Z" fill="#fff" stroke="#111" stroke-width="1.6" stroke-linejoin="round"/></svg>';
  const mount = () => {
    if (!document.body) return;
    if (!style.isConnected) document.head.appendChild(style);
    if (!cursor.isConnected) document.body.appendChild(cursor);
  };
  const move = (e) => {
    mount();
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  };
  document.addEventListener('mousemove', move, true);
  document.addEventListener('pointermove', move, true);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();`;

function stopChild(child) {
  if (!child?.pid) return;
  try {
    if (process.platform === 'win32') {
      execSync(`taskkill /pid ${child.pid} /T /F`, { stdio: 'ignore' });
    } else {
      child.kill('SIGTERM');
    }
  } catch {
    /* already gone */
  }
}

function sleep(n) {
  return new Promise((resolve) => setTimeout(resolve, n));
}

function log(msg) {
  const stamp = new Date().toISOString().slice(11, 19);
  console.log(`[${stamp}] ${msg}`);
}

async function waitForHttp(url, timeoutMs = 40000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url, { method: 'GET' });
      if (res.ok) return;
    } catch {
      /* still starting */
    }
    await sleep(250);
  }
  throw new Error('Timed out waiting for ' + url);
}

async function ensureVite() {
  const probe = `${BASE}/tir-escape/index.html`;
  try {
    const res = await fetch(probe);
    if (res.ok) {
      log('Using existing Vite at ' + BASE);
      return { child: null };
    }
  } catch {
    /* start our own */
  }
  log('Starting Vite on port ' + PORT);
  const child = spawn(process.execPath, [viteBin, '--host', '127.0.0.1', '--port', String(PORT), '--strictPort'], {
    cwd: root,
    shell: false,
    stdio: 'pipe',
  });
  child.stdout.on('data', (buf) => {
    const text = String(buf);
    if (text.includes('Local:') || text.includes('error')) process.stdout.write(text);
  });
  child.stderr.on('data', (buf) => process.stderr.write(String(buf)));
  await waitForHttp(probe);
  return { child };
}

function hasFfmpeg() {
  try {
    execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

async function launchBrowser() {
  try {
    return await chromium.launch({
      headless: true,
      args: [
        '--autoplay-policy=no-user-gesture-required',
        '--disable-gpu',
        '--use-angle=swiftshader',
      ],
    });
  } catch {
    log('Playwright Chromium missing; installing…');
    execSync('npx playwright install chromium', { cwd: root, stdio: 'inherit' });
    return chromium.launch({
      headless: true,
      args: [
        '--autoplay-policy=no-user-gesture-required',
        '--disable-gpu',
        '--use-angle=swiftshader',
      ],
    });
  }
}

async function centerOf(locator) {
  const box = await locator.boundingBox();
  if (!box) throw new Error('No bounding box for ' + String(locator));
  return { x: box.x + box.width / 2, y: box.y + box.height / 2, box };
}

async function moveTo(page, locator, steps = 16) {
  await locator.scrollIntoViewIfNeeded();
  const { x, y } = await centerOf(locator);
  await page.mouse.move(x, y, { steps });
}

async function clickControl(page, locator, settle = 350) {
  await moveTo(page, locator, 18);
  await sleep(ms(settle));
  await locator.click();
  await sleep(ms(250));
}

function sliderX(box, deg) {
  const pad = 10;
  return box.x + pad + (deg / 90) * (box.width - pad * 2);
}

async function setAngle(page, deg) {
  await page.evaluate((a) => {
    const slider = document.getElementById('angle-slider');
    slider.value = String(a);
    slider.dispatchEvent(new Event('input', { bubbles: true }));
  }, deg);
}

async function sweepAngle(page, fromDeg, toDeg, durationMs) {
  const slider = page.locator('#angle-slider');
  await slider.scrollIntoViewIfNeeded();
  const box = await slider.boundingBox();
  if (!box) throw new Error('angle slider not visible');
  const y = box.y + box.height / 2;
  await page.mouse.move(sliderX(box, fromDeg), y, { steps: 12 });
  await setAngle(page, fromDeg);
  await sleep(ms(200));
  const steps = Math.max(12, Math.round(durationMs / 80));
  for (let i = 1; i <= steps; i++) {
    const deg = fromDeg + ((toDeg - fromDeg) * i) / steps;
    await page.mouse.move(sliderX(box, deg), y);
    await setAngle(page, deg);
    await sleep(durationMs / steps);
  }
  await page.evaluate(() => {
    document.getElementById('angle-slider').dispatchEvent(new Event('change', { bubbles: true }));
  });
}

async function recordDemo(page) {
  const tirUrl = `${BASE}/tir-escape/index.html?lang=zh&n1=${N1}&n2=${N2}&angle=${START_ANGLE}`;
  log('Open Prison Break');
  await page.goto(tirUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.locator('#angle-slider').waitFor({ state: 'visible' });
  await page.evaluate(async () => {
    if (window.MathJax?.startup?.promise) await window.MathJax.startup.promise;
  }).catch(() => {});
  await sleep(ms(800));
  await setAngle(page, START_ANGLE);
  await moveTo(page, page.locator('#simCanvas'), 10);
  log('Intro hold');
  await sleep(ms(20000));

  log('Sweep 20° → 32°');
  await sweepAngle(page, START_ANGLE, 32, ms(28000));
  await moveTo(page, page.locator('#simCanvas'), 10);
  await sleep(ms(4000));

  log('Sweep 32° → 40°');
  await sweepAngle(page, 32, 40, ms(28000));
  await moveTo(page, page.locator('#simCanvas'), 10);
  await sleep(ms(4000));

  log('Sweep 40° → θc');
  await sweepAngle(page, 40, THETA_C, ms(36000));
  await clickControl(page, page.locator('#btn-set-critical'), 500);
  await moveTo(page, page.locator('#simCanvas'), 14);
  log('Hold at critical');
  await sleep(ms(25000));

  log('Past critical into TIR');
  await sweepAngle(page, THETA_C, TIR_ANGLE, ms(12000));
  await moveTo(page, page.locator('#simCanvas'), 12);
  await sleep(ms(23000));

  log('Open heat-transfer flask');
  await page.goto(`${BASE}/heat-transfer/index.html?lang=zh-Hant`, {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });
  await page.locator('#lang-zh').waitFor({ state: 'visible' });
  await clickControl(page, page.locator('#lang-zh'), 400);
  await clickControl(page, page.locator('#tab-applications'), 500);
  const flaskCard = page.locator('#card-flask');
  await flaskCard.scrollIntoViewIfNeeded();
  await sleep(ms(600));
  await clickControl(page, page.locator('#card-flask button').first(), 400);
  await page.locator('#flask-controls-container').waitFor({ state: 'visible', timeout: 10000 });
  await page.evaluate(() => {
    if (typeof handleResize === 'function') handleResize();
  });
  await page.waitForFunction(() => {
    const svg = document.getElementById('flask-svg');
    const r = svg?.getBoundingClientRect();
    return !!r && r.width > 120 && r.height > 120;
  }, { timeout: 15000 });
  await sleep(ms(800));
  const idealBtn = page.locator('#flask-presets-box button').filter({ hasText: /Ideal Flask/i });
  await clickControl(page, idealBtn, 400);
  await sleep(ms(Math.max(2000, 20000 - 6000)));

  log('Pour hot water');
  const pourSlider = page.locator('#flask-pour-temp-slider');
  await moveTo(page, pourSlider, 14);
  await sleep(ms(400));
  await pourSlider.fill('100');
  await clickControl(page, page.locator('#flask-pour-panel button'), 400);
  await moveTo(page, page.locator('#flaskCanvas'), 12);
  await sleep(ms(20000));

  log('Vacuum hotspot then Solid Copper');
  const vacuumNode = page.locator('#node-vacuum');
  if (await vacuumNode.count()) {
    await clickControl(page, vacuumNode, 400);
    await sleep(ms(2500));
  }
  const medium = page.locator('#flask-opt-medium');
  await moveTo(page, medium, 16);
  await sleep(ms(600));
  await medium.selectOption('solid');
  await moveTo(page, page.locator('#flaskCanvas'), 12);
  await sleep(ms(40000));

  log('Restore vacuum');
  await moveTo(page, medium, 14);
  await sleep(ms(400));
  await medium.selectOption('vacuum');
  await moveTo(page, page.locator('#flaskCanvas'), 10);
  await sleep(ms(10000));

  log('Remove silver coating');
  const coating = page.locator('#flask-opt-coating');
  await moveTo(page, coating, 16);
  await sleep(ms(600));
  await coating.selectOption('black');
  await moveTo(page, page.locator('#flaskCanvas'), 12);
  await sleep(ms(30000));
  log('Demo actions finished');
}

async function convertVideo(webmPath) {
  fs.copyFileSync(webmPath, outWebm);
  if (!hasFfmpeg()) {
    log('ffmpeg not found; left WebM at ' + outWebm);
    return outWebm;
  }
  log('Encoding H.264 mp4');
  execFileSync(
    'ffmpeg',
    [
      '-y',
      '-i',
      webmPath,
      '-c:v',
      'libx264',
      '-pix_fmt',
      'yuv420p',
      '-movflags',
      '+faststart',
      '-an',
      outMp4,
    ],
    { stdio: 'inherit' },
  );
  log('Wrote ' + outMp4);
  return outMp4;
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  fs.rmSync(tmpVideoDir, { recursive: true, force: true });
  fs.mkdirSync(tmpVideoDir, { recursive: true });

  const vite = await ensureVite();
  const browser = await launchBrowser();
  const context = await browser.newContext({
    viewport: VIEWPORT,
    recordVideo: { dir: tmpVideoDir, size: VIEWPORT },
    deviceScaleFactor: 1,
    locale: 'zh-Hant',
  });
  await context.addInitScript(CURSOR_INIT);
  await context.addInitScript(() => {
    Element.prototype.requestFullscreen = () => Promise.resolve();
    Document.prototype.exitFullscreen = () => Promise.resolve();
  });
  const page = await context.newPage();
  page.on('crash', () => log('PAGE CRASHED'));
  const started = Date.now();
  let ok = false;
  try {
    await recordDemo(page);
    ok = true;
  } finally {
    const video = page.video();
    await page.close().catch(() => {});
    const webmPath = video ? await video.path().catch(() => null) : null;
    await context.close();
    await browser.close();
    if (vite.child) stopChild(vite.child);
    const elapsed = ((Date.now() - started) / 1000).toFixed(1);
    log(`Elapsed ${elapsed}s (DEMO_SPEED=${SPEED})`);
    if (ok) {
      if (!webmPath || !fs.existsSync(webmPath)) {
        throw new Error('Playwright did not write a video file');
      }
      await convertVideo(webmPath);
    } else if (webmPath && fs.existsSync(webmPath)) {
      log('Skipping encode after failed run; temp video at ' + webmPath);
    }
    if (ok) fs.rmSync(tmpVideoDir, { recursive: true, force: true });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
