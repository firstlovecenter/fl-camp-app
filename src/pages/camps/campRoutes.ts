import { lazy } from 'react'
import { LazyRouteTypes } from '../../auth/auth-types'

const Camps = lazy(() => import('./Camps'))
const StartCampForm = lazy(() => import('./StartCampForm'))

export const campRoutes: LazyRouteTypes[] = [
  {
    path: '/camps',
    element: Camps,
    placeholder: true,
    roles: ['all'],
  },
  {
    path: '/camps/start-camp',
    element: StartCampForm,
    placeholder: true,
    roles: ['all'],
  },
]
