import { lazy } from 'react'
import { LazyRouteTypes } from '../../auth/auth-types'

const Camps = lazy(() => import('./Camps'))

export const campRoutes: LazyRouteTypes[] = [
  {
    path: '/camps',
    element: Camps,
    placeholder: true,
    roles: ['all'],
  },
]
