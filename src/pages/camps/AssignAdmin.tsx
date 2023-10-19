import { Button, Container, useToast, Heading } from '@chakra-ui/react'
import AssignAdminUserSearch from 'components/AssignAdminUserSearch'
import { collection } from '@firebase/firestore'
import { useFirestore, useFirestoreCollectionData } from 'reactfire'
import React, { useState } from 'react'
import { UserData } from '../../../global'
import { ApolloWrapper } from '@jaedag/admin-portal-react-core'
import AssignCampAdminModal from 'components/modals/AssignCampAdminModal'

const AssignAdmin = () => {
  const [isOpenFirstModal, setIsOpenFirstModal] = useState(false)
  const onOpenFirstModal = () => setIsOpenFirstModal(true)
  const onCloseFirstModal = () => setIsOpenFirstModal(false)
  const toast = useToast()

  const firestore = useFirestore()
  const userCollection = collection(firestore, 'users')
  const { data: users } = useFirestoreCollectionData(userCollection, {
    idField: 'id',
  })

  const loading = !users

  const usersData: UserData[] = []

  users?.forEach((user: any) => {
    usersData.push(user)
  })

  // Submit handler for both modals
  const onSubmitModal = () => {
    // Handle submission logic here
  }

  return (
    <ApolloWrapper data={usersData} loading={loading}>
      <Container p={6}>
        <AssignCampAdminModal
          isOpen={isOpenFirstModal}
          onClose={onCloseFirstModal}
          onSubmit={onSubmitModal}
        />
        <Heading my={3}>Assign Admin</Heading>
        <AssignAdminUserSearch modal={onOpenFirstModal} />
      </Container>
    </ApolloWrapper>
  )
}

export default AssignAdmin
