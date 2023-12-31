import React, { useState } from 'react'
import { Container, Center } from '@chakra-ui/layout'
import { useAuth } from '../contexts/AuthContext'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Card,
  CardBody,
  CardHeader,
  Image,
  VStack,
  Text,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import ProfilePageSkeleton from './ProfilePageSkeleton'
import useCustomColors from '../hooks/useCustomColors'

const ProfilePage = () => {
  const [error, setError] = useState('')
  const { userInfo, logout } = useAuth()
  const navigate = useNavigate()
  const { navBg } = useCustomColors()

  const handleLogout = async () => {
    setError('')
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      setError('Failed to log out')
    }
  }

  return (
    <>
      {userInfo.image_url ? (
        <Center mt={28} height={'60vh'}>
          <Container textAlign="center">
            <Card rounded={'lg'} bg={navBg} my={10}>
              <CardHeader fontSize={'2xl'} fontWeight={'bold'}>
                Profile
              </CardHeader>
              <CardBody>
                {error && (
                  <Alert status="error">
                    <AlertIcon />
                    <AlertTitle>Error!</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <VStack>
                  <Image
                    src={userInfo.image_url}
                    rounded={'full'}
                    width={'56'}
                    objectFit="cover"
                  />
                  <Text
                    textTransform={'capitalize'}
                    mt={2}
                    fontWeight={'semibold'}
                    fontSize={'3xl'}
                  >{`${userInfo.firstName} ${userInfo.lastName}`}</Text>
                  <Text position={'relative'} bottom={3}>
                    {userInfo.email}
                  </Text>
                </VStack>
                <Button
                  bg={'cyan.700'}
                  my={2}
                  onClick={() => navigate('/update-profile')}
                >
                  Update Profile
                </Button>
              </CardBody>
            </Card>
          </Container>
        </Center>
      ) : (
        <ProfilePageSkeleton />
      )}
      <Center>
        <Button colorScheme="red" onClick={handleLogout}>
          Log Out
        </Button>
      </Center>
    </>
  )
}

export default ProfilePage
