import { Container, Text, Center, Box } from '@chakra-ui/layout'
import React, { useState } from 'react'
import { useAuth } from 'contexts/AuthContext'
import { Heading } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import CampCard from 'components/CampCard'
import {
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
} from 'reactfire'
import { collection, query, doc, getDoc } from 'firebase/firestore'

const LandingPage = () => {
  const [error, setError] = useState('')
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const email = currentUser?.email || ''

  const firestore = useFirestore()

  const userCampsQuery = query(collection(firestore, 'users', email, 'camps'))

  const { status, data: campsData } = useFirestoreCollectionData(
    userCampsQuery,
    {
      idField: 'id',
    }
  )

  campsData?.forEach(async (camp) => {
    const campee = await getDoc(doc(firestore, 'camps', camp.id))
    console.log('check', campee.data())
  })

  const loading = !campsData

  console.log(campsData)

  // let error = ''
  // if (status === 'error') {
  //   error = 'Error'
  // }

  const camps = []
  const campAdmin = {
    name: 'Camp A',
    date: '10th to 14th, December 2023',
    campLevel: 'Worldwide',
    campStatus: 'Active',
    role: 'Admin',
    roomOption: '',
    paymentStatus: '',
    registrationStatus: '',
  }

  const campCamper = {
    name: 'Camp B',
    date: '10th to 14th, December 2023',
    campLevel: 'Worldwide',
    registrationStatus: 'Registered',
    paymentStatus: 'Paid',
    role: 'Camper',
    roomOption: 'Wise As Serpents - Room 12',
    campStatus: '',
  }

  camps.push(campAdmin)
  camps.push(campCamper)

  return (
    <Box bg="body.bg">
      <Container my={6}>
        <Heading>Welcome Camper!</Heading>
        <Box mt={6}>
          {camps.map((camp, index) => (
            <CampCard
              name={camp.name}
              type={camp.campLevel}
              registrationStatus={camp?.registrationStatus}
              paymentStatus={camp?.paymentStatus}
              role={camp.role}
              date={camp.date}
              roomOption={camp.roomOption}
              key={index}
              campStatus={camp?.campStatus}
            />
          ))}
        </Box>
      </Container>
    </Box>
  )
}

export default LandingPage
