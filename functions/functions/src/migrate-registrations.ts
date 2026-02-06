import { getFirestore } from 'firebase-admin/firestore'

export async function migrateRegistrationsToCampParticipants() {
  const db = getFirestore()
  const registrations = await db.collection('registrations').get()

  const batch = db.batch()
  let count = 0

  for (const doc of registrations.docs) {
    const data = doc.data()

    const participant = {
      userId: null, // No user accounts yet
      campId: data.campId,
      personalInfo: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phoneNumber,
        whatsappNumber: data.whatsappNumber,
        gender: data.gender,
      },
      groupingValues: {}, // Populate from campusId if needed
      states: {
        registration: 'registered',
        payment: 'pending',
        room: 'unassigned',
        checkIn: 'not_arrived',
      },
      paymentDetails: {
        amountDue: 0, // Set from camp config
        amountPaid: 0,
        auditHistory: [],
      },
      createdAt: data.timestamp || new Date(),
      updatedAt: new Date(),
    }

    const newRef = db.collection('camp_participants').doc()
    batch.set(newRef, participant)
    count++

    // Firestore batch limit is 500
    if (count % 500 === 0) {
      await batch.commit()
    }
  }

  await batch.commit()
  console.log(`Migrated ${count} registrations to camp_participants`)
}

// Run via HTTP function
export const runMigration = onRequest(async (req, res) => {
  try {
    await migrateRegistrationsToCampParticipants()
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})
