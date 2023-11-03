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
import { ModalProps, SelectOptions } from '../../../global'
import * as Yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { churchLevel } from 'utils/utils'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { useFirestore } from 'reactfire'

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
  const toast = useToast()

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

      await addClaimsToUser({
        email: user,
        permission: campLevel,
      })

      const userReference = doc(firestore, 'users', user)
      //TODO check if the camp already exists in the user's camp_admin array
      const userData = await getDoc(doc(firestore, 'users', user))
      const adminCamps = userData.data()?.camp_admin || []

      const campAdmin = [...adminCamps]

      const newCampObject = {
        campId: campId,
        churchLevel: churchLevel(campLevel),
        name: camp?.key,
        role: campLevel,
      }
      campAdmin.push(newCampObject)

      await updateDoc(userReference, {
        camp_admin: campAdmin,
      })
      onClose()
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
