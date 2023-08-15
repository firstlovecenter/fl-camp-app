import { lazy } from 'react'
import { LazyRouteTypes } from './auth-types'

const Login = lazy(() => import('./LogIn'))
const Signup = lazy(() => import('./SignUp'))
const LandingPage = lazy(() => import('../pages/LandingPage'))
const ForgotPassword = lazy(() => import('./ForgotPassword'))
const UpdateProfile = lazy(() => import('./UpdateProfile'))

export const authRoutes: LazyRouteTypes[] = [
  {
    path: '/login',
    element: Login,
    placeholder: true,
    roles: ['all'],
  },
  {
    path: '/signup',
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
  {
    path: '/',
    element: LandingPage,
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
