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
