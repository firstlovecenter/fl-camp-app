import { useEffect, useState } from 'react'
import { db } from '../firebase'
import { collection, onSnapshot, query, where } from '@firebase/firestore'

// web-react-ts/src/hooks/useCampParticipants.ts
type CampParticipant = { id: string } & Record<string, any>

export const useCampParticipants = (campId: string) => {
  const [participants, setParticipants] = useState<CampParticipant[]>([])

  useEffect(() => {
    const q = query(
      collection(db, 'camp_participants'),
      where('campId', '==', campId)
    )
    return onSnapshot(q, (snapshot) => {
      setParticipants(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
  }, [campId])

  return participants
}

export enum RegistrationState {
  Draft = 'draft',
  Registered = 'registered',
  Cancelled = 'cancelled',
}

export enum PaymentState {
  Pending = 'pending',
  Partial = 'partial',
  Paid = 'paid',
  Waived = 'waived',
}
