import { Container, Box } from '@chakra-ui/layout'
import React, { useEffect, useState } from 'react'
import { useAuth } from 'contexts/AuthContext'
import { Heading } from '@chakra-ui/react'
import CampCard from 'components/CampCard'
import { useFirestore, useFirestoreDocData } from 'reactfire'
import { doc, getDoc, DocumentData } from 'firebase/firestore'
import { ApolloWrapper } from '@jaedag/admin-portal-react-core'
import { FetchedCampData } from '../../../global'
import CampCardSkeleton from 'components/CampCardSkeleton'

const AdminHomePage = () => {
  const { currentUser } = useAuth()

  const [camps, setcamps] = useState<FetchedCampData[]>([])
  const [loading, setLoading] = useState(true)

  const email = currentUser?.email || ''

  const firestore = useFirestore()

<<<<<<< HEAD
  const userReference = doc(firestore, 'users', email)
  const { status, data: user } = useFirestoreDocData(userReference)
=======
  const ref = doc(firestore, 'users', email)
  const { status, data: user } = useFirestoreDocData(ref)

  console.log('campsData')
>>>>>>> 9f4cf98 (fix: change user camp data to object field instead of subcollection)

  useEffect(() => {
    const fetchData = async () => {
      const fetchedCamps: FetchedCampData[] = []
      if (Array.isArray(user?.camp_admin)) {
        await Promise.all(
<<<<<<< HEAD
          user?.camp_admin?.map(async (camp: any) => {
            const campee = await getDoc(doc(firestore, 'camps', camp?.campId))

            fetchedCamps.push({
              id: camp?.campId,
=======
          user?.camp_admin?.map(async (camp) => {
            const campee = await getDoc(doc(firestore, 'camps', camp.campId))

            fetchedCamps.push({
              id: camp.campId,
>>>>>>> 9f4cf98 (fix: change user camp data to object field instead of subcollection)
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
<<<<<<< HEAD
  }, [user?.camp_admin, email, firestore])
=======
  }, [user, email, firestore])
>>>>>>> 9f4cf98 (fix: change user camp data to object field instead of subcollection)

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
