type EnvironmentProps = {
  showFloor?: boolean
  showWall?: boolean
  scale?: number
}

/** Realistic environmental context — floors, walls, architectural elements */
export function RealisticEnvironment({ showFloor = true, showWall = false, scale = 1 }: EnvironmentProps) {
  return (
    <group scale={scale}>
      {/* Dark walnut floor with realistic material */}
      {showFloor && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[15, 15]} />
          <meshStandardMaterial
            color="#2a1a0e"
            roughness={0.65}
            metalness={0.02}
          />
        </mesh>
      )}

      {/* Charcoal stone wall */}
      {showWall && (
        <mesh position={[0, 3, -5]} receiveShadow>
          <planeGeometry args={[15, 6]} />
          <meshStandardMaterial
            color="#1a1a1a"
            roughness={0.8}
            metalness={0.05}
          />
        </mesh>
      )}

      {/* Subtle architectural baseboard */}
      {showWall && (
        <mesh position={[0, 0.15, -4.95]} receiveShadow>
          <boxGeometry args={[15, 0.3, 0.15]} />
          <meshStandardMaterial
            color="#2a2a2a"
            roughness={0.7}
            metalness={0.03}
          />
        </mesh>
      )}
    </group>
  )
}
