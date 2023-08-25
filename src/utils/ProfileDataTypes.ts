interface PageDetails {
  registrations: number
  paidRegistrations: number
  name: string
  id: string
}

interface CountryPageDetails extends PageDetails {
  campuses: number
}

export type { PageDetails, CountryPageDetails }
