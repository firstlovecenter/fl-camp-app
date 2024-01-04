type Camp = {
  campLevel: string
  endDate: string
  levelRef: string
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
export { Camp, Campus }
