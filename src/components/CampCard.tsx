import React from 'react'
import {
  Card,
  CardBody,
  Heading,
  Stack,
  Tag,
  Wrap,
  Text,
} from '@chakra-ui/react'
import useCustomColorMode from '../hooks/useCustomColors'
import { capitalizeFirstLetter, formatDateRange } from 'utils/utils'
import { Camp } from '../../global'

const CampCard = ({
  name,
  campType,
  roomOption,
  role,
  registrationStatus,
  paymentStatus,

  startDate,
  endDate,
}: Camp) => {
  const { cardBackground } = useCustomColorMode()
  const date = formatDateRange(startDate, endDate)

  const currentDate = new Date()
  const deadline = new Date(endDate)
  return (
    <Card
      //   onClick={() => handleClick()}
      borderRadius="md"
      bg={cardBackground}
      mb={3}
    >
      <CardBody>
        <Stack>
          <Heading size="sm">{name}</Heading>
          <Wrap>
            <Tag colorScheme="telegram">
              {capitalizeFirstLetter(campType)} Camp
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
                <Tag colorScheme="whatsapp">{registrationStatus}</Tag>
                <Tag colorScheme="red">{paymentStatus}</Tag>
                {roomOption && <Tag colorScheme="orange">{roomOption}</Tag>}
              </>
            )}
          </Wrap>
          <Text>{date}</Text>
        </Stack>
      </CardBody>
    </Card>
  )
}

export default CampCard
