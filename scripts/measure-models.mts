/**
 * One-shot: measure GLB bounding boxes used by the Story.
 * Run: npx tsx scripts/measure-models.mts
 */
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const files = [
  'laptop.glb',
  'smartphone.glb',
  'monitor.glb',
  'keyboard.glb',
  'server.glb',
  'desk.glb',
  'mug.glb',
  'mouse.glb',
]

async function measure(path: string) {
  const loader = new GLTFLoader()
  const buffer = readFileSync(path)
  const ab = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)

  const gltf = await new Promise<Awaited<ReturnType<GLTFLoader['parseAsync']>>>((resolve, reject) => {
    loader.parse(ab, '', resolve, reject)
  })

  const box = new THREE.Box3().setFromObject(gltf.scene)
  const size = new THREE.Vector3()
  const center = new THREE.Vector3()
  box.getSize(size)
  box.getCenter(center)
  return {
    file: path.split(/[/\\]/).pop(),
    min: box.min.toArray().map((n) => +n.toFixed(4)),
    max: box.max.toArray().map((n) => +n.toFixed(4)),
    size: size.toArray().map((n) => +n.toFixed(4)),
    center: center.toArray().map((n) => +n.toFixed(4)),
    maxDim: +Math.max(size.x, size.y, size.z).toFixed(4),
  }
}

const results = []
for (const f of files) {
  const candidates = [
    join(root, 'public', 'models', f),
    join(root, 'src', 'assets', 'models', f),
  ]
  const path = candidates.find((p) => {
    try {
      readFileSync(p)
      return true
    } catch {
      return false
    }
  })
  if (!path) {
    results.push({ file: f, error: 'not found' })
    continue
  }
  try {
    results.push(await measure(path))
  } catch (e) {
    results.push({ file: f, error: String(e) })
  }
}

console.log(JSON.stringify(results, null, 2))
