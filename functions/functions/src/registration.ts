import { onDocumentCreated } from 'firebase-functions/v2/firestore'
import {
  campusDirectory,
  countryDirectory,
  continentDirectory,
  planetDirectory,
} from './directory-functions'
import { Camp } from './types'

import { getFirestore } from 'firebase-admin/firestore'
import aggregateRegistration from './aggregations'

const db = getFirestore()

const registerCampUser = onDocumentCreated(
  'registrations/{registrationId}',
  (event: { data: any }) => {
    const snapshot = event.data
    if (!snapshot) {
      console.log('No data associated with the event')
      return
    }
    const data = snapshot.data()

    // access a particular field as you would any JS property
    // const name = data.name
    console.log('data', data)

    const campRegistrationsRef = db
      .collection('camps')
      .doc(data.campId)
      .collection('registrations')
      .doc(data.whatsappNumber)

    campRegistrationsRef.set(data)

    aggregateRegistration(data)

    // perform more operations ...
  }
)

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
