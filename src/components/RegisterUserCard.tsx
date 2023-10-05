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

const RegisterUserCard = ({
  name,
  email,
  image,
}: {
  name: string
  email: string
  image: string
}) => {
  const { registerMemberCardBackground } = useCustomColors()
  return (
    <Card maxW="md" bg={registerMemberCardBackground}>
      <CardBody>
        <Flex>
          <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
            <Avatar name={name} src="https://bit.ly/sage-adebayo" size="sm" />

            <Box>
              <Text>{name}</Text>
            </Box>
          </Flex>
          <Button size="sm">Remove </Button>
        </Flex>
      </CardBody>
    </Card>
  )
}

export default RegisterUserCard
