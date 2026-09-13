/** Canvas primitives matching Newton First Law + stacked-boxes art. */
(function (root) {
  "use strict";

  const FONT = '"Plus Jakarta Sans", Inter, system-ui, sans-serif';
  const MONO = '"JetBrains Mono", ui-monospace, monospace';
  const C = {
    skyTop: "#38bdf8",
    skyBot: "#0369a1",
    skyStroke: "#0284c7",
    greenTop: "#34d399",
    greenBot: "#059669",
    greenStroke: "#047857",
    orange: "#f97316",
    rose: "#f43f5e",
    violet: "#7c3aed",
    indigo: "#6366f1",
    ink: "#0f172a",
    muted: "#64748b",
    floor: "#f1f5f9",
    floorLine: "#94a3b8",
    hatch: "rgba(100,116,139,0.45)",
    white: "#ffffff",
    wall: "#e2e8f0",
    wallEdge: "#94a3b8",
    slateTop: "#cbd5e1",
    slateBot: "#475569",
    slateStroke: "#334155",
  };

  function font(weight, px) {
    return weight + " " + px + "px " + FONT;
  }

  function mono(weight, px) {
    return weight + " " + px + "px " + MONO;
  }

  function roundRect(ctx, x, y, w, h, r) {
    const rr = Math.min(r || 8, Math.abs(w) / 2, Math.abs(h) / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  function drawGlowingBox(ctx, x, y, w, h, topColor, botColor, strokeColor) {
    const grad = ctx.createLinearGradient(x, y, x, y + h);
    grad.addColorStop(0, topColor);
    grad.addColorStop(1, botColor);
    roundRect(ctx, x, y, w, h, Math.min(8, Math.abs(w) * 0.12, Math.abs(h) * 0.2));
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;
    ctx.stroke();
    if (w > 22 && h > 12) {
      ctx.beginPath();
      ctx.moveTo(x + 10, y + 5);
      ctx.lineTo(x + w - 10, y + 5);
      ctx.strokeStyle = "rgba(255,255,255,0.55)";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.stroke();
    }
  }

  function skyBox(ctx, x, y, w, h) {
    drawGlowingBox(ctx, x, y, w, h, C.skyTop, C.skyBot, C.skyStroke);
  }

  function greenBox(ctx, x, y, w, h) {
    drawGlowingBox(ctx, x, y, w, h, C.greenTop, C.greenBot, C.greenStroke);
  }

  function slateBar(ctx, x, y, w, h) {
    drawGlowingBox(ctx, x, y, w, h, C.slateTop, C.slateBot, C.slateStroke);
  }

  function drawFloor(ctx, width, height, floorY, label) {
    ctx.fillStyle = C.white;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = C.floor;
    ctx.fillRect(0, floorY, width, height - floorY);
    ctx.strokeStyle = C.floorLine;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, floorY);
    ctx.lineTo(width, floorY);
    ctx.stroke();
    ctx.strokeStyle = C.hatch;
    ctx.lineWidth = 1;
    for (let x = 10; x < width; x += 18) {
      ctx.beginPath();
      ctx.moveTo(x, floorY + 6);
      ctx.lineTo(x - 8, floorY + 18);
      ctx.stroke();
    }
    if (label) {
      ctx.fillStyle = C.ink;
      ctx.font = font(800, 14);
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      ctx.fillText(label, 16, Math.min(height - 10, floorY + 32));
    }
  }

  function drawArrow(ctx, x1, y1, x2, y2, color, width) {
    const ang = Math.atan2(y2 - y1, x2 - x1);
    const head = Math.max(10, (width || 3.2) * 5.5);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = width || 3.2;
    ctx.lineCap = "butt";
    const inset = head * 0.55;
    const len = Math.hypot(x2 - x1, y2 - y1);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    if (len > inset + 2) {
      ctx.lineTo(x2 - inset * Math.cos(ang), y2 - inset * Math.sin(ang));
    }
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - head * Math.cos(ang - 0.45), y2 - head * Math.sin(ang - 0.45));
    ctx.lineTo(x2 - head * Math.cos(ang + 0.45), y2 - head * Math.sin(ang + 0.45));
    ctx.closePath();
    ctx.fill();
  }

  function drawGlowingBall(ctx, x, y, r, topColor, botColor, strokeColor) {
    const grad = ctx.createLinearGradient(x, y - r, x, y + r);
    grad.addColorStop(0, topColor || C.greenTop);
    grad.addColorStop(1, botColor || C.greenBot);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = strokeColor || C.greenStroke;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x - r * 0.28, y - r * 0.3, r * 0.28, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.fill();
  }

  function labelBox(ctx, x, y, w, h, text) {
    ctx.fillStyle = "#ffffff";
    ctx.font = font(800, Math.max(11, Math.min(18, h * 0.38)));
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x + w / 2, y + h / 2 + 1);
  }

  function clamp01(t) {
    return Math.min(1, Math.max(0, t));
  }

  function mixRgb(a, b, t) {
    t = clamp01(t);
    return [
      Math.round(a[0] + (b[0] - a[0]) * t),
      Math.round(a[1] + (b[1] - a[1]) * t),
      Math.round(a[2] + (b[2] - a[2]) * t),
    ];
  }

  function rgbCss(c, a) {
    if (a == null || a >= 1) return "rgb(" + c[0] + ", " + c[1] + ", " + c[2] + ")";
    return "rgba(" + c[0] + ", " + c[1] + ", " + c[2] + ", " + a + ")";
  }

  var COL_COLD = [2, 132, 199];
  var COL_HOT = [249, 115, 22];

  function particleFill(heat) {
    return rgbCss(mixRgb(COL_COLD, COL_HOT, heat));
  }

  function fillStage(ctx, w, h) {
    ctx.fillStyle = C.white;
    ctx.fillRect(0, 0, w, h);
  }

  function drawGlassChamber(ctx, x, y, w, h, heat, dens) {
    heat = clamp01(heat);
    dens = clamp01(dens == null ? 0.25 : dens);
    var top = mixRgb([248, 250, 252], mixRgb([224, 242, 254], [255, 237, 213], heat), 0.5 + dens * 0.4);
    var bot = mixRgb([241, 245, 249], mixRgb([186, 230, 253], [253, 186, 116], heat), 0.4 + dens * 0.45);
    var g = ctx.createLinearGradient(x, y, x, y + h);
    g.addColorStop(0, rgbCss(top));
    g.addColorStop(1, rgbCss(bot));
    roundRect(ctx, x, y, w, h, 8);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.strokeStyle = heat > 0.62 ? "#ea580c" : C.skyStroke;
    ctx.lineWidth = 2;
    ctx.stroke();
    if (w > 28 && h > 16) {
      ctx.beginPath();
      ctx.moveTo(x + 10, y + 5);
      ctx.lineTo(x + w - 10, y + 5);
      ctx.strokeStyle = "rgba(255,255,255,0.7)";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.stroke();
    }
  }

  function drawPiston(ctx, x, y, h, label) {
    drawGlowingBox(ctx, x, y - 6, 14, h + 12, C.slateTop, C.slateBot, C.slateStroke);
    drawGlowingBox(ctx, x + 14, y + h * 0.42, 36, 12, C.slateTop, C.slateBot, C.slateStroke);
    skyBox(ctx, x + 48, y + h * 0.42 - 5, 18, 22);
    if (label) {
      ctx.fillStyle = C.ink;
      ctx.font = font(800, 12);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, x + 32, y + h * 0.52);
    }
  }

  function drawHeatBar(ctx, x, y, w, heat) {
    heat = clamp01(heat);
    if (heat < 0.04) return;
    ctx.save();
    ctx.globalAlpha = 0.3 + 0.6 * heat;
    roundRect(ctx, x, y, w, 8, 4);
    ctx.fillStyle = C.orange;
    ctx.fill();
    ctx.restore();
  }

  function drawDot(ctx, x, y, r, heat) {
    ctx.beginPath();
    ctx.fillStyle = particleFill(heat);
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawSpeedTrail(ctx, x, y, vx, vy, heat) {
    ctx.beginPath();
    ctx.strokeStyle = rgbCss(mixRgb(COL_COLD, COL_HOT, heat), 0.28);
    ctx.lineWidth = 1.4;
    ctx.lineCap = "round";
    ctx.moveTo(x, y);
    ctx.lineTo(x - vx * 2.2, y - vy * 2.2);
    ctx.stroke();
  }

  function drawHitFlash(ctx, x, y, life) {
    ctx.beginPath();
    ctx.strokeStyle = "rgba(249, 115, 22, " + Math.max(0, life) + ")";
    ctx.lineWidth = 2;
    ctx.arc(x, y, 6 + (1 - life) * 14, 0, Math.PI * 2);
    ctx.stroke();
  }

  function drawBourdon(ctx, cx, cy, P, caption) {
    var r = 32;
    ctx.beginPath();
    ctx.fillStyle = C.white;
    ctx.strokeStyle = C.skyStroke;
    ctx.lineWidth = 2;
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    var i, ang;
    for (i = 0; i <= 6; i++) {
      ang = Math.PI * 0.75 + (Math.PI * 1.5 * i) / 6;
      ctx.beginPath();
      ctx.strokeStyle = C.floorLine;
      ctx.lineWidth = 1.5;
      ctx.moveTo(cx + Math.cos(ang) * (r - 7), cy + Math.sin(ang) * (r - 7));
      ctx.lineTo(cx + Math.cos(ang) * (r - 2), cy + Math.sin(ang) * (r - 2));
      ctx.stroke();
    }
    var frac = Math.min(1, Math.max(0, P / 300));
    var nang = Math.PI * 0.75 + Math.PI * 1.5 * frac;
    ctx.beginPath();
    ctx.strokeStyle = C.orange;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(nang) * (r - 10), cy + Math.sin(nang) * (r - 10));
    ctx.stroke();
    ctx.beginPath();
    ctx.fillStyle = C.skyStroke;
    ctx.arc(cx, cy, 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = C.ink;
    ctx.font = font(800, 10);
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    if (caption) ctx.fillText(caption, cx, cy - r - 16);
    ctx.fillStyle = C.muted;
    ctx.font = font(700, 11);
    ctx.fillText(P.toFixed(0) + " kPa", cx, cy - r - 4);
    ctx.textAlign = "left";
  }

  root.N1Art = {
    FONT,
    MONO,
    C,
    font,
    mono,
    roundRect,
    drawGlowingBox,
    skyBox,
    greenBox,
    slateBar,
    drawFloor,
    drawArrow,
    drawGlowingBall,
    labelBox,
    clamp01,
    mixRgb,
    rgbCss,
    particleFill,
    fillStage,
    drawGlassChamber,
    drawPiston,
    drawHeatBar,
    drawDot,
    drawSpeedTrail,
    drawHitFlash,
    drawBourdon,
  };
})(window);
