import * as THREE from 'three'

/** KingzConnect story palette — charcoal, walnut, amber, anodized metal */
export const storyColors = {
  charcoal: '#1a1a1a',
  charcoalDeep: '#0c0c0c',
  charcoalMid: '#2a2a2a',
  walnut: '#3d2914',
  walnutLight: '#5c3d22',
  plaster: '#2e2c2a',
  cream: '#efeee9',
  amber: '#c4a574',
  bronze: '#8a7048',
  glass: '#c5ccd3',
  screen: '#070b12',
  screenGlow: '#152238',
  warmLight: '#ffe8c8',
  daylight: '#f2f0ea',
  anodized: '#2c2e32',
  anodizedLight: '#3a3d42',
  spaceGray: '#1d1f23',
  keycap: '#2a2c30',
  ceramic: '#e8e4dc',
}

type StoryMats = {
  charcoal: THREE.MeshStandardMaterial
  metal: THREE.MeshStandardMaterial
  anodized: THREE.MeshStandardMaterial
  anodizedDark: THREE.MeshStandardMaterial
  metalFine: THREE.MeshStandardMaterial
  walnut: THREE.MeshStandardMaterial
  walnutDark: THREE.MeshStandardMaterial
  cream: THREE.MeshStandardMaterial
  amber: THREE.MeshStandardMaterial
  glass: THREE.MeshPhysicalMaterial
  screen: THREE.MeshStandardMaterial
  screenBright: THREE.MeshStandardMaterial
  rubber: THREE.MeshStandardMaterial
  keycap: THREE.MeshStandardMaterial
  ceramic: THREE.MeshStandardMaterial
  paper: THREE.MeshStandardMaterial
  ledOn: THREE.MeshStandardMaterial
  ledOff: THREE.MeshStandardMaterial
  plasticDark: THREE.MeshStandardMaterial
}

let cache: StoryMats | null = null

function createMaterials(): StoryMats {
  return {
    charcoal: new THREE.MeshStandardMaterial({
      color: storyColors.charcoal,
      roughness: 0.72,
      metalness: 0.08,
    }),
    metal: new THREE.MeshStandardMaterial({
      color: '#3a3a3a',
      roughness: 0.35,
      metalness: 0.75,
    }),
    anodized: new THREE.MeshStandardMaterial({
      color: storyColors.anodized,
      roughness: 0.32,
      metalness: 0.88,
      envMapIntensity: 1.2,
    }),
    anodizedDark: new THREE.MeshStandardMaterial({
      color: storyColors.spaceGray,
      roughness: 0.38,
      metalness: 0.9,
      envMapIntensity: 1.1,
    }),
    metalFine: new THREE.MeshStandardMaterial({
      color: '#4a4e55',
      roughness: 0.22,
      metalness: 0.94,
      envMapIntensity: 1.3,
    }),
    walnut: new THREE.MeshStandardMaterial({
      color: storyColors.walnut,
      roughness: 0.58,
      metalness: 0.04,
      envMapIntensity: 0.4,
    }),
    walnutDark: new THREE.MeshStandardMaterial({
      color: '#2a1a0e',
      roughness: 0.65,
      metalness: 0.03,
    }),
    cream: new THREE.MeshStandardMaterial({
      color: storyColors.cream,
      roughness: 0.85,
      metalness: 0,
    }),
    amber: new THREE.MeshStandardMaterial({
      color: storyColors.amber,
      roughness: 0.35,
      metalness: 0.38,
      emissive: storyColors.amber,
      emissiveIntensity: 0.15,
    }),
    glass: new THREE.MeshPhysicalMaterial({
      color: storyColors.glass,
      roughness: 0.04,
      metalness: 0,
      transmission: 0.6,
      thickness: 0.45,
      transparent: true,
      opacity: 0.88,
      envMapIntensity: 1.5,
      clearcoat: 1,
      clearcoatRoughness: 0.06,
    }),
    screen: new THREE.MeshStandardMaterial({
      color: storyColors.screen,
      roughness: 0.15,
      metalness: 0.12,
      emissive: storyColors.screenGlow,
      emissiveIntensity: 0.4,
    }),
    screenBright: new THREE.MeshStandardMaterial({
      color: storyColors.screen,
      roughness: 0.1,
      metalness: 0.08,
      emissive: '#1a3355',
      emissiveIntensity: 0.95,
    }),
    rubber: new THREE.MeshStandardMaterial({
      color: '#111111',
      roughness: 0.95,
      metalness: 0.04,
    }),
    keycap: new THREE.MeshStandardMaterial({
      color: storyColors.keycap,
      roughness: 0.5,
      metalness: 0.18,
    }),
    ceramic: new THREE.MeshStandardMaterial({
      color: storyColors.ceramic,
      roughness: 0.3,
      metalness: 0.05,
      envMapIntensity: 0.7,
    }),
    paper: new THREE.MeshStandardMaterial({
      color: '#f0ebe3',
      roughness: 0.92,
      metalness: 0,
    }),
    ledOn: new THREE.MeshStandardMaterial({
      color: '#3dff8a',
      emissive: '#3dff8a',
      emissiveIntensity: 1.5,
      roughness: 0.25,
      metalness: 0.25,
    }),
    ledOff: new THREE.MeshStandardMaterial({
      color: '#1a221c',
      emissive: '#000000',
      emissiveIntensity: 0,
      roughness: 0.55,
      metalness: 0.25,
    }),
    plasticDark: new THREE.MeshStandardMaterial({
      color: '#16181c',
      roughness: 0.5,
      metalness: 0.25,
    }),
  }
}

export function useStoryMaterials() {
  if (!cache) cache = createMaterials()
  return cache
}

/** Legacy alias used by older props */
export function useStoryMaterialsLegacy() {
  const m = useStoryMaterials()
  return {
    charcoal: m.anodizedDark,
    walnut: m.walnut,
    metal: m.metalFine,
    cream: m.cream,
    amber: m.amber,
    glass: m.glass,
    screen: m.screen,
  }
}
