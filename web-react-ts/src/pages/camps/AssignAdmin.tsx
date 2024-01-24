import React, { useState } from 'react'
import { Container, Heading } from '@chakra-ui/react'
import AssignAdminUserSearch from '../../components/AssignAdminUserSearch'
import { ApolloWrapper } from '@jaedag/admin-portal-react-core'
import AssignCampAdminModal from '../../components/camps/AssignCampAdminModal'

const AssignAdmin = () => {
  const [isOpenFirstModal, setIsOpenFirstModal] = useState(false)
  const onOpenFirstModal = () => setIsOpenFirstModal(true)
  const onCloseFirstModal = () => setIsOpenFirstModal(false)
  const [userId, setUserId] = useState('')

  // Submit handler for both modals
  const onSubmitModal = () => {
    // Handle submission logic here
  }

  return (
    <ApolloWrapper data={'data'} loading={false}>
      <Container p={6}>
        <AssignCampAdminModal
          isOpen={isOpenFirstModal}
          onClose={onCloseFirstModal}
          onSubmit={onSubmitModal}
          userId={userId}
        />
        <Heading my={3}>Assign Admin</Heading>
        <AssignAdminUserSearch modal={onOpenFirstModal} setUserId={setUserId} />
      </Container>
    </ApolloWrapper>
  )
}

export default AssignAdmin
