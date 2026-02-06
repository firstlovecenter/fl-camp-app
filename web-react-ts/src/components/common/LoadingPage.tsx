import React from 'react'
import { Spinner, Center, Text } from '@chakra-ui/react'

const LoadingPage: React.FC = () => {
  return (
    <Center minH="200px" flexDirection="column">
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
        mb={4}
      />
      <Text color="gray.500">Loading...</Text>
    </Center>
  )
}

export default LoadingPage
