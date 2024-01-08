interface DataItem {
  id: string
  paidRegistrations: number
  registrations: number
  name: string
}

interface ContinentsDataItem extends DataItem {
  planetRef?: string
}

interface CountriesDataItem extends DataItem {
  continentRef?: string
}

interface CampusesDataItem extends DataItem {
  countryRef?: string
}

export type {
  DataItem,
  ContinentsDataItem,
  CountriesDataItem,
  CampusesDataItem,
}
