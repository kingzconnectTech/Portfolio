import { useMemo, useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Html } from '@react-three/drei'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { useStoryMaterials, storyColors } from '../materials'
import { normalizeGltfScene } from '../normalizeGltf'

type NodeStatus = 'on' | 'off' | 'warn'

type ServerRackProps = {
  status?: NodeStatus
  label?: string
  scale?: number
}

export function RealisticServerRack({
  status = 'on',
  label = 'SERVER',
  scale = 1,
}: ServerRackProps) {
  const mats = useStoryMaterials()
  const led = status === 'on' ? mats.ledOn : status === 'warn' ? mats.amber : mats.ledOff
  const [model, setModel] = useState<THREE.Group | null>(null)

  useEffect(() => {
    const loader = new GLTFLoader()
    loader.load(
      '/models/server.glb',
      (gltf) => {
        setModel(
          normalizeGltfScene(gltf.scene, {
            targetSize: 0.55,
            ground: true,
            centerXZ: true,
          }),
        )
      },
      undefined,
      (error) => {
        console.error('Error loading server model:', error)
      },
    )
  }, [])

  if (!model) {
    return (
      <group scale={scale}>
        <RoundedBox
          args={[0.88, 0.4, 0.58]}
          radius={0.015}
          smoothness={4}
          castShadow
          receiveShadow
          material={mats.anodizedDark}
        />
      </group>
    )
  }

  return (
    <group scale={scale}>
      <primitive object={model} />

      <group position={[0.22, 0.18, 0.2]}>
        {[-0.04, 0, 0.04].map((y, i) => (
          <mesh key={i} position={[0, y, 0]} material={i === 0 ? led : mats.ledOn}>
            <sphereGeometry args={[0.008, 12, 12]} />
          </mesh>
        ))}
      </group>

      <Html position={[0.38, 0.2, 0]} style={{ pointerEvents: 'none', whiteSpace: 'nowrap' }}>
        <span
          style={{
            color: storyColors.cream,
            fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
            fontSize: 11,
            letterSpacing: '0.14em',
            opacity: 0.85,
          }}
        >
          {label}
        </span>
      </Html>
    </group>
  )
}

type DatabaseUnitProps = {
  status?: NodeStatus
  scale?: number
}

export function RealisticDatabase({ status = 'on', scale = 1 }: DatabaseUnitProps) {
  const mats = useStoryMaterials()
  const led = status === 'on' ? mats.ledOn : status === 'off' ? mats.ledOff : mats.amber

  return (
    <group scale={scale}>
      <RoundedBox args={[0.9, 0.5, 0.6]} radius={0.014} smoothness={3} castShadow material={mats.anodized} />
      {Array.from({ length: 6 }).map((_, i) => (
        <RoundedBox
          key={i}
          args={[0.38, 0.055, 0.5]}
          radius={0.004}
          position={[-0.2 + (i % 2) * 0.4, 0.16 - Math.floor(i / 2) * 0.14, 0]}
          material={mats.anodizedDark}
        />
      ))}
      <mesh position={[0.38, 0.15, 0.31]} material={led}>
        <sphereGeometry args={[0.015, 12, 12]} />
      </mesh>
      <Html position={[0.6, 0, 0]} style={{ pointerEvents: 'none', whiteSpace: 'nowrap' }}>
        <span
          style={{
            color: storyColors.cream,
            fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
            fontSize: 11,
            letterSpacing: '0.14em',
          }}
        >
          DATABASE
        </span>
      </Html>
    </group>
  )
}

type SystemsNetworkProps = {
  progress: number
  problemPhase: number
}

export function SystemsNetwork({ progress, problemPhase }: SystemsNetworkProps) {
  const group = useRef<THREE.Group>(null)
  const lineRef = useRef<THREE.LineSegments>(null)
  const mats = useStoryMaterials()

  const nodes = useMemo(
    () => [
      { id: 'user', label: 'USER', y: 1.55, kind: 'user' as const },
      { id: 'api', label: 'API', y: 0.75, kind: 'api' as const },
      { id: 'server', label: 'SERVER', y: 0, kind: 'server' as const },
      { id: 'db', label: 'DATABASE', y: -0.95, kind: 'db' as const },
    ],
    [],
  )

  const lineGeo = useMemo(() => {
    const pos: number[] = []
    for (let i = 0; i < nodes.length - 1; i++) {
      pos.push(0, nodes[i].y - 0.22, 0, 0, nodes[i + 1].y + 0.22, 0)
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    return g
  }, [nodes])

  const dbStatus: NodeStatus =
    problemPhase > 0.35 && problemPhase < 0.65
      ? 'off'
      : problemPhase >= 0.35 && problemPhase < 0.7
        ? 'warn'
        : 'on'
  const lineBroken = problemPhase > 0.38 && problemPhase < 0.62

  useFrame(({ clock }) => {
    if (lineRef.current) {
      const mat = lineRef.current.material as THREE.LineBasicMaterial
      mat.color.set(lineBroken ? '#664422' : storyColors.amber)
      mat.opacity = lineBroken ? 0.15 : 0.35 + Math.sin(clock.elapsedTime * 2.2) * 0.15
    }
  })

  void progress

  return (
    <group ref={group}>
      <lineSegments ref={lineRef} geometry={lineGeo}>
        <lineBasicMaterial color={storyColors.amber} transparent opacity={0.4} />
      </lineSegments>

      <group position={[0, nodes[0].y, 0]}>
        <RoundedBox args={[0.35, 0.55, 0.06]} radius={0.04} smoothness={4} material={mats.anodized} castShadow />
        <Html position={[0.45, 0, 0]} style={{ pointerEvents: 'none' }}>
          <StatusLabel label="USER" ok />
        </Html>
      </group>

      <group position={[0, nodes[1].y, 0]}>
        <RoundedBox args={[0.7, 0.28, 0.35]} radius={0.02} smoothness={3} material={mats.amber} castShadow />
        {Array.from({ length: 4 }).map((_, i) => (
          <mesh key={i} position={[-0.2 + i * 0.12, 0, 0.18]} material={mats.ledOn}>
            <boxGeometry args={[0.04, 0.04, 0.02]} />
          </mesh>
        ))}
        <Html position={[0.55, 0, 0]} style={{ pointerEvents: 'none' }}>
          <StatusLabel label="API" ok />
        </Html>
      </group>

      <group position={[0, nodes[2].y, 0]}>
        <RealisticServerRack status="on" label="SERVER" scale={0.85} />
      </group>

      <group position={[0, nodes[3].y, 0]}>
        <RealisticDatabase status={dbStatus} scale={0.75} />
        <Html position={[0.7, 0.35, 0]} style={{ pointerEvents: 'none' }}>
          <StatusLabel label="DATABASE" ok={dbStatus === 'on'} />
        </Html>
      </group>
    </group>
  )
}

function StatusLabel({ label, ok }: { label: string; ok: boolean }) {
  return (
    <span
      style={{
        color: storyColors.cream,
        fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
        fontSize: 11,
        letterSpacing: '0.14em',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ color: ok ? '#3dff8a' : '#664422', marginRight: 6 }}>{ok ? '●' : '○'}</span>
      {label}
    </span>
  )
}
