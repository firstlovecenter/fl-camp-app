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
import { ReactElement, JSXElementConstructor, ReactNode } from 'react'

import { useNavigate } from 'react-router-dom'

const UserListCard = ({ name }: { name: string }) => {
  const navigate = useNavigate()
  const { profileCardBackground } = useCustomColors()

  return (
    <Card
      maxW="md"
      onClick={() => navigate('')}
      bg={profileCardBackground}
      mb={2}
    >
      <CardHeader>
        <HStack>
          <Center>
            <Avatar name={name} mr={3} size="xs" />
            <Box>
              <Text>{name}</Text>
            </Box>
          </Center>
        </HStack>
      </CardHeader>
    </Card>
  )
}

export default UserListCard
