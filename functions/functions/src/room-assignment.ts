import { onCall } from 'firebase-functions/v2/https'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import { HttpsError } from 'firebase-functions/v2/https'

const db = getFirestore()

export const autoAssignRoom = onCall(async (request) => {
  const { participantId } = request.data

  const participantRef = db.collection('camp_participants').doc(participantId)
  const participant = await participantRef.get()

  if (!participant.exists) {
    throw new HttpsError('not-found', 'Participant not found')
  }

  const data = participant.data()!
  const campId = data.campId
  const gender = data.personalInfo.gender

  // Get camp config
  const camp = await db.collection('camps').doc(campId).get()
  const roomConfig = camp.data()?.roomAssignment

  if (!roomConfig?.autoAssign) {
    throw new HttpsError(
      'failed-precondition',
      'Auto-assign not enabled for this camp'
    )
  }

  // Query available rooms
  const roomsQuery = db
    .collection('rooms')
    .where('campId', '==', campId)
    .where('gender', 'in', [gender, 'mixed', null])

  const rooms = await roomsQuery.get()

  // Find room with lowest occupancy (not full)
  let bestRoom: any = null
  let lowestOccupancy = Infinity

  for (const room of rooms.docs) {
    const occupants = room.data().occupants || []
    const capacity = room.data().capacity

    if (occupants.length < capacity || room.data().overbookAllowed) {
      if (occupants.length < lowestOccupancy) {
        lowestOccupancy = occupants.length
        bestRoom = room
      }
    }
  }

  if (!bestRoom) {
    throw new HttpsError('resource-exhausted', 'No available rooms')
  }

  // Atomic update (transaction to prevent race condition)
  await db.runTransaction(async (transaction) => {
    const roomDoc = await transaction.get(bestRoom.ref)
    const currentOccupants = roomDoc.data()?.occupants || []

    // Check capacity again inside transaction
    if (
      currentOccupants.length >= roomDoc.data()?.capacity &&
      !roomDoc.data()?.overbookAllowed
    ) {
      throw new HttpsError(
        'resource-exhausted',
        'Room filled during assignment'
      )
    }

    // Update room
    transaction.update(bestRoom.ref, {
      occupants: FieldValue.arrayUnion(participantId),
    })

    // Update participant
    transaction.update(participantRef, {
      roomAssignment: {
        roomId: bestRoom.id,
        tentative: false,
        assignedAt: FieldValue.serverTimestamp(),
        assignedBy: 'system_auto',
      },
      'states.room': 'assigned',
      updatedAt: FieldValue.serverTimestamp(),
    })
  })

  return {
    success: true,
    roomId: bestRoom.id,
    roomName: bestRoom.data()?.name,
  }
})

export const manualAssignRoom = onCall(async (request) => {
  const { participantId, roomId } = request.data
  const actorId = request.auth?.uid

  if (!actorId) {
    throw new HttpsError('unauthenticated', 'Must be logged in')
  }

  // Similar transaction logic but with actorId tracking
  await db.runTransaction(async (transaction) => {
    const participantRef = db.collection('camp_participants').doc(participantId)
    const roomRef = db.collection('rooms').doc(roomId)

    const participant = await transaction.get(participantRef)
    const room = await transaction.get(roomRef)

    if (!participant.exists || !room.exists) {
      throw new HttpsError('not-found', 'Participant or room not found')
    }

    // Remove from old room if exists
    const oldRoomId = participant.data()?.roomAssignment?.roomId
    if (oldRoomId) {
      const oldRoomRef = db.collection('rooms').doc(oldRoomId)
      transaction.update(oldRoomRef, {
        occupants: FieldValue.arrayRemove(participantId),
      })
    }

    // Add to new room
    transaction.update(roomRef, {
      occupants: FieldValue.arrayUnion(participantId),
    })

    transaction.update(participantRef, {
      roomAssignment: {
        roomId,
        tentative: false,
        assignedAt: FieldValue.serverTimestamp(),
        assignedBy: actorId,
      },
      'states.room': 'assigned',
    })
  })

  return { success: true }
})
