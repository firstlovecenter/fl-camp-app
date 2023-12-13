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
import RegisterMembersSearch from 'components/RegisteredMembersSearch'
import { useFirestore, useFirestoreDocData } from 'reactfire'
import { doc } from '@firebase/firestore'
import useClickCard from 'hooks/useClickCard'
import NotRegisteredMembersSearch from 'components/NotRegisteredMembersSearch'
import { ApolloWrapper } from '@jaedag/admin-portal-react-core'

const RegisterMembers = () => {
  let { campId } = useClickCard()

  if (!campId) campId = ''

  const firestore = useFirestore()
  const { data: camp } = useFirestoreDocData(doc(firestore, 'camps', campId))

  const loading = !camp

  return (
    <ApolloWrapper data={camp} loading={loading}>
      <Container p={6} my={3}>
        <Box>
          <Center>
            <Text textAlign={'center'}>{camp?.name}</Text>
          </Center>
        </Box>
        <Box mt={2}>
          <Tabs isFitted>
            <TabList>
              <Tab>Registered Users</Tab>
              <Tab>All Users</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <RegisterMembersSearch campId={campId} />
              </TabPanel>
              <TabPanel>
                <NotRegisteredMembersSearch />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </ApolloWrapper>
  )
}

export default RegisterMembers
