import { onCall } from 'firebase-functions/v2/https'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'
import { HttpsError } from 'firebase-functions/v2/https'

const db = getFirestore()

export const registerSelfService = onCall(async (request) => {
  const { campSlug, personalInfo, groupingValues, createAccount, password } =
    request.data

  // Find camp by slug
  const campsQuery = await db
    .collection('camps')
    .where('publicSlug', '==', campSlug)
    .limit(1)
    .get()

  if (campsQuery.empty) {
    throw new HttpsError('not-found', 'Camp not found')
  }

  const campDoc = campsQuery.docs[0]
  const camp = campDoc.data()

  // Check if self-service enabled
  if (!camp.enableSelfService) {
    throw new HttpsError(
      'permission-denied',
      'Self-registration not enabled for this camp'
    )
  }

  // Check registration window
  const now = new Date()
  if (
    now < camp.registration.start.toDate() ||
    now > camp.registration.end.toDate()
  ) {
    throw new HttpsError('failed-precondition', 'Registration period closed')
  }

  // Check max participants
  const participantsCount = await db
    .collection('camp_participants')
    .where('campId', '==', campDoc.id)
    .count()
    .get()

  if (participantsCount.data().count >= camp.registration.maxParticipants) {
    throw new HttpsError('resource-exhausted', 'Camp is full')
  }

  // Validate grouping dimensions
  for (const dimension of camp.groupingDimensions) {
    if (dimension.required && !groupingValues[dimension.name]) {
      throw new HttpsError('invalid-argument', `${dimension.name} is required`)
    }
    if (
      groupingValues[dimension.name] &&
      !dimension.values.includes(groupingValues[dimension.name])
    ) {
      throw new HttpsError(
        'invalid-argument',
        `Invalid ${dimension.name} value`
      )
    }
  }

  // Check for duplicates (phone number)
  const existingQuery = await db
    .collection('camp_participants')
    .where('campId', '==', campDoc.id)
    .where('personalInfo.phone', '==', personalInfo.phone)
    .limit(1)
    .get()

  if (!existingQuery.empty) {
    throw new HttpsError(
      'already-exists',
      'Phone number already registered for this camp'
    )
  }

  let userId: string | null = null

  // Create user account if requested
  if (createAccount && personalInfo.email && password) {
    try {
      const userRecord = await getAuth().createUser({
        email: personalInfo.email,
        password,
        displayName: `${personalInfo.firstName} ${personalInfo.lastName}`,
      })
      userId = userRecord.uid

      // Set initial custom claims
      await getAuth().setCustomUserClaims(userRecord.uid, {
        roles: ['campCamper'],
        scopedRoles: { [campDoc.id]: 'camper' },
      })
    } catch (error) {
      throw new HttpsError(
        'internal',
        `Failed to create account: ${error.message}`
      )
    }
  }

  // Create participant
  const participant = {
    userId,
    campId: campDoc.id,
    personalInfo,
    groupingValues,
    states: {
      registration: 'draft', // Becomes 'registered' after payment
      payment: 'pending',
      room: 'unassigned',
      checkIn: 'not_arrived',
    },
    paymentDetails: {
      amountDue: camp.payments.amountDue || 0,
      amountPaid: 0,
      auditHistory: [
        {
          actorId: userId || 'guest',
          timestamp: FieldValue.serverTimestamp(),
          action: 'self_registration',
          note: 'Self-service registration',
        },
      ],
    },
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  }

  const participantRef = await db
    .collection('camp_participants')
    .add(participant)

  // Generate Paystack payment link if aggregator mode
  let paymentLink = null
  if (
    camp.payments.defaultMode === 'aggregator' &&
    camp.payments.methods.includes('paystack')
  ) {
    // TODO: Call Paystack API to generate payment link
    const reference = `${campDoc.id}_${participantRef.id}`
    paymentLink = `https://paystack.com/pay/${reference}`
  }

  return {
    success: true,
    participantId: participantRef.id,
    paymentLink,
    userId,
  }
})
