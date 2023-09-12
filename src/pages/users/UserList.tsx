import { Container, Heading, Box, Button, Center } from '@chakra-ui/react'
import { SearchMemberCard } from '@jaedag/admin-portal-react-core'
import UserListCard from '../../components/UserListCard'
import React from 'react'

const UserList = () => {
  const member = {
    id: 'abcd',
    firstName: 'John',
    lastName: 'Doe',
    pictureURL: 'https://bit.ly/dan-abramov',
  }

  return (
    <Container px={6}>
      <Box mt={6}>
        <Heading>Users</Heading>
      </Box>
      <Box>
        <Center>
          <Button>Add New User</Button>
        </Center>
        <Box mt={4}>
          <UserListCard name="David Dag" />
        </Box>
      </Box>
    </Container>
  )
}

export default UserList
