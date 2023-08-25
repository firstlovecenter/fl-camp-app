import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navigation from './components/Navigation'
import { AuthProvider } from 'contexts/AuthContext'
import PrivateRoute from 'auth/PrivateRoute'
import { authRoutes } from 'auth/authRoutes'
import { directoryRoutes } from 'pages/directory/directoryRoutes'
import { LoadingPage, PageNotFound } from '@jaedag/admin-portal-react-core'
import { Suspense } from 'react'
import { IdContextProvider } from 'contexts/IdContext'

const App = () => {
  return (
    <IdContextProvider>
      <AuthProvider>
        <BrowserRouter>
          <Navigation />
          <Suspense fallback={<LoadingPage />}>
            <Routes>
              {[...authRoutes, ...directoryRoutes].map((route, i) => (
                <Route
                  key={i}
                  path={route.path}
                  element={
                    <PrivateRoute
                      roles={route.roles}
                      placeholder={route.placeholder}
                    >
                      <route.element />
                    </PrivateRoute>
                  }
                />
              ))}
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </IdContextProvider>
  )
}

export default App
