import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { useStoryMaterials, storyColors } from '../materials'

type LaptopProps = {
  openAmount?: number
  screenBright?: number
  showUI?: boolean
  codeStage?: number
  scale?: number
}

/** Realistic laptop using actual 3D model */
export function RealisticLaptop({
  openAmount = 1,
  screenBright = 0.4,
  showUI = true,
  codeStage = 0,
  scale = 1,
}: LaptopProps) {
  const lid = useRef<THREE.Group>(null)
  const mats = useStoryMaterials()
  const screenMat = useRef(mats.screenBright.clone())
  const [model, setModel] = useState<THREE.Group | null>(null)

  useEffect(() => {
    const loader = new GLTFLoader()
    loader.load('/models/laptop.glb', (gltf) => {
      const clonedScene = gltf.scene.clone()
      setModel(clonedScene)
    }, undefined, (error) => {
      console.error('Error loading laptop model:', error)
    })
  }, [])

  useFrame(() => {
    if (lid.current) {
      // Animate lid open/close based on progress
      lid.current.rotation.x = THREE.MathUtils.lerp(-Math.PI / 2, -0.15, openAmount)
    }
    screenMat.current.emissiveIntensity = 0.35 + screenBright * 1.2
  })

  const codeLines =
    codeStage < 0.4
      ? ['<div className="hero">', '  <h1>Hello World</h1>', '  <p>Curiosity.</p>', '</div>']
      : codeStage < 0.75
        ? ['import { createRoot } from "react-dom"', 'const App = () => <Hero />', 'createRoot(el).render(<App />)']
        : ['// React · Node · API · DB', 'app.use("/api", router)', 'await db.query(sql)', 'res.json(payload)']

  if (!model) {
    // Fallback to loading state
    return (
      <mesh scale={scale}>
        <boxGeometry args={[0.5, 0.3, 0.4]} />
        <meshStandardMaterial color="#333" />
      </mesh>
    )
  }

  return (
    <group scale={scale}>
      <primitive object={model} ref={lid} />

      {showUI && openAmount > 0.25 && (
        <Html
          transform
          position={[0, 0.15, 0]}
          distanceFactor={1.05}
          style={{ width: 300, height: 176, pointerEvents: 'none', opacity: Math.min(1, openAmount) }}
        >
          <LaptopIDE codeLines={codeLines} codeStage={codeStage} />
        </Html>
      )}
    </group>
  )
}

function LaptopIDE({ codeLines, codeStage }: { codeLines: string[]; codeStage: number }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#0d1117',
        borderRadius: 4,
        overflow: 'hidden',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        fontSize: 8,
        color: '#c9d1d9',
        display: 'grid',
        gridTemplateColumns: '68px 1fr 92px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ background: '#010409', padding: 5, borderRight: '1px solid #21262d' }}>
        <div style={{ color: '#8b949e', marginBottom: 5, fontSize: 6.5, letterSpacing: '0.05em' }}>EXPLORER</div>
        {['src', '  components', '  App.tsx', '  api.ts', '  hooks', 'public', 'package.json'].map((f) => (
          <div key={f} style={{ color: f.includes('.') ? '#79c0ff' : '#8b949e', marginBottom: 1.5, fontSize: 7 }}>
            {f}
          </div>
        ))}
      </div>
      <div style={{ padding: 6 }}>
        <div style={{ color: '#8b949e', marginBottom: 4, fontSize: 6.5, letterSpacing: '0.05em' }}>App.tsx — editor</div>
        <div style={{ marginBottom: 3, color: '#ff7b72', fontSize: 7 }}>{'import React from "react"'}</div>
        {codeLines.map((l) => (
          <div key={l} style={{ marginBottom: 1.5, color: l.includes('import') || l.includes('<') ? '#ff7b72' : l.includes('const') || l.includes('await') ? '#79c0ff' : '#c9d1d9', fontSize: 7 }}>
            {l}
          </div>
        ))}
        <div style={{ marginTop: 8, color: '#3fb950', fontSize: 6.5 }}>
          {codeStage < 0.4 ? '$ npm run dev — ready on :5173' : codeStage < 0.75 ? '$ npm run build — optimized' : '$ npm start — production'}
        </div>
      </div>
      <div style={{ background: '#161b22', padding: 5, borderLeft: '1px solid #21262d' }}>
        <div style={{ color: '#8b949e', marginBottom: 5, fontSize: 6.5, letterSpacing: '0.05em' }}>PREVIEW</div>
        <div
          style={{
            background: '#0d1117',
            borderRadius: 3,
            padding: 6,
            color: storyColors.cream,
            fontSize: 8,
            minHeight: 65,
            border: '1px solid #21262d',
          }}
        >
          {codeStage < 0.4 ? (
            <div>
              <div style={{ fontSize: 10, marginBottom: 2 }}>Hello World</div>
              <div style={{ fontSize: 6, opacity: 0.5 }}>v1.0.0</div>
            </div>
          ) : codeStage < 0.75 ? (
            <div>
              <div style={{ fontSize: 10, marginBottom: 2 }}>React App</div>
              <div style={{ fontSize: 6, opacity: 0.5 }}>v2.4.1</div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: 10, marginBottom: 2 }}>API · Live</div>
              <div style={{ fontSize: 6, opacity: 0.5, color: '#3fb950' }}>● Connected</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
