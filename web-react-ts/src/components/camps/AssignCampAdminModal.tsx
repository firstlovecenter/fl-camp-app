import React, { useEffect, useState } from 'react'
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
import { ModalProps, SelectOptions, UserCampData } from '../../../global'
import * as Yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { adminLevels, assignAdmin, highestUserRole } from '../../utils/utils'
import { doc, getDoc, collection, getDocs } from 'firebase/firestore'
import { useFirestore } from 'reactfire'
import useClickCard from '../../hooks/useClickCard'
import { useUserContext } from '../../contexts/UserContext'
import { useAuth } from '../../contexts/AuthContext'

type InitialValues = { campLevel: string; campus?: string }

const AssignCampAdminModal = ({
  isOpen,
  onClose,
  userId,
}: ModalProps & { userId: string }) => {
  const { campId } = useClickCard()
  const { currentUser } = useAuth()
  const { userRoles } = useUserContext()
  const [campAdminOptions, setCampAdminOptions] = useState<SelectOptions[]>([])
  const [campusOptions, setCampusOptions] = useState<SelectOptions[]>([])

  const user = userId || ''
  const camp = campId || ''

  const firestore = useFirestore()

  const toast = useToast()

  const initialValues: InitialValues = {
    campLevel: '',
    campus: '',
  }

  const validationSchema = Yup.object({
    campLevel: Yup.string().required('Camp Level is a required field'),
    campus: Yup.string().when('campLevel', ([campLevel], schema) => {
      return campLevel === 'campus'
        ? schema.required('Campus is a required field')
        : schema
    }),
  })

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<typeof initialValues>({
    resolver: yupResolver(validationSchema),
    defaultValues: initialValues,
  })

  const watchCampLevel = watch('campLevel')

  useEffect(() => {
    const getCampAdminOptions = async (userEmail: string, campId: string) => {
      const currenUserDoc = doc(firestore, 'users', userEmail || '')
      const currenUserData = await getDoc(currenUserDoc)
      const campAdmin: UserCampData[] = currenUserData?.data()?.camp_admin || []
      const userCamp = campAdmin.find((camp) => camp.campId === campId)

      if (userRoles.includes('globalAdmin')) {
        setCampAdminOptions([])
        const adminLevelsResponse = await adminLevels(
          campId,
          ['globalAdmin'],
          firestore
        )
        if (adminLevelsResponse) setCampAdminOptions(adminLevelsResponse)
      } else if (userCamp?.role) {
        const highestRole = highestUserRole(userCamp?.role)

        const adminLevelsResponse = await adminLevels(
          campId,
          [highestRole],
          firestore
        )

        if (adminLevelsResponse) setCampAdminOptions(adminLevelsResponse)
      }
    }

    getCampAdminOptions(currentUser?.email || '', camp)
  }, [currentUser, camp, userRoles])

  useEffect(() => {
    const getCampusOptions = async (campId: string) => {
      const campusesReference = collection(
        firestore,
        'camps',
        campId,
        'campuses'
      )
      const campusesCollection = await getDocs(campusesReference)

      const campusOptions: SelectOptions[] = []
      campusesCollection.forEach((campus) => {
        campusOptions.push({ key: campus.data().name, value: campus.id })
      })

      if (watchCampLevel === 'campus') setCampusOptions(campusOptions)
    }

    getCampusOptions(camp)
  }, [camp, firestore, watchCampLevel])

  const handleSubmitForm = async (values: typeof initialValues) => {
    try {
      const response = await assignAdmin(
        firestore,
        values?.campLevel,
        camp,
        values?.campus,
        user
      )
      onClose()
      toast(response)
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
                options={campAdminOptions}
                control={control}
                errors={errors}
              />
            </Box>

            {watchCampLevel === 'campus' && (
              <Box my={3}>
                <Select
                  name="campus"
                  label="Campus"
                  placeholder="Campus"
                  options={campusOptions}
                  control={control}
                  errors={errors}
                />
              </Box>
            )}

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
