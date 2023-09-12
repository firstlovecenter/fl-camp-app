import React from 'react'
import { Container, Box, Image, Center, Stack } from '@chakra-ui/react'
import useClickCard from 'hooks/useClickCard'

const UserProfile = () => {
  const { userId } = useClickCard()
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
        <Box>First Name - {userId}</Box>
      </Stack>
    </Container>
  )
}

export default UserProfile
