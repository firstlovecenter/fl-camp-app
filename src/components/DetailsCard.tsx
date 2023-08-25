import React from 'react'
import { Box, Stat, StatLabel, StatNumber } from '@chakra-ui/react'
import useCustomColorMode from '../hooks/useCustomColors'

function DetailsCard({ title, number }: { title: string; number: number }) {
  const { cardBackground } = useCustomColorMode()

  return (
    <Box p={4} borderRadius="md" my={3} bg={cardBackground}>
      <Stat>
        <StatLabel color="#ebe86d">{title}</StatLabel>
        <StatNumber>{number}</StatNumber>
      </Stat>
    </Box>
  )
}

export default DetailsCard
