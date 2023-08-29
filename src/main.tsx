import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ChakraProvider } from '@chakra-ui/react'
import theme from './theme'
import { FirebaseAppProvider } from 'reactfire'
import { firebaseConfig } from 'firebase'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </FirebaseAppProvider>
  </React.StrictMode>
)
