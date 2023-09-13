interface Camp {
  name: string
  type: string
  roomOption: string
  role: string
  startDate: string
  endDate: string
  registrationStatus?: string
  paymentStatus?: string
  campStatus?: boolean
}

type Role = 'campCamper' | 'campAdmin' | 'globalAdmin' | 'all'

interface FetchedCampData {
  role: string
  id: string
  name: string
  campLevel: string
  startDate: string
  endDate: string
  campStatus: boolean
}

interface FetchedCampDataCamper extends FetchedCampData {
  registrationStatus: string
  paymentStatus: string
  roomOption: string
}
