import React, { useState } from 'react'
import {
  Card,
  CardHeader,
  Box,
  Text,
  HStack,
  Image,
  Skeleton,
} from '@chakra-ui/react'
import useCustomColors from '../hooks/useCustomColors'
import { useNavigate } from 'react-router-dom'
import useClickCard from '../hooks/useClickCard'

type UserListProps = {
  id: string
  name: string
  role: string[]
  image: string
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

const UserListCard = ({ name, role, id, image }: UserListProps) => {
  const navigate = useNavigate()
  const [imageLoaded, setImageLoaded] = useState<boolean>(false)
  const { homePageCardBackground } = useCustomColors()

  const roleText = findHighestPriorityRole(role)
  const { clickCard } = useClickCard()

  const handleClick = () => {
    const card = { id: id, type: 'User' }
    clickCard(card)
    navigate('/user-profile')
  }

  const loading = !name

  return (
    <Card
      onClick={() => handleClick()}
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
                src={image}
                alt={name}
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
