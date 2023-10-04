import { Container, Box } from '@chakra-ui/layout'
import React, { useEffect, useState } from 'react'
import { useAuth } from 'contexts/AuthContext'
import { Heading } from '@chakra-ui/react'
import CampCard from 'components/CampCard'
import { useFirestore, useFirestoreCollectionData } from 'reactfire'
import { collection, query, doc, getDoc } from 'firebase/firestore'
import { ApolloWrapper } from '@jaedag/admin-portal-react-core'
import { FetchedCampData } from '../../../global'

const AdminHomePage = () => {
  const { currentUser } = useAuth()

  const [camps, setcamps] = useState<FetchedCampData[]>([])
  const [loading, setLoading] = useState(true)

  const email = currentUser?.email || ''

  const firestore = useFirestore()

  const userCampsQuery = query(
    collection(firestore, 'users', email, 'camp_admin')
  )

  const { data: campsData } = useFirestoreCollectionData(userCampsQuery, {
    idField: 'id',
  })

  useEffect(() => {
    const fetchData = async () => {
      const fetchedCamps: FetchedCampData[] = []
      if (Array.isArray(campsData)) {
        await Promise.all(
          campsData?.map(async (camp) => {
            const campee = await getDoc(doc(firestore, 'camps', camp.id))

            fetchedCamps.push({
              id: camp.id,
              role: 'Admin',
              name: campee.data()?.name,
              campLevel: campee.data()?.campLevel,
              startDate: campee.data()?.startDate,
              endDate: campee.data()?.endDate,
              campStatus: campee.data()?.campStatus,
              campType: campee.data()?.campType,
            })
          })
        )
      }

      setcamps(fetchedCamps)
      setLoading(false)
    }

    fetchData()
  }, [campsData, email, firestore])

  return (
    <ApolloWrapper data={camps} loading={loading}>
      <Box bg="body.bg">
        <Container my={6}>
          <Heading>Welcome Admin!</Heading>
          <Box mt={6}>
            {camps?.map((camp, index) => (
              <CampCard
                name={camp?.name}
                campType={camp?.campType}
                registrationStatus={''}
                paymentStatus={''}
                role={camp?.role}
                startDate={camp?.startDate}
                endDate={camp?.endDate}
                roomOption={''}
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

export default AdminHomePage
