import React, { ReactNode } from 'react'
import { Box } from '@chakra-ui/react'
import LoadingPage from './LoadingPage'

interface ApolloWrapperProps {
  data: any
  loading: boolean
  error?: any
  children: ReactNode
}

const ApolloWrapper: React.FC<ApolloWrapperProps> = ({
  data,
  loading,
  error,
  children,
}) => {
  if (loading) {
    return <LoadingPage />
  }

  if (error) {
    return (
      <Box p={4} color="red.500" textAlign="center">
        Error: {error.message || 'Something went wrong'}
      </Box>
    )
  }

  if (!data && !loading) {
    return (
      <Box p={4} color="gray.500" textAlign="center">
        No data available
      </Box>
    )
  }

  return <>{children}</>
}

export default ApolloWrapper
