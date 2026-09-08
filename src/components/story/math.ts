/** Smoothstep remap helpers for scroll-driven story progress */

export function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value))
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp((x - edge0) / (edge1 - edge0))
  return t * t * (3 - 2 * t)
}

/** Map global progress into a local 0–1 within [start, end] */
export function rangeProgress(progress: number, start: number, end: number) {
  return smoothstep(start, end, progress)
}

export function fadeInOut(
  progress: number,
  inStart: number,
  inEnd: number,
  outStart: number,
  outEnd: number,
) {
  const fadeIn = smoothstep(inStart, inEnd, progress)
  const fadeOut = 1 - smoothstep(outStart, outEnd, progress)
  return fadeIn * fadeOut
}
