/** Scene units per metre. The apparatus is small in SI units, so the view is scaled up. */
export const SCALE = 8
export const X_MIN = 0.04
export const X_MAX = 0.18
export const Z0 = 0.03
/** Height of the magnets and galvanometer. It does not follow ℓ or θ. */
export const FIXED_SPAN = 0.1
export const V_MAX = 3
export const TARGET: [number, number, number] = [0.88, 0, 0.72]

export function sx(metres: number) {
  return metres * SCALE
}

export type ViewId = 'top' | 'front' | 'right' | 'perspective'

export type ViewSpec = {
  id: ViewId
  title: string
  ortho: boolean
  position: [number, number, number]
  up: [number, number, number]
}

/** DOM order is the four-pane grid, row by row: Perspective | Right / Front | Top. */
export const VIEWS: ViewSpec[] = [
  {
    id: 'perspective',
    title: 'Perspective',
    ortho: false,
    position: [2.7, -2.5, 1.95],
    up: [0, 0, 1],
  },
  { id: 'right', title: 'Right', ortho: true, position: [4.5, 0, 0.72], up: [0, 0, 1] },
  { id: 'front', title: 'Front', ortho: true, position: [0.88, -3.6, 0.72], up: [0, 0, 1] },
  { id: 'top', title: 'Top', ortho: true, position: [0.88, 0, 4.4], up: [0, 1, 0] },
]
