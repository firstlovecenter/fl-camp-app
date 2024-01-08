import React, { useEffect, useState } from 'react'
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
import useClickCard from '../../hooks/useClickCard'
import { useFirestore, useFirestoreDocData } from 'reactfire'
import { doc } from '@firebase/firestore'
import useCustomColors from '../../hooks/useCustomColors'
import { FaEllipsisV } from 'react-icons/fa'
import { capitalizeFirstLetter } from '../../utils/utils'
import { useNavigate } from 'react-router-dom'
import { CampMenuItem } from '../../../global'
import { useChurchId } from '../../contexts/IdContext'

const CampDetails = () => {
  const { campId } = useClickCard()
  const navigate = useNavigate()
  const firestore = useFirestore()
  const [menuItems, setMenuItems] = useState<CampMenuItem[]>([])
  const {
    homePageCardBackground,
    homePageOptionsSubtitle,
    campRegistrationsCardBackground,
    campPaymentsCardBackground,
  } = useCustomColors()

  const ref = doc(firestore, 'camps', campId as string)
  const { data: campDoc } = useFirestoreDocData(ref, { idField: 'id' })
  const { setContinentId, setCountryId, setCampusId } = useChurchId()

  const getDirectoryPath = (campLevel: string) => {
    switch (campLevel) {
      case 'planet':
        return '/camp/directory'
      case 'continent':
        setContinentId(campDoc.levelId)
        return '/camp/continent-profile'
      case 'country':
        setCountryId(campDoc.levelId)
        return '/camp/country-profile'
      case 'campus':
        setCampusId(campDoc.levelId)
        return '/camp/campus-profile'
      default:
        return '#'
    }
  }

  useEffect(() => {
    // Check if campDoc is available
    if (campDoc) {
      let directoryPath = ''
      if (campDoc.campLevel) {
        directoryPath = getDirectoryPath(campDoc.campLevel)
      }

      const menuItems: CampMenuItem[] = [
        {
          name: 'Camp Directory',
          path: directoryPath,
          subtitle: 'View the camp registration details',
        },
        {
          name: 'Rooms Upload',
          path: '#',
          subtitle: 'Click to setup and manage rooms',
        },
        {
          name: 'Manage Admins',
          path: '/camp/assign-camp-admin',
          subtitle: 'Click to Manage Admins',
        },
      ]

      // Check if endDate is available and compare dates
      if (campDoc.endDate && campDoc.endDate.toDate() > new Date()) {
        menuItems.unshift({
          name: 'Register Members',
          path: '/camp/register-members',
          subtitle: 'Register Members for this camp',
        })
      }

      setMenuItems(menuItems)
    }
  }, [campDoc, getDirectoryPath()])

  const loading = !campDoc || !menuItems

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
          {menuItems.map((item, index) => (
            <Box mt={2} key={index}>
              <Card
                borderLeft="4px"
                borderColor="blue.500"
                bg={homePageCardBackground}
                onClick={() => navigate(item.path)}
                key={index}
              >
                <CardBody>
                  <Text fontSize="lg">{item.name}</Text>
                  <Text fontSize="sm" color={homePageOptionsSubtitle}>
                    {item.subtitle}
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
