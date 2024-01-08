import React from 'react'
import { Box, Button, Container, Heading, Stack, Text } from '@chakra-ui/react'
import DetailsCard from '../../../components/DetailsCard'
import { useNavigate } from 'react-router-dom'
import { doc } from '@firebase/firestore'
import { useChurchId } from '../../../contexts/IdContext'
import { useFirestore, useFirestoreDocData } from 'reactfire'
import { ApolloWrapper } from '@jaedag/admin-portal-react-core'
import useClickCard from '../../../hooks/useClickCard'

const CountryProfile = () => {
  const navigate = useNavigate()
  const { countryId } = useChurchId()
  const { campId } = useClickCard()

  console.log('countryId', countryId)
  console.log('campId', campId)

  const firestore = useFirestore()
  const ref = doc(firestore, 'camps', campId as string, 'countries', countryId)
  const { status, data: country } = useFirestoreDocData(ref)

  console.log('country', country)

  const loading = !country

  let error = ''
  if (status === 'error') {
    error = 'Error'
  }

  return (
    <ApolloWrapper data={country} loading={loading} error={error}>
      <Container>
        <Box>
          <Heading mt={6}>{country?.name}</Heading>
          <Text>Country</Text>
          <Box my={6}>
            <DetailsCard
              number={country?.registrations ? country?.registrations : 0}
              title={'Registrations'}
            />
            <DetailsCard
              number={
                country?.paidRegistrations ? country?.paidRegistrations : 0
              }
              title={'Paid Registrations'}
            />
            <DetailsCard
              number={country?.campuses ? country?.campuses : 0}
              title={'Campuses'}
            />
            <Stack direction="column" spacing={1}>
              <Button
                colorScheme="yellow"
                variant="solid"
                onClick={() => navigate('/camp/campuses-by-country')}
                my={3}
              >
                View All Campuses
              </Button>
            </Stack>
          </Box>
        </Box>
      </Container>
    </ApolloWrapper>
  )
}

export default CountryProfile
