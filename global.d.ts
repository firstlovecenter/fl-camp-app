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
  image_url: string
<<<<<<< HEAD
  email: string
=======
  roles?: string[]
>>>>>>> 9f4cf98 (fix: change user camp data to object field instead of subcollection)
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
  world: string | undefined
  continent: string | undefined
  country: string | undefined
  campus: string | undefined
}
