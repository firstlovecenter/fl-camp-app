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
import { FaEllipsisH, FaPhone, FaWhatsapp } from 'react-icons/fa'
import useClickCard from '../../hooks/useClickCard'
import {
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
} from 'reactfire'
import { doc, collection } from 'firebase/firestore'
import { ApolloWrapper } from '@jaedag/admin-portal-react-core'
import useCustomColors from '../../hooks/useCustomColors'
import UserCampsCard from '../../components/UserCampsCard'
import { SelectOptions, UserCampData } from '../../../global'
import AssignAdminToCampModal from '../../components/modals/AssignAdminUserModal'
import RemoveUserFromCampModal from '../../components/modals/RemoveUserFromCampModal'
import { capitalizeFirstLetter } from '../../utils/utils'
import { useNavigate } from 'react-router-dom'

const UserProfile = () => {
  const [isOpenFirstModal, setIsOpenFirstModal] = useState(false)
  const [isOpenSecondModal, setIsOpenSecondModal] = useState(false)
  const navigate = useNavigate()
  const { navBg } = useCustomColors()

  // Handler to open/close the first modal
  const onOpenFirstModal = () => setIsOpenFirstModal(true)
  const onCloseFirstModal = () => setIsOpenFirstModal(false)

  // Handler to open/close the second modal
  const onOpenSecondModal = () => setIsOpenSecondModal(true)
  const onCloseSecondModal = () => setIsOpenSecondModal(false)

  // Submit handler for both modals
  const onSubmitModal = () => {
    // Handle submission logic here
  }

  const [imageLoaded, setImageLoaded] = useState(false)

  const firestore = useFirestore()
  const { userId } = useClickCard()
  const { userCardBackground, userCardStroke } = useCustomColors()
  const userEmail = userId as string

  const userReference = doc(firestore, 'users', userEmail)
  const { data: user } = useFirestoreDocData(userReference)

  let allCamps: UserCampData[] = []
  if (user?.camp_admin && user?.camp_camper) {
    allCamps = [...user.camp_admin, ...user.camp_camper]
  }

  const campsCollectionRef = collection(firestore, 'camps')
  const { data: campsCollection } = useFirestoreCollectionData(
    campsCollectionRef,
    { idField: 'id' }
  )

  const campOptions: SelectOptions[] = []

  if (campsCollection && campsCollection.length > 0) {
    campsCollection.forEach((camp) => {
      campOptions.push({ key: camp.name, value: camp.id })
    })
  }

  const loading = !user || !campsCollection

  return (
    <ApolloWrapper data={user} loading={loading}>
      <Container p={6}>
        {/* Render the first modal */}
        <AssignAdminToCampModal
          isOpen={isOpenFirstModal}
          onClose={onCloseFirstModal}
          onSubmit={onSubmitModal}
          campOptions={campOptions}
          user={userEmail}
        />

        {/* Render the second modal */}
        <RemoveUserFromCampModal
          isOpen={isOpenSecondModal}
          onClose={onCloseSecondModal}
          onSubmit={onSubmitModal}
        />

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
                      <MenuList bg={navBg}>
                        <MenuItem
                          bg={navBg}
                          onClick={() => navigate('/edit-user')}
                        >
                          Edit User
                        </MenuItem>
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
                          objectFit="cover"
                        />
                      </SkeletonCircle>
                    </Box>
                    <Box>
                      <Text fontSize="2xl">
                        {user &&
                          capitalizeFirstLetter(user?.firstName) +
                            ' ' +
                            capitalizeFirstLetter(user?.lastName)}
                      </Text>
                    </Box>
                    <Box mt={3} maxWidth="97%">
                      <Flex>
                        <a href={`tel:${user?.phone}`}>
                          <IconButton
                            colorScheme="blue"
                            aria-label="Call Icon"
                            variant="solid"
                            size="sm"
                            icon={<FaPhone />}
                            mr={1}
                          />
                        </a>
                        <Spacer />
                        <a
                          href={`https://wa.me/${user?.phone}`}
                          className="ms-3"
                        >
                          <IconButton
                            colorScheme="whatsapp"
                            aria-label="Whatsapp Icon"
                            variant="solid"
                            size="sm"
                            icon={<FaWhatsapp />}
                            mr={1}
                          />
                        </a>
                        <Spacer />
                        <Button
                          colorScheme="purple"
                          size="sm"
                          onClick={onOpenFirstModal}
                        >
                          Assign
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
                      <Text fontSize="sm">{user?.email}</Text>
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
                      <UserCampsCard
                        camp={camp}
                        key={camp.campId}
                        onOpenSecondModal={onOpenSecondModal}
                      />
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
