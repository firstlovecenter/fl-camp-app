import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Heading,
  Text,
} from '@chakra-ui/react'

interface RemoveUserFromCampModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
}

const RemoveUserFromCampModal = ({
  isOpen,
  onClose,
  onSubmit,
}: RemoveUserFromCampModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={'xs'}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody>
          <Heading>User</Heading>
          <Text>Remove from Camp</Text>

          <Text>Action will remove user from camp</Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onSubmit}>
            Remove User
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default RemoveUserFromCampModal
