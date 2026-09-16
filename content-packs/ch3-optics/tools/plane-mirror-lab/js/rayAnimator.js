/** @file Step-by-step ray diagram animation (HKDSE drawing order). */

export const STEPS_PER_RAY = 5;

export class RayAnimator {
  constructor() {
    this.stepIndex = 0;
    this.playing = false;
    this.raf = null;
    this.playTimer = null;
    this.stepDelayMs = 550;
    this.onUpdate = null;
    this.rayCount = 2;
    /** Steps per ray/image unit (default 5 for HKDSE sight rays; wedge mirrors use 2). */
    this.stepsPerRay = STEPS_PER_RAY;
    /** Extra animation steps after all rays (e.g. similar-triangle construction). */
    this.extraSteps = 0;
    /** When set, bypasses rayCount/stepsPerRay formula (e.g. Image Formation uses 7). */
    this.overrideTotalSteps = null;
  }

  get totalSteps() {
    if (this.overrideTotalSteps != null) return this.overrideTotalSteps;
    return (this.rayCount || 1) * (this.stepsPerRay || STEPS_PER_RAY) + (this.extraSteps ?? 0);
  }

  get progress() {
    return this.totalSteps > 0 ? this.stepIndex / this.totalSteps : 0;
  }

  reset() {
    this.pause();
    this.stepIndex = 0;
    this.onUpdate?.();
  }

  showAll() {
    this.pause();
    this.stepIndex = this.totalSteps;
    this.onUpdate?.();
  }

  play() {
    if (this.playing) return;
    if (this.stepIndex >= this.totalSteps) this.stepIndex = 0;
    this.playing = true;
    this.playTimer = setInterval(() => {
      if (this.stepIndex < this.totalSteps) {
        this.stepIndex += 1;
        this.onUpdate?.();
      } else {
        this.pause();
      }
    }, this.stepDelayMs);
  }

  pause() {
    this.playing = false;
    if (this.playTimer) {
      clearInterval(this.playTimer);
      this.playTimer = null;
    }
    if (this.raf) {
      cancelAnimationFrame(this.raf);
      this.raf = null;
    }
  }

  stepNext() {
    this.pause();
    if (this.stepIndex < this.totalSteps) {
      this.stepIndex += 1;
      this.onUpdate?.();
    }
  }

  /**
   * Draw one sight ray with discrete steps (1–5 per ray).
   * stepIndex: global count of completed steps (0 = blank).
   */
  static drawSightRay(ctx, view, t, draw, ray, stepIndex, rayIndex, rayCount, fail = false) {
    const rayStart = rayIndex * STEPS_PER_RAY;
    const localSteps = Math.max(0, Math.min(STEPS_PER_RAY, stepIndex - rayStart));
    if (localSteps <= 0) return;

    const { objectPt, eye, image, reflectPt } = ray;
    const realColor = fail ? '#ff5252' : undefined;

    if (localSteps >= 1) {
      draw.drawPoint?.(objectPt, fail ? '#ff5252' : undefined);
    }

    if (localSteps >= 2 && image) {
      draw.drawImageLine?.(objectPt, image, 1);
    }

    if (localSteps >= 3 && image && reflectPt) {
      draw.drawArrow(image, eye, { dashed: true, progress: 1, color: realColor || undefined });
    }

    if (localSteps >= 4 && reflectPt) {
      draw.drawArrow(objectPt, reflectPt, { progress: 1, color: realColor || undefined });
    }

    if (localSteps >= 5 && reflectPt) {
      draw.drawArrow(reflectPt, eye, { progress: 1, color: realColor || undefined });
    }
  }
}
