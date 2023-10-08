interface Camp {
  name: string
  roomOption: string
  role: string
  startDate: string
  endDate: string
  campType: string
  registrationStatus?: string
  paymentStatus?: string
  campStatus?: boolean
  campId?: string
  id?: string
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

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
}

export interface SelectOptions {
  key: string
  value: string
}
