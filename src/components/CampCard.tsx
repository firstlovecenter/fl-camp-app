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

const CampCard = ({
  name,
  type,
  date,
  roomOption,
  role,
  registrationStatus,
  paymentStatus,
  campStatus,
}: Camp) => {
  const { cardBackground } = useCustomColorMode()
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
            <Tag colorScheme="telegram">{type} Camp</Tag>
            {/* admin stuff */}
            {role === 'Admin' && <Tag colorScheme="whatsapp">{campStatus}</Tag>}

            {/* camper stuff */}
            {role === 'Camper' && (
              <>
                <Tag colorScheme="whatsapp">{registrationStatus}</Tag>
                <Tag colorScheme="red">{paymentStatus}</Tag>
                <Tag colorScheme="orange">{roomOption}</Tag>
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
