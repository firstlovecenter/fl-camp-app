import React from 'react'
import {
  Container,
  Box,
  Flex,
  Image,
  VStack,
  Center,
  Stack,
} from '@chakra-ui/react'

const UserProfile = () => {
  return (
    <Container p={6}>
      <Stack>
        <Box>UserProfile</Box>
        <Center>
          <Box>
            <Image
              borderRadius="full"
              boxSize="150px"
              src="https://bit.ly/dan-abramov"
              alt="Dan Abramov"
            />
          </Box>
        </Center>
        <Box>First Name</Box>
      </Stack>
    </Container>
  )
}

export default UserProfile
