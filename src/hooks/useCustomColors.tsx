import { useColorModeValue } from '@chakra-ui/react'

const useCustomColors = () => {
  const bg = useColorModeValue('#bdbec0', '#15181f')
  const brand = useColorModeValue('#188287', '#2ad5dc')
  const cardBackground = useColorModeValue('#fff', '#222836')
  const cardRegistrationsText = useColorModeValue('#6d70eb', '#ebe86d')
  const cardPaidRegistrationsText = useColorModeValue('#66c083', '#66c083')
  const cardSubtitle = useColorModeValue('#cbced6', '#cbced6')
  const profileCardBackground = useColorModeValue('#fff', '#252937')
  const homePageCardBackground = useColorModeValue('#2c2a1e', '#1e202c')
  const homePageCardTextEmphasis = useColorModeValue('#1e202c', '#7DDB86')
  const homePageCardSubtitle = useColorModeValue('#7DDB86', '#5C6CA5')
  const homePageCardText = useColorModeValue('#7DDB86', '#8A92A6')
  const homePageOptionsSubtitle = useColorModeValue('#7DDB86', '#9AC2FF')
  const userCardBackground = useColorModeValue('#fff', '#171C22')
  const dropdownBackground = useColorModeValue('#fff', '#282D35')
  const userCardStroke = useColorModeValue('#e2e8f0', '#374151')

  return {
    bg,
    brand,
    cardBackground,
    cardRegistrationsText,
    cardPaidRegistrationsText,
    cardSubtitle,
    profileCardBackground,
    homePageCardBackground,
    homePageCardText,
    homePageCardTextEmphasis,
    homePageCardSubtitle,
    homePageOptionsSubtitle,
    userCardBackground,
    dropdownBackground,
    userCardStroke,
  }
}

export default useCustomColors
