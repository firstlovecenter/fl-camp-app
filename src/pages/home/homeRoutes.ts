import { lazy } from 'react'
import { LazyRouteTypes } from '../../auth/auth-types'

const AdminHomePage = lazy(() => import('./AdminHomePage'))
const CamperHomePage = lazy(() => import('./CamperHomePage'))

export const homeRoutes: LazyRouteTypes[] = [
  {
    path: '/admin',
    element: AdminHomePage,
    placeholder: true,
    roles: ['all'],
  },
  {
    path: '/camper',
    element: CamperHomePage,
    placeholder: true,
    roles: ['all'],
  },
]
