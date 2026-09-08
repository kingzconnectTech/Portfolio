import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Html, ContactShadows, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { useStoryProgress } from './StoryContext'
import { lerp, smoothstep, fadeInOut } from './math'
import { storyColors } from './materials'
import { RealisticLaptop } from './devices/Laptop'
import { RealisticPhone } from './devices/Phone'
import { RealisticMonitor } from './devices/Monitor'
import { RealisticKeyboard } from './devices/Keyboard'
import { RealisticMouse } from './devices/Mouse'
import { SystemsNetwork } from './devices/Server'
import { WalnutDesk, CoffeeMug, Notebook, Book, Headphones, TechPlaque } from './devices/Props'
import { RealisticEnvironment } from './devices/Environment'
import { storyProjects, toolboxItems } from '../../data/story'

/**
 * Continuous cinematic object chain.
 * Objects transform into the next idea — they do not hard-cut.
 */
export function StoryChain() {
  const { progress, isMobile, onSelectProject } = useStoryProgress()
  const root = useRef<THREE.Group>(null)

  // Enhanced chapter local drivers with smoother cinematic transitions
  const laptopAppear = smoothstep(0.03, 0.12, progress)
  const laptopOpen = smoothstep(0.1, 0.22, progress)
  const screenBright = smoothstep(0.12, 0.24, progress)
  const codeStage = smoothstep(0.14, 0.26, progress)
  const diveToScreen = smoothstep(0.2, 0.3, progress)
  const codeFloat = fadeInOut(progress, 0.22, 0.28, 0.32, 0.38)
  const workspaceAssemble = smoothstep(0.26, 0.38, progress)
  const browserGrow = smoothstep(0.32, 0.44, progress)
  const browserDominate = fadeInOut(progress, 0.34, 0.4, 0.48, 0.56)
  const phoneMorph = smoothstep(0.44, 0.56, progress)
  const phoneShow = fadeInOut(progress, 0.42, 0.5, 0.6, 0.68)
  const networkPulse = smoothstep(0.5, 0.6, progress)
  const systemsReveal = smoothstep(0.52, 0.64, progress)
  const systemsShow = fadeInOut(progress, 0.52, 0.58, 0.72, 0.8)
  const problemPhase = smoothstep(0.58, 0.72, progress)
  const projectsEmit = smoothstep(0.7, 0.82, progress)
  const projectsShow = fadeInOut(progress, 0.68, 0.76, 0.84, 0.92)
  const toolboxShow = fadeInOut(progress, 0.8, 0.86, 0.94, 0.98)
  const toolboxAssemble = smoothstep(0.82, 0.92, progress)
  const worldFade = 1 - smoothstep(0.9, 0.98, progress)

  const floatingBits = useMemo(
    () =>
      ['div', 'h1', 'React', 'API', 'useState', 'fetch', 'Node', 'CSS'].map((t, i) => ({
        t,
        x: ((i % 4) - 1.5) * 0.55,
        y: 1.2 + Math.floor(i / 4) * 0.35,
        z: -0.2 + (i % 3) * 0.15,
        rot: (i - 4) * 0.08,
      })),
    [],
  )

  useFrame(() => {
    if (!root.current) return
    root.current.visible = worldFade > 0.02
    root.current.scale.setScalar(lerp(0.92, 1, worldFade))
  })

  return (
    <group ref={root}>
      {/* Realistic environmental context */}
      <RealisticEnvironment showFloor={true} showWall={progress > 0.3 && progress < 0.7} scale={1} />

      {/* Ground disc for contact shadows */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[5, 48]} />
        <meshStandardMaterial color="#141210" roughness={0.9} metalness={0.05} />
      </mesh>

      {/* —— CURIOSITY / LEARNING: laptop on desk —— */}
      {progress < 0.4 && (
        <group
          position={[0, 0, 0]}
          scale={lerp(0.7, 1, laptopAppear)}
          visible={laptopAppear > 0.02 && browserGrow < 0.85}
        >
          <WalnutDesk width={1.9} depth={1.05} />
          <group position={[0, 0.78, 0.05]}>
            <RealisticLaptop
              openAmount={laptopOpen}
              screenBright={screenBright + diveToScreen * 0.5}
              showUI={diveToScreen < 0.85}
              codeStage={codeStage}
              scale={isMobile ? 0.95 : 1.05}
            />
          </group>
          {/* Dive: scale screen presence via floating code leaving the laptop */}
          {codeFloat > 0.05 &&
            floatingBits.map((b, i) => (
              <Html
                key={b.t}
                position={[
                  b.x * codeFloat,
                  lerp(1.15, b.y, codeFloat) + diveToScreen * 0.3,
                  lerp(0.1, b.z, codeFloat),
                ]}
                style={{
                  opacity: codeFloat * (1 - workspaceAssemble * 0.9),
                  pointerEvents: 'none',
                  color: storyColors.cream,
                  fontFamily: 'ui-monospace, Menlo, monospace',
                  fontSize: 11,
                  letterSpacing: '0.04em',
                  transform: `rotate(${b.rot * 20}deg)`,
                }}
              >
                {b.t}
              </Html>
            ))}
        </group>
      )}

      {/* —— EXPERIMENTATION: workspace assembles —— */}
      {progress > 0.22 && progress < 0.42 && (
        <group scale={lerp(0.85, 1, workspaceAssemble)} visible={workspaceAssemble > 0.05 && browserGrow < 0.7}>
          <WalnutDesk width={2.7} depth={1.4} />
          <group position={[0, 0.78, 0]}>
            <RealisticLaptop openAmount={1} screenBright={0.5} codeStage={1} scale={0.75} showUI={false} />
          </group>
          {/* Progressive object assembly */}
          <group
            position={[-0.9, 0.82, 0.25]}
            scale={smoothstep(0.15, 0.35, workspaceAssemble)}
            rotation={[0, 0.35, 0]}
          >
            <RealisticPhone showUI={false} scale={0.55} />
          </group>
          <group position={[0.85, 1.25, -0.35]} scale={smoothstep(0.3, 0.5, workspaceAssemble)}>
            <RealisticMonitor width={0.7} height={0.45} showUI uiVariant="ide" />
          </group>
          <group position={[0.35, 0.79, 0.35]} scale={smoothstep(0.45, 0.65, workspaceAssemble)} rotation={[0, -0.1, 0]}>
            <RealisticKeyboard scale={0.7} showCable={false} />
          </group>
          <group position={[0.65, 0.8, 0.18]} scale={smoothstep(0.5, 0.7, workspaceAssemble)} rotation={[0, 0.12, 0]}>
            <RealisticMouse scale={1.1} />
          </group>
          <group position={[-0.4, 0.8, 0.4]} scale={smoothstep(0.55, 0.7, workspaceAssemble)}>
            <Notebook rotation={0.35} />
          </group>
          <group position={[-0.75, 0.82, -0.2]} scale={smoothstep(0.65, 0.8, workspaceAssemble)}>
            <CoffeeMug />
          </group>
          <group position={[0.7, 0.82, 0.15]} scale={smoothstep(0.75, 0.9, workspaceAssemble)}>
            <Headphones scale={0.9} />
          </group>
          <group position={[1.0, 0.86, 0.2]} scale={smoothstep(0.85, 1, workspaceAssemble)}>
            <Book color="#2a2218" rotation={-0.25} />
          </group>
        </group>
      )}

      {/* —— THE WEB: browser grows from workspace UI —— */}
      {progress > 0.3 && progress < 0.52 && (
        <group
          position={[0, lerp(0.9, 0.55, browserGrow), 0]}
          scale={lerp(0.35, 1.2, browserGrow) * browserDominate}
          rotation={[lerp(0.25, -0.08, browserGrow), lerp(0.5, -0.12, browserGrow), 0]}
          visible={browserDominate > 0.02}
        >
          <FloatingBrowser />
        </group>
      )}

      {/* —— MOBILE: browser compresses into phone chassis —— */}
      {progress > 0.4 && progress < 0.62 && (
        <group
          position={[
            lerp(0.8, 0, phoneMorph),
            lerp(0.5, 0.25, phoneMorph),
            0,
          ]}
          scale={lerp(0.4, isMobile ? 1.2 : 1.45, phoneMorph) * phoneShow}
          rotation={[0.1, lerp(1.1, -0.28, phoneMorph), 0]}
          visible={phoneShow > 0.02}
        >
          <RealisticPhone showUI networkPulse={networkPulse} />
        </group>
      )}

      {/* —— SYSTEMS: lines from phone into infrastructure —— */}
      {progress > 0.48 && progress < 0.75 && (
        <group
          position={[0, 0.2, 0]}
          scale={systemsReveal * systemsShow}
          visible={systemsShow > 0.02}
        >
          <SystemsNetwork progress={progress} problemPhase={problemPhase} />
        </group>
      )}

      {/* —— PROJECTS: system outputs become product screens —— */}
      {progress > 0.65 && progress < 0.88 && (
        <group visible={projectsShow > 0.02} scale={projectsShow}>
          {storyProjects.slice(0, isMobile ? 2 : 4).map((project, i) => {
            const t = smoothstep(i * 0.08, i * 0.08 + 0.35, projectsEmit)
            const angle = (i / 4) * Math.PI * 1.15 - 0.5
            const radius = lerp(0.3, isMobile ? 1.3 : 2.1, t)
            return (
              <group
                key={project.id}
                position={[Math.sin(angle) * radius, (i % 2) * 0.3 * t, Math.cos(angle) * radius - 0.4]}
                rotation={[0, -angle + Math.PI, 0]}
                scale={t}
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
                <RoundedBox args={[1.35, 0.9, 0.05]} radius={0.02} castShadow>
                  <meshStandardMaterial color="#1a1c20" roughness={0.4} metalness={0.6} />
                </RoundedBox>
                <Html transform position={[0, 0, 0.04]} distanceFactor={1.35} style={{ width: 210, pointerEvents: 'none' }}>
                  <div
                    style={{
                      width: 210,
                      height: 130,
                      background: 'linear-gradient(145deg,#1c1a18,#0e0d0c)',
                      padding: 12,
                      color: storyColors.cream,
                      fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                      borderTop: `2px solid ${storyColors.amber}`,
                      boxSizing: 'border-box',
                    }}
                  >
                    <div style={{ fontSize: 8, letterSpacing: '0.16em', color: storyColors.amber }}>{project.category}</div>
                    <div style={{ fontSize: 13, marginTop: 6 }}>{project.name}</div>
                    <div style={{ fontSize: 9, opacity: 0.5, marginTop: 6, lineHeight: 1.35 }}>
                      {project.description.slice(0, 70)}…
                    </div>
                  </div>
                </Html>
              </group>
            )
          })}
        </group>
      )}

      {/* —— TOOLBOX —— */}
      {progress > 0.75 && progress < 0.96 && (
        <group scale={toolboxShow} visible={toolboxShow > 0.02}>
          <WalnutDesk width={3.1} depth={1.45} />
          {toolboxItems.map((item, i) => {
            const local = smoothstep(i * 0.045, i * 0.045 + 0.22, toolboxAssemble)
            if (local < 0.02) return null
            const col = i % 4
            const row = Math.floor(i / 4)
            return (
              <group
                key={item}
                position={[-1.05 + col * 0.7, 0.9 + (1 - local) * 0.35, -0.3 + row * 0.38]}
                scale={local}
                rotation={[0, (i % 3) * 0.04 - 0.04, 0]}
              >
                <TechPlaque label={item} kind={i % 3} />
              </group>
            )
          })}
          <group position={[1.1, 0.82, 0.35]} scale={toolboxAssemble}>
            <RealisticKeyboard scale={0.65} />
          </group>
          <group position={[0.7, 0.82, 0.22]} scale={toolboxAssemble} rotation={[0, 0.1, 0]}>
            <RealisticMouse />
          </group>
          <group position={[-1.2, 0.86, 0.4]} scale={toolboxAssemble}>
            <CoffeeMug />
          </group>
        </group>
      )}
    </group>
  )
}

function FloatingBrowser() {
  const mats = useMemo(() => null, [])
  void mats
  return (
    <group>
      <RoundedBox args={[2.35, 1.5, 0.07]} radius={0.02} smoothness={4} castShadow>
        <meshStandardMaterial color="#2a2c30" roughness={0.35} metalness={0.8} />
      </RoundedBox>
      <RoundedBox args={[2.22, 1.28, 0.02]} radius={0.01} position={[0, -0.04, 0.04]}>
        <meshPhysicalMaterial
          color="#a8b0b8"
          roughness={0.1}
          metalness={0.05}
          transmission={0.4}
          thickness={0.3}
          transparent
          opacity={0.75}
        />
      </RoundedBox>
      <mesh position={[0, -0.04, 0.05]}>
        <planeGeometry args={[2.15, 1.2]} />
        <meshStandardMaterial color="#0a1628" emissive="#1e3a5f" emissiveIntensity={0.5} roughness={0.2} />
      </mesh>
      {/* Chrome bar */}
      <mesh position={[0, 0.66, 0.045]}>
        <boxGeometry args={[2.15, 0.1, 0.01]} />
        <meshStandardMaterial color="#3a3d42" metalness={0.7} roughness={0.35} />
      </mesh>
      <Html transform position={[0, -0.04, 0.06]} distanceFactor={1.55} style={{ width: 400, pointerEvents: 'none' }}>
        <div
          style={{
            width: 400,
            height: 230,
            background: 'linear-gradient(160deg,#1a1816,#0f0e0d)',
            color: storyColors.cream,
            fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 14,
              padding: '10px 14px',
              borderBottom: '1px solid rgba(239,238,233,0.12)',
              fontSize: 9,
              letterSpacing: '0.12em',
            }}
          >
            <span>KINGZCONNECT</span>
            <span style={{ opacity: 0.45 }}>WORK</span>
            <span style={{ opacity: 0.45 }}>STUDIO</span>
            <span style={{ opacity: 0.45 }}>CONTACT</span>
          </div>
          <div style={{ padding: '26px 14px 10px' }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>Built with intention.</div>
            <div style={{ fontSize: 10, opacity: 0.5, maxWidth: 220 }}>Interfaces that feel like places, not pages.</div>
          </div>
          <div style={{ display: 'flex', gap: 8, padding: '0 14px' }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: 64,
                  background: i === 1 ? 'rgba(196,165,116,0.2)' : 'rgba(239,238,233,0.06)',
                  border: '1px solid rgba(239,238,233,0.08)',
                }}
              />
            ))}
          </div>
          <div
            style={{
              margin: '12px 14px',
              height: 22,
              width: 90,
              background: storyColors.amber,
              color: '#111',
              fontSize: 9,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            EXPLORE
          </div>
        </div>
      </Html>
      <mesh position={[0, -1.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.3, 32]} />
        <meshBasicMaterial color="#000" transparent opacity={0.3} />
      </mesh>
    </group>
  )
}

/** Scroll-scrubbed cinematic camera with product-shot composition */
export function StoryCamera() {
  const { progress, isMobile, reducedMotion } = useStoryProgress()
  const target = useRef(new THREE.Vector3())
  const look = useRef(new THREE.Vector3())

  useFrame(({ camera }, dt) => {
    const p = progress
    let x = 0
    let y = 1.25
    let z = 4.5
    let lx = 0
    let ly = 0.85
    let lz = 0

    if (p < 0.06) {
      const t = smoothstep(0, 0.06, p)
      y = lerp(1.5, 1.2, t)
      z = lerp(5.8, 4.2, t)
    } else if (p < 0.18) {
      const t = smoothstep(0.06, 0.18, p)
      // Move closer to laptop for product shot
      x = lerp(0, isMobile ? 0.3 : 0.5, t)
      y = lerp(1.2, 1.0, t)
      z = lerp(4.2, 2.2, t)
      ly = lerp(0.85, 1.05, t)
    } else if (p < 0.26) {
      // Dolly into laptop screen - close-up shot
      const t = smoothstep(0.18, 0.26, p)
      x = lerp(isMobile ? 0.3 : 0.5, 0, t)
      y = lerp(1.0, 1.2, t)
      z = lerp(2.2, 1.2, t)
      ly = lerp(1.05, 1.25, t)
      lz = lerp(0, -0.1, t)
    } else if (p < 0.33) {
      // Pull back to reveal workspace
      const t = smoothstep(0.26, 0.33, p)
      x = 0
      y = lerp(1.2, 1.6, t)
      z = lerp(1.2, 4.2, t)
      ly = lerp(1.25, 1.1, t)
    } else if (p < 0.42) {
      // Focus on browser/monitor
      const t = smoothstep(0.33, 0.42, p)
      x = lerp(0, -0.3, t)
      y = lerp(1.6, 1.1, t)
      z = lerp(4.2, 3.5, t)
      ly = 0.8
    } else if (p < 0.51) {
      // Phone enters - close-up shot
      const t = smoothstep(0.42, 0.51, p)
      x = lerp(-0.3, 0.4, t)
      y = lerp(1.1, 1.0, t)
      z = lerp(3.5, 2.8, t)
      ly = 0.6
    } else if (p < 0.6) {
      // Pull back to reveal systems
      const t = smoothstep(0.51, 0.6, p)
      x = lerp(0.4, 1.2, t)
      y = lerp(1.0, 0.4, t)
      z = lerp(2.8, 4.8, t)
      ly = 0.2
    } else if (p < 0.7) {
      // Focus on problem solving
      const t = smoothstep(0.6, 0.7, p)
      x = lerp(1.2, 0.5, t)
      y = lerp(0.4, 0.55, t)
      z = lerp(4.8, 4.2, t)
      ly = 0.15
    } else if (p < 0.78) {
      // Projects wide shot
      const t = smoothstep(0.7, 0.78, p)
      x = lerp(0.5, 0, t)
      y = lerp(0.55, 1.3, t)
      z = lerp(4.2, 5.2, t)
      ly = 0.65
    } else if (p < 0.88) {
      // Toolbox - wider view
      const t = smoothstep(0.78, 0.88, p)
      x = 0
      y = lerp(1.3, 1.6, t)
      z = lerp(5.2, 4.5, t)
      ly = 1.0
    } else {
      // TODAY - settle into calm shot
      const t = smoothstep(0.88, 0.98, p)
      x = 0
      y = lerp(1.6, 1.4, t)
      z = lerp(4.5, 5.8, t)
      ly = lerp(1.0, 0.85, t)
    }

    if (isMobile) {
      z *= 1.15
      y += 0.1
    }

    target.current.set(x, y, z)
    look.current.set(lx, ly, lz)

    if (reducedMotion) {
      camera.position.copy(target.current)
      camera.lookAt(look.current)
    } else {
      const k = 1 - Math.exp(-3.5 * dt)
      camera.position.lerp(target.current, k)
      const curLook = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion).add(camera.position)
      curLook.lerp(look.current, k)
      camera.lookAt(curLook)
    }
  })

  return null
}

export function StoryLighting() {
  const { progress, isMobile } = useStoryProgress()
  const warm = 1 - smoothstep(0.88, 0.96, progress)
  const daylight = smoothstep(0.75, 0.9, progress) * (1 - smoothstep(0.92, 0.99, progress))

  return (
    <>
      <ambientLight intensity={0.28 + daylight * 0.2} color="#cfc8bc" />
      <directionalLight
        position={[4.5, 6.5, 3.5]}
        intensity={0.7 + daylight * 0.5}
        color="#fff4e6"
        castShadow={!isMobile}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0002}
      />
      <directionalLight position={[-3, 2.5, -2]} intensity={0.2 * warm} color="#7a8a9a" />
      <pointLight position={[0, 2.4, 1.2]} intensity={0.35 * warm} color={storyColors.amber} distance={9} />
      <spotLight position={[1.5, 3.5, 2]} angle={0.45} penumbra={0.7} intensity={0.4 * warm} color="#ffe8c8" />
      {!isMobile && <Environment preset="warehouse" />}
      <ContactShadows position={[0, 0.01, 0]} opacity={0.45 * warm} scale={14} blur={2.8} far={5} />
      <fog attach="fog" args={[storyColors.charcoalDeep, isMobile ? 7 : 9, isMobile ? 16 : 20]} />
    </>
  )
}