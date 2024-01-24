import { Timestamp } from '@firebase/firestore-types'
import { doc, Firestore, getDoc } from 'firebase/firestore'
import { SelectOptions, UserCampData } from '../../global'
import { ROLE_MAPPINGS, ROLE_WEIGHTS } from './constants'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { updateDoc } from 'firebase/firestore'
import { UseToastOptions } from '@chakra-ui/react'

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

export const adminLevels = async (
  campId: string,
  finalRoles: string[],
  firestore: Firestore
) => {
  try {
    if (campId) {
      const campReference = doc(firestore, 'camps', campId)
      const campData = await getDoc(campReference)
      const camp = campData.data()
      const campLevel = camp?.campLevel
      const adminLevels: SelectOptions[] = []

      const allowedRoles = ROLE_MAPPINGS[campLevel] || {}

      finalRoles.forEach((userRole) => {
        const allowedRoleList = allowedRoles[userRole] || []

        allowedRoleList.forEach((role: string) => {
          const level = {
            key: `${role} Admin`,
            value: role.toLowerCase().replace(' ', ''),
          }
          adminLevels.push(level)
        })
      })

      return adminLevels
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const highestUserRole = (roles: string[]) => {
  const highestWeightRole = roles.reduce((prevRole, currentRole) => {
    const prevWeight =
      ROLE_WEIGHTS.find((role) => role.role === prevRole)?.weight || 0
    const currentWeight =
      ROLE_WEIGHTS.find((role) => role.role === currentRole)?.weight || 0

    return currentWeight > prevWeight ? currentRole : prevRole
  }, '')

  return highestWeightRole
}

export const assignAdmin = async (
  firestore: Firestore,
  campLevel: string,
  campId: string,
  campusId: string | undefined,
  userEmail: string
) => {
  const campReference = doc(firestore, 'camps', campId)
  const campDoc = await getDoc(campReference)

  const functions = getFunctions()
  const addClaimsToUser = httpsCallable(functions, 'addClaimsToUsersCallable')

  await addClaimsToUser({
    email: userEmail,
    permission: `${campLevel}Admin`,
  })

  const userReference = doc(firestore, 'users', userEmail)
  //TODO check if the camp already exists in the user's camp_admin array
  const userData = await getDoc(userReference)
  const adminCamps: UserCampData[] = userData.data()?.camp_admin || []
  // Check if the user is already assigned to the camp
  const existingCampIndex = adminCamps.findIndex(
    (camp) => camp.campId === campId
  )

  if (existingCampIndex !== -1) {
    // Update the existing roles if the user is already assigned to the camp
    const existingRoles = adminCamps[existingCampIndex].role || []
    const updatedRoles = Array.from(
      new Set([...existingRoles, `${campLevel}Admin`])
    )

    adminCamps[existingCampIndex].role = updatedRoles

    // Add campusId when campLevel is "campus"
    if (campLevel === 'campus') {
      adminCamps[existingCampIndex].campusId = campusId || undefined
    }
  } else {
    // Add a new object to the camp_admin array
    const newCampObject = {
      campId: campId,
      churchLevel: campLevel,
      name: (campDoc.data()?.name as string) || '',
      role: [`${campLevel}Admin`],
    }

    // Add campusId when campLevel is "campus"
    if (campLevel === 'campus') {
      newCampObject['campusId'] = campusId || undefined
    }

    adminCamps.push(newCampObject)
  }

  await updateDoc(userReference, {
    camp_admin: adminCamps,
  })

  const returnObject: UseToastOptions = {
    title: 'User Assigned',
    description: 'User has been made an admin',
    status: 'success',
    duration: 4000,
    isClosable: true,
  }

  return returnObject
}
