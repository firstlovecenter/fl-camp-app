import React, { useState } from 'react'
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
import SelectCampusModal from 'components/modals/SelectCampusModal'

const RegisterMembers = () => {
  let { campId } = useClickCard()
  if (!campId) campId = ''

  const firestore = useFirestore()
  const { data: camp } = useFirestoreDocData(doc(firestore, 'camps', campId))

  const [isOpenSelectCampusModal, setIsOpenSelectCampusModal] = useState(false)
  const onOpenSelectCampusModal = () => setIsOpenSelectCampusModal(true)
  const onCloseSelectCampusModal = () => setIsOpenSelectCampusModal(false)

  const onSubmitModal = () => {
    // Handle submission logic here
  }

  return (
    <Container p={6} my={3}>
      {/* <SelectCampusModal
        isOpen={isOpenSelectCampusModal}
        onClose={onCloseSelectCampusModal}
        onSubmit={onSubmitModal}
        // campOptions={campOptions}
        user={userEmail}
      /> */}
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
  )
}

export default RegisterMembers
