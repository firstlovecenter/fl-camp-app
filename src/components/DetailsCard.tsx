import React from 'react'
import {
  Box,
  Skeleton,
  SkeletonText,
  Stat,
  StatLabel,
  StatNumber,
  Text,
} from '@chakra-ui/react'
import useCustomColorMode from '../hooks/useCustomColors'

function DetailsCard({ title, number }: { title: string; number: number }) {
  const { cardBackground, cardRegistrationsText } = useCustomColorMode()
  const loading = !title || !number

  return (
    <Box p={4} borderRadius="md" my={3} bg={cardBackground}>
      <Stat>
        <StatLabel color={cardRegistrationsText}>
          <SkeletonText isLoaded={!loading} noOfLines={1} marginY={2}>
            {title}
          </SkeletonText>
        </StatLabel>
        <StatNumber>
          <Skeleton isLoaded={!loading} noOfLines={2} marginY={2}>
            {number}
          </Skeleton>
        </StatNumber>
      </Stat>
    </Box>
  )
}

export default DetailsCard
