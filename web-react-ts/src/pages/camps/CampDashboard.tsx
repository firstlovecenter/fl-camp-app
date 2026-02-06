import React, { useEffect, useState } from 'react'
import {
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/react'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '../../firebase'

interface DashboardStats {
  totalRegistered: number
  paymentPending: number
  paymentPaid: number
  roomsUnassigned: number
  checkedIn: number
}

export const CampDashboard: React.FC<{ campId: string }> = ({ campId }) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalRegistered: 0,
    paymentPending: 0,
    paymentPaid: 0,
    roomsUnassigned: 0,
    checkedIn: 0,
  })

  useEffect(() => {
    // Real-time listener for all participants in camp
    const participantsQuery = query(
      collection(db, 'camp_participants'),
      where('campId', '==', campId)
    )

    const unsubscribe = onSnapshot(participantsQuery, (snapshot) => {
      let totalRegistered = 0
      let paymentPending = 0
      let paymentPaid = 0
      let roomsUnassigned = 0
      let checkedIn = 0

      snapshot.forEach((doc) => {
        const data = doc.data()

        if (data.states?.registration === 'registered') {
          totalRegistered++
        }

        if (data.states?.payment === 'pending') {
          paymentPending++
        } else if (data.states?.payment === 'paid') {
          paymentPaid++
        }

        if (data.states?.room === 'unassigned') {
          roomsUnassigned++
        }

        if (data.states?.checkIn === 'arrived') {
          checkedIn++
        }
      })

      setStats({
        totalRegistered,
        paymentPending,
        paymentPaid,
        roomsUnassigned,
        checkedIn,
      })
    })

    return () => unsubscribe()
  }, [campId])

  return (
    <SimpleGrid columns={{ base: 1, md: 3, lg: 5 }} spacing={6}>
      <Stat>
        <StatLabel>Total Registered</StatLabel>
        <StatNumber>{stats.totalRegistered}</StatNumber>
      </Stat>

      <Stat>
        <StatLabel>Payment Pending</StatLabel>
        <StatNumber color="orange.500">{stats.paymentPending}</StatNumber>
        <StatHelpText>Needs attention</StatHelpText>
      </Stat>

      <Stat>
        <StatLabel>Payment Complete</StatLabel>
        <StatNumber color="green.500">{stats.paymentPaid}</StatNumber>
      </Stat>

      <Stat>
        <StatLabel>Unassigned Rooms</StatLabel>
        <StatNumber color="red.500">{stats.roomsUnassigned}</StatNumber>
        <StatHelpText>Assign rooms</StatHelpText>
      </Stat>

      <Stat>
        <StatLabel>Checked In</StatLabel>
        <StatNumber>{stats.checkedIn}</StatNumber>
      </Stat>
    </SimpleGrid>
  )
}
