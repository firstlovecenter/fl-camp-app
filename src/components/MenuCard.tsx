import { Box, Text } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

const MenuCard = ({ number, title, route }) => {
  const navigate = useNavigate()
  return (
    <Box
      onClick={() => navigate(route)}
      p={4}
      border="1px solid #ccc"
      borderRadius="md"
      mb={3}
    >
      <Text fontSize="2xl" fontWeight="bold" mr={4}>
        {title}
      </Text>
      <Box>
        <Text fontSize="lg">{number} registrations</Text>
      </Box>
    </Box>
  )
}

export default MenuCard
