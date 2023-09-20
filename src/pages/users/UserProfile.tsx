import React from 'react'
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
} from '@chakra-ui/react'
import { DeleteIcon } from '@chakra-ui/icons'
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
const UserProfile = () => {
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
            {' '}
            <Card
              pb={10}
              bg={userCardBackground}
              variant="outline"
              outline={4}
              outlineColor={userCardStroke}
            >
              <CardBody>
                <VStack alignItems="center">
                  <Box py={8}></Box>
                  <Box>
                    <Image
                      borderRadius="full"
                      boxSize="100px"
                      src="https://bit.ly/dan-abramov"
                      alt="Dan Abramov"
                    />
                  </Box>
                  <Box>
                    <Text fontSize="2xl">
                      {user?.firstName + ' ' + user?.lastName}
                    </Text>
                  </Box>
                  <Box mt={3} maxWidth="97%">
                    <Flex>
                      <Button colorScheme="blue" size="sm" mr={1}>
                        Call {user?.firstName}
                      </Button>
                      <Spacer />
                      <Button colorScheme="gray" size="sm" mr={1}>
                        Message
                      </Button>
                      <Spacer />
                      <Button colorScheme="whatsapp" size="sm">
                        Assign to Camp
                      </Button>
                    </Flex>
                  </Box>
                </VStack>
              </CardBody>
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
