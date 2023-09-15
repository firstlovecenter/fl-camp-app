import { Container, Heading, Box, Button, Center, Text } from '@chakra-ui/react'
import { ApolloWrapper } from '@jaedag/admin-portal-react-core'
import React from 'react'
import { useFirestore, useFirestoreCollectionData } from 'reactfire'
import { collection } from '@firebase/firestore'
import UserSearch from 'components/UserSearch'

const UserList = () => {
  const firestore = useFirestore()
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
            <Button width="100%" my={4} py={7} colorScheme="telegram">
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
