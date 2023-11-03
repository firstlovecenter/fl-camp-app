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
import { ModalProps, UserData } from '../../../global'
import * as Yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { addDoc, collection } from 'firebase/firestore'
import { useFirestore } from 'reactfire'

interface SelectCampusModalProps extends ModalProps {
  user: UserData
  campId: string
}

const SelectCampusModal = ({
  isOpen,
  onClose,
  onSubmit,
  user,
  campId,
}: SelectCampusModalProps) => {
  const firestore = useFirestore()
  const toast = useToast()

  const initialValues = {
    campus: '',
  }

  const validationSchema = Yup.object({
    campus: Yup.string().required('Camp Level is a required field'),
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
      const registrationReference = collection(firestore, 'registrations')
      const newRegistrationObject = {
        campId: campId,
        firstName: user?.firstName,
        lastName: user?.lastName,
        campusId: values?.campus,
        email: user?.email,
        gender: user?.gender,
        paymentStatus: false,
        phoneNumber: '',
        whatsappNumber: '',
      }

      await addDoc(registrationReference, newRegistrationObject)

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
          <Text>Select A Campus</Text>

          <form onSubmit={handleSubmit(handleSubmitForm)}>
            <Box my={3}>
              <Select
                name="campus"
                label="Campus"
                placeholder="Campus"
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

export default SelectCampusModal
