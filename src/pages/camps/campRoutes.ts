import { lazy } from 'react'
import { LazyRouteTypes } from '../../auth/auth-types'

const Camps = lazy(() => import('./Camps'))
<<<<<<< HEAD
const CampDetails = lazy(() => import('./CampDetails'))
const AssignAdmin = lazy(() => import('./AssignAdmin'))
const StartCamp = lazy(() => import('./StartCampForm'))
=======
const StartCampForm = lazy(() => import('./StartCampForm'))
const RegisterMembers = lazy(() => import('./RegisterMembers'))
>>>>>>> 9f4cf98 (fix: change user camp data to object field instead of subcollection)

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
<<<<<<< HEAD
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
=======
    path: '/camps/register-members',
    element: RegisterMembers,
    placeholder: true,
    roles: ['all'],
  },
>>>>>>> 9f4cf98 (fix: change user camp data to object field instead of subcollection)
]
