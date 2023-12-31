import { lazy } from 'react'
import { LazyRouteTypes } from '../../auth/auth-types'

const AdminHomePage = lazy(() => import('./AdminHomePage'))
const CamperHomePage = lazy(() => import('./CamperHomePage'))
const GlobalAdminHomePage = lazy(() => import('./GlobalAdminHomePage'))

export const homeRoutes: LazyRouteTypes[] = [
  {
    path: '/admin',
    element: AdminHomePage,
    placeholder: true,
    roles: ['campusAdmin', 'countryAdmin', 'continentAdmin', 'globalAdmin'],
  },
  {
    path: '/camper',
    element: CamperHomePage,
    placeholder: true,
    roles: ['all'],
  },
  {
    path: '/global-admin',
    element: GlobalAdminHomePage,
    placeholder: true,
    roles: ['globalAdmin'],
  },
]
