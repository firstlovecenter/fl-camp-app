import { Container, Heading, Box, Button, Center, Text } from '@chakra-ui/react'
import { ApolloWrapper } from '@jaedag/admin-portal-react-core'
import React from 'react'
import { useFirestore, useFirestoreCollectionData } from 'reactfire'
import { collection } from '@firebase/firestore'
import UserSearch from 'components/UserSearch'
import { useNavigate } from 'react-router-dom'
import { UserData } from '../../../global'

const UserList = () => {
  const firestore = useFirestore()
  const navigate = useNavigate()
  return (
    <Container px={6}>
      <Box mt={6}>
        <Heading>Users</Heading>
        <Text>All Users</Text>
      </Box>
      <Box>
        <Center>
          <Button
            width="100%"
            my={4}
            py={7}
            colorScheme="telegram"
            onClick={() => navigate('/add-user')}
          >
            Add A User
          </Button>
        </Center>
        <UserSearch />
      </Box>
    </Container>
  )
}

export default UserList
