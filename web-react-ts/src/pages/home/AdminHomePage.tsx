import React, { useEffect, useState } from 'react'
import { Container, Box } from '@chakra-ui/layout'
import { useAuth } from '../../contexts/AuthContext'
import { Heading } from '@chakra-ui/react'
import CampCard from '../../components/CampCard'
import { useFirestore, useFirestoreDocData } from 'reactfire'
import { doc, getDoc, DocumentData } from 'firebase/firestore'
import { ApolloWrapper } from '@jaedag/admin-portal-react-core'
import { FetchedCampData } from '../../../global'
import CampCardSkeleton from '../../components/CampCardSkeleton'

const AdminHomePage = () => {
  const { currentUser } = useAuth()

  const [camps, setcamps] = useState<FetchedCampData[]>([])
  const [loading, setLoading] = useState(true)

  const email = currentUser?.email || ''

  const firestore = useFirestore()

  const userReference = doc(firestore, 'users', email)
  const { data: user } = useFirestoreDocData(userReference)

  useEffect(() => {
    const fetchData = async () => {
      const fetchedCamps: FetchedCampData[] = []
      if (Array.isArray(user?.camp_admin)) {
        await Promise.all(
          user?.camp_admin?.map(async (camp: DocumentData) => {
            const campee = await getDoc(doc(firestore, 'camps', camp?.campId))

            fetchedCamps.push({
              id: camp?.campId,
              role: 'Admin',
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
  }, [user?.camp_admin, email, firestore])

  return (
    <ApolloWrapper data={camps} loading={loading}>
      <Box bg="body.bg">
        <Container my={6}>
          <Heading>Welcome Admin!</Heading>
          <Box mt={6}>
            {loading && <CampCardSkeleton />}
            {camps &&
              camps?.map((camp, index) => (
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
                  campId={camp.id}
                />
              ))}
          </Box>
        </Container>
      </Box>
    </ApolloWrapper>
  )
}

export default AdminHomePage
