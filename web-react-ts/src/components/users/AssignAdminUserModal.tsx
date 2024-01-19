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

import { doc, getDoc, collection, getDocs } from 'firebase/firestore'
import { useFirestore } from 'reactfire'
import { useAuth } from '../../contexts/AuthContext'
import { useUserContext } from '../../contexts/UserContext'
import { adminLevels, assignAdmin, highestUserRole } from '../../utils/utils'

interface AssignAdminToCampModalProps extends ModalProps {
  user: string
  campOptions: SelectOptions[]
}

const AssignAdminToCampModal = ({
  isOpen,
  onClose,
  user,
  campOptions,
}: AssignAdminToCampModalProps) => {
  const firestore = useFirestore()
  const toast = useToast()
  const { currentUser } = useAuth()
  const [campAdminOptions, setCampAdminOptions] = useState<SelectOptions[]>([])
  const [campusOptions, setCampusOptions] = useState<SelectOptions[]>([])
  const { userRoles } = useUserContext()

  type InitialValues = { campLevel: string; camp: string; campus?: string }

  const initialValues: InitialValues = {
    campLevel: '',
    camp: '',
    campus: '',
  }

  const validationSchema = Yup.object({
    campLevel: Yup.string().required('Camp Level is a required field'),
    camp: Yup.string().required('Camp is a required field'),
    campus: Yup.string().when('campLevel', ([campLevel], schema) => {
      return campLevel === 'campus'
        ? schema.required('Campus is a required field')
        : schema
    }),
  })

  const {
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<InitialValues>({
    resolver: yupResolver(validationSchema),
    defaultValues: initialValues,
  })

  const watchCamp = watch('camp')
  const watchCampLevel = watch('campLevel')

  useEffect(() => {
    const campUserRoles = async (userEmail: string, watchCamp: string) => {
      try {
        const currenUserDoc = doc(firestore, 'users', userEmail || '')
        const currenUserData = await getDoc(currenUserDoc)
        const campAdmin: UserCampData[] =
          currenUserData?.data()?.camp_admin || []
        const userCamp = campAdmin.find((camp) => camp.campId === watchCamp)

        if (userRoles.includes('globalAdmin')) {
          setCampAdminOptions([])
          const adminLevelsResponse = await adminLevels(
            watchCamp,
            ['globalAdmin'],
            firestore
          )
          if (adminLevelsResponse) setCampAdminOptions(adminLevelsResponse)
        } else if (userCamp?.role) {
          const highestRole = highestUserRole(userCamp?.role)

          const adminLevelsResponse = await adminLevels(
            watchCamp,
            [highestRole],
            firestore
          )

          if (adminLevelsResponse) setCampAdminOptions(adminLevelsResponse)
        }
      } catch (error) {
        console.log(error)
      }
    }

    campUserRoles(currentUser?.email || '', watchCamp)
  }, [watchCamp, userRoles, currentUser?.email, firestore])

  useEffect(() => {
    const fetchCampuses = async (campId: string) => {
      const campusesRef = collection(firestore, 'camps', campId, 'campuses')
      const campusesSnapshot = await getDocs(campusesRef)
      const campuses: SelectOptions[] = []

      campusesSnapshot.docs.map((doc) =>
        campuses.push({ key: doc.data().name, value: doc.id })
      )

      setCampusOptions(campuses)
    }

    if (watchCamp) {
      fetchCampuses(watchCamp)
    }
  }, [watchCampLevel, watchCamp, firestore])

  const handleSubmitForm = async (values: typeof initialValues) => {
    try {
      const response = await assignAdmin(
        firestore,
        values?.campLevel,
        values?.camp,
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
          <Heading>Users</Heading>
          <Text>Assign to A Camp</Text>

          <form onSubmit={handleSubmit(handleSubmitForm)}>
            <Box my={3}>
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

              <Select
                name="campLevel"
                label="Level"
                placeholder="Level"
                options={campAdminOptions}
                control={control}
                errors={errors}
              />
              {watchCampLevel && watchCampLevel === 'campus' && (
                <Select
                  name="campus"
                  label="Campus"
                  placeholder="Campus"
                  options={campusOptions}
                  control={control}
                  errors={errors}
                />
              )}
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
