import React, { useEffect, useState } from 'react'

import { Heading, Text, Box, Container } from '@chakra-ui/react'
import RoleCard from '../../components/RoleCard'
import { useAuth } from '../../contexts/AuthContext'
import { ApolloWrapper } from '@jaedag/admin-portal-react-core'
import { Role } from '../../../global'
import { useUserContext } from '../../contexts/UserContext'

const LandingPage = () => {
  const { currentUser } = useAuth()
  const [roles, setRoles] = useState<Role[]>([])
  const { setUserRoles, userRoles } = useUserContext()
  const loading = !roles

  useEffect(() => {
    const getRoles = async () => {
      const token = await currentUser?.getIdTokenResult()
      let roles: string[] = []
      if (token?.claims?.roles) {
        roles = [...token.claims.roles]
        setUserRoles(roles)
      }

      // Check if any of the roles to be replaced exists in the roles array
      const hasCampRoles = roles.some((role) =>
        ['continentAdmin', 'countryAdmin', 'campusAdmin'].includes(role)
      )

      // If any of the roles exist, include 'campAdmin', otherwise keep the original roles
      const filteredRoles = hasCampRoles
        ? [
            ...roles.filter(
              (role) =>
                !['continentAdmin', 'countryAdmin', 'campusAdmin'].includes(
                  role
                )
            ),
            'campAdmin',
          ]
        : roles.filter(
            (role) => role === 'globalAdmin' || role === 'campCamper'
          )

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
