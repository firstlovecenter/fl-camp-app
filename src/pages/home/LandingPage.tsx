import { Heading, Text, Box, Container } from '@chakra-ui/react'
import RoleCard from 'components/RoleCard'

import React, { useEffect, useState } from 'react'

import { useAuth } from 'contexts/AuthContext'
import { ApolloWrapper } from '@jaedag/admin-portal-react-core'
import { Role } from '../../../global'
import { useNavigate } from 'react-router-dom'

const LandingPage = () => {
  const { currentUser, logout } = useAuth()
  // const [error, setError] = useState('')

  const navigate = useNavigate()
  const [roles, setRoles] = useState<Role[]>([])

  const loading = !roles

  useEffect(() => {
    const getRoles = async () => {
      const token = await currentUser?.getIdTokenResult()
      let roles: string[] = []
      if (token?.claims?.roles) {
        roles = [...token.claims.roles]
      }

      const roleMappings: { [key: string]: string } = {
        countryAdmin: 'campAdmin',
        campusAdmin: 'campAdmin',
        continentAdmin: 'campAdmin',
      }

      // Use filter to keep only 'globalAdmin', 'campCamper', and roles mapped to 'campAdmin'
      const filteredRoles = roles.filter((role) => {
        return (
          role === 'globalAdmin' ||
          role === 'campCamper' ||
          roleMappings[role] === 'campAdmin'
        )
      })

      setRoles(filteredRoles as Role[])
    }

    getRoles()
  }, [currentUser])

  return (
    <ApolloWrapper data={roles} loading={loading}>
      <Box bg="body.bg">
        <Container my={6}>
          <Heading mb={4}>Welcome Camper!</Heading>
          {roles.length > 0 ? (
            roles.map((role: Role, index: number) => (
              <RoleCard
                role={role}
                name={currentUser?.displayName || ''}
                key={index}
              />
            ))
          ) : (
            <Text>
              Unfotunately you have no roles. Kindly contact the global admin to
              assign you correctly
            </Text>
          )}
        </Container>
      </Box>
    </ApolloWrapper>
  )
}

export default LandingPage
