import React from 'react'
import { Center, Heading, Text, Button, VStack } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

const PageNotFound: React.FC = () => {
  const navigate = useNavigate()

  return (
    <Center minH="50vh" flexDirection="column">
      <VStack spacing={4}>
        <Heading size="2xl" color="gray.600">
          404
        </Heading>
        <Heading size="lg" color="gray.500">
          Page Not Found
        </Heading>
        <Text color="gray.400" textAlign="center">
          The page you are looking for does not exist.
        </Text>
        <Button colorScheme="blue" onClick={() => navigate('/')}>
          Go Home
        </Button>
      </VStack>
    </Center>
  )
}

export default PageNotFound
