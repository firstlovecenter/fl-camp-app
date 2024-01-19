import React from 'react'
import { Box, Button, Container, Heading, Stack, Text } from '@chakra-ui/react'
import DetailsCard from '../../../components/DetailsCard'
import { useNavigate } from 'react-router-dom'
import { doc } from '@firebase/firestore'
import { useChurchId } from '../../../contexts/IdContext'
import { useFirestore, useFirestoreDocData } from 'reactfire'
import { ApolloWrapper } from '@jaedag/admin-portal-react-core'
import useClickCard from '../../../hooks/useClickCard'

const PlanetProfile = () => {
  const navigate = useNavigate()
  const { planetId } = useChurchId()
  const { campId } = useClickCard()

  const firestore = useFirestore()
  const ref = doc(firestore, 'camps', campId as string, 'planets', planetId)
  const { status, data: planet } = useFirestoreDocData(ref)

  const loading = !planet

  let error = ''
  if (status === 'error') {
    error = 'Error'
  }

  return (
    <ApolloWrapper data={planet} loading={loading} error={error}>
      <Container>
        <Box>
          <Heading mt={6}>{planet?.name}</Heading>
          <Text>World</Text>
          <Box my={6}>
            <DetailsCard
              number={planet?.registrations ? planet.registrations : 0}
              title={'Registrations'}
            />
            <DetailsCard
              number={planet?.paidRegistrations ? planet?.paidRegistrations : 0}
              title={'Paid Registrations'}
            />
            {/*add number of continents to this*/}
            <DetailsCard number={2} title={'Continents'} />
            <Stack direction="column" spacing={1}>
              <Button
                colorScheme="yellow"
                variant="solid"
                onClick={() => navigate('/camp/continents-by-planet')}
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

export default PlanetProfile
