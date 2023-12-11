import {
  Container,
  Flex,
  Spacer,
  Center,
  Heading,
  Card,
  CardBody,
  Tag,
  Box,
  Text,
  Menu,
  MenuList,
  IconButton,
  MenuButton,
  MenuItem,
  HStack,
} from '@chakra-ui/react'
import { ApolloWrapper } from '@jaedag/admin-portal-react-core'

import useClickCard from 'hooks/useClickCard'
import React from 'react'
import { useFirestore, useFirestoreDocData } from 'reactfire'
import { doc } from '@firebase/firestore'
import useCustomColors from 'hooks/useCustomColors'
import { FaEllipsisV } from 'react-icons/fa'
import { capitalizeFirstLetter } from 'utils/utils'
import { useNavigate } from 'react-router-dom'

const infos = [
  {
    id: 1,
    name: 'Register Members',
    details: 'Register Members for this camp',
    navigate: '/users',
  },
  {
    id: 2,
    name: 'Camp Directory',
    details: 'View the camp registration details',
    navigate: '/users',
  },
  {
    id: 3,
    name: 'Rooms Uploads',
    details: 'Click to setup and manage camp rooms',
    navigate: '/users',
  },
  {
    id: 4,
    name: 'Manage Admins',
    details: 'Click to Manage Admins',
    navigate: '/camp/assign-camp-admin',
  },
]

const CampDetails = () => {
  const { campId } = useClickCard()
  const navigate = useNavigate()
  const firestore = useFirestore()
  const {
    homePageCardBackground,
    homePageOptionsSubtitle,
    campRegistrationsCardBackground,
    campPaymentsCardBackground,
  } = useCustomColors()

  const ref = doc(firestore, 'camps', campId as string)
  const { status, data: campDoc } = useFirestoreDocData(ref, { idField: 'id' })

  const loading = !campDoc

  return (
    <ApolloWrapper data={campDoc} loading={loading}>
      <Container px={6}>
        <Box mt={6}>
          <Flex minWidth="-moz-fit-content" alignItems="baseline" gap="2">
            <Box>
              <Heading>Camps</Heading>
              <Box>
                <Text>{campDoc?.name}</Text>
              </Box>
              <Tag colorScheme="telegram">
                {campDoc?.campType && capitalizeFirstLetter(campDoc?.campType)}{' '}
                Camp
              </Tag>
            </Box>
            <Spacer />
            <Center>
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="Options"
                  icon={<FaEllipsisV />}
                  variant="link"
                />
                <MenuList>
                  <MenuItem onClick={() => navigate('/camp/assign-camp-admin')}>
                    Assign Admin
                  </MenuItem>
                </MenuList>
              </Menu>
            </Center>
          </Flex>
        </Box>
        <Box mt={3}>
          <HStack spacing={4}>
            <Box
              bg={campRegistrationsCardBackground}
              p={7}
              alignContent={'center'}
              borderRadius={10}
            >
              <Center>
                <Text fontSize="2xl">
                  {campDoc?.registrations ? campDoc?.registrations : 0}
                </Text>
              </Center>
              <Center>
                <Text>Registrations</Text>
              </Center>
            </Box>
            <Box
              bg={campPaymentsCardBackground}
              p={7}
              alignContent={'center'}
              borderRadius={10}
            >
              <Center>
                <Text fontSize="2xl">
                  {campDoc?.payments ? campDoc?.payments : 0}
                </Text>
              </Center>
              <Center>
                <Text>Payments</Text>
              </Center>
            </Box>
          </HStack>
        </Box>
        <Box mt={6}>
          <Tag>Quick Links</Tag>
          {infos.map((info) => (
            <Box mt={2} key={info.id} cursor="pointer">
              <Card
                borderLeft="4px"
                borderColor="blue.500"
                bg={homePageCardBackground}
                onClick={() => navigate(info.navigate)}
              >
                <CardBody>
                  <Text fontSize="lg">{info.name}</Text>
                  <Text fontSize="sm" color={homePageOptionsSubtitle}>
                    {info.details}
                  </Text>
                </CardBody>
              </Card>
            </Box>
          ))}
        </Box>
      </Container>
    </ApolloWrapper>
  )
}

export default CampDetails
