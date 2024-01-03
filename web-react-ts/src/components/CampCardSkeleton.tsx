import { Card, CardBody, Skeleton, Stack, Wrap } from '@chakra-ui/react'
import useCustomColors from '../hooks/useCustomColors'
import React from 'react'

const CampCardSkeleton = () => {
  const { cardBackground } = useCustomColors()
  return (
    <Card borderRadius="md" bg={cardBackground} mb={3}>
      <CardBody>
        <Stack>
          <Skeleton height={14} mb={1} />
          <Wrap>
            <Skeleton h={7} w="25%" />
            <Skeleton h={7} w="25%" />
            <Skeleton h={7} w="25%" />
          </Wrap>
          <Skeleton height={6} />
        </Stack>
      </CardBody>
    </Card>
  )
}

export default CampCardSkeleton
