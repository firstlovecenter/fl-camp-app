import { useColorModeValue } from '@chakra-ui/react'

const useCustomColors = () => {
  const bg = useColorModeValue('#e6e9ef', '#15181f')
  const brand = useColorModeValue('#188287', '#2ad5dc')
  const cardBackground = useColorModeValue('#fff', '#222836')
  const cardRegistrationsText = useColorModeValue('#ebe86d', '#ebe86d')
  const cardPaidRegistrationsText = useColorModeValue('#66c083', '#66c083')
  const cardSubtitle = useColorModeValue('#cbced6', '#cbced6')

  return {
    bg,
    brand,
    cardBackground,
    cardRegistrationsText,
    cardPaidRegistrationsText,
    cardSubtitle,
  }
}

export default useCustomColors
