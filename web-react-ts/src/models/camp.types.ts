import { Timestamp } from 'firebase/firestore'

export interface GroupingDimension {
  name: string // e.g., 'Area', 'Council'
  required: boolean
  values: string[] // e.g., ['North', 'South', 'East']
  order: number // Display order
}

export interface PaymentConfig {
  methods: ('mobile_money' | 'paystack' | 'cash' | 'bank_transfer')[]
  defaultMode: 'aggregator' | 'manual'
  allowBulk: boolean
  allowPartial: boolean
  amountDue: number // Default amount
}

export interface RoomAssignmentConfig {
  type: 'pre_assigned' | 'on_site' | 'mixed'
  genderSegregation: boolean
  autoAssign: boolean
}

export interface Camp {
  // Existing fields
  name: string
  campLevel: 'campus' | 'country' | 'continent' | 'planet'
  startDate: Timestamp
  endDate: Timestamp
  registrationDeadline: Timestamp
  paymentDeadline: Timestamp
  levelId: string // Reference to planet/continent/country/campus doc

  // New fields
  description?: string
  location?: string
  registration: {
    start: Timestamp
    end: Timestamp
    maxParticipants: number
    autoClose: boolean
  }
  payments: PaymentConfig
  roomAssignment: RoomAssignmentConfig
  groupingDimensions: GroupingDimension[]
  enableSelfService: boolean
  publicSlug?: string // For self-service link (e.g., 'summer-2026')
  admins: string[] // UIDs of camp admins

  // Metadata
  createdAt: Timestamp
  createdBy: string // UID
  clonedFrom?: string // campId if cloned
}
