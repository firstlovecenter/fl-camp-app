import React, { useState } from 'react'
import {
  Container,
  Box,
  Image,
  Stack,
  Heading,
  Text,
  Card,
  VStack,
  Button,
  Spacer,
  Flex,
  StackDivider,
  CardBody,
  IconButton,
  SkeletonCircle,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { FaEllipsisH } from 'react-icons/fa'
import useClickCard from 'hooks/useClickCard'
import {
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
} from 'reactfire'
import { doc, collection, addDoc } from 'firebase/firestore'
import { ApolloWrapper, Select } from '@jaedag/admin-portal-react-core'
import useCustomColors from 'hooks/useCustomColors'
import UserCampsCard from 'components/UserCampsCard'
import * as Yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios'
import { getFunctions, httpsCallable } from 'firebase/functions'

interface CampOption {
  key: string
  value: string
}

const churchLevel = (campLevel: string) => {
  switch (campLevel) {
    case 'campusAdmin':
      return 'campus'
    case 'countryAdmin':
      return 'country'
    case 'continentAdmin':
      return 'continent'
    case 'globalAdmin':
      return 'global'
    default:
      return 'campus'
  }
}

const UserProfile = () => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const firestore = useFirestore()
  const { userId } = useClickCard()
  const { userCardBackground, userCardStroke } = useCustomColors()
  const userEmail = userId as string
  const userReference = doc(firestore, 'users', userEmail)
  const { status, data: user } = useFirestoreDocData(userReference)
  const campAdminCollection = collection(
    firestore,
    'users',
    userEmail,
    'camp_admin'
  )
  const {
    status: campsCollectionstatus,
    data: campAdmin,
    error: campAdminError,
  } = useFirestoreCollectionData(campAdminCollection, {
    idField: 'id',
  })
  if (campAdminError) {
    console.error('Error fetching campAdmin:', campAdminError)
  }
  const campCamperCollection = collection(
    firestore,
    'users',
    userEmail,
    'camp_camper'
  )
  const { status: campCamperStatus, data: campCamper } =
    useFirestoreCollectionData(campCamperCollection, {
      idField: 'id',
    })

  const campsCollectionRef = collection(firestore, 'camps')
  const {
    status: campsStatus,
    data: campsCollection,
    error: campError,
  } = useFirestoreCollectionData(campsCollectionRef, { idField: 'id' })

  const campOptions: CampOption[] = []

  campsCollection.forEach((camp) => {
    campOptions.push({ key: camp.name, value: camp.id })
  })

  let allCamps: any[] = []
  if (campAdmin && campCamper) {
    allCamps = [...campAdmin, ...campCamper]
  }

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

  const onSubmit = async (values: typeof initialValues) => {
    try {
      console.log('Form submitted with values:', values)

      console.log(values)

      const campLevel = values.campLevel
      const campId = values.camp

      const camp = campOptions.find((camp) => camp.value === campId)

      const functions = getFunctions()
      const addClaimsToUser = httpsCallable(
        functions,
        'addClaimsToUsersCallable'
      )

      const callableResponse = await addClaimsToUser({
        email: userEmail,
        permission: campLevel,
      })
      console.log('callable response', callableResponse)

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

  const loading = !user || !campAdmin || !campCamper || !campsCollection

  return (
    <ApolloWrapper data={user} loading={loading}>
      <Container p={6}>
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

              <form onSubmit={handleSubmit(onSubmit)}>
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

        <Stack>
          <Box>
            <Heading>User</Heading>
            <Text>Profile</Text>
          </Box>
          <Box>
            <Card
              pb={5}
              bg={userCardBackground}
              variant="outline"
              outline={4}
              outlineColor={userCardStroke}
            >
              <Box>
                <CardBody>
                  <Flex alignItems="center">
                    <Spacer />

                    <Menu>
                      <MenuButton
                        as={IconButton}
                        aria-label="Options"
                        icon={<FaEllipsisH />}
                        variant="link"
                      />
                      <MenuList>
                        <MenuItem>Edit User</MenuItem>
                        <MenuItem>Delete User</MenuItem>
                      </MenuList>
                    </Menu>
                  </Flex>
                  <VStack alignItems="center">
                    <Box py={1}></Box>
                    <Box>
                      <SkeletonCircle size="100" isLoaded={imageLoaded}>
                        <Image
                          borderRadius="full"
                          boxSize="100px"
                          src={user?.image_url}
                          alt={user?.firstName + ' ' + user?.lastName}
                          onLoad={() => setImageLoaded(true)}
                        />
                      </SkeletonCircle>
                    </Box>
                    <Box>
                      <Text fontSize="2xl">
                        {user?.firstName + ' ' + user?.lastName}
                      </Text>
                    </Box>
                    <Box mt={3} maxWidth="97%">
                      <Flex>
                        <a href={`tel:${user?.phone}`}>
                          <Button colorScheme="blue" size="sm" mr={1}>
                            Call {user?.firstName}
                          </Button>
                        </a>
                        <Spacer />
                        <a
                          href={`https://wa.me/${user?.phone}`}
                          className="ms-3"
                        >
                          <Button colorScheme="gray" size="sm" mr={1}>
                            Message
                          </Button>
                        </a>
                        <Spacer />
                        <Button
                          colorScheme="whatsapp"
                          size="sm"
                          onClick={onOpen}
                        >
                          Assign to Camp
                        </Button>
                      </Flex>
                    </Box>
                  </VStack>
                </CardBody>
              </Box>
            </Card>
          </Box>
          <Box mt={3}>
            <Text mb={1}>Biodata</Text>
            <Card bg={userCardBackground} variant="outline">
              <CardBody>
                <Stack divider={<StackDivider />} spacing="2">
                  <Box>
                    <Flex>
                      <Text fontSize="sm">Email</Text>
                      <Spacer />
                      <Text fontSize="sm">{user?.NO_ID_FIELD}</Text>
                    </Flex>
                  </Box>
                  <Box>
                    <Flex>
                      <Text fontSize="sm">Date of Birth</Text>
                      <Spacer />
                      <Text fontSize="sm">{user?.dob}</Text>
                    </Flex>
                  </Box>
                  {user?.church && (
                    <Box>
                      <Flex>
                        <Text fontSize="sm">Church</Text>
                        <Spacer />
                        <Text fontSize="sm">{user?.church}</Text>
                      </Flex>
                    </Box>
                  )}
                </Stack>
              </CardBody>
            </Card>
          </Box>
          <Box mt={3}>
            {allCamps.length > 0 && (
              <>
                <Text mb={1}>Camp</Text>
                <Card bg={userCardBackground} variant="outline">
                  <CardBody>
                    {allCamps.map((camp) => (
                      <UserCampsCard camp={camp} key={camp.id} />
                    ))}
                  </CardBody>
                </Card>
              </>
            )}
          </Box>
        </Stack>
      </Container>
    </ApolloWrapper>
  )
}
export default UserProfile
