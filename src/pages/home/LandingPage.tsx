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
import { useFirestore, useFirestoreDocData } from 'reactfire'
import { doc } from 'firebase/firestore'

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from 'contexts/AuthContext'
import { ApolloWrapper } from '@jaedag/admin-portal-react-core'

const LandingPage = () => {
  // const [error, setError] = useState('')
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const email = currentUser?.email || ''

  const firestore = useFirestore()

  const ref = doc(firestore, 'users', email)
  const { data: user, status } = useFirestoreDocData(ref)

  const loading = status === 'loading' ? false : true

  return (
    <ApolloWrapper data={user?.roles} loading={loading}>
      <Box bg="body.bg">
        <Container my={6}>
          <Heading mb={4}>Welcome Camper!</Heading>
          {user?.roles ? (
            user.roles.map((role: string, index: number) => (
              <RoleCard
                role={role}
                name={user?.firstName + ' ' + user?.lastName}
                key={index}
              />
            ))
          ) : (
            <Text>You have no roles.</Text>
          )}
        </Container>
      </Box>
    </ApolloWrapper>
  )
}

export default LandingPage
