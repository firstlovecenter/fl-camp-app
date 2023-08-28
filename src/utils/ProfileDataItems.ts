interface PageDetails {
  registrations: number
  paidRegistrations: number
  name: string
  id: string
}

interface CountryPageDetails extends PageDetails {
  campuses: number
}

interface ContinentPageDetails extends PageDetails {
  countries: number
}

interface EarthPageDetails extends PageDetails {
  continents: number
}

export type {
  PageDetails,
  CountryPageDetails,
  ContinentPageDetails,
  EarthPageDetails,
}
