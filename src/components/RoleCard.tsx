import {
  Card,
  CardHeader,
  Avatar,
  Box,
  Center,
  Stack,
  Text,
  HStack,
} from '@chakra-ui/react'
import useCustomColors from 'hooks/useCustomColors'

import { useNavigate } from 'react-router-dom'

const RoleCard = ({ role, name }: Role) => {
  const navigate = useNavigate()
  const { profileCardBackground } = useCustomColors()

  let roleText = ''
  let route = ''
  switch (role) {
    case 'globalAdmin':
      roleText = 'Global Admin'
      route = '/global-admin'
      break
    case 'campAdmin':
      roleText = 'Admin'
      route = '/admin'
      break
    case 'campCamper':
      roleText = 'Camper'
      route = '/camper'
      break
  }
  return (
    <Card maxW="md" onClick={() => navigate(route)} bg={profileCardBackground}>
      <CardHeader>
        <HStack>
          <Center>
            <Avatar name={role} mr={3} size="xs" />
            <Box>
              <Text>{roleText}</Text>
            </Box>
          </Center>
        </HStack>
      </CardHeader>
    </Card>
  )
}

export default RoleCard
