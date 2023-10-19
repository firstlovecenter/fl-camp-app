import { lazy } from 'react'
import { LazyRouteTypes } from '../../auth/auth-types'

const Camps = lazy(() => import('./Camps'))
const CampDetails = lazy(() => import('./CampDetails'))
const AssignAdmin = lazy(() => import('./AssignAdmin'))
const StartCamp = lazy(() => import('./StartCampForm'))

export const campRoutes: LazyRouteTypes[] = [
  {
    path: '/camps',
    element: Camps,
    placeholder: true,
    roles: ['all'],
  },
  {
    path: '/camp/camp-details',
    element: CampDetails,
    placeholder: true,
    roles: ['all'],
  },
  {
    path: '/camp/assign-camp-admin',
    element: AssignAdmin,
    placeholder: true,
    roles: ['all'],
  },
  {
    path: '/camp/start-camp',
    element: StartCamp,
    placeholder: true,
    roles: ['globalAdmin'],
  },
]
