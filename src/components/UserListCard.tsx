import {
  Card,
  CardHeader,
  Avatar,
  Box,
  Center,
  Text,
  HStack,
  Image,
  Skeleton,
} from '@chakra-ui/react'
import useCustomColors from 'hooks/useCustomColors'
import { ReactElement, JSXElementConstructor, ReactNode } from 'react'

import { useNavigate } from 'react-router-dom'

const UserListCard = ({ name }: { name: string }) => {
  const navigate = useNavigate()
  const { homePageCardBackground } = useCustomColors()
  const loading = !name

  return (
    <Skeleton isLoaded={!loading}>
      <Card
        maxW="md"
        onClick={() => navigate('/user-profile')}
        bg={homePageCardBackground}
        mb={2}
        borderRadius={10}
      >
        <CardHeader>
          <HStack>
            <Image
              maxW={{ base: '20%', sm: '20px' }}
              maxH={{ base: '20%', sm: '20px' }}
              borderRadius="lg"
              src="https://bit.ly/dan-abramov"
              alt="Dan Abramov"
              fallbackSrc="https://via.placeholder.com/150"
            />
            <Box pl={2}>
              <Text fontSize="lg">
                <b>{name}</b>
              </Text>
              <Text>Role</Text>
            </Box>
          </HStack>
        </CardHeader>
      </Card>
    </Skeleton>
  )
}

export default UserListCard
