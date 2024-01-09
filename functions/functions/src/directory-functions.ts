import { getFirestore } from 'firebase-admin/firestore'
import { Camp } from '../types'

const db = getFirestore()

interface DirectoryItem {
  name: string
  upperChurchId: string
  type: string
  id: string
}

const campusDirectory = async (camp: Camp, campId: string) => {
  const campusesRef = db.collection('campuses').doc(camp.levelId)
  const campusDoc = await campusesRef.get()

  const campusData = {
    name: campusDoc.data()?.name,
    upperChurchId: campusDoc.data()?.upperChurchId,
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

  const continentsRef = db.collection('continents')
  const campContinentsDocs = await continentsRef
    .where('upperChurchId', '==', planetDoc.id)
    .get()

  const campContinentsArray: DirectoryItem[] = campContinentsDocs.docs.map(
    (campContinent) => ({
      name: campContinent.data()?.name,
      upperChurchId: campContinent.data()?.upperChurchId,
      type: 'continent',
      id: campContinent.id,
    })
  )

  const countryPromises = campContinentsArray.map(async (continent) => {
    const countriesRef = db.collection('countries')
    const campCountriesDocs = await countriesRef
      .where('upperChurchId', '==', continent.id)
      .get()

    return campCountriesDocs.docs.map((campCountry) => ({
      name: campCountry.data()?.name,
      upperChurchId: campCountry.data()?.upperChurchId,
      type: 'country',
      id: campCountry.id,
    }))
  })

  // Wait for all country promises to resolve
  const campCountriesArrays = await Promise.all(countryPromises)

  // Flatten the array of arrays
  const campCountriesArray = campCountriesArrays.flat()

  const campusPromises = campCountriesArray.map(async (country) => {
    const campusesRef = db.collection('campuses')
    const campCampusesDoc = await campusesRef
      .where('upperChurchId', '==', country.id)
      .get()

    return campCampusesDoc.docs.map((campCampus) => ({
      name: campCampus.data()?.name,
      upperChurchId: campCampus.data()?.upperChurchId,
      type: 'campus',
      id: campCampus.id,
    }))
  })

  // Wait for all campus promises to resolve
  const campCampusesArrays = await Promise.all(campusPromises)

  // Flatten the array of arrays
  const campCampusesArray = campCampusesArrays.flat()

  for (const campContinent of campContinentsArray) {
    const batch = db.batch()

    const campContinentsRef = campRef
      .collection('continents')
      .doc(campContinent.id)

    batch.set(campContinentsRef, campContinent)

    await batch.commit()
  }

  for (const campCountry of campCountriesArray) {
    const batch = db.batch()

    const campCountryRef = campRef.collection('countries').doc(campCountry.id)

    batch.set(campCountryRef, campCountry)

    await batch.commit()
  }

  for (const campCampus of campCampusesArray) {
    const batch = db.batch()

    const campcampusId = campRef.collection('campuses').doc(campCampus.id)

    batch.set(campcampusId, campCampus)

    await batch.commit()
  }
}

const continentDirectory = async (camp: Camp, campId: string) => {
  const continentRef = db.collection('continents').doc(camp.levelId)
  const continentDoc = await continentRef.get()

  const continentData = {
    name: continentDoc.data()?.name,
    upperChurchId: continentDoc.data()?.upperChurchId,
    id: continentDoc.id,
  }

  const campRef = db.collection('camps').doc(campId)
  await campRef.get()

  const directoryRef = db
    .collection('camps')
    .doc(campId)
    .collection('continents')
    .doc(continentData.id)

  await directoryRef.set(continentData)

  const campContinentsDoc = await continentRef.get()

  const campContinentsArray: DirectoryItem[] = [
    {
      name: campContinentsDoc.data()?.name,
      upperChurchId: campContinentsDoc.data()?.upperChurchId,
      type: 'continent',
      id: campContinentsDoc.id,
    },
  ]

  const countryPromises = campContinentsArray.map(async (continent) => {
    const countriesRef = db.collection('countries')
    const campCountriesDocs = await countriesRef
      .where('upperChurchId', '==', continent.id)
      .get()

    return campCountriesDocs.docs.map((campCountry) => ({
      name: campCountry.data()?.name,
      upperChurchId: campCountry.data()?.upperChurchId,
      type: 'country',
      id: campCountry.id,
    }))
  })

  // Wait for all country promises to resolve
  const campCountriesArrays = await Promise.all(countryPromises)

  // Flatten the array of arrays
  const campCountriesArray = campCountriesArrays.flat()

  const campusPromises = campCountriesArray.map(async (country) => {
    const campusesRef = db.collection('campuses')
    const campCampusesDoc = await campusesRef
      .where('upperChurchId', '==', country.id)
      .get()

    return campCampusesDoc.docs.map((campCampus) => ({
      name: campCampus.data()?.name,
      upperChurchId: campCampus.data()?.upperChurchId,
      type: 'campus',
      id: campCampus.id,
    }))
  })

  // Wait for all campus promises to resolve
  const campCampusesArrays = await Promise.all(campusPromises)

  // Flatten the array of arrays
  const campCampusesArray = campCampusesArrays.flat()

  for (const campContinent of campContinentsArray) {
    const batch = db.batch()

    const campContinentsRef = campRef
      .collection('continents')
      .doc(campContinent.id)

    batch.set(campContinentsRef, campContinent)

    await batch.commit()
  }

  for (const campCountry of campCountriesArray) {
    const batch = db.batch()

    const campCountryRef = campRef.collection('countries').doc(campCountry.id)

    batch.set(campCountryRef, campCountry)

    await batch.commit()
  }

  for (const campCampus of campCampusesArray) {
    const batch = db.batch()

    const campcampusId = campRef.collection('campuses').doc(campCampus.id)

    batch.set(campcampusId, campCampus)

    await batch.commit()
  }
}

const countryDirectory = async (camp: Camp, campId: string) => {
  const countryRef = db.collection('countries').doc(camp.levelId)
  const countryDoc = await countryRef.get()

  const countryData = {
    name: countryDoc.data()?.name,
    upperChurchId: countryDoc.data()?.upperChurchId,
    id: countryDoc.id,
  }

  const campRef = db.collection('camps').doc(campId)
  await campRef.get()

  const directoryRef = db
    .collection('camps')
    .doc(campId)
    .collection('countries')
    .doc(countryData.id)

  await directoryRef.set(countryData)

  const campCountryDoc = await countryRef.get()

  const campCountriesArray: DirectoryItem[] = [
    {
      name: campCountryDoc.data()?.name,
      upperChurchId: campCountryDoc.data()?.upperChurchId,
      type: 'country',
      id: campCountryDoc.id,
    },
  ]

  const campusPromises = campCountriesArray.map(async (country) => {
    const campusesRef = db.collection('campuses')
    const campCampusesDoc = await campusesRef
      .where('upperChurchId', '==', country.id)
      .get()

    return campCampusesDoc.docs.map((campCampus) => ({
      name: campCampus.data()?.name,
      upperChurchId: campCampus.data()?.upperChurchId,
      type: 'campus',
      id: campCampus.id,
    }))
  })

  // Wait for all campus promises to resolve
  const campCampusesArrays = await Promise.all(campusPromises)

  // Flatten the array of arrays
  const campCampusesArray = campCampusesArrays.flat()

  for (const campCountry of campCountriesArray) {
    const batch = db.batch()

    const campCountryRef = campRef.collection('countries').doc(campCountry.id)

    batch.set(campCountryRef, campCountry)

    await batch.commit()
  }

  for (const campCampus of campCampusesArray) {
    const batch = db.batch()

    const campcampusId = campRef.collection('campuses').doc(campCampus.id)

    batch.set(campcampusId, campCampus)

    await batch.commit()
  }
}

export {
  campusDirectory,
  countryDirectory,
  continentDirectory,
  planetDirectory,
}
