import { lazy } from 'react'
import { LazyRouteTypes } from '../../auth/auth-types'

const UserList = lazy(() => import('./UserList'))
const UserProfile = lazy(() => import('./UserProfile'))
const AddUserForm = lazy(() => import('./AddUserForm'))
const EditUserForm = lazy(() => import('./EditUserForm'))

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
  {
    path: '/add-user',
    element: AddUserForm,
    placeholder: true,
    roles: ['all'],
  },
  {
    path: '/edit-user',
    element: EditUserForm,
    placeholder: true,
    roles: ['all'],
  },
]
