/** @file Shared 2D geometry for plane mirror simulations (world units: metres). */
export const Vec2 = {
  add(a, b) { return { x: a.x + b.x, y: a.y + b.y }; },
  sub(a, b) { return { x: a.x - b.x, y: a.y - b.y }; },
  scale(v, s) { return { x: v.x * s, y: v.y * s }; },
  dot(a, b) { return a.x * b.x + a.y * b.y; },
  len(v) { return Math.hypot(v.x, v.y); },
  norm(v) { const l = Math.hypot(v.x, v.y) || 1; return { x: v.x / l, y: v.y / l }; },
  dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); },
  lerp(a, b, t) { return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }; },
  rot(v, rad) {
    const c = Math.cos(rad), s = Math.sin(rad);
    return { x: v.x * c - v.y * s, y: v.x * s + v.y * c };
  },
};

export function reflectPoint(p, mirrorA, mirrorB) {
  const ab = Vec2.sub(mirrorB, mirrorA);
  const ap = Vec2.sub(p, mirrorA);
  const t = Vec2.dot(ap, ab) / (Vec2.dot(ab, ab) || 1);
  const foot = Vec2.add(mirrorA, Vec2.scale(ab, t));
  return Vec2.add(foot, Vec2.sub(foot, p));
}

export function lineIntersection(p1, p2, p3, p4) {
  const d = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);
  if (Math.abs(d) < 1e-10) return null;
  const t = ((p1.x - p3.x) * (p3.y - p4.y) - (p1.y - p3.y) * (p3.x - p4.x)) / d;
  const u = -((p1.x - p2.x) * (p1.y - p3.y) - (p1.y - p2.y) * (p1.x - p3.x)) / d;
  if (t < 0 || t > 1 || u < 0 || u > 1) return null;
  return { x: p1.x + t * (p2.x - p1.x), y: p1.y + t * (p2.y - p1.y), t, u };
}

export function segmentIntersection(p1, p2, p3, p4) {
  return lineIntersection(p1, p2, p3, p4);
}

export function lineIntersectInfinite(p1, p2, p3, p4) {
  const d = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);
  if (Math.abs(d) < 1e-10) return null;
  const t = ((p1.x - p3.x) * (p3.y - p4.y) - (p1.y - p3.y) * (p3.x - p4.x)) / d;
  return { x: p1.x + t * (p2.x - p1.x), y: p1.y + t * (p2.y - p1.y), t };
}

export function pointOnSegment(p, a, b, eps = 1e-6) {
  const ab = Vec2.sub(b, a);
  const ap = Vec2.sub(p, a);
  const t = Vec2.dot(ap, ab) / (Vec2.dot(ab, ab) || 1);
  return t >= -eps && t <= 1 + eps;
}

/** Mirror segment vertical at x, from y0 to y1. */
export function verticalMirrorSegment(x, y0, y1) {
  return { a: { x, y: Math.min(y0, y1) }, b: { x, y: Math.max(y0, y1) } };
}

/** Horizontal mirror segment at y, from x0 to x1. */
export function horizontalMirrorSegment(y, x0, x1) {
  return { a: { x: Math.min(x0, x1), y }, b: { x: Math.max(x0, x1), y } };
}

export function virtualSightOnVerticalMirror(imagePt, eye, mirrorX, yMin, yMax) {
  const hit = lineIntersectInfinite(imagePt, eye, { x: mirrorX, y: yMin }, { x: mirrorX, y: yMax });
  if (!hit) return null;
  if (hit.y < yMin - 1e-6 || hit.y > yMax + 1e-6) return null;
  return { x: mirrorX, y: hit.y };
}

export function sightRayVertical(objectPt, eye, mirrorX, yMin, yMax) {
  const image = reflectPoint(objectPt, { x: mirrorX, y: yMin }, { x: mirrorX, y: yMax });
  const reflectPt = virtualSightOnVerticalMirror(image, eye, mirrorX, yMin, yMax);
  if (!reflectPt) return { ok: false, image, reflectPt: null };
  return { ok: true, image, reflectPt, objectPt, eye };
}

/** y on mirror for eye to see floor object: y/(hEye-y) = dObj/dEye */
export function mirrorHeightForFloorObject(dObj, dEye, hEye, hObj = 0) {
  if (hObj === 0) return (dObj * hEye) / (dObj + dEye);
  const num = dObj * (hEye - hObj) + hObj * dEye;
  const den = dObj + dEye;
  return num / den;
}

/** Ceiling light: mirror height from ground. dLight=dist light to wall, dEye=eye to wall, hLight, hEye */
export function mirrorHeightForCeilingLight(dLight, dEye, hLight, hEye) {
  const dh = hLight - hEye;
  const hBelowEye = (dEye * dh) / (dLight + dEye);
  return hEye + hBelowEye;
}

/** Max visible height on back wall through mirror top at mirrorTopY */
export function maxHeightOnBackWall(dEyeToMirror, dMirrorToWall, hEye, mirrorTopY) {
  const dy = mirrorTopY - hEye;
  const totalBase = 2 * dEyeToMirror + dMirrorToWall;
  return hEye + dy * totalBase / dEyeToMirror;
}

export function minMirrorForBody(H, hEye) {
  const q = hEye / 2;
  const p = H / 2;
  const top = (H + hEye) / 2;
  return { length: p, bottom: q, top, minP: p, minQ: q };
}

export function canSeeFullBody(H, hEye, p, q) {
  const req = minMirrorForBody(H, hEye);
  return { ok: p >= req.minP - 1e-6 && q >= req.minQ - 1e-6, required: req };
}

/** Ground mirror: horizontal span visible at height H from eye at hEye over mirror half-width w */
export function groundMirrorSpan(hEye, mirrorWidth, objectHeight) {
  const totalH = hEye + objectHeight;
  const x = (mirrorWidth * objectHeight) / hEye;
  return x;
}

export function groundMirrorSpeed(hEye, mirrorWidth, cloudHeight, timeSec) {
  const x = groundMirrorSpan(hEye, mirrorWidth, cloudHeight);
  return { distance: x, speed: timeSec > 0 ? x / timeSec : 0 };
}

export function reflectAcrossLine(p, a, b) {
  return reflectPoint(p, a, b);
}

/** j-th mirror boundary: evenly divides 360° into 360/θ sectors (j = 0 .. nWedges-1). */
export function wedgeMirrorLineAngle(j, half, thetaRad) {
  return -half + j * thetaRad;
}

/** k-th use of M1/M2 maps to sector boundary index j. */
export function wedgeMirrorLineIndex(mirrorSide, useCount) {
  const k = useCount;
  return mirrorSide === 1 ? 2 * (k - 1) + 1 : 2 * (k - 1);
}

/** Ray from apex toward the virtual-image sector (opposite side of real segment when k >= 2). */
export function wedgeMirrorDrawAngle(mirrorSide, useCount, half) {
  const k = useCount;
  const sign = mirrorSide === 1 ? (-1) ** (k + 1) : (-1) ** k;
  return sign * (2 * k - 1) * half;
}

/** Pick apex→tip direction along sector j that points toward towardPt (for virtual mirror extension). */
export function wedgeMirrorDrawAngleToward(j, towardPt, half, thetaRad) {
  const lineAngle = wedgeMirrorLineAngle(j, half, thetaRad);
  const c1 = Math.cos(lineAngle);
  const s1 = Math.sin(lineAngle);
  const c2 = Math.cos(lineAngle + Math.PI);
  const s2 = Math.sin(lineAngle + Math.PI);
  const dot1 = towardPt.x * c1 + towardPt.y * s1;
  const dot2 = towardPt.x * c2 + towardPt.y * s2;
  return dot1 >= dot2 ? lineAngle : lineAngle + Math.PI;
}

/** Real-sector j for M1 (j=1) or M2 (j=0). */
function realMirrorLineJ(mirrorSide) {
  return mirrorSide === 1 ? 1 : 0;
}

function buildAltMirrorResult(j, imagePt, half, thetaRad) {
  const mirrorSide = j % 2 === 0 ? 2 : 1;
  const mirrorOrder = Math.floor(j / 2) + 1;
  const mirrorAngle = wedgeMirrorDrawAngleToward(j, imagePt, half, thetaRad);
  return {
    mirrorSide,
    mirrorOrder,
    mirrorAngle,
    mirrorLineIndex: j,
    isVirtual: mirrorOrder >= 2,
    mirror: {
      a: { x: 0, y: 0 },
      b: { x: Math.cos(mirrorAngle), y: Math.sin(mirrorAngle) },
    },
  };
}

/** Find mirror j that reflects altParent to imagePt; draw extension toward image. */
function findAltMirror(altParent, imagePt, apex, half, thetaRad, nWedges, altParentMirrorSide) {
  const matches = [];
  for (let j = 0; j < nWedges; j++) {
    const lineAngle = wedgeMirrorLineAngle(j, half, thetaRad);
    const tip = { x: Math.cos(lineAngle), y: Math.sin(lineAngle) };
    const reflected = reflectPoint(altParent, apex, tip);
    if (Vec2.dist(reflected, imagePt) < 1e-5) matches.push(j);
  }

  if (!matches.length) {
    const j = realMirrorLineJ(altParentMirrorSide);
    return buildAltMirrorResult(j, imagePt, half, thetaRad);
  }

  const sideMatches = matches.filter((j) => (j % 2 === 0 ? 2 : 1) === altParentMirrorSide);
  const candidates = sideMatches.length ? sideMatches : matches;

  const minOrder = Math.min(...candidates.map((j) => Math.floor(j / 2) + 1));
  let bestJ = candidates[0];
  let bestDot = -Infinity;
  for (const j of candidates) {
    if (Math.floor(j / 2) + 1 !== minOrder) continue;
    const drawAngle = wedgeMirrorDrawAngleToward(j, imagePt, half, thetaRad);
    const towardImage = imagePt.x * Math.cos(drawAngle) + imagePt.y * Math.sin(drawAngle);
    if (towardImage > bestDot) {
      bestDot = towardImage;
      bestJ = j;
    }
  }
  return buildAltMirrorResult(bestJ, imagePt, half, thetaRad);
}

function angleDiff(a, b) {
  return Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b)));
}

/** Pick sector boundary j whose reflection from parent matches the unfolded target angle. */
function findPrimaryMirrorJ(parent, objectAngle, i, half, thetaRad, nWedges) {
  const k = Math.ceil((i + 1) / 2);
  const sign = i % 2 === 0 ? 1 : -1;
  const targetAngle = objectAngle + sign * k * thetaRad;
  let bestJ = 0;
  let bestErr = Infinity;
  for (let j = 0; j < nWedges; j++) {
    const lineAngle = wedgeMirrorLineAngle(j, half, thetaRad);
    const tip = { x: Math.cos(lineAngle), y: Math.sin(lineAngle) };
    const candidate = reflectPoint(parent, { x: 0, y: 0 }, tip);
    const err = angleDiff(Math.atan2(candidate.y, candidate.x), targetAngle);
    if (err < bestErr) {
      bestErr = err;
      bestJ = j;
    }
  }
  return bestJ;
}

/** Generate images in wedge between two mirrors meeting at origin, angle theta (rad). */
export function imagesInWedge(thetaRad, object, maxImages = 12) {
  const half = thetaRad / 2;
  const nFormula = Math.round(360 / rad2deg(thetaRad)) - 1;
  const nWedges = Math.round(360 / rad2deg(thetaRad));
  const labels = ['X', 'Z', 'Y', 'W', 'V', 'U', 'T', 'S', 'R', 'Q'];
  const apex = { x: 0, y: 0 };
  const objectAngle = Math.atan2(object.y, object.x);
  const images = [];

  for (let i = 0; i < nFormula && images.length < maxImages; i++) {
    const parentIdx = i < 2 ? -1 : i - 2;
    const parent = parentIdx < 0 ? object : images[parentIdx].pt;
    const mirrorLineIndex = findPrimaryMirrorJ(parent, objectAngle, i, half, thetaRad, nWedges);
    const lineAngle = wedgeMirrorLineAngle(mirrorLineIndex, half, thetaRad);
    const tip = { x: Math.cos(lineAngle), y: Math.sin(lineAngle) };
    const pt = reflectPoint(parent, apex, tip);
    const mirrorSide = mirrorLineIndex % 2 === 0 ? 2 : 1;
    const mirrorOrder = Math.floor(mirrorLineIndex / 2) + 1;
    const mirrorAngle = wedgeMirrorDrawAngleToward(mirrorLineIndex, pt, half, thetaRad);
    const isVirtual = mirrorOrder >= 2;

    const entry = {
      pt: { ...pt },
      label: labels[i] || String(i + 1),
      angle: Math.atan2(pt.y, pt.x),
      parentIdx,
      parentLabel: parentIdx < 0 ? 'O' : images[parentIdx].label,
      mirrorLineIndex,
      mirrorAngle,
      mirrorSide,
      mirrorOrder,
      isVirtual,
      mirror: {
        a: { x: 0, y: 0 },
        b: { x: Math.cos(mirrorAngle), y: Math.sin(mirrorAngle) },
      },
    };
    if (i >= 2) {
      const altParentIdx = i % 2 === 0 ? i - 1 : i - 3;
      if (altParentIdx >= 0) {
        const alt = findAltMirror(
          images[altParentIdx].pt,
          pt,
          apex,
          half,
          thetaRad,
          nWedges,
          images[altParentIdx].mirrorSide,
        );
        if (alt) {
          entry.altConstruction = { ...alt, parentIdx: altParentIdx };
        }
      }
    }
    images.push(entry);
  }

  return { images, count: images.length, formula: nFormula };
}

export function deg2rad(d) { return d * Math.PI / 180; }
export function rad2deg(r) { return r * 180 / Math.PI; }

export function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

export function formatLength(m, lang = 'zh') {
  if (m >= 1) return `${m.toFixed(2)} m`;
  const cm = m * 100;
  return lang === 'zh' ? `${cm.toFixed(1)} cm` : `${cm.toFixed(1)} cm`;
}
