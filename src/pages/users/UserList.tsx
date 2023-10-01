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
  const userCollection = collection(firestore, 'users')
  const { status, data: users } = useFirestoreCollectionData(userCollection, {
    idField: 'id',
  })

  const loading = !users

  const usersData: UserData[] = []

  users?.forEach((user: any) => {
    usersData.push(user)
  })

  return (
    <ApolloWrapper loading={loading} data={users}>
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
          <UserSearch users={usersData} />
        </Box>
      </Container>
    </ApolloWrapper>
  )
}

export default UserList
