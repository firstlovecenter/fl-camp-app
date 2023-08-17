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

const LandingPage = () => {
  const [error, setError] = useState('')
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  return <div>Welcome Camper!</div>
}

export default LandingPage
