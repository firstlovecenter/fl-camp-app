import {
  CheckInState,
  PaymentState,
  RegistrationState,
  RoomState,
} from './participant.types'

// Helper: State transition validator
export const canTransitionState = (
  from: RegistrationState | PaymentState | RoomState | CheckInState,
  to: RegistrationState | PaymentState | RoomState | CheckInState,
  stateType: 'registration' | 'payment' | 'room' | 'checkIn'
): boolean => {
  const transitions: Record<string, Record<string, string[]>> = {
    registration: {
      draft: ['registered', 'cancelled'],
      registered: ['cancelled'],
      cancelled: [], // Terminal
    },
    payment: {
      pending: ['partial', 'paid', 'waived'],
      partial: ['paid', 'waived'],
      paid: [], // Terminal
      waived: [], // Terminal
    },
    room: {
      unassigned: ['tentative', 'assigned'],
      tentative: ['assigned', 'unassigned'],
      assigned: ['unassigned'], // Can unassign
    },
    checkIn: {
      not_arrived: ['arrived'],
      arrived: ['departed'],
      departed: [], // Terminal
    },
  }

  return transitions[stateType]?.[from]?.includes(to) ?? false
}
