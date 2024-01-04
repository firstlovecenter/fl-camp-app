import React from 'react'
import { Box, Button, Container, Heading, Stack, Text } from '@chakra-ui/react'
import DetailsCard from '../../../components/DetailsCard'
import { useNavigate } from 'react-router-dom'
import { doc } from '@firebase/firestore'
import { useChurchId } from '../../../contexts/IdContext'
import { useFirestore, useFirestoreDocData } from 'reactfire'
import { ApolloWrapper } from '@jaedag/admin-portal-react-core'

const EarthProfile = () => {
  const navigate = useNavigate()
  const { planetId } = useChurchId()

  const firestore = useFirestore()
  const ref = doc(firestore, 'earth', planetId)
  const { status, data: earth } = useFirestoreDocData(ref)

  const loading = !earth

  let error = ''
  if (status === 'error') {
    error = 'Error'
  }

  return (
    <ApolloWrapper data={earth} loading={loading} error={error}>
      <Container>
        <Box>
          <Heading mt={6}>{earth?.name}</Heading>
          <Text>World</Text>
          <Box my={6}>
            <DetailsCard
              number={earth?.registrations}
              title={'Registrations'}
            />
            <DetailsCard
              number={earth?.paidRegistrations}
              title={'Paid Registrations'}
            />
            <DetailsCard number={2} title={'Continents'} />
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
    </ApolloWrapper>
  )
}

export default EarthProfile
