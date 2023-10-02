import { LazyExoticComponent } from 'react'
import { Role } from '../../global'

export interface LazyRouteTypes {
  path: string
  element: LazyExoticComponent<() => JSX.Element>
  placeholder?: boolean
  roles: Role[]
}
