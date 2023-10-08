import React from 'react'
import {
  Card,
  CardBody,
  Flex,
  Avatar,
  Text,
  Box,
  Button,
} from '@chakra-ui/react'
import useCustomColors from 'hooks/useCustomColors'
import useClickCard from 'hooks/useClickCard'

const AdminUserSearchCard = ({
  name,
  email,
  image,
  modal,
}: {
  name: string
  email: string
  image: string
  modal: () => void
}) => {
  const { generalBackground } = useCustomColors()
  const { clickCard, userId } = useClickCard()
  // console.log('email', email)

  const handleClick = () => {
    const card = { id: email, type: 'User' }
    clickCard(card)
    console.log('user here we go', userId)
    modal()
  }

  return (
    <Card maxW="md" bg={generalBackground}>
      <CardBody>
        <Flex>
          <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
            <Avatar name={name} src={image} size="sm" />

            <Box>
              <Text>{name}</Text>
            </Box>
          </Flex>
          <Button size="sm" onClick={() => handleClick()}>
            Assign{' '}
          </Button>
        </Flex>
      </CardBody>
    </Card>
  )
}

export default AdminUserSearchCard
