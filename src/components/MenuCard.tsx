import {
  Box,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
  Text,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import useCustomColorMode from '../hooks/useCustomColors'

const MenuCard = ({
  number,
  title,
  route,
}: {
  number: number
  title: string
  route: string
}) => {
  const navigate = useNavigate()
  const { cardBackground } = useCustomColorMode()
  return (
    <Box
      onClick={() => navigate(route)}
      p={4}
      borderRadius="md"
      mb={3}
      bg={cardBackground}
    >
      <Text fontSize="2xl" fontWeight="bold" mr={4}>
        {title}
      </Text>

      <StatGroup>
        <Stat>
          <StatNumber color="#ebe86d">{number}</StatNumber>
          <StatLabel color="#cbced6">Registrations</StatLabel>
        </Stat>

        <Stat>
          <StatNumber color="#66c083">{number}</StatNumber>
          <StatLabel color="#cbced6">Paid</StatLabel>
        </Stat>
      </StatGroup>
    </Box>
  )
}

export default MenuCard
