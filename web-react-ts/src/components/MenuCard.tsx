import React from 'react'
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
import { useChurchId } from '../contexts/IdContext'
import { capitalizeFirstLetter } from '../utils/utils'

const MenuCard = ({
  paidRegistrations,
  registrations,
  name,
  id,
  route,
  type,
}: {
  paidRegistrations?: number
  registrations?: number
  name: string
  id: string
  route: string
  type: string
}) => {
  const navigate = useNavigate()
  const { setPlanetId, setContinentId, setCountryId, setCampusId } =
    useChurchId()
  const {
    cardBackground,
    cardPaidRegistrationsText,
    cardRegistrationsText,
    cardSubtitle,
  } = useCustomColorMode()
  const loading = !name

  const handleClick = () => {
    switch (type) {
      case 'planet':
        setPlanetId(id)
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
          {capitalizeFirstLetter(name)}
        </Text>
      </SkeletonText>

      <StatGroup>
        <Stat>
          <StatNumber color={cardRegistrationsText}>
            <Skeleton isLoaded={!loading} noOfLines={2} marginY={2}>
              {registrations ? registrations : 0}
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
              {paidRegistrations ? paidRegistrations : 0}
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
