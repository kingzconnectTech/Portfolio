import * as THREE from 'three'

export type NormalizeOptions = {
  /** Fit longest axis to this size (meters) */
  targetSize: number
  /** Sit the model on y=0 (bottom of bbox) */
  ground?: boolean
  /** Center XZ on origin */
  centerXZ?: boolean
  castShadow?: boolean
  receiveShadow?: boolean
}

/**
 * Bring wildly inconsistent GLB unit scales into shared meter space.
 * Does not "fake" proximity — it restores realistic physical proportions
 * so the camera path can frame objects consistently.
 */
export function normalizeGltfScene(
  source: THREE.Object3D,
  {
    targetSize,
    ground = true,
    centerXZ = true,
    castShadow = true,
    receiveShadow = true,
  }: NormalizeOptions,
): THREE.Group {
  const root = new THREE.Group()
  const model = source.clone(true)

  model.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.castShadow = castShadow
      obj.receiveShadow = receiveShadow
      if (obj.material) {
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
        mats.forEach((m) => {
          m.side = THREE.FrontSide
          m.needsUpdate = true
        })
      }
    }
  })

  root.add(model)

  // First pass — measure raw
  root.updateMatrixWorld(true)
  const box = new THREE.Box3().setFromObject(root)
  const size = new THREE.Vector3()
  box.getSize(size)
  const maxDim = Math.max(size.x, size.y, size.z, 1e-6)
  const s = targetSize / maxDim
  root.scale.setScalar(s)

  root.updateMatrixWorld(true)
  const fitted = new THREE.Box3().setFromObject(root)
  const center = new THREE.Vector3()
  fitted.getCenter(center)

  if (centerXZ) {
    root.position.x -= center.x
    root.position.z -= center.z
  }
  if (ground) {
    root.position.y -= fitted.min.y
  } else {
    root.position.y -= center.y
  }

  return root
}

/** Distance for subject size to fill ~fraction of vertical FOV */
export function framingDistance(subjectSize: number, fovDeg: number, fill = 0.6) {
  const half = THREE.MathUtils.degToRad(fovDeg * 0.5)
  return (subjectSize * 0.5) / Math.tan(half) / fill
}
