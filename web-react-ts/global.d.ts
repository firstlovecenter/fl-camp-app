import { Timestamp } from '@firebase/firestore-types'

interface Camp {
  name: string
  roomOption: string
  role: string
  startDate: Timestamp
  endDate: Timestamp
  campLevel: string
  registrationStatus?: string
  paymentStatus?: string
  campId?: string
  id?: string
  registrationDeadline?: Timestamp
  paymentDeadline?: Timestamp
}

type Role =
  | 'campCamper'
  | 'campusAdmin'
  | 'globalAdmin'
  | 'all'
  | 'countryAdmin'
  | 'continentAdmin'

interface FetchedCampData {
  role: string
  id: string
  name: string
  campLevel: string
  startDate: string
  endDate: string
  campType: string
}

interface FetchedCampDataCamper extends FetchedCampData {
  registrationStatus: string
  paymentStatus: string
  roomOption: string
}

export interface UserCampData {
  campId: string
  name: string
  role?: string[]
  campusRef?: string
}
export interface UserData {
  firstName: string
  id: string
  lastName: string
  image_url: string
  email: string
  gender: string
  phoneNumber?: string
  whatsappNumber?: string
  camp_camper?: UserCampData[]
  camp_admin?: UserCampData[]
  roles?: string[]
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

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
}

export interface SelectOptions {
  key: string
  value: string
}

type FormData = {
  campName: string
  campLevel: string
  campStart: Date
  campEnd: Date
  registrationDeadline: Date
  paymentDeadline: Date
  planet?: string | undefined
  continent?: string | undefined
  country?: string | undefined
  campus?: string | undefined
}

export interface Registration {
  campId: string
  campusRef: string
  email: string
  firstName: string
  gender: string
  lastName: string
  phoneNumber: string
  whatsappNumber: string
}
