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
import { getFunctions, httpsCallable } from 'firebase/functions'
import { churchLevel } from '../../utils/utils'
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore'
import { useFirestore } from 'reactfire'
import { useAuth } from '../../contexts/AuthContext'
import { useUserContext } from '../../contexts/UserContext'
import { ROLE_MAPPINGS, ROLE_WEIGHTS } from '../../utils/constants'

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

  const adminLevels = async (campId: string, finalRoles: string[]) => {
    try {
      setCampAdminOptions([])
      if (campId) {
        const campReference = doc(firestore, 'camps', campId)
        const campData = await getDoc(campReference)
        const camp = campData.data()
        const campLevel = camp?.campLevel
        const adminLevels: SelectOptions[] = []

        const allowedRoles = ROLE_MAPPINGS[campLevel] || {}

        finalRoles.forEach((userRole) => {
          const allowedRoleList = allowedRoles[userRole] || []

          allowedRoleList.forEach((role: string) => {
            console.log('role', role)
            const level = {
              key: `${role} Admin`,
              value: role.toLowerCase().replace(' ', ''),
            }
            adminLevels.push(level)
          })
        })

        setCampAdminOptions(adminLevels)
      }
    } catch (error) {
      console.log(error)
    }
  }

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
  console.log('watchCampLevel', watchCampLevel)

  const highestUserRole = (roles: string[]) => {
    console.log('roles', roles)
    const highestWeightRole = roles.reduce((prevRole, currentRole) => {
      const prevWeight =
        ROLE_WEIGHTS.find((role) => role.role === prevRole)?.weight || 0
      const currentWeight =
        ROLE_WEIGHTS.find((role) => role.role === currentRole)?.weight || 0

      return currentWeight > prevWeight ? currentRole : prevRole
    }, '')

    return highestWeightRole
  }

  useEffect(() => {
    const campUserRoles = async (userEmail: string, watchCamp: string) => {
      const currenUserDoc = doc(firestore, 'users', userEmail || '')
      const currenUserData = await getDoc(currenUserDoc)
      const campAdmin: UserCampData[] = currenUserData?.data()?.camp_admin || []
      const userCamp = campAdmin.find((camp) => camp.campId === watchCamp)

      if (userRoles.includes('globalAdmin')) {
        adminLevels(watchCamp, ['globalAdmin'])
      } else if (userCamp?.role) {
        const highestRole = highestUserRole(userCamp?.role)
        adminLevels(watchCamp, [highestRole])
      }
    }

    campUserRoles(currentUser?.email || '', watchCamp)
  }, [watchCamp, userRoles])

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
  }, [watchCampLevel, watchCamp])

  const handleSubmitForm = async (values: typeof initialValues) => {
    try {
      console.log('values', values)
      const campLevel = values.campLevel
      const campId = values.camp
      const campusId = values?.campus

      const camp =
        campOptions && campOptions.find((camp) => camp.value === campId)

      const functions = getFunctions()
      const addClaimsToUser = httpsCallable(
        functions,
        'addClaimsToUsersCallable'
      )

      await addClaimsToUser({
        email: user,
        permission: `${campLevel}Admin`,
      })

      const userReference = doc(firestore, 'users', user)
      //TODO check if the camp already exists in the user's camp_admin array
      const userData = await getDoc(doc(firestore, 'users', user))
      const adminCamps: UserCampData[] = userData.data()?.camp_admin || []
      // Check if the user is already assigned to the camp
      const existingCampIndex = adminCamps.findIndex(
        (camp) => camp.campId === campId
      )

      if (existingCampIndex !== -1) {
        // Update the existing roles if the user is already assigned to the camp
        const existingRoles = adminCamps[existingCampIndex].role || []
        const updatedRoles = Array.from(
          new Set([...existingRoles, `${campLevel}Admin`])
        )

        adminCamps[existingCampIndex].role = updatedRoles

        // Add campusId when campLevel is "campus"
        if (campLevel === 'campus') {
          adminCamps[existingCampIndex].campusId = campusId || undefined
        }
      } else {
        // Add a new object to the camp_admin array
        const newCampObject = {
          campId: campId,
          churchLevel: campLevel,
          name: (camp?.key as string) || '',
          role: [`${campLevel}Admin`],
        }

        // Add campusId when campLevel is "campus"
        if (campLevel === 'campus') {
          newCampObject.campusId = campusId || undefined
        }

        adminCamps.push(newCampObject)
      }

      await updateDoc(userReference, {
        camp_admin: adminCamps,
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
