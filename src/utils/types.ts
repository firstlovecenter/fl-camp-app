interface DataItem {
  id: string
  paidRegistrations: number
  registrations: number
  name: string
}

interface ContinentsDataItem extends DataItem {
  earthRef: string
}

interface CountriesDataItem extends DataItem {
  continentRef: string
}

export type { DataItem, ContinentsDataItem, CountriesDataItem }
