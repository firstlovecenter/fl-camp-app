import {
  Box,
  Skeleton,
  SkeletonText,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
  Text,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import useCustomColorMode from '../hooks/useCustomColors'
import { useChurchId } from 'contexts/IdContext'

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
  const { setEarthId, setContinentId, setCountryId, setCampusId } =
    useChurchId()
  const {
    cardBackground,
    cardPaidRegistrationsText,
    cardRegistrationsText,
    cardSubtitle,
  } = useCustomColorMode()
  const loading = !name || !registrations || !paidRegistrations

  const handleClick = () => {
    switch (type) {
      case 'earth':
        setEarthId(id)
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
      <SkeletonText isLoaded={!loading}>
        <Text fontSize="2xl" fontWeight="bold" mr={4}>
          {name}
        </Text>
      </SkeletonText>

      <StatGroup>
        <Stat>
          <StatNumber color={cardRegistrationsText}>
            <Skeleton isLoaded={!loading} noOfLines={2} marginY={2}>
              {registrations}
            </Skeleton>
          </StatNumber>
          <StatLabel color={cardSubtitle}>
            <SkeletonText isLoaded={!loading} noOfLines={1} marginY={2}>
              Registrations
            </SkeletonText>
          </StatLabel>
        </Stat>

        <Stat>
          <StatNumber color={cardPaidRegistrationsText}>
            <Skeleton isLoaded={!loading} noOfLines={2} marginY={2}>
              {paidRegistrations}
            </Skeleton>
          </StatNumber>
          <StatLabel color={cardSubtitle}>
            <SkeletonText isLoaded={!loading} noOfLines={1} marginY={2}>
              Paid Registrations
            </SkeletonText>
          </StatLabel>
        </Stat>
      </StatGroup>
    </Box>
  )
}

export default MenuCard
