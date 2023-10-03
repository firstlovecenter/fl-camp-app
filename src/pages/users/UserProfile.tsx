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
} from '@chakra-ui/react'
import { FaEllipsisH } from 'react-icons/fa'
import useClickCard from 'hooks/useClickCard'
import {
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
} from 'reactfire'
import { doc, collection } from 'firebase/firestore'
import { ApolloWrapper } from '@jaedag/admin-portal-react-core'
import useCustomColors from 'hooks/useCustomColors'
import UserCampsCard from 'components/UserCampsCard'
import Ellipsis from 'components/Ellipsis'

const UserProfile = () => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const firestore = useFirestore()
  const { userId } = useClickCard()
  const { userCardBackground, userCardStroke } = useCustomColors()
  const userEmail = userId as string
  const ref = doc(firestore, 'users', userEmail)
  const { status, data: user } = useFirestoreDocData(ref)
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
  let allCamps: any[] = []
  if (campAdmin && campCamper) {
    allCamps = [...campAdmin, ...campCamper]
  }
  const loading = !user || !campAdmin || !campCamper
  return (
    <ApolloWrapper data={user} loading={loading}>
      <Container p={6}>
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
                        <MenuItem onClick={() => handleEditUser()}>
                          Edit User
                        </MenuItem>
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
                        <Button colorScheme="whatsapp" size="sm">
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
                <Text mb={1}>Camps Admin Of</Text>
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
