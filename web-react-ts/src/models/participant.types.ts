import { Timestamp } from 'firebase/firestore'
export type RegistrationState = 'draft' | 'registered' | 'cancelled'
export type PaymentState = 'pending' | 'partial' | 'paid' | 'waived'
export type RoomState = 'unassigned' | 'tentative' | 'assigned'
export type CheckInState = 'not_arrived' | 'arrived' | 'departed'

export interface ParticipantStates {
  registration: RegistrationState
  payment: PaymentState
  room: RoomState
  checkIn: CheckInState
}

export interface AuditEntry {
  actorId: string // UID of who made change
  timestamp: Timestamp
  action: string // e.g., 'payment_updated', 'room_assigned'
  note?: string
  previousValue?: any
  newValue?: any
}

export interface PaymentDetails {
  amountDue: number
  amountPaid: number
  method?: string
  transactionRef?: string
  auditHistory: AuditEntry[]
}

export interface RoomAssignment {
  roomId: string // Reference to rooms doc
  tentative: boolean
  assignedAt: Timestamp
  assignedBy: string // UID
}

export interface CampParticipant {
  id?: string // Firestore auto ID
  userId?: string // Firebase UID (null for guests)
  campId: string

  // Personal info (denormalized for guests)
  personalInfo: {
    firstName: string
    lastName: string
    email?: string
    phone: string
    whatsappNumber?: string
    gender: 'male' | 'female' | 'other'
    dateOfBirth?: Timestamp
    emergencyContact?: {
      name: string
      phone: string
      relationship: string
    }
  }

  // Grouping (matches camp's dimensions)
  groupingValues: Record<string, string> // e.g., {Area: 'North', Council: 'Youth'}

  // State machine
  states: ParticipantStates

  // Payment
  paymentDetails: PaymentDetails

  // Room
  roomAssignment?: RoomAssignment

  // Check-in
  checkIn?: {
    timestamp: Timestamp
    actorId: string
    notes?: string
  }

  // Metadata
  notes?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}
