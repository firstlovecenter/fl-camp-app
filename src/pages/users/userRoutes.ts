import { lazy } from 'react'
import { LazyRouteTypes } from '../../auth/auth-types'

const UserList = lazy(() => import('./UserList'))
const UserProfile = lazy(() => import('./UserProfile'))

export const userRoutes: LazyRouteTypes[] = [
  {
    path: '/users',
    element: UserList,
    placeholder: true,
    roles: ['all'],
  },
  {
    path: '/user-profile',
    element: UserProfile,
    placeholder: true,
    roles: ['all'],
  },
]
