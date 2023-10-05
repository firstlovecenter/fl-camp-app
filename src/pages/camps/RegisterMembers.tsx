import React from 'react'
import {
  Container,
  Box,
  Center,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react'
import RegisterUserCard from '../../components/RegisterUserCard'
import RegisterMembersSearch from 'components/RegisterMemberSearch'

const users = ['David', 'John', 'Paul', 'Ringo', 'George']
const usersA = [
  {
    firstName: 'David',
    id: 'david@david.com',
    lastName: 'David',
    image_url: '',
    roles: ['admin'],
  },
  {
    firstName: 'John',
    id: 'abcd',
    lastName: 'John',
    image_url: '',
    roles: ['admin'],
  },
  {
    firstName: 'Paul',
    id: 'abcd',
    lastName: 'Paul',
    image_url: '',
    roles: ['admin'],
  },
]

const RegisterMembers = () => {
  return (
    <Container my={3}>
      <Box>
        <Center>
          <Text>MOTL 2023</Text>
        </Center>
      </Box>
      <Box>
        <Tabs isFitted>
          <TabList>
            <Tab>Registered Users</Tab>
            <Tab>All Users</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              {/* {usersA.map((user) => (
                <RegisterUserCard name={user?.name} email={user?.email} />
              ))} */}
              <RegisterMembersSearch users={usersA} />
              {/* <RegisterUserCard /> */}
            </TabPanel>
            <TabPanel>
              <p>two!</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default RegisterMembers
