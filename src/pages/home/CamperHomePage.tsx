import { Container, Box } from '@chakra-ui/layout'
import React, { useEffect, useState } from 'react'
import { useAuth } from 'contexts/AuthContext'
import { Heading } from '@chakra-ui/react'

import CampCard from 'components/CampCard'
import { useFirestore, useFirestoreCollectionData } from 'reactfire'
import {
  collection,
  query,
  doc,
  getDoc,
  where,
  getDocs,
} from 'firebase/firestore'
import { db } from 'firebase'
import { parseRegistrationOptions } from 'utils/utils'
import { ApolloWrapper } from '@jaedag/admin-portal-react-core'
import { FetchedCampDataCamper } from '../../../global'

const CamperHomePage = () => {
  const { currentUser, logout } = useAuth()

  const [camps, setcamps] = useState<FetchedCampDataCamper[]>([])
  const [loading, setLoading] = useState(true)

  const email = currentUser?.email || ''

  const firestore = useFirestore()

  const userCampsQuery = query(
    collection(firestore, 'users', email, 'camp_camper')
  )

  const { data: campsData } = useFirestoreCollectionData(userCampsQuery, {
    idField: 'id',
  })

  useEffect(() => {
    const fetchData = async () => {
      const fetchedCamps: FetchedCampDataCamper[] = []
      if (Array.isArray(campsData)) {
        await Promise.all(
          campsData?.map(async (camp) => {
            const campee = await getDoc(doc(firestore, 'camps', camp.id))

            const q = query(
              collection(db, 'registrations'),
              where('email', '==', email),
              where('camp', '==', camp.id)
            )

            const querySnapshot = await getDocs(q)
            const registrationDetails = parseRegistrationOptions(querySnapshot)

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
              campStatus: false,
              campType: campee.data()?.campType,
            })
          })
        )
      }

      // console.log(fetchedCamps)
      setcamps(fetchedCamps)
      setLoading(false)
    }

    fetchData()
  }, [campsData, email, firestore])

  return (
    <ApolloWrapper data={camps} loading={loading}>
      <Box bg="body.bg">
        <Container my={6}>
          <Heading>Welcome Camper!</Heading>
          <Box mt={6}>
            {camps &&
              camps.map((camp, index) => (
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
                  campStatus={camp?.campStatus}
                />
              ))}
          </Box>
        </Container>
      </Box>
    </ApolloWrapper>
  )
}

export default CamperHomePage
