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
import { useUserContext } from 'contexts/UserContext'
import useCustomColors from 'hooks/useCustomColors'

import { useNavigate } from 'react-router-dom'
import { Role } from '../../global'

type RoleCardProps = {
  role: Role
  name: string
}

const RoleCard = ({ role, name }: RoleCardProps) => {
  const navigate = useNavigate()
  const { profileCardBackground } = useCustomColors()
  const { setUserProfile } = useUserContext()

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

  const handleClick = () => {
    setUserProfile(role)
    navigate(route)
  }

  return (
    <Card
      maxW="md"
      onClick={() => handleClick()}
      bg={profileCardBackground}
      mb={2}
    >
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
