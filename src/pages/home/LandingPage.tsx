import {
  Card,
  CardHeader,
  Flex,
  Avatar,
  Heading,
  IconButton,
  CardBody,
  CardFooter,
  Button,
  Text,
  Box,
  Container,
} from '@chakra-ui/react'
import RoleCard from 'components/RoleCard'
import {
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
} from 'reactfire'
import { collection, query, doc, getDoc } from 'firebase/firestore'

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from 'contexts/AuthContext'

const LandingPage = () => {
  const [error, setError] = useState('')
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const email = currentUser?.email || ''

  const firestore = useFirestore()

  const ref = doc(firestore, 'users', email)
  const { data: user } = useFirestoreDocData(ref)

  console.log(user?.roles)

  return (
    <Box bg="body.bg">
      <Container my={6}>
        <Heading mb={4}>Welcome Camper!</Heading>
        {user?.roles.map((role: string, index: number) => (
          <RoleCard role={role} key={index} />
        ))}
      </Container>
    </Box>
  )
}

export default LandingPage
