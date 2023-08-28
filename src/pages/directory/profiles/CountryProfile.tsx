import React, { useEffect, useState } from 'react'
import { Box, Button, Container, Heading, Stack, Text } from '@chakra-ui/react'
import DetailsCard from '../../../components/DetailsCard'
import { useNavigate } from 'react-router-dom'
import { doc, getDoc } from '@firebase/firestore'
import { db } from 'firebase'
import { useChurchId } from 'contexts/IdContext'
import { CountryPageDetails } from 'utils/ProfileDataTypes'

const CountryProfile = () => {
  const navigate = useNavigate()
  const { countryId } = useChurchId()

  const [pageDetails, setPageDetails] = useState<CountryPageDetails>({
    registrations: 0,
    paidRegistrations: 0,
    campuses: 0,
    name: '',
    id: '',
  })

  const campusDetails = async () => {
    const docRef = doc(db, 'countries', countryId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const res: CountryPageDetails = {
        id: docSnap.id,
        paidRegistrations: docSnap?.data()?.paidRegistrations,
        registrations: docSnap?.data()?.registrations,
        name: docSnap?.data()?.name,
        campuses: 2,
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
        <Text>Country</Text>
        <Box my={6}>
          <DetailsCard
            number={pageDetails.registrations}
            title={'Registrations'}
          />
          <DetailsCard
            number={pageDetails.paidRegistrations}
            title={'Paid Registrations'}
          />
          <DetailsCard number={pageDetails.campuses} title={'Campuses'} />
          <Stack direction="column" spacing={1}>
            <Button
              colorScheme="yellow"
              variant="solid"
              onClick={() => navigate('/campuses-by-country')}
              my={3}
            >
              View All Campuses
            </Button>
          </Stack>
        </Box>
      </Box>
    </Container>
  )
}

export default CountryProfile
