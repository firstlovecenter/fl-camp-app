import { LazyExoticComponent } from 'react'

export interface LazyRouteTypes {
  path: string
  element: LazyExoticComponent<() => JSX.Element>
  placeholder?: boolean
  roles: string[]
}
