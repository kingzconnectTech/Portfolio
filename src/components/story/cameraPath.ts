import { lerp, smoothstep } from './math'
import { framingDistance } from './normalizeGltf'

export type CameraWaypoint = {
  /** Progress 0–1 */
  p: number
  /** Camera world position */
  pos: [number, number, number]
  /** Look-at target (object visual center) */
  look: [number, number, number]
}

/**
 * Local focus waypoints for Story subjects.
 * Positions assume meter-normalized GLBs on desks around y≈0.78–1.2.
 *
 * Sequence per subject: approach → focus → transition
 * Primary subject fills ~50–75% of viewport (via framingDistance).
 */
const FOV = 36

/** Known subject sizes after normalizeGltf (meters) */
const SUBJECT = {
  laptop: 0.36,
  phone: 0.16,
  browser: 1.4,
  systems: 2.4,
  projects: 2.8,
  toolbox: 2.6,
}

const deskTop = 0.78
const laptopCenter: [number, number, number] = [0, deskTop + 0.14, 0.05]
const phoneCenter: [number, number, number] = [0, 0.55, 0]
const browserCenter: [number, number, number] = [0, 0.55, 0]
const systemsCenter: [number, number, number] = [0, 0.35, 0]
const projectsCenter: [number, number, number] = [0, 0.55, 0]
const toolboxCenter: [number, number, number] = [0, 0.95, 0]

function ahead(
  center: [number, number, number],
  distance: number,
  azimuth = 0.22,
  elevation = 0.12,
): [number, number, number] {
  const x = center[0] + Math.sin(azimuth) * distance
  const y = center[1] + elevation * distance + 0.15
  const z = center[2] + Math.cos(azimuth) * distance
  return [x, y, z]
}

const dLaptop = framingDistance(SUBJECT.laptop, FOV, 0.62)
const dPhone = framingDistance(SUBJECT.phone, FOV, 0.58)
const dBrowser = framingDistance(SUBJECT.browser, FOV, 0.55)
const dSystems = framingDistance(SUBJECT.systems, FOV, 0.5)
const dProjects = framingDistance(SUBJECT.projects, FOV, 0.48)
const dToolbox = framingDistance(SUBJECT.toolbox, FOV, 0.5)

/**
 * Ordered waypoints. StoryCamera samples between neighbours by progress.
 * Distances clamped to ~1.0–2.6m for product/architecture framing.
 */
export const storyCameraPath: CameraWaypoint[] = [
  // Intro — quiet wide establish
  { p: 0.0, pos: [0, 1.45, 4.2], look: [0, 0.9, 0] },
  { p: 0.05, pos: [0.15, 1.28, 3.4], look: [0, 0.95, 0] },

  // 01 Curiosity — approach laptop
  {
    p: 0.08,
    pos: ahead(laptopCenter, Math.min(2.55, dLaptop * 1.35), 0.35, 0.18),
    look: laptopCenter,
  },
  // focus — 3/4 desk-level product shot
  {
    p: 0.13,
    pos: ahead(laptopCenter, Math.min(2.15, Math.max(1.35, dLaptop)), 0.28, 0.1),
    look: [laptopCenter[0], laptopCenter[1] + 0.02, laptopCenter[2]],
  },

  // 02 Learning — dolly toward screen (still clear of chassis)
  {
    p: 0.18,
    pos: ahead(laptopCenter, Math.min(1.55, Math.max(1.15, dLaptop * 0.72)), 0.08, 0.05),
    look: [0, deskTop + 0.22, -0.05],
  },
  {
    p: 0.23,
    pos: ahead(laptopCenter, Math.min(1.35, Math.max(1.05, dLaptop * 0.62)), 0.02, 0.02),
    look: [0, deskTop + 0.26, -0.08],
  },

  // 03 Experimentation — pull to medium workspace
  {
    p: 0.28,
    pos: ahead([0, 1.05, 0], 2.55, 0.15, 0.22),
    look: [0, 1.0, 0],
  },
  {
    p: 0.32,
    pos: ahead([0, 1.05, 0], 2.35, -0.1, 0.18),
    look: [0.2, 1.05, -0.1],
  },

  // 04 The Web — medium-close on browser
  {
    p: 0.36,
    pos: ahead(browserCenter, Math.min(2.6, Math.max(1.8, dBrowser * 1.05)), -0.25, 0.08),
    look: browserCenter,
  },
  {
    p: 0.4,
    pos: ahead(browserCenter, Math.min(2.35, Math.max(1.65, dBrowser)), -0.18, 0.05),
    look: browserCenter,
  },

  // 05 Mobile — product-style phone shot
  {
    p: 0.44,
    pos: ahead(phoneCenter, Math.min(1.9, Math.max(1.2, dPhone * 1.15)), 0.35, 0.08),
    look: phoneCenter,
  },
  {
    p: 0.49,
    pos: ahead(phoneCenter, Math.min(1.55, Math.max(1.1, dPhone)), 0.22, 0.04),
    look: [phoneCenter[0], phoneCenter[1] + 0.02, phoneCenter[2]],
  },

  // 06 Systems — pull back to read the stack, then 3/4 on chassis
  {
    p: 0.54,
    pos: ahead(systemsCenter, Math.min(2.7, Math.max(2.0, dSystems)), 0.55, 0.05),
    look: systemsCenter,
  },
  {
    p: 0.58,
    pos: ahead(systemsCenter, Math.min(2.4, Math.max(1.85, dSystems * 0.9)), 0.45, 0.02),
    look: [0, 0.15, 0],
  },

  // 07 Problem solving — hold on infrastructure
  {
    p: 0.64,
    pos: ahead(systemsCenter, 2.2, 0.3, 0.08),
    look: [0, 0.05, 0],
  },
  {
    p: 0.68,
    pos: ahead(systemsCenter, 2.35, 0.15, 0.12),
    look: systemsCenter,
  },

  // 08 Projects — medium-close readable screens
  {
    p: 0.72,
    pos: ahead(projectsCenter, Math.min(2.85, Math.max(2.1, dProjects)), 0.2, 0.15),
    look: projectsCenter,
  },
  {
    p: 0.76,
    pos: ahead(projectsCenter, Math.min(2.55, Math.max(1.95, dProjects * 0.9)), 0.05, 0.12),
    look: projectsCenter,
  },

  // 09 Toolbox — close enough to read plaques / tools
  {
    p: 0.82,
    pos: ahead(toolboxCenter, Math.min(2.65, Math.max(2.0, dToolbox)), 0.18, 0.2),
    look: toolboxCenter,
  },
  {
    p: 0.86,
    pos: ahead(toolboxCenter, Math.min(2.4, Math.max(1.85, dToolbox * 0.9)), 0.08, 0.16),
    look: [0, 0.9, 0],
  },

  // 10 Today — settle back into calm void
  { p: 0.92, pos: [0, 1.35, 3.6], look: [0, 0.9, 0] },
  { p: 1.0, pos: [0, 1.3, 4.4], look: [0, 0.85, 0] },
]

export function sampleCameraPath(
  progress: number,
  isMobile: boolean,
): { pos: [number, number, number]; look: [number, number, number] } {
  const path = storyCameraPath
  const p = Math.min(1, Math.max(0, progress))

  let i = 0
  while (i < path.length - 2 && path[i + 1].p < p) i++

  const a = path[i]
  const b = path[Math.min(i + 1, path.length - 1)]
  const span = Math.max(1e-5, b.p - a.p)
  const t = smoothstep(0, 1, (p - a.p) / span)

  let pos: [number, number, number] = [
    lerp(a.pos[0], b.pos[0], t),
    lerp(a.pos[1], b.pos[1], t),
    lerp(a.pos[2], b.pos[2], t),
  ]
  const look: [number, number, number] = [
    lerp(a.look[0], b.look[0], t),
    lerp(a.look[1], b.look[1], t),
    lerp(a.look[2], b.look[2], t),
  ]

  if (isMobile) {
    // Pull back slightly on narrow viewports so subjects don't fill the whole screen
    const cx = look[0]
    const cy = look[1]
    const cz = look[2]
    pos = [
      cx + (pos[0] - cx) * 1.22,
      cy + (pos[1] - cy) * 1.1 + 0.08,
      cz + (pos[2] - cz) * 1.22,
    ]
  }

  // Floor clearance — never clip through desk/floor
  pos[1] = Math.max(pos[1], 0.55)

  return { pos, look }
}

export const STORY_CAMERA_FOV = { desktop: 36, mobile: 40 }
