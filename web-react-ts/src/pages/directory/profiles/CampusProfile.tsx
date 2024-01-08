import React from 'react'
import { Box, Container, Heading, Text } from '@chakra-ui/react'
import DetailsCard from '../../../components/DetailsCard'
// import { useNavigate } from 'react-router-dom'
import { doc } from '@firebase/firestore'
import { useChurchId } from '../../../contexts/IdContext'
import { useFirestore, useFirestoreDocData } from 'reactfire'
import { ApolloWrapper } from '@jaedag/admin-portal-react-core'
import useClickCard from '../../../hooks/useClickCard'

const CampusProfile = () => {
  // const navigate = useNavigate()
  const { campusId } = useChurchId()
  const { campId } = useClickCard()

  const firestore = useFirestore()
  const ref = doc(firestore, 'camps', campId as string, 'campuses', campusId)
  const { status, data: campus } = useFirestoreDocData(ref)

  const loading = !campus

  let error = ''
  if (status === 'error') {
    error = 'Error'
  }

  return (
    <ApolloWrapper data={campus} loading={loading} error={error}>
      <Container>
        <Box>
          <Heading mt={6}>{campus?.name}</Heading>
          <Text>Campus</Text>
          <Box my={6}>
            <DetailsCard
              number={campus?.registrations ? campus?.registrations : 0}
              title={'Registrations'}
            />
            <DetailsCard
              number={campus?.paidRegistrations ? campus?.paidRegistrations : 0}
              title={'Paid Registrations'}
            />

            {/* <Stack direction="column" spacing={1}>
              <Button
                colorScheme="yellow"
                variant="solid"
                onClick={() => navigate('/add-admin')}
                my={3}
              >
                Add An Admin
              </Button>
            </Stack> */}
          </Box>
        </Box>
      </Container>
    </ApolloWrapper>
  )
}

export default CampusProfile
