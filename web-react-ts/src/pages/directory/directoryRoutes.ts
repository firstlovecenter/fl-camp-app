import { lazy } from 'react'
import { LazyRouteTypes } from '../../auth/auth-types'

const Directory = lazy(() => import('./Directory'))
const ContinentsByplanet = lazy(() => import('./ContinentsByPlanet'))
const CountriesByContinent = lazy(() => import('./CountriesByContinents'))
const CampusesByCountry = lazy(() => import('./CampusesByCountry'))
const CampusProfile = lazy(() => import('./profiles/CampusProfile'))
const CountryProfile = lazy(() => import('./profiles/CountryProfile'))
const ContinentProfile = lazy(() => import('./profiles/ContinentProfile'))
const PlanetProfile = lazy(() => import('./profiles/PlanetProfile'))

export const directoryRoutes: LazyRouteTypes[] = [
  {
    path: '/camp/directory',
    element: Directory,
    placeholder: true,
    roles: ['all'],
  },
  {
    path: '/camp/continents-by-planet',
    element: ContinentsByplanet,
    placeholder: true,
    roles: ['all'],
  },
  {
    path: '/camp/countries-by-continent',
    element: CountriesByContinent,
    placeholder: true,
    roles: ['all'],
  },
  {
    path: '/camp/campuses-by-country',
    element: CampusesByCountry,
    placeholder: true,
    roles: ['all'],
  },
  {
    path: '/camp/campus-profile',
    element: CampusProfile,
    placeholder: true,
    roles: ['all'],
  },
  {
    path: '/camp/country-profile',
    element: CountryProfile,
    placeholder: true,
    roles: ['all'],
  },
  {
    path: '/camp/continent-profile',
    element: ContinentProfile,
    placeholder: true,
    roles: ['all'],
  },
  {
    path: '/camp/planet-profile',
    element: PlanetProfile,
    placeholder: true,
    roles: ['all'],
  },
]
