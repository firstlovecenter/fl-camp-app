import React from 'react'
import { Card, CardBody, Stack, Tag, Wrap, Text } from '@chakra-ui/react'
import useCustomColorMode from '../hooks/useCustomColors'
import { capitalizeFirstLetter, formatDateRange } from '../utils/utils'
import { Camp } from '../../global'
import useClickCard from '../hooks/useClickCard'
import { useNavigate } from 'react-router-dom'
import { useUserContext } from '../contexts/UserContext'

const CampCard = ({
  name,
  campLevel,
  roomOption,
  role,
  registrationStatus,
  paymentStatus,
  startDate,
  endDate,
  campId,
}: Camp) => {
  const { cardBackground } = useCustomColorMode()
  const date = formatDateRange(startDate, endDate)
  const { clickCard } = useClickCard()
  const navigate = useNavigate()
  const { userProfile } = useUserContext()

  const handleClick = () => {
    const card = { id: campId as string, type: 'Camp' }
    clickCard(card)
    if (userProfile === 'campCamper') {
      navigate(`/camper`)
    } else {
      navigate(`/camp/camp-details`)
    }
  }

  const currentDate = new Date()
  const deadline = endDate.toDate()
  return (
    <Card
      onClick={() => handleClick()}
      borderRadius="md"
      cursor={'pointer'}
      bg={cardBackground}
      mb={3}
    >
      <CardBody>
        <Stack>
          <Text fontSize={'lg'} size="sm">
            {name}
          </Text>
          <Wrap>
            <Tag borderRadius={0} bg="blue.600">
              {campLevel && capitalizeFirstLetter(campLevel)} Camp
            </Tag>
            {/* admin stuff */}
            {role === 'Admin' && (
              <Tag colorScheme={deadline > currentDate ? 'whatsapp' : 'red'}>
                {deadline > currentDate ? 'Active' : 'Ended'}
              </Tag>
            )}

            {/* camper stuff */}
            {role === 'Camper' && (
              <>
                <Tag borderRadius={0} mx={1} bg="green.400">
                  {registrationStatus}
                </Tag>
                <Tag borderRadius={0} bg="red.500">
                  {paymentStatus}
                </Tag>
                {roomOption && <Tag colorScheme="orange">{roomOption}</Tag>}
              </>
            )}
          </Wrap>
          <Text fontSize={'md'}>{date}</Text>
        </Stack>
      </CardBody>
    </Card>
  )
}

export default CampCard
