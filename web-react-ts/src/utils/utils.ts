import { Timestamp } from '@firebase/firestore-types'

export const parseRegistrationOptions = (data: any) => {
  const res: {
    value: string
    paymentStatus: boolean
    campLevel: string
  }[] = []

  data.forEach(
    (item: {
      data: () => {
        campType: string
        paymentStatus: boolean
        (): any
        new (): any
        name: string
      }
      id: string
    }) => {
      res.push({
        value: item.id,
        paymentStatus: item.data()?.paymentStatus,
        campLevel: item.data()?.campType,
      })
    }
  )
  return res
}

export const formatDateRange = (
  startDateTimestamp: Timestamp,
  endDateTimestamp: Timestamp
) => {
  const startDate = startDateTimestamp.toDate()
  const endDate = endDateTimestamp.toDate()

  // Format day with 'st', 'nd', 'rd', or 'th'
  const formatDay = (day: number) => {
    if (day >= 11 && day <= 13) {
      return `${day}th`
    }
    switch (day % 10) {
      case 1:
        return `${day}st`
      case 2:
        return `${day}nd`
      case 3:
        return `${day}rd`
      default:
        return `${day}th`
    }
  }

  const startDay = formatDay(startDate.getDate())
  const endDay = formatDay(endDate.getDate())

  const startMonth = startDate.toLocaleString('default', { month: 'long' })
  const endMonth = endDate.toLocaleString('default', { month: 'long' })

  const startYear = startDate.getFullYear()
  const endYear = endDate.getFullYear()

  if (startMonth === endMonth && startYear === endYear) {
    // Same month and year
    return `${startDay} - ${endDay} ${startMonth} ${startYear}`
  } else {
    // Different months or years
    return `${startDay} ${startMonth} ${startYear} - ${endDay} ${endMonth} ${endYear}`
  }
}

export const capitalizeFirstLetter = (str: string) => {
  // Using replace method with regEx
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const churchLevel = (campLevel: string) => {
  switch (campLevel) {
    case 'campusAdmin':
      return 'campus'
    case 'countryAdmin':
      return 'country'
    case 'continentAdmin':
      return 'continent'
    case 'globalAdmin':
      return 'global'
    default:
      return 'campus'
  }
}

export const PHONE_NUM_REGEX = /^[+][(]{0,1}[1-9]{1,4}[)]{0,1}[-\s/0-9]*$/

export const convertStringToDate = (dateString: string | Date) => {
  const dateRaw = dateString as string
  const [year, month, day] = dateRaw.split('-').map(Number)
  // Month in JavaScript Date is 0-indexed, so we subtract 1
  return new Date(year, month - 1, day)
}
