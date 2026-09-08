import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { useStoryMaterials, storyColors } from '../materials'
import { fadeInOut, lerp, rangeProgress, smoothstep } from '../math'
import { useStoryProgress } from '../StoryContext'
import { mobileTechLabels, storyProjects, toolboxItems } from '../../../data/story'

type Props = { progress: number }

function Table({ width = 2.4, depth = 1.2 }: { width?: number; depth?: number }) {
  const { walnut, charcoal } = useStoryMaterials()
  return (
    <group>
      <mesh position={[0, 0.72, 0]} castShadow receiveShadow material={walnut}>
        <boxGeometry args={[width, 0.06, depth]} />
      </mesh>
      {[
        [-width / 2 + 0.08, 0.36, -depth / 2 + 0.08],
        [width / 2 - 0.08, 0.36, -depth / 2 + 0.08],
        [-width / 2 + 0.08, 0.36, depth / 2 - 0.08],
        [width / 2 - 0.08, 0.36, depth / 2 - 0.08],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]} castShadow material={charcoal}>
          <boxGeometry args={[0.06, 0.72, 0.06]} />
        </mesh>
      ))}
    </group>
  )
}

/** Chapter 01–02: laptop that opens and shows a code IDE */
export function CuriosityLaptop({ progress }: Props) {
  const group = useRef<THREE.Group>(null)
  const lid = useRef<THREE.Group>(null)
  const { charcoal, metal, screen, walnut } = useStoryMaterials()
  const appear = fadeInOut(progress, 0.04, 0.1, 0.3, 0.38)
  const open = smoothstep(0.14, 0.2, progress)
  const codeStage = smoothstep(0.16, 0.23, progress)

  useFrame(() => {
    if (!group.current || !lid.current) return
    group.current.visible = appear > 0.01
    group.current.scale.setScalar(lerp(0.85, 1, appear))
    group.current.position.y = lerp(-0.4, 0, appear)
    lid.current.rotation.x = lerp(-Math.PI / 2.05, -0.18, open)
  })

  const codeLines =
    codeStage < 0.45
      ? ['<div>', '  <h1>Hello World</h1>', '</div>']
      : ['import React from "react"', 'const App = () => {', '  return <Hero />', '}']

  return (
    <group ref={group} position={[0, 0, 0]}>
      <Table width={1.8} depth={1} />
      <group position={[0, 0.76, 0.05]}>
        {/* Base */}
        <mesh castShadow material={charcoal}>
          <boxGeometry args={[0.9, 0.04, 0.58]} />
        </mesh>
        <mesh position={[0, 0.025, 0.08]} material={metal}>
          <boxGeometry args={[0.72, 0.008, 0.28]} />
        </mesh>
        {/* Lid */}
        <group ref={lid} position={[0, 0.02, -0.28]}>
          <mesh position={[0, 0.28, 0]} castShadow material={charcoal}>
            <boxGeometry args={[0.9, 0.56, 0.03]} />
          </mesh>
          <mesh position={[0, 0.28, 0.018]} material={screen}>
            <planeGeometry args={[0.82, 0.48]} />
          </mesh>
          {appear > 0.3 && open > 0.2 && (
            <Html
              transform
              position={[0, 0.28, 0.025]}
              distanceFactor={1.1}
              style={{
                width: 280,
                height: 168,
                pointerEvents: 'none',
                opacity: open,
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: '#0d1117',
                  borderRadius: 4,
                  padding: 10,
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                  fontSize: 9,
                  color: '#c9d1d9',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 4,
                  boxSizing: 'border-box',
                }}
              >
                <div>
                  <div style={{ color: '#8b949e', marginBottom: 4 }}>editor</div>
                  {codeLines.map((l) => (
                    <div key={l} style={{ color: l.includes('React') || l.includes('div') ? '#79c0ff' : '#c9d1d9' }}>
                      {l}
                    </div>
                  ))}
                </div>
                <div style={{ borderLeft: '1px solid #21262d', paddingLeft: 6 }}>
                  <div style={{ color: '#8b949e', marginBottom: 4 }}>preview</div>
                  <div
                    style={{
                      background: '#161b22',
                      borderRadius: 3,
                      padding: 8,
                      color: storyColors.cream,
                      fontSize: 11,
                    }}
                  >
                    {codeStage < 0.45 ? 'Hello World' : 'React · Node · API'}
                  </div>
                  <div style={{ marginTop: 8, color: '#3fb950', fontSize: 8 }}>$ npm run dev</div>
                </div>
              </div>
            </Html>
          )}
        </group>
      </group>
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={walnut}>
        <circleGeometry args={[2.2, 48]} />
      </mesh>
    </group>
  )
}

/** Chapter 03: expanding creative workspace */
export function ExperimentWorkspace({ progress }: Props) {
  const group = useRef<THREE.Group>(null)
  const { charcoal, metal, cream, screen, amber } = useStoryMaterials()
  const appear = fadeInOut(progress, 0.24, 0.28, 0.34, 0.4)
  const t = rangeProgress(progress, 0.24, 0.33)

  const objects = useMemo(
    () => [
      { key: 'phone', at: 0.15, pos: [-0.85, 0.82, 0.25] as const, geo: 'phone' },
      { key: 'tablet', at: 0.3, pos: [0.75, 0.8, 0.1] as const, geo: 'tablet' },
      { key: 'monitor', at: 0.45, pos: [0.1, 1.05, -0.35] as const, geo: 'monitor' },
      { key: 'sketch', at: 0.6, pos: [-0.35, 0.78, 0.35] as const, geo: 'book' },
      { key: 'keys', at: 0.75, pos: [0.35, 0.78, 0.3] as const, geo: 'keys' },
      { key: 'notes', at: 0.9, pos: [-0.7, 0.78, -0.15] as const, geo: 'notes' },
    ],
    [],
  )

  useFrame(() => {
    if (!group.current) return
    group.current.visible = appear > 0.01
    group.current.scale.setScalar(lerp(0.9, 1, appear))
  })

  return (
    <group ref={group}>
      <Table width={2.6} depth={1.35} />
      {/* base laptop remnant */}
      <mesh position={[0, 0.78, 0]} material={charcoal} castShadow>
        <boxGeometry args={[0.7, 0.03, 0.45]} />
      </mesh>
      {objects.map((obj) => {
        const local = smoothstep(obj.at, obj.at + 0.12, t) * appear
        if (local < 0.02) return null
        return (
          <group key={obj.key} position={obj.pos} scale={lerp(0.2, 1, local)}>
            {obj.geo === 'phone' && (
              <>
                <mesh material={charcoal} castShadow>
                  <boxGeometry args={[0.18, 0.02, 0.36]} />
                </mesh>
                <mesh position={[0, 0.012, 0]} material={screen}>
                  <planeGeometry args={[0.15, 0.3]} />
                </mesh>
              </>
            )}
            {obj.geo === 'tablet' && (
              <>
                <mesh material={charcoal} castShadow>
                  <boxGeometry args={[0.42, 0.02, 0.3]} />
                </mesh>
                <mesh position={[0, 0.012, 0]} material={screen}>
                  <planeGeometry args={[0.38, 0.26]} />
                </mesh>
              </>
            )}
            {obj.geo === 'monitor' && (
              <>
                <mesh material={charcoal} castShadow>
                  <boxGeometry args={[0.7, 0.45, 0.04]} />
                </mesh>
                <mesh position={[0, 0, 0.025]} material={screen}>
                  <planeGeometry args={[0.64, 0.38]} />
                </mesh>
                <mesh position={[0, -0.3, 0]} material={metal}>
                  <boxGeometry args={[0.12, 0.15, 0.08]} />
                </mesh>
              </>
            )}
            {obj.geo === 'book' && (
              <mesh material={cream} castShadow rotation={[0, 0.3, 0]}>
                <boxGeometry args={[0.28, 0.02, 0.36]} />
              </mesh>
            )}
            {obj.geo === 'keys' && (
              <mesh material={charcoal} castShadow>
                <boxGeometry args={[0.4, 0.025, 0.14]} />
              </mesh>
            )}
            {obj.geo === 'notes' && (
              <mesh material={amber} castShadow rotation={[0, -0.4, 0]}>
                <boxGeometry args={[0.16, 0.01, 0.2]} />
              </mesh>
            )}
          </group>
        )
      })}
    </group>
  )
}

/** Chapter 04: floating 3D browser */
export function WebBrowser({ progress }: Props) {
  const group = useRef<THREE.Group>(null)
  const { charcoal, metal, glass, screen } = useStoryMaterials()
  const appear = fadeInOut(progress, 0.32, 0.37, 0.43, 0.49)
  const float = rangeProgress(progress, 0.33, 0.42)

  useFrame(({ clock }) => {
    if (!group.current) return
    group.current.visible = appear > 0.01
    group.current.position.y = lerp(-0.2, 0.6, appear) + Math.sin(clock.elapsedTime * 0.6) * 0.03
    group.current.rotation.y = lerp(0.4, -0.15, float)
    group.current.rotation.x = lerp(0.2, -0.08, float)
    group.current.scale.setScalar(lerp(0.6, 1.15, appear))
  })

  return (
    <group ref={group}>
      {/* Frame thickness */}
      <mesh castShadow material={charcoal}>
        <boxGeometry args={[2.4, 1.55, 0.08]} />
      </mesh>
      {/* Glass bevel */}
      <mesh position={[0, 0, 0.05]} material={glass}>
        <boxGeometry args={[2.28, 1.42, 0.02]} />
      </mesh>
      {/* Screen */}
      <mesh position={[0, -0.02, 0.055]} material={screen}>
        <planeGeometry args={[2.2, 1.28]} />
      </mesh>
      {/* Chrome bar */}
      <mesh position={[0, 0.68, 0.06]} material={metal}>
        <boxGeometry args={[2.2, 0.12, 0.01]} />
      </mesh>
      {appear > 0.25 && (
        <Html transform position={[0, -0.02, 0.07]} distanceFactor={1.6} style={{ width: 420, pointerEvents: 'none', opacity: appear }}>
          <div
            style={{
              width: 420,
              height: 240,
              background: 'linear-gradient(160deg, #1a1816 0%, #0f0e0d 100%)',
              borderRadius: 2,
              overflow: 'hidden',
              fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
              color: storyColors.cream,
            }}
          >
            <div style={{ display: 'flex', gap: 16, padding: '10px 16px', borderBottom: '1px solid rgba(239,238,233,0.12)', fontSize: 9, letterSpacing: '0.12em' }}>
              <span>KINGZCONNECT</span>
              <span style={{ opacity: 0.5 }}>WORK</span>
              <span style={{ opacity: 0.5 }}>STUDIO</span>
              <span style={{ opacity: 0.5 }}>CONTACT</span>
            </div>
            <div style={{ padding: '28px 16px 12px' }}>
              <div style={{ fontSize: 22, letterSpacing: '-0.02em', marginBottom: 6 }}>Built with intention.</div>
              <div style={{ fontSize: 10, opacity: 0.55, maxWidth: 220 }}>Interfaces that feel like places, not pages.</div>
            </div>
            <div style={{ display: 'flex', gap: 8, padding: '0 16px' }}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: 72,
                    background: i === 1 ? 'rgba(196,165,116,0.2)' : 'rgba(239,238,233,0.06)',
                    border: '1px solid rgba(239,238,233,0.08)',
                  }}
                />
              ))}
            </div>
            <div style={{ margin: '12px 16px', height: 22, width: 88, background: storyColors.amber, color: '#111', fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              EXPLORE
            </div>
          </div>
        </Html>
      )}
      {/* Soft shadow disc */}
      <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[1.4, 32]} />
        <meshBasicMaterial color="#000" transparent opacity={0.35 * appear} />
      </mesh>
    </group>
  )
}

/** Chapter 05: premium phone */
export function MobilePhone({ progress }: Props) {
  const group = useRef<THREE.Group>(null)
  const { charcoal, screen, metal } = useStoryMaterials()
  const appear = fadeInOut(progress, 0.41, 0.45, 0.52, 0.58)

  useFrame(({ clock }) => {
    if (!group.current) return
    group.current.visible = appear > 0.01
    group.current.position.set(lerp(2, 0, appear), lerp(0, 0.2, appear), 0)
    group.current.rotation.y = lerp(1.2, -0.25, appear) + Math.sin(clock.elapsedTime * 0.4) * 0.03
    group.current.rotation.x = 0.12
    group.current.scale.setScalar(lerp(0.5, 1.35, appear))
  })

  return (
    <group ref={group}>
      <mesh castShadow material={charcoal}>
        <boxGeometry args={[0.55, 1.15, 0.06]} />
      </mesh>
      <mesh position={[0, 0, 0.032]} material={screen}>
        <planeGeometry args={[0.48, 1.05]} />
      </mesh>
      <mesh position={[0, 0.52, 0.035]} material={metal}>
        <boxGeometry args={[0.12, 0.02, 0.01]} />
      </mesh>
      {appear > 0.2 && (
        <Html transform position={[0, 0, 0.04]} distanceFactor={1.05} style={{ width: 180, pointerEvents: 'none', opacity: appear }}>
          <div
            style={{
              width: 180,
              height: 360,
              background: '#121110',
              borderRadius: 18,
              padding: 14,
              color: storyColors.cream,
              fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ fontSize: 8, letterSpacing: '0.18em', opacity: 0.45, marginBottom: 12 }}>KINGZCONNECT</div>
            <div style={{ fontSize: 16, marginBottom: 14 }}>Today</div>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  height: 54,
                  marginBottom: 8,
                  background: 'rgba(239,238,233,0.05)',
                  border: '1px solid rgba(239,238,233,0.08)',
                  borderRadius: 8,
                  padding: 10,
                  fontSize: 10,
                }}
              >
                <div style={{ opacity: 0.5, fontSize: 8, marginBottom: 4 }}>CARD 0{i}</div>
                Activity stream
              </div>
            ))}
            <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
              {mobileTechLabels.map((label) => (
                <span
                  key={label}
                  style={{
                    fontSize: 7,
                    letterSpacing: '0.08em',
                    padding: '3px 6px',
                    border: '1px solid rgba(196,165,116,0.35)',
                    color: storyColors.amber,
                  }}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}

/** Chapter 06: infrastructure nodes */
export function SystemsViz({ progress }: Props) {
  const group = useRef<THREE.Group>(null)
  const lineRef = useRef<THREE.LineSegments>(null)
  const { charcoal, amber, metal } = useStoryMaterials()
  const appear = fadeInOut(progress, 0.5, 0.54, 0.61, 0.67)
  const nodes = useMemo(
    () => [
      { label: 'USER', y: 1.6 },
      { label: 'FRONTEND', y: 0.9 },
      { label: 'API', y: 0.2 },
      { label: 'SERVER', y: -0.5 },
      { label: 'DATABASE', y: -1.2 },
    ],
    [],
  )

  const lineGeo = useMemo(() => {
    const positions: number[] = []
    for (let i = 0; i < nodes.length - 1; i++) {
      positions.push(0, nodes[i].y - 0.18, 0, 0, nodes[i + 1].y + 0.18, 0)
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    return geo
  }, [nodes])

  useFrame(({ clock }) => {
    if (!group.current) return
    group.current.visible = appear > 0.01
    group.current.scale.setScalar(appear)
    if (lineRef.current) {
      const mat = lineRef.current.material as THREE.LineBasicMaterial
      mat.opacity = (0.35 + Math.sin(clock.elapsedTime * 2) * 0.15) * appear
    }
  })

  return (
    <group ref={group}>
      <lineSegments ref={lineRef} geometry={lineGeo}>
        <lineBasicMaterial color={storyColors.amber} transparent opacity={0.4} />
      </lineSegments>
      {nodes.map((n, i) => (
        <group key={n.label} position={[0, n.y, 0]}>
          <mesh castShadow material={i === 2 ? amber : charcoal}>
            <boxGeometry args={[0.7, 0.32, 0.35]} />
          </mesh>
          <mesh position={[0.42, 0, 0]} material={metal}>
            <boxGeometry args={[0.08, 0.2, 0.2]} />
          </mesh>
          <Html position={[0.95, 0, 0]} style={{ pointerEvents: 'none', whiteSpace: 'nowrap' }}>
            <span
              style={{
                color: storyColors.cream,
                fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                fontSize: 11,
                letterSpacing: '0.14em',
                opacity: 0.9,
              }}
            >
              {n.label}
            </span>
          </Html>
        </group>
      ))}
    </group>
  )
}

/** Chapter 07: abstract puzzle / architectural block */
export function ProblemPuzzle({ progress }: Props) {
  const group = useRef<THREE.Group>(null)
  const { charcoal, amber } = useStoryMaterials()
  const appear = fadeInOut(progress, 0.59, 0.63, 0.7, 0.76)
  const assemble = rangeProgress(progress, 0.6, 0.69)

  const pieces = useMemo(
    () => [
      { pos: [-0.35, 0.35, -0.2] as [number, number, number], size: [0.5, 0.5, 0.5] as [number, number, number], offset: [-1.2, 0.8, 0.4] as [number, number, number] },
      { pos: [0.3, 0.35, -0.15] as [number, number, number], size: [0.55, 0.5, 0.45] as [number, number, number], offset: [1.4, 0.6, -0.3] as [number, number, number] },
      { pos: [-0.1, 0.85, 0.1] as [number, number, number], size: [0.45, 0.4, 0.45] as [number, number, number], offset: [0.2, 1.5, 0.8] as [number, number, number] },
      { pos: [0.05, 0.2, 0.35] as [number, number, number], size: [0.4, 0.35, 0.4] as [number, number, number], offset: [-0.5, -0.8, 1.2] as [number, number, number] },
    ],
    [],
  )

  useFrame(() => {
    if (!group.current) return
    group.current.visible = appear > 0.01
    group.current.rotation.y = assemble * 0.5
  })

  return (
    <group ref={group}>
      {pieces.map((p, i) => {
        const t = smoothstep(i * 0.12, i * 0.12 + 0.35, assemble)
        const x = lerp(p.offset[0], p.pos[0], t)
        const y = lerp(p.offset[1], p.pos[1], t)
        const z = lerp(p.offset[2], p.pos[2], t)
        return (
          <mesh key={i} position={[x, y, z]} castShadow material={i === 2 ? amber : charcoal}>
            <boxGeometry args={p.size} />
          </mesh>
        )
      })}
      <pointLight position={[0.5, 1.5, 1]} intensity={appear * 1.2} color={storyColors.amber} distance={6} />
    </group>
  )
}

/** Chapter 08: floating project screens */
export function ProjectScreens({ progress }: Props) {
  const group = useRef<THREE.Group>(null)
  const { charcoal, screen, amber } = useStoryMaterials()
  const { onSelectProject, isMobile } = useStoryProgress()
  const appear = fadeInOut(progress, 0.68, 0.72, 0.79, 0.85)

  useFrame(({ clock }) => {
    if (!group.current) return
    group.current.visible = appear > 0.01
    group.current.rotation.y = Math.sin(clock.elapsedTime * 0.15) * 0.05
  })

  const count = isMobile ? 2 : 4
  const visible = storyProjects.slice(0, count)

  return (
    <group ref={group}>
      {visible.map((project, i) => {
        const angle = (i / visible.length) * Math.PI * 1.2 - 0.6
        const radius = isMobile ? 1.4 : 2.2
        const x = Math.sin(angle) * radius
        const z = Math.cos(angle) * radius - 0.5
        const y = (i % 2) * 0.35
        return (
          <group
            key={project.id}
            position={[x, y, z]}
            rotation={[0, -angle + Math.PI, 0]}
            scale={appear}
            onClick={(e) => {
              e.stopPropagation()
              onSelectProject(project)
            }}
            onPointerOver={() => {
              document.body.style.cursor = 'pointer'
            }}
            onPointerOut={() => {
              document.body.style.cursor = 'auto'
            }}
          >
            <mesh castShadow material={charcoal}>
              <boxGeometry args={[1.4, 0.95, 0.05]} />
            </mesh>
            <mesh position={[0, 0, 0.03]} material={screen}>
              <planeGeometry args={[1.28, 0.82]} />
            </mesh>
            <Html transform position={[0, 0, 0.04]} distanceFactor={1.4} style={{ width: 220, pointerEvents: 'none' }}>
              <div
                style={{
                  width: 220,
                  height: 140,
                  background: 'linear-gradient(145deg, #1c1a18, #0e0d0c)',
                  padding: 14,
                  color: storyColors.cream,
                  fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                  boxSizing: 'border-box',
                  borderTop: `2px solid ${storyColors.amber}`,
                }}
              >
                <div style={{ fontSize: 8, letterSpacing: '0.16em', color: storyColors.amber, marginBottom: 8 }}>
                  {project.category}
                </div>
                <div style={{ fontSize: 14, marginBottom: 6 }}>{project.name}</div>
                <div style={{ fontSize: 9, opacity: 0.5, lineHeight: 1.4 }}>{project.description.slice(0, 72)}…</div>
              </div>
            </Html>
            <mesh position={[0, -0.55, 0]} material={amber}>
              <boxGeometry args={[0.4, 0.02, 0.02]} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

/** Chapter 09: technology table / toolbox */
export function ToolboxTable({ progress }: Props) {
  const group = useRef<THREE.Group>(null)
  const { walnut, charcoal, amber, metal } = useStoryMaterials()
  const appear = fadeInOut(progress, 0.77, 0.81, 0.88, 0.93)
  const t = rangeProgress(progress, 0.78, 0.87)

  useFrame(() => {
    if (!group.current) return
    group.current.visible = appear > 0.01
    group.current.scale.setScalar(lerp(0.85, 1, appear))
  })

  return (
    <group ref={group}>
      <Table width={3.2} depth={1.5} />
      <mesh position={[0, 0.76, 0]} material={walnut}>
        <boxGeometry args={[2.8, 0.02, 1.1]} />
      </mesh>
      {toolboxItems.map((item, i) => {
        const local = smoothstep(i * 0.05, i * 0.05 + 0.2, t) * appear
        if (local < 0.02) return null
        const col = i % 4
        const row = Math.floor(i / 4)
        const x = -1.1 + col * 0.75
        const z = -0.35 + row * 0.4
        const kind = i % 3
        return (
          <group key={item} position={[x, 0.85 + (1 - local) * 0.4, z]} scale={local}>
            {kind === 0 && (
              <mesh material={charcoal} castShadow>
                <boxGeometry args={[0.5, 0.28, 0.08]} />
              </mesh>
            )}
            {kind === 1 && (
              <mesh material={metal} castShadow>
                <boxGeometry args={[0.35, 0.35, 0.35]} />
              </mesh>
            )}
            {kind === 2 && (
              <mesh material={amber} castShadow>
                <boxGeometry args={[0.42, 0.12, 0.28]} />
              </mesh>
            )}
            <Html position={[0, kind === 1 ? 0.28 : 0.22, 0.06]} center style={{ pointerEvents: 'none' }}>
              <span
                style={{
                  color: storyColors.cream,
                  fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                  fontSize: 10,
                  letterSpacing: '0.06em',
                  whiteSpace: 'nowrap',
                }}
              >
                {item}
              </span>
            </Html>
          </group>
        )
      })}
    </group>
  )
}

/** Chapter 10: developer workshop — from behind, three monitors, no front portrait */
export function WorkshopVignette({ progress }: Props) {
  const group = useRef<THREE.Group>(null)
  const { charcoal, walnut, screen, cream, metal, amber } = useStoryMaterials()
  const appear = smoothstep(0.86, 0.92, progress)

  useFrame(() => {
    if (!group.current) return
    group.current.visible = appear > 0.01
    group.current.position.z = lerp(4, 0, appear)
    group.current.scale.setScalar(lerp(0.9, 1, appear))
  })

  return (
    <group ref={group}>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow material={walnut}>
        <planeGeometry args={[12, 10]} />
      </mesh>
      {/* Desk */}
      <mesh position={[0, 0.75, -0.8]} castShadow receiveShadow material={walnut}>
        <boxGeometry args={[3.4, 0.08, 1.1]} />
      </mesh>
      {/* Three monitors */}
      {[-1.05, 0, 1.05].map((x, i) => (
        <group key={i} position={[x, 1.35, -1.15]} rotation={[0, x * -0.12, 0]}>
          <mesh material={charcoal} castShadow>
            <boxGeometry args={[0.95, 0.62, 0.05]} />
          </mesh>
          <mesh position={[0, 0, 0.03]} material={screen}>
            <planeGeometry args={[0.88, 0.54]} />
          </mesh>
          <mesh position={[0, -0.4, 0.05]} material={metal}>
            <boxGeometry args={[0.15, 0.2, 0.1]} />
          </mesh>
        </group>
      ))}
      {/* Developer from behind — hoodie silhouette, no face */}
      <group position={[0, 0.95, -0.25]}>
        {/* Torso */}
        <mesh material={charcoal} castShadow position={[0, 0.15, 0]}>
          <boxGeometry args={[0.55, 0.7, 0.28]} />
        </mesh>
        {/* Hood */}
        <mesh material={charcoal} castShadow position={[0, 0.62, -0.02]}>
          <sphereGeometry args={[0.2, 16, 12]} />
        </mesh>
        {/* Hoodie mark — amber strip suggesting KingzConnect branding */}
        <mesh material={amber} position={[0, 0.2, 0.145]}>
          <boxGeometry args={[0.28, 0.04, 0.01]} />
        </mesh>
        {/* Arms on desk */}
        <mesh material={charcoal} position={[-0.35, -0.05, 0.2]} rotation={[0.4, 0, 0.2]}>
          <boxGeometry args={[0.12, 0.12, 0.45]} />
        </mesh>
        <mesh material={charcoal} position={[0.35, -0.05, 0.2]} rotation={[0.4, 0, -0.2]}>
          <boxGeometry args={[0.12, 0.12, 0.45]} />
        </mesh>
      </group>
      {/* Bookshelf */}
      <group position={[-2.4, 1.4, -1.6]}>
        <mesh material={walnut} castShadow>
          <boxGeometry args={[0.8, 1.8, 0.35]} />
        </mesh>
        {[0.3, 0, -0.3, -0.6].map((y, i) => (
          <mesh key={i} position={[-0.1 + (i % 2) * 0.15, y, 0.1]} material={i % 2 ? cream : charcoal}>
            <boxGeometry args={[0.18, 0.28, 0.22]} />
          </mesh>
        ))}
      </group>
      {/* Plants */}
      <group position={[2.2, 0.9, -0.9]}>
        <mesh material={charcoal}>
          <cylinderGeometry args={[0.12, 0.1, 0.25, 12]} />
        </mesh>
        <mesh position={[0, 0.35, 0]} material={amber}>
          <sphereGeometry args={[0.22, 12, 12]} />
        </mesh>
      </group>
      {/* Window / city light plane */}
      <mesh position={[0, 2.2, -2.4]} material={screen}>
        <planeGeometry args={[6, 2.8]} />
      </mesh>
      <mesh position={[0, 2.2, -2.39]}>
        <planeGeometry args={[5.6, 2.4]} />
        <meshBasicMaterial color="#c8d4e0" transparent opacity={0.35 * appear} />
      </mesh>
    </group>
  )
}
