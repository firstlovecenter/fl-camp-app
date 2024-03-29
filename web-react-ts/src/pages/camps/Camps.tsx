import React from 'react'
import {
  Container,
  Heading,
  Stack,
  Button,
  Box,
  Center,
  Text,
} from '@chakra-ui/react'
import { ApolloWrapper } from '@jaedag/admin-portal-react-core'
import CampCard from '../../components/CampCard'
import { collection, DocumentData } from '@firebase/firestore'
import { useFirestore, useFirestoreCollectionData } from 'reactfire'
import { Camp } from '../../../global'
import { useNavigate } from 'react-router-dom'

const Camps = () => {
  const navigate = useNavigate()

  const firestore = useFirestore()
  const campCollection = collection(firestore, 'camps')
  const { status, data: campDocs } = useFirestoreCollectionData(
    campCollection,
    {
      idField: 'id',
    }
  )

  const camps: Camp[] = []

  campDocs?.forEach((camp: DocumentData) => {
    camps.push({
      id: camp.id,
      name: camp.name,
      campLevel: camp.campLevel,
      roomOption: '',
      role: '',
      startDate: camp.startDate,
      endDate: camp.endDate,
    })
  })

  const loading = !camps

  const error = ''
  if (status === 'error') {
    console.log('error', error)
  }

  return (
    <ApolloWrapper data={camps} loading={loading}>
      <Container my={6}>
        <Heading>Camps</Heading>
        <Stack direction="column" spacing={1}>
          <Button
            colorScheme="blue"
            variant="solid"
            onClick={() => navigate('/camp/start-camp')}
            my={6}
            py={6}
          >
            Add Camp
          </Button>
        </Stack>
        {camps ? (
          camps?.map((camp: Camp, index: number) => (
            <CampCard
              name={camp?.name}
              campLevel={camp?.campLevel}
              roomOption={camp?.roomOption}
              startDate={camp?.startDate}
              endDate={camp?.endDate}
              role={'Admin'}
              key={index}
              campId={camp?.id}
            />
          ))
        ) : (
          <Box p={20} bg={'blackAlpha.100'}>
            <Center alignContent="center">
              <Text>No Camps Started</Text>
            </Center>
            <Center>
              <Text>Start A Camp!</Text>
            </Center>
          </Box>
        )}
      </Container>
    </ApolloWrapper>
  )
}

export default Camps
