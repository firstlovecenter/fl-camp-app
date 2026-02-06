import { onDocumentUpdated } from 'firebase-functions/v2/firestore'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import { HttpsError } from 'firebase-functions/v2/https'

const db = getFirestore()

const enforceParticipantStateTransitions = onDocumentUpdated(
  'camp_participants/{participantId}',
  async (event) => {
    const before = event.data?.before.data()
    const after = event.data?.after.data()

    if (!before || !after) return

    const stateTypes: ('registration' | 'payment' | 'room' | 'checkIn')[] = [
      'registration',
      'payment',
      'room',
      'checkIn',
    ]

    const asyncTasks: Promise<any>[] = []

    for (const stateType of stateTypes) {
      const oldState = before.states?.[stateType]
      const newState = after.states?.[stateType]

      if (oldState !== newState) {
        if (!canTransitionState(oldState, newState, stateType)) {
          // Revert invalid transition
          asyncTasks.push(
            event.data.after.ref.update({
              [`states.${stateType}`]: oldState,
            })
          )

          console.error(
            `Invalid ${stateType} state transition: ${oldState} -> ${newState}`
          )
          throw new HttpsError(
            'failed-precondition',
            `Cannot transition ${stateType} from ${oldState} to ${newState}`
          )
        }

        // Log state change
        console.log(
          `Participant ${event.params.participantId}: ${stateType} ${oldState} -> ${newState}`
        )

        // Trigger side effects
        if (stateType === 'payment' && newState === 'paid') {
          // Auto-assign room if pre_assigned mode
          asyncTasks.push(autoAssignRoom(event.data.after.ref.id, after.campId))
        }
      }
    }

    // Wait for all async tasks to complete
    if (asyncTasks.length > 0) {
      await Promise.all(asyncTasks)
    }

    // Update timestamp
    await event.data.after.ref.update({
      updatedAt: FieldValue.serverTimestamp(),
    })
  }
)

function canTransitionState(
  from: string,
  to: string,
  stateType: string
): boolean {
  const transitions: Record<string, Record<string, string[]>> = {
    registration: {
      draft: ['registered', 'cancelled'],
      registered: ['cancelled'],
    },
    payment: {
      pending: ['partial', 'paid', 'waived'],
      partial: ['paid', 'waived'],
    },
    room: {
      unassigned: ['tentative', 'assigned'],
      tentative: ['assigned', 'unassigned'],
      assigned: ['unassigned'],
    },
    checkIn: {
      not_arrived: ['arrived'],
      arrived: ['departed'],
    },
  }

  return transitions[stateType]?.[from]?.includes(to) ?? false
}

async function autoAssignRoom(participantId: string, campId: string) {
  const campRef = db.collection('camps').doc(campId)
  const camp = await campRef.get()

  if (camp.data()?.roomAssignment?.autoAssign !== true) {
    // Auto-assign is not enabled, so do nothing
    return
  }
}

export default enforceParticipantStateTransitions
