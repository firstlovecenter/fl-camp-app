import { Container, Heading, Box, Button, Center, Text } from '@chakra-ui/react'
import {
  ApolloWrapper,
  SearchMemberCard,
} from '@jaedag/admin-portal-react-core'
import UserListCard from '../../components/UserListCard'
import React from 'react'
import { useFirestore, useFirestoreCollectionData } from 'reactfire'
import { collection } from '@firebase/firestore'

const UserList = () => {
  const firestore = useFirestore()
  const userCollection = collection(firestore, 'users')
  const { status, data: users } = useFirestoreCollectionData(userCollection, {
    idField: 'id',
  })

  console.log('users', users)

  const loading = !users

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
          <Box mt={4}>
            {users?.map((user, index) => (
              <UserListCard
                id={user?.id}
                name={user?.firstName + ' ' + user?.lastName}
                key={index}
                role={user?.roles}
              />
            ))}
          </Box>
        </Box>
      </Container>
    </ApolloWrapper>
  )
}

export default UserList
