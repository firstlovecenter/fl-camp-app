import { Card, CardHeader, Flex, Avatar, Heading, Box } from '@chakra-ui/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const RoleCard = ({ role }: Role) => {
  const navigate = useNavigate()
  return (
    <Card
      maxW="md"
      mb={3}
      onClick={() =>
        role === 'campAdmin' ? navigate('/admin') : navigate('/camper')
      }
    >
      <CardHeader>
        <Flex spacing={4}>
          <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
            <Avatar name="Edem Ahadzi" src="https://bit.ly/sage-adebayo" />

            <Box>
              <Heading size="sm">
                Continue as {role === 'campAdmin' ? 'an Admin' : 'a Camper'}
              </Heading>
              {/* <Text>Creator, Chakra UI</Text> */}
            </Box>
          </Flex>
        </Flex>
      </CardHeader>
    </Card>
  )
}

export default RoleCard
