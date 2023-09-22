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

interface UserData {
  firstName: string
  id: string
  lastName: string
  roles: string[]
  image_url: string
}

export interface Member {
  id: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  phoneNumber: string
  whatsappNumber: string
  pictureUrl: string
}
