import { Route, Routes, useLocation } from 'react-router-dom'
import Navigation from './components/Navigation'
import { AuthProvider } from 'contexts/AuthContext'
import PrivateRoute from 'auth/PrivateRoute'
import { authRoutes } from 'auth/authRoutes'
import { directoryRoutes } from 'pages/directory/directoryRoutes'
import { homeRoutes } from 'pages/home/homeRoutes'
import { userRoutes } from 'pages/users/userRoutes'
import { campRoutes } from 'pages/camps/campRoutes'
import { LoadingPage, PageNotFound } from '@jaedag/admin-portal-react-core'
import { Suspense } from 'react'
import { IdContextProvider } from 'contexts/IdContext'
import { FirestoreProvider, useFirebaseApp } from 'reactfire'
import { getFirestore } from 'firebase/firestore'
import { UserContextProvider } from 'contexts/UserContext'

const App = () => {
  const firestoreInstance = getFirestore(useFirebaseApp())
  const location = useLocation()
  const isAuthRoute = authRoutes.some(
    (route) => location.pathname === route.path
  )
  return (
    <FirestoreProvider sdk={firestoreInstance}>
      <UserContextProvider>
        <IdContextProvider>
          <AuthProvider>
            {!isAuthRoute && <Navigation />}
            <Suspense fallback={<LoadingPage />}>
              <Routes>
                {[
                  ...authRoutes,
                  ...directoryRoutes,
                  ...homeRoutes,
                  ...userRoutes,
                  ...campRoutes,
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
          </AuthProvider>
        </IdContextProvider>
      </UserContextProvider>
    </FirestoreProvider>
  )
}

export default App
