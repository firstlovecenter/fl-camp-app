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

interface Role {
  role: string
  name: string
}

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
