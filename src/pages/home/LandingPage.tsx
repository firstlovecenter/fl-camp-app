import { Heading, Text, Box, Container } from '@chakra-ui/react'
import RoleCard from 'components/RoleCard'

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from 'contexts/AuthContext'
import { ApolloWrapper } from '@jaedag/admin-portal-react-core'

const LandingPage = () => {
  // const [error, setError] = useState('')
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const [roles, setRoles] = useState<Role[]>([])

  const loading = !roles

  useEffect(() => {
    const getRoles = async () => {
      const token = await currentUser?.getIdTokenResult()
      if (token?.claims?.roles) {
        console.log(token.claims.roles)
        setRoles(token.claims.roles)
      }
    }

    getRoles()
  }, [])

  return (
    <ApolloWrapper data={roles} loading={loading}>
      <Box bg="body.bg">
        <Container my={6}>
          <Heading mb={4}>Welcome Camper!</Heading>
          {roles ? (
            roles.map((role: Role, index: number) => (
              <RoleCard
                role={role}
                name={currentUser?.displayName || ''}
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
