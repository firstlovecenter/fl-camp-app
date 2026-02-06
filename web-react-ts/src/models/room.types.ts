import { Timestamp } from 'firebase/firestore'
export interface Room {
  id?: string
  campId: string
  name: string // e.g., 'Dorm A - Room 101'
  type: 'dorm' | 'private' | 'tent' | 'other'
  capacity: number
  gender?: 'male' | 'female' | 'mixed'
  overbookAllowed: boolean
  occupants: string[] // Array of participant IDs
  price?: number
  location?: string
  amenities?: string[]
  notes?: string
  createdAt: Timestamp
}
