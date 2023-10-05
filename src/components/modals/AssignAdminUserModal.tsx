import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Heading,
  Text,
  Box,
} from '@chakra-ui/react'
import { Select } from '@jaedag/admin-portal-react-core'
import { ModalProps, SelectOptions } from '../../../global'
import * as Yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { churchLevel } from 'utils/utils'
import { addDoc, collection, doc } from 'firebase/firestore'
import { useFirestore, useFirestoreCollectionData } from 'reactfire'

interface AssignAdminToCampModalProps extends ModalProps {
  user: string
  campOptions: SelectOptions[]
}

const AssignAdminToCampModal = ({
  isOpen,
  onClose,
  onSubmit,
  user,
  campOptions,
}: AssignAdminToCampModalProps) => {
  //   const campOptions = [{ key: 'abcde', value: 'abcde' }]
  const firestore = useFirestore()

  const initialValues = {
    campLevel: '',
    camp: '',
  }

  const validationSchema = Yup.object({
    campLevel: Yup.string().required('Camp Level is a required field'),
    camp: Yup.string().required('Camp is a required field'),
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
      const campId = values.camp

      const camp =
        campOptions && campOptions.find((camp) => camp.value === campId)

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

      const userReference = doc(firestore, 'users', user)

      await addDoc(collection(userReference, 'camp_admin'), {
        campId: campId,
        churchLevel: churchLevel(campLevel),
        name: camp?.key,
        role: campLevel,
      })
    } catch (error) {
      console.log(error)
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
          <Heading>Users</Heading>
          <Text>Assign to A Camp</Text>

          <form onSubmit={handleSubmit(handleSubmitForm)}>
            <Box my={3}>
              <Select
                name="campLevel"
                label="Level"
                placeholder="Level"
                options={[
                  { key: 'Campus Admin', value: 'campusAdmin' },
                  { key: 'Country Admin', value: 'countryAdmin' },
                  { key: 'Continent Admin', value: 'continentAdmin' },
                  { key: 'Global Admin', value: 'globalAdmin' },
                ]}
                control={control}
                errors={errors}
              />
            </Box>

            <Box my={3}>
              <Select
                name="camp"
                label="Camps"
                placeholder="Camps"
                options={campOptions}
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

export default AssignAdminToCampModal
