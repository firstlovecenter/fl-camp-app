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
  Box,
  useToast,
} from '@chakra-ui/react'
import { Select } from '@jaedag/admin-portal-react-core'
import { ModalProps } from '../../../global'
import * as Yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { churchLevel } from '../../utils/utils'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { useFirestore } from 'reactfire'
import { CAMP_ADMIN_ROLES_OPTIONS } from '../../utils/constants'

import { getFunctions, httpsCallable } from 'firebase/functions'
import useClickCard from '../../hooks/useClickCard'

const AssignCampAdminModal = ({ isOpen, onClose }: ModalProps) => {
  const { userId, campId } = useClickCard()

  const user = userId || ''
  const camp = campId || ''

  const firestore = useFirestore()

  const toast = useToast()

  const initialValues = {
    campLevel: '',
  }

  const validationSchema = Yup.object({
    campLevel: Yup.string().required('Camp Level is a required field'),
  })

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<typeof initialValues>({
    resolver: yupResolver(validationSchema),
    defaultValues: initialValues,
  })

  const handleSubmitForm = async (values: typeof initialValues) => {
    try {
      const campLevel = values.campLevel
      //TODO: check if the user already has the camp assinged with the admin level
      const functions = getFunctions()
      const addClaimsToUser = httpsCallable(
        functions,
        'addClaimsToUsersCallable'
      )

      const callableResponse = await addClaimsToUser({
        email: user,
        permission: campLevel,
      })
      console.log('callable response', callableResponse)

      const campReference = doc(firestore, 'camps', camp)
      //TODO check if the camp already exists in the user's camp_admin array
      const campData = await getDoc(campReference)

      const userReference = doc(firestore, 'users', user)
      //TODO check if the camp already exists in the user's camp_admin array
      const userData = await getDoc(doc(firestore, 'users', user))
      const adminCamps = userData.data()?.camp_admin || []

      const campAdmin = [...adminCamps]

      const newCampObject = {
        campId: campId,
        churchLevel: churchLevel(campLevel),
        name: campData?.data()?.name,
        role: campLevel,
      }
      campAdmin.push(newCampObject)

      await updateDoc(userReference, {
        camp_admin: campAdmin,
      })

      toast({
        title: 'User Assigned',
        description: 'User has been made an admin',
        status: 'success',
        duration: 4000,
        isClosable: true,
      })
    } catch (error) {
      console.log(error)
      toast({
        title: 'User Not  Assigned',
        description: 'There was an error making the user and admin',
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={'xs'}
      scrollBehavior={'inside'}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Heading>Admin Users</Heading>
          <Text>Assign to Camp</Text>

          <form onSubmit={handleSubmit(handleSubmitForm)}>
            <Box my={3}>
              <Select
                name="campLevel"
                label="Level"
                placeholder="Level"
                options={CAMP_ADMIN_ROLES_OPTIONS}
                control={control}
                errors={errors}
              />
            </Box>

            <ModalFooter>
              <Button
                type="submit"
                size="lg"
                width="100%"
                isLoading={isSubmitting}
                colorScheme="blue"
              >
                Assign
              </Button>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default AssignCampAdminModal
