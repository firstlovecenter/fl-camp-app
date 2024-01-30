import React, { useEffect, useState } from 'react'
import { Heading, Text, Box, Container } from '@chakra-ui/react'
import RoleCard from '../../components/RoleCard'
import { useAuth } from '../../contexts/AuthContext'
import { ApolloWrapper } from '@jaedag/admin-portal-react-core'
import { Role } from '../../../global'
import { useUserContext } from '../../contexts/UserContext'

const LandingPage = () => {
  const { currentUser } = useAuth()
  const { userRoles, setUserRoles } = useUserContext()
  const [roles, setRoles] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const allowedRoles = [
    'globalAdmin',
    'campCamper',
    'countryAdmin',
    'continentAdmin',
    'campusAdmin',
  ]
  const getRoles = async () => {
    try {
      const token = await currentUser?.getIdTokenResult()
      const newRoles = token?.claims?.roles || []

      const filteredRoles = newRoles.filter((role) =>
        allowedRoles.includes(role)
      )

      setRoles(filteredRoles)
    } catch (error) {
      console.error('Error fetching roles:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userRoles.length === 0) {
      getRoles()
    } else {
      const filteredRoles = userRoles.filter((role) =>
        allowedRoles.includes(role)
      )
      setRoles(filteredRoles)
      setLoading(false)
    }
  }, [currentUser, setUserRoles, userRoles, allowedRoles])

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
              Unfortunately, you have no roles. Kindly contact the global admin
              to assign you correctly
            </Text>
          )}
        </Container>
      </Box>
    </ApolloWrapper>
  )
}

export default LandingPage
