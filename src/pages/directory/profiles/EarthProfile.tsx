import React, { useEffect, useState } from 'react'
import { Box, Button, Container, Heading, Stack, Text } from '@chakra-ui/react'
import DetailsCard from '../../../components/DetailsCard'
import { useNavigate } from 'react-router-dom'
import { doc, getDoc } from '@firebase/firestore'
import { db } from 'firebase'
import { useId } from 'contexts/IdContext'
import { ContinentPageDetails, EarthPageDetails } from 'utils/ProfileDataTypes'

const EarthProfile = () => {
  const navigate = useNavigate()

  const [pageDetails, setPageDetails] = useState<EarthPageDetails>({
    registrations: 0,
    paidRegistrations: 0,
    continents: 0,
    name: '',
    id: '',
  })

  const { earthId } = useId()

  const campusDetails = async () => {
    const docRef = doc(db, 'earth', earthId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const res: EarthPageDetails = {
        id: docSnap.id,
        paidRegistrations: docSnap?.data()?.paidRegistrations,
        registrations: docSnap?.data()?.registrations,
        name: docSnap?.data()?.name,
        continents: 2,
      }
      setPageDetails(res)
    } else {
      // docSnap.data() will be undefined in this case
      console.log('No such document!')
    }
  }

  const fetchData = async () => {
    await campusDetails()
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Container>
      <Box>
        <Heading mt={6}>{pageDetails.name}</Heading>
        <Text>Continent</Text>
        <Box my={6}>
          <DetailsCard
            number={pageDetails.registrations}
            title={'Registrations'}
          />
          <DetailsCard
            number={pageDetails.paidRegistrations}
            title={'Paid Registrations'}
          />
          <DetailsCard number={pageDetails.continents} title={'Continents'} />
          <Stack direction="column" spacing={1}>
            <Button
              colorScheme="yellow"
              variant="solid"
              onClick={() => navigate('/continents-by-earth')}
              my={3}
            >
              View All Continents
            </Button>
          </Stack>
        </Box>
      </Box>
    </Container>
  )
}

export default EarthProfile
