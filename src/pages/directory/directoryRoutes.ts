import { lazy } from 'react'
import { LazyRouteTypes } from '../../auth/auth-types'

const Directory = lazy(() => import('./Directory'))
const ContinentsByEarth = lazy(() => import('./ContinentsByEarth'))
const CountriesByContinent = lazy(() => import('./CountriesByContinents'))
const CampusesByCountry = lazy(() => import('./CampusesByCountry'))
const CampusProfile = lazy(() => import('./profiles/CampusProfile'))

export const directoryRoutes: LazyRouteTypes[] = [
  {
    path: '/directory',
    element: Directory,
    placeholder: true,
    roles: ['all'],
  },
  {
    path: '/continents-by-earth',
    element: ContinentsByEarth,
    placeholder: true,
    roles: ['all'],
  },
  {
    path: '/countries-by-continent',
    element: CountriesByContinent,
    placeholder: true,
    roles: ['all'],
  },
  {
    path: '/campuses-by-country',
    element: CampusesByCountry,
    placeholder: true,
    roles: ['all'],
  },
  {
    path: '/campus-profile',
    element: CampusProfile,
    placeholder: true,
    roles: ['all'],
  },
]
