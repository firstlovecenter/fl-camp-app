import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navigation from './components/Navigation'
import { AuthProvider } from 'contexts/AuthContext'
import PrivateRoute from 'auth/PrivateRoute'
import { authRoutes } from 'auth/authRoutes'
import { directoryRoutes } from 'pages/directory/directoryRoutes'
import { homeRoutes } from 'pages/home/homeRoutes'
import { userRoutes } from 'pages/users/userRoutes'
import { LoadingPage, PageNotFound } from '@jaedag/admin-portal-react-core'
import { Suspense } from 'react'
import { IdContextProvider } from 'contexts/IdContext'
import { FirestoreProvider, useFirebaseApp } from 'reactfire'
import { getFirestore } from 'firebase/firestore'

const App = () => {
  const firestoreInstance = getFirestore(useFirebaseApp())
  return (
    <FirestoreProvider sdk={firestoreInstance}>
      <IdContextProvider>
        <AuthProvider>
          <BrowserRouter>
            <Navigation />
            <Suspense fallback={<LoadingPage />}>
              <Routes>
                {[
                  ...authRoutes,
                  ...directoryRoutes,
                  ...homeRoutes,
                  ...userRoutes,
                ].map((route, i) => (
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
    </FirestoreProvider>
  )
}

export default App
