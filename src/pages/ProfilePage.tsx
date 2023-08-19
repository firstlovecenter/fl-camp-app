import { Container, Text, Center } from '@chakra-ui/layout'
import React, { useState } from 'react'
import { useAuth } from 'contexts/AuthContext'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Card,
  CardBody,
  CardHeader,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import useCustomColorMode from '../hooks/useCustomColors'

const ProfilePage = () => {
  const [error, setError] = useState('')
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const { bg } = useCustomColorMode()

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
    <Center height="60vh" color={bg}>
      <Container textAlign="center">
        <Card>
          <CardHeader>Profile</CardHeader>
          <CardBody>
            {error && (
              <Alert status="error">
                <AlertIcon />
                <AlertTitle>Error!</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Text>Email: {currentUser.email}</Text>

            <Button marginTop={2} onClick={() => navigate('/update-profile')}>
              Update Profile
            </Button>
          </CardBody>
        </Card>
        <Button variant="link" onClick={handleLogout}>
          Log Out
        </Button>
      </Container>
    </Center>
  )
}

export default ProfilePage
