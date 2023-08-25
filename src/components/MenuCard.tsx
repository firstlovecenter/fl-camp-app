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
import { useId } from 'contexts/IdContext'

const MenuCard = ({
  paidRegistrations,
  registrations,
  name,
  id,
  route,
  type,
}: {
  paidRegistrations: number
  registrations: number
  name: string
  id: string
  route: string
  type: string
}) => {
  const navigate = useNavigate()
  const { setReferenceId, setContinentId, setCountryId, setCampusId } = useId()
  const {
    cardBackground,
    cardPaidRegistrationsText,
    cardRegistrationsText,
    cardSubtitle,
  } = useCustomColorMode()

  const handleClick = () => {
    switch (type) {
      case 'earth':
        setReferenceId(id)
        break
      case 'continents':
        setContinentId(id)
        break
      case 'countries':
        setCountryId(id)
        break
      case 'campuses':
        setCampusId(id)
        break
    }
    navigate(route)
  }

  return (
    <Box
      onClick={() => handleClick()}
      p={4}
      borderRadius="md"
      mb={3}
      bg={cardBackground}
    >
      <Text fontSize="2xl" fontWeight="bold" mr={4}>
        {name}
      </Text>

      <StatGroup>
        <Stat>
          <StatNumber color={cardRegistrationsText}>{registrations}</StatNumber>
          <StatLabel color={cardSubtitle}>Registrations</StatLabel>
        </Stat>

        <Stat>
          <StatNumber color={cardPaidRegistrationsText}>
            {paidRegistrations}
          </StatNumber>
          <StatLabel color={cardSubtitle}>Paid Registrations</StatLabel>
        </Stat>
      </StatGroup>
    </Box>
  )
}

export default MenuCard
