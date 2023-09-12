import {
  Card,
  CardHeader,
  Box,
  Text,
  HStack,
  Image,
  Skeleton,
} from '@chakra-ui/react'
import useCustomColors from 'hooks/useCustomColors'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

type UserListProps = {
  name: string
  role: string[]
}

const findHighestPriorityRole = (roles: string[]) => {
  if (!Array.isArray(roles) || roles.length === 0) {
    return 'Member'
  }

  const priorityList = ['globalAdmin', 'campAdmin', 'campCamper']

  for (const role of priorityList) {
    if (roles.includes(role)) {
      switch (role) {
        case 'globalAdmin':
          return 'Global Admin'
        case 'campAdmin':
          return 'Admin'
        default:
          return 'Member'
      }
    }
  }

  return 'Member'
}

const UserListCard = ({ name, role }: UserListProps) => {
  const navigate = useNavigate()
  const [imageLoaded, setImageLoaded] = useState<boolean>(false)
  const { homePageCardBackground } = useCustomColors()

  const loading = !name && imageLoaded

  const roleText = findHighestPriorityRole(role)

  return (
    <Card
      maxW="md"
      onClick={() => navigate('/user-profile')}
      bg={homePageCardBackground}
      mb={2}
      borderRadius={10}
    >
      <Skeleton isLoaded={!loading}>
        <CardHeader>
          <Skeleton isLoaded={imageLoaded}>
            <HStack>
              <Image
                maxW={{ base: '20%', sm: '20px' }}
                maxH={{ base: '20%', sm: '20px' }}
                borderRadius="lg"
                src="https://bit.ly/dan-abramov"
                // alt="Dan Abramov"
                loading="lazy"
                onLoad={() => setImageLoaded(true)} // Set imageLoaded to true when the image is loaded
              />

              <Box pl={2}>
                <Text fontSize="lg">
                  <b>{name}</b>
                </Text>
                <Text>{roleText}</Text>
              </Box>
            </HStack>
          </Skeleton>
        </CardHeader>
      </Skeleton>
    </Card>
  )
}

export default UserListCard
