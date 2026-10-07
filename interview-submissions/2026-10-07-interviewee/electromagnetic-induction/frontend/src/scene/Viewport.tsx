import { useEffect, useLayoutEffect, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Grid, GizmoHelper, GizmoViewport, OrbitControls, OrthographicCamera, PerspectiveCamera } from '@react-three/drei'
import { MOUSE, OrthographicCamera as Ortho, PerspectiveCamera as Persp } from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { useLab, type ViewId } from '../store'
import { TARGET, VIEWS, type ViewSpec } from './constants'
import { Apparatus } from './Apparatus'
import { Effects } from './Effects'

function fitOrtho(camera: Ortho, width: number, height: number) {
  const aspect = width / Math.max(height, 1)
  const halfH = 2.15
  camera.left = -halfH * aspect
  camera.right = halfH * aspect
  camera.top = halfH
  camera.bottom = -halfH
  camera.near = -30
  camera.far = 60
  camera.updateProjectionMatrix()
}

function applyPose(camera: Ortho | Persp, spec: ViewSpec, width: number, height: number) {
  camera.up.set(spec.up[0], spec.up[1], spec.up[2])
  camera.position.set(spec.position[0], spec.position[1], spec.position[2])
  camera.lookAt(TARGET[0], TARGET[1], TARGET[2])
  if (camera instanceof Ortho) {
    camera.zoom = 1
    fitOrtho(camera, width, height)
  } else {
    camera.fov = 42
    camera.near = 0.05
    camera.far = 80
    camera.updateProjectionMatrix()
  }
}

function CadControls({ view }: { view: ViewId }) {
  const spec = VIEWS.find((item) => item.id === view) as ViewSpec
  const camera = useThree((state) => state.camera)
  const size = useThree((state) => state.size)
  const gl = useThree((state) => state.gl)
  const controls = useRef<OrbitControlsImpl>(null)
  const frameToken = useLab((state) => state.frameToken)
  const posed = useRef(false)

  useLayoutEffect(() => {
    if (size.width < 2 || size.height < 2) return
    const orbit = controls.current
    if (!posed.current) {
      applyPose(camera as Ortho | Persp, spec, size.width, size.height)
      posed.current = true
      if (orbit) {
        orbit.target.set(TARGET[0], TARGET[1], TARGET[2])
        orbit.update()
      }
      return
    }
    if (camera instanceof Ortho) {
      const zoom = camera.zoom
      fitOrtho(camera, size.width, size.height)
      camera.zoom = zoom
      camera.updateProjectionMatrix()
    }
  }, [camera, spec, size.width, size.height])

  useLayoutEffect(() => {
    if (frameToken === 0) return
    if (useLab.getState().active !== view) return
    applyPose(camera as Ortho | Persp, spec, size.width, size.height)
    const orbit = controls.current
    if (!orbit) return
    orbit.target.set(TARGET[0], TARGET[1], TARGET[2])
    orbit.update()
  }, [frameToken, camera, spec, size.width, size.height, view])

  useEffect(() => {
    const element = gl.domElement
    const blockMenu = (event: Event) => event.preventDefault()
    element.addEventListener('contextmenu', blockMenu)
    return () => element.removeEventListener('contextmenu', blockMenu)
  }, [gl])

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      zoomToCursor
      enableDamping={false}
      screenSpacePanning
      enableRotate={!spec.ortho}
      minDistance={0.35}
      maxDistance={24}
      minZoom={0.35}
      maxZoom={8}
      mouseButtons={{
        LEFT: undefined,
        MIDDLE: MOUSE.PAN,
        RIGHT: spec.ortho ? MOUSE.PAN : MOUSE.ROTATE,
      }}
    />
  )
}

function ConstructionPlane() {
  const showGrid = useLab((state) => state.showGrid)
  if (!showGrid) return null
  return (
    <group>
      <Grid
        args={[12, 12]}
        rotation={[-Math.PI / 2, 0, 0]}
        side={2}
        cellSize={0.25}
        cellThickness={0.6}
        cellColor="#c8c8c8"
        sectionSize={1}
        sectionThickness={1.15}
        sectionColor="#a0a0a0"
        infiniteGrid
        fadeDistance={22}
        fadeStrength={1.4}
      />
      <mesh position={[0, 0, 0.004]}>
        <boxGeometry args={[7, 0.012, 0.006]} />
        <meshBasicMaterial color="#d35b5b" toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, 0.004]}>
        <boxGeometry args={[0.012, 7, 0.006]} />
        <meshBasicMaterial color="#3aa35a" toneMapped={false} />
      </mesh>
    </group>
  )
}

function ViewportScene({ view }: { view: ViewId }) {
  const spec = VIEWS.find((item) => item.id === view) as ViewSpec
  return (
    <>
      <color attach="background" args={['#e6e6e6']} />
      {spec.ortho ? (
        <OrthographicCamera makeDefault position={spec.position} up={spec.up} zoom={1} />
      ) : (
        <PerspectiveCamera makeDefault position={spec.position} up={spec.up} fov={42} />
      )}
      <CadControls view={view} />
      <ambientLight intensity={0.72} />
      <directionalLight position={[4, -6, 8]} intensity={1.15} />
      <directionalLight position={[-3, 4, 3]} intensity={0.3} />
      <ConstructionPlane />
      <Apparatus />
      <Effects view={view} />
      <GizmoHelper alignment="bottom-left" margin={[72, 72]}>
        <GizmoViewport
          disabled
          hideNegativeAxes
          axisColors={['#d64545', '#2f9e44', '#1c7ed6']}
          labelColor="#1a1a1a"
        />
      </GizmoHelper>
    </>
  )
}

function ViewCanvas({ view }: { view: ViewId }) {
  return (
    <Canvas
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: false }}
      style={{ width: '100%', height: '100%', touchAction: 'none' }}
    >
      <ViewportScene view={view} />
    </Canvas>
  )
}

export function ViewportGrid() {
  const maximized = useLab((state) => state.maximized)
  const active = useLab((state) => state.active)
  const setActive = useLab((state) => state.setActive)
  const toggleMaximize = useLab((state) => state.toggleMaximize)

  return (
    <div className={maximized ? 'viewports single' : 'viewports'}>
      {VIEWS.map((spec) => {
        const hidden = maximized !== null && maximized !== spec.id
        return (
          <section key={spec.id} className={hidden ? 'pane hidden' : active === spec.id ? 'pane active' : 'pane'}>
            <header
              className="pane-title"
              onClick={() => setActive(spec.id)}
              onDoubleClick={() => toggleMaximize(spec.id)}
            >
              <span>{spec.title}</span>
              <span className="proj">{spec.ortho ? 'Parallel' : 'Perspective'}</span>
            </header>
            <div className="pane-canvas">{hidden ? null : <ViewCanvas view={spec.id} />}</div>
          </section>
        )
      })}
    </div>
  )
}
