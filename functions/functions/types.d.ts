type Camp = {
  campLevel: string
  endDate: string
  levelId: string
  name: string
  paymentDeadline: string
  registrationDeadline: string
  startDate: string
}

interface Place {
  name: string
}

interface Campus extends Place {
  countryRef: string
}

type Registration = {
  email: string
  firstName: string
  lastName: string
  campId: string
  campusId: string
  gender: string
  phoneNumber: string
  whatsappNumber: string
}

export { Camp, Campus, Registration }
