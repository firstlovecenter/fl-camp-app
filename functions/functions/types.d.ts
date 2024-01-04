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
export { Camp, Campus }
