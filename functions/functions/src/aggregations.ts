import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import { Registration } from '../types'

const db = getFirestore()

const aggregateRegistration = async (registration: Registration) => {
  const { campId, campusId } = registration
  const increment = FieldValue.increment(1)

  const campusIderence = db
    .collection('camps')
    .doc(campId)
    .collection('campuses')
    .doc(campusId)
  try {
    const campReference = db.collection('camps').doc(campId)
    const camp = await campReference.get()

    await campReference.update({
      registrations: increment,
      timestamp: FieldValue.serverTimestamp(),
    })

    // Common update for all cases
    await campusIderence.update({
      registrations: increment,
      timestamp: FieldValue.serverTimestamp(),
    })

    if (
      camp.data()?.campLevel === 'country' ||
      camp.data()?.campLevel === 'continent' ||
      camp.data()?.campLevel === 'planet'
    ) {
      const campus = await campusIderence.get()
      const countryId = campus.data()?.upperChurchId

      if (countryId) {
        const countryReference = db
          .collection('camps')
          .doc(campId)
          .collection('countries')
          .doc(countryId)

        await countryReference.update({
          registration: increment,
          timestamp: FieldValue.serverTimestamp(),
        })

        if (
          camp.data()?.campLevel === 'continent' ||
          camp.data()?.campLevel === 'planet'
        ) {
          const country = await countryReference.get()
          const continentId = country.data()?.upperChurchId

          const continentReference = db
            .collection('camps')
            .doc(campId)
            .collection('continents')
            .doc(continentId)

          await continentReference.update({
            registration: increment,
            timestamp: FieldValue.serverTimestamp(),
          })

          if (camp.data()?.campLevel === 'planet') {
            const continent = await countryReference.get()
            const planetId = continent.data()?.upperChurchId

            const planetReference = db
              .collection('camps')
              .doc(campId)
              .collection('planets')
              .doc(planetId)

            await planetReference.update({
              registration: increment,
              timestamp: FieldValue.serverTimestamp(),
            })
          }
        }
      }
    }
  } catch (error) {
    console.error(error)
  }
}

export default aggregateRegistration
