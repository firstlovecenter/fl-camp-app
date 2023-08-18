import { useColorModeValue } from '@chakra-ui/react'

const useCustomColors = () => {
  const bg = useColorModeValue('#e6e9ef', '#15181f')
  const brand = useColorModeValue('#188287', '#2ad5dc')
  const cardBackground = useColorModeValue('#fff', '#222836')

  return { bg, brand, cardBackground }
}

export default useCustomColors
