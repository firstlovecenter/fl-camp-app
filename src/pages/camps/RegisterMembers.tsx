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
import { useFirestore, useFirestoreCollectionData } from 'reactfire'
import { collection, query, where } from '@firebase/firestore'
import { UserData } from '../../../global'
import { check } from 'prettier'

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
  const firestore = useFirestore()
  const usersCollection = collection(firestore, 'users')
  const { status, data: users } = useFirestoreCollectionData(usersCollection, {
    idField: 'id',
  })
  console.log('users', users)

  const parsedUsers: UserData[] = []
  users?.forEach((user: any) => {
    parsedUsers.push({
      firstName: user?.firstName,
      id: user?.id,
      lastName: user?.lastName,
      image_url: user?.image_url,
      camp_admin: user?.camp_admin,
      camp_camper: user?.camp_camper,
      roles: user?.roles,
    })
  })

  console.log('parsedUsers', parsedUsers)

  const inCampUsers: UserCampData = []
  const notInCampUsers: UserCampData = []

  const checkCamp = (element: string) => {
    console.log('element', element)
    return element == 'lT1akYRvLl7FnVrPV8cp'
  }

  parsedUsers?.forEach((user) => {
    const belongsToCamp = user?.camp_camper?.some((camp) => {
      return checkCamp(camp.campId)
    })
    console.log('user', user, 'what it is', belongsToCamp)

    if (!belongsToCamp) {
      notInCampUsers.push(user)
    }

    if (belongsToCamp) {
      inCampUsers.push(user)
    }
  })

  console.log('inCampUsers', inCampUsers)
  console.log('notInCampUsers', notInCampUsers)

  // const belongsToCamp = parsedUsers?.camp_camper.some(
  //   (camp) => camp.campId === campIdToExclude
  // )

  // console.log('belongsToCamp', belongsToCamp)
  //
  const q = query(
    usersCollection,
    where('camp_camper', 'array-contains', {
      campId: 'lT1akYRvLl7FnVrPV8cp',
    })
  )

  const { otherStatus, data: campUsers } = useFirestoreCollectionData(q, {
    idField: 'id',
  })
  console.log('campUsers', campUsers)

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
              <RegisterMembersSearch users={inCampUsers} />
              {/* <RegisterUserCard /> */}
            </TabPanel>
            <TabPanel>
              <p>two!</p>
              <RegisterMembersSearch users={notInCampUsers} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default RegisterMembers
