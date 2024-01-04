import { getFirestore, DocumentReference } from 'firebase-admin/firestore'
import { Camp } from '../types'

const db = getFirestore()

const campusDirectory = async (camp: Camp, campId: string) => {
  const campusesRef = db.collection('campuses').doc(camp.levelId)
  const campusDoc = await campusesRef.get()

  const campusData = {
    name: campusDoc.data()?.name,
    countryRef: campusDoc.data()?.countryRef,
  }

  const campRef = db.collection('camps').doc(campId)
  await campRef.get()

  const directoryRef = db
    .collection('camps')
    .doc(campId)
    .collection('campuses')
    .doc(campusDoc.id)

  await directoryRef.set(campusData)
}

const countryDirectory = async (camp: Camp, campId: string) => {
  const countriesRef = db.collection('countries').doc(camp.levelId)
  const countryDoc = await countriesRef.get()

  const countryData = {
    name: countryDoc.data()?.name,
    countryRef: countryDoc.data()?.upperRef,
  }

  // const campRef = db.collection('camps').doc(campId)
  // await campRef.get()

  const directoryRef = db
    .collection('camps')
    .doc(campId)
    .collection('countries')
    .doc(countryDoc.id)

  await directoryRef.set(countryData)

  await createPlaces(countryDoc.id, campId, 'campuses')
}

const continentsWrite = async (
  continentData: {
    name: string
    countryRef: string
  },
  continentDocId: string,
  campRef: DocumentReference
) => {
  // Create continents subcollection
  const batch = db.batch()
  const continentsDirectoryRef = campRef
    .collection('continents')
    .doc(continentDocId)
  batch.set(continentsDirectoryRef, {
    ...continentData,
    type: 'continent', // add a type field to identify the entity type
  })

  await batch.commit()
}

const continentDirectory = async (camp: Camp, campId: string) => {
  try {
    const continentsRef = db.collection('continents').doc(camp.levelId)
    const continentDoc = await continentsRef.get()

    const continentData = {
      name: continentDoc.data()?.name,
      countryRef: continentDoc.data()?.upperRef,
    }

    const campRef = db.collection('camps').doc(campId)

    // Create continents subcollection

    await continentsWrite(continentData, continentDoc.id, campRef)

    // Create countries subcollection

    await countriesWrite(continentDoc.id, campRef)

    await campusesWrite(campRef)
  } catch (error) {
    console.error('Error in continentDirectory:', error)
  }
}

const countriesWrite = async (
  continentDocId: string,
  campRef: DocumentReference
) => {
  try {
    const batch = db.batch()
    const countriesRef = db.collection('countries')
    const countriesSnapshot = await countriesRef
      .where('upperRef', '==', continentDocId)
      .get()

    await Promise.all(
      countriesSnapshot.docs.map(async (country) => {
        const countryData = {
          name: country.data()?.name,
          upperRef: country.data()?.upperRef,
          type: 'country',
        }

        const countriesDirectoryRef = campRef
          .collection('countries')
          .doc(country.id)

        batch.set(countriesDirectoryRef, countryData)
      })
    )

    // Commit the batch after all operations are complete
    await batch.commit()
    console.log('Batch committed successfully')
  } catch (error) {
    console.error('Error in countriesWrite:', error)
  }
}

const campusesWrite = async (campRef: DocumentReference) => {
  try {
    const batch = db.batch()
    const campCountriesRef = campRef.collection('countries')
    const campCountries = await campCountriesRef.get()

    await Promise.all(
      campCountries.docs.map(async (campCountry) => {
        const campusesRef = db.collection('campuses')
        const campusesSnapshot = await campusesRef
          .where('upperRef', '==', campCountry.id)
          .get()

        campusesSnapshot.forEach((campus) => {
          const campusesDirectoryRef = campRef
            .collection('campuses')
            .doc(campus.id)
          batch.set(campusesDirectoryRef, {
            name: campus.data()?.name,
            upperRef: campus.data()?.upperRef,
            type: 'campus',
          })
        })
      })
    )

    // Commit the batch after all operations are complete
    await batch.commit()
  } catch (error) {
    console.error('Error in campusesWrite:', error)
  }
}

const createPlaces = async (upperRef: string, campId: string, type: string) => {
  const placeRef = db.collection(type)

  const placeSnapshot = await placeRef.where('upperRef', '==', upperRef).get()

  console.log('placeSnapshot', placeSnapshot)

  placeSnapshot.forEach(async (place) => {
    const directoryRef = db
      .collection('camps')
      .doc(campId)
      .collection(type)
      .doc(place.id)

    await directoryRef.set({
      name: place.data()?.name,
      upperRef: place.data()?.upperRef,
    })

    await directoryRef.get()
  })
}

const planetDirectory = async (camp: Camp, campId: string) => {
  const planetRef = db.collection('planets').doc(camp.levelId)
  const planetDoc = await planetRef.get()

  const planetData = {
    name: planetDoc.data()?.name,
  }

  const campRef = db.collection('camps').doc(campId)
  await campRef.get()

  const directoryRef = db
    .collection('camps')
    .doc(campId)
    .collection('planets')
    .doc(planetDoc.id)

  await directoryRef.set(planetData)

  await createContinents(planetDoc.id, campId)

  await createCountries(campId)

  await createCampuses(campId)
}

const createContinents = async (camplevelId: string, campId: string) => {
  await createPlaces(camplevelId, campId, 'continents')
}

interface DirectoryItem {
  name: string
  upperRef: string
  type: string
  id: string
}

const createCountries = async (campId: string) => {
  const campRef = db.collection('camps').doc(campId)
  const campContinents = await campRef.collection('continents').get()

  // const view = campContinents.docs.map((doc) => doc.data())
  // console.log('view', view)

  const campContinentsArray: DirectoryItem[] = []

  campContinents.forEach((campContinent) => {
    campContinentsArray.push({
      name: campContinent.data()?.name,
      upperRef: campContinent.data()?.upperRef,
      type: campContinent.data()?.type,
      id: campContinent.id,
    })
  })

  console.log('campContinentsArray', campContinentsArray)

  for (const continent of campContinentsArray) {
    await createPlaces(continent.id, campId, 'countries')
  }
}

const createCampuses = async (campId: string) => {
  const campRef = db.collection('camps').doc(campId)
  const campCountries = await campRef.collection('countries').get()

  const campCountriesArray: DirectoryItem[] = []

  campCountries.forEach((campCountries) => {
    campCountriesArray.push({
      name: campCountries.data()?.name,
      upperRef: campCountries.data()?.upperRef,
      type: campCountries.data()?.type,
      id: campCountries.id,
    })
  })

  console.log('campCountriesArray', campCountriesArray)

  for (const country of campCountriesArray) {
    await createPlaces(country.id, campId, 'campuses')
  }
}

export {
  campusDirectory,
  countryDirectory,
  continentDirectory,
  planetDirectory,
}
