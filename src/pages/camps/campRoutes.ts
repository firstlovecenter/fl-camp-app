import { lazy } from 'react'
import { LazyRouteTypes } from '../../auth/auth-types'

const Camps = lazy(() => import('./Camps'))
const CampDetails = lazy(() => import('./CampDetails'))

export const campRoutes: LazyRouteTypes[] = [
  {
    path: '/camps',
    element: Camps,
    placeholder: true,
    roles: ['all'],
  },
  {
    path: '/camps/camp-details',
    element: CampDetails,
    placeholder: true,
    roles: ['all'],
  },
]
