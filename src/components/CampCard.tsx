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
  type,
  roomOption,
  role,
  registrationStatus,
  paymentStatus,
  campStatus,
  startDate,
  endDate,
}: Camp) => {
  const { cardBackground } = useCustomColorMode()
  const date = formatDateRange(startDate, endDate)

  return (
    <Card
      //   onClick={() => handleClick()}
      borderRadius="md"
      bg={cardBackground}
      mb={3}
    >
      <CardBody>
        <Stack>
          <Heading size="md">{name}</Heading>
          <Wrap>
            <Tag colorScheme="telegram">{capitalizeFirstLetter(type)} Camp</Tag>
            {/* admin stuff */}
            {role === 'Admin' && (
              <Tag colorScheme={campStatus ? 'whatsapp' : 'red'}>
                {campStatus ? 'Active' : 'Ended'}
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
