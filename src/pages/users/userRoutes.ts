import { lazy } from 'react'
import { LazyRouteTypes } from '../../auth/auth-types'

const UserList = lazy(() => import('./UserList'))

export const userRoutes: LazyRouteTypes[] = [
  {
    path: '/users',
    element: UserList,
    placeholder: true,
    roles: ['all'],
  },
]
