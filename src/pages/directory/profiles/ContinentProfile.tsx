import React, { useEffect, useState } from 'react'
import { Box, Button, Container, Heading, Stack, Text } from '@chakra-ui/react'
import DetailsCard from '../../../components/DetailsCard'
import { useNavigate } from 'react-router-dom'
import { doc } from '@firebase/firestore'
import { useChurchId } from 'contexts/IdContext'
import { useFirestore, useFirestoreDocData } from 'reactfire'
import { ApolloWrapper } from '@jaedag/admin-portal-react-core'

const ContinentProfile = () => {
  const navigate = useNavigate()
  const { continentId } = useChurchId()

  const firestore = useFirestore()
  const ref = doc(firestore, 'continents', continentId)
  const { status, data: continents } = useFirestoreDocData(ref)

  const loading = !continents

  let error = ''
  if (status === 'error') {
    error = 'Error'
  }

  return (
    <ApolloWrapper data={continents} loading={loading} error={error}>
      <Container>
        <Box>
          <Heading mt={6}>{continents?.name}</Heading>
          <Text>Continent</Text>
          <Box my={6}>
            <DetailsCard
              number={continents?.registrations}
              title={'Registrations'}
            />
            <DetailsCard
              number={continents?.paidRegistrations}
              title={'Paid Registrations'}
            />
            <DetailsCard number={continents?.countries} title={'Countries'} />
            <Stack direction="column" spacing={1}>
              <Button
                colorScheme="yellow"
                variant="solid"
                onClick={() => navigate('/countries-by-continent')}
                my={3}
              >
                View All Countries
              </Button>
            </Stack>
          </Box>
        </Box>
      </Container>
    </ApolloWrapper>
  )
}

export default ContinentProfile
