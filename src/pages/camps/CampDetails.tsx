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

const CampDetails = () => {
  const { campId } = useClickCard()
  const firestore = useFirestore()
  const {
    homePageCardBackground,
    homePageOptionsSubtitle,
    campRegistrationsCardBackground,
    campPaymentsCardBackground,
  } = useCustomColors()

  const camp = campId ?? '2dFnsBjS1R6kWaMzKU8s'

  console.log('camp', camp)

  const ref = doc(firestore, 'camps', '2dFnsBjS1R6kWaMzKU8s')
  console.log('ref', ref)
  const { status, data: campDoc } = useFirestoreDocData(ref, { idField: 'id' })

  console.log('campDoc', campDoc)

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
                {campDoc?.campType && capitalizeFirstLetter(campDoc?.campType)}
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
                  <MenuItem>Assign Admin</MenuItem>
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
          <Box mt={2}>
            <Card
              borderLeft="4px"
              borderColor="blue.500"
              bg={homePageCardBackground}
              //   onClick={() => navigate('/users')}
            >
              <CardBody>
                <Text fontSize="lg">Manage Users</Text>
                <Text fontSize="sm" color={homePageOptionsSubtitle}>
                  Add admins, members
                </Text>
              </CardBody>
            </Card>
          </Box>
        </Box>
      </Container>
    </ApolloWrapper>
  )
}

export default CampDetails
