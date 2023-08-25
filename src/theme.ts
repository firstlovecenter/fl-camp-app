// theme.ts

// 1. import `extendTheme` function
import {
  extendTheme,
  type ThemeConfig,
  type StyleFunctionProps,
} from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'

// 2. Add your color mode config
const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

const colors = {
  brand: '#2ad5dc',
  bg: '#1a202c',
}

const styles = {
  global: (props: StyleFunctionProps) => ({
    body: { bg: mode('#f4f4f4', '#15181f')(props) },
  }),
}

// 3. extend the theme
const theme = extendTheme({ config, colors, styles })

export default theme
