import {
  campusDirectory,
  countryDirectory,
  continentDirectory,
  planetDirectory,
} from './directory-functions'
import { Camp } from './types'

type Registration = {
  email: string
  firstName: string
  lastName: string
  campId: string
  campusRef: string
  gender: string
  phoneNumber: string
  whatsappNumber: string
}

const registerCampUser = async (registration: Registration) => {
  // const { campId, campusRef } = registration
  // return registration
}

const createCampDirectoryLevels = async (camp: Camp, campId: string) => {
  switch (camp.campLevel) {
    case 'campus':
      await campusDirectory(camp, campId)
      break

    case 'country':
      await countryDirectory(camp, campId)
      break

    case 'continent':
      await continentDirectory(camp, campId)
      break
    case 'planet':
      await planetDirectory(camp, campId)
      break
  }
}

export { registerCampUser, createCampDirectoryLevels }
