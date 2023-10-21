import { lazy } from 'react'
import { LazyRouteTypes } from './auth-types'

const Login = lazy(() => import('./LogIn'))
const Signup = lazy(() => import('./SignUp'))
const LandingPage = lazy(() => import('../pages/home/LandingPage'))
const ProfilePage = lazy(() => import('../pages/ProfilePage'))
const ForgotPassword = lazy(() => import('./ForgotPassword'))
const UpdateProfile = lazy(() => import('./UpdateProfile'))

export const mainAuthRoutes: LazyRouteTypes[] = [
  {
    path: '/login',
    element: Login,
    placeholder: true,
    roles: ['all'],
  },
  {
    path: '/sign-up',
    element: Signup,
    placeholder: true,
    roles: ['all'],
  },
  {
    path: '/forgot-password',
    element: ForgotPassword,
    placeholder: true,
    roles: ['all'],
  },
]
export const authRoutes: LazyRouteTypes[] = [
  {
    path: '/',
    element: LandingPage,
    placeholder: false,
    roles: ['all'],
  },
  {
    path: '/profile',
    element: ProfilePage,
    placeholder: false,
    roles: ['all'],
  },
  {
    path: '/update-profile',
    element: UpdateProfile,
    placeholder: false,
    roles: ['all'],
  },
]
