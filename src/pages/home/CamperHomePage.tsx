import { Container, Box } from '@chakra-ui/layout'
import React, { useEffect, useState } from 'react'
import { useAuth } from 'contexts/AuthContext'
import { Text } from '@chakra-ui/react'

import CampCard from 'components/CampCard'
import { useFirestore, useFirestoreDocData } from 'reactfire'
import { collection, query, doc, getDoc, getDocs } from 'firebase/firestore'
import { db } from 'firebase'
import { ApolloWrapper } from '@jaedag/admin-portal-react-core'
import { FetchedCampDataCamper } from '../../../global'

type UserRegistrationDetails = {
  paymentStatus: string
  roomOption: string
  user: string
}

const CamperHomePage = () => {
  const { currentUser } = useAuth()

  const [camps, setcamps] = useState<FetchedCampDataCamper[]>([])
  const [loading, setLoading] = useState(true)

  const email = currentUser?.email || ''

  const firestore = useFirestore()

  const userReference = doc(firestore, 'users', email)
  const { data: user } = useFirestoreDocData(userReference)

  useEffect(() => {
    const fetchData = async () => {
      const fetchedCamps: FetchedCampDataCamper[] = []
      if (Array.isArray(user?.camp_camper)) {
        await Promise.all(
          user?.camp_camper?.map(async (camp) => {
            const campee = await getDoc(doc(firestore, 'camps', camp.campId))

            const queryRegistrationDetails = query(
              collection(db, 'camps', camp.campId, 'registrations')
            )

            const queryRegistrationDetailsSnapshot = await getDocs(
              queryRegistrationDetails
            )

            const registrationDetails: UserRegistrationDetails[] = []
            queryRegistrationDetailsSnapshot.forEach((doc) => {
              registrationDetails.push({
                paymentStatus: doc.data()?.paymentStatus,
                roomOption: doc.data()?.roomOption,
                user: doc.data()?.user,
              })
            })

            fetchedCamps.push({
              id: camp.id,
              registrationStatus: 'Registered',
              paymentStatus: registrationDetails[0]?.paymentStatus
                ? 'Paid'
                : 'Not Paid',
              role: 'Camper',
              roomOption: '',
              name: campee.data()?.name,
              campLevel: campee.data()?.campLevel,
              startDate: campee.data()?.startDate,
              endDate: campee.data()?.endDate,
              campType: campee.data()?.campType,
            })
          })
        )
      }

      setcamps(fetchedCamps)
      setLoading(false)
    }

    fetchData()
  }, [user?.camp_camper, email, firestore])

  return (
    <ApolloWrapper data={camps} loading={loading}>
      <Box bg="body.bg">
        <Container mt={9}>
          <Text fontSize={23}>Camps</Text>
          <Box mt={5}>
            {camps.map((camp, index) => (
              <CampCard
                name={camp?.name}
                campType={camp?.campType}
                registrationStatus={camp?.registrationStatus}
                paymentStatus={camp?.paymentStatus}
                role={camp?.role}
                startDate={camp?.startDate}
                endDate={camp?.endDate}
                roomOption={camp?.roomOption}
                key={index}
              />
            ))}
          </Box>
        </Container>
      </Box>
    </ApolloWrapper>
  )
}

export default CamperHomePage
