import { useAuth } from 'contexts/AuthContext'
import LogIn from './LogIn'
import { UnauthMsg } from './UnauthMsg'
import { useEffect, useState } from 'react'
import { Role } from '../../global'
import { Route, Routes, useNavigate } from 'react-router-dom'

interface ProtectedRouteProps {
  children: JSX.Element
  roles: Role[]
  roleBased?: boolean
  placeholder?: boolean
}

export const isAuthorised = (permittedRoles: Role[], userRoles: Role[]) => {
  if (permittedRoles?.includes('all')) {
    return true
  }

  return permittedRoles?.some((r) => userRoles.includes(r))
}

const PrivateRoute: React.FC<ProtectedRouteProps> = (props) => {
  const { children, roles, placeholder } = props
  const { currentUser } = useAuth()
  const [userRoles, setUserRoles] = useState<Role[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserRoles = async () => {
      try {
        if (currentUser) {
          const token = await currentUser.getIdTokenResult()
          setUserRoles(token?.claims?.roles || [])
        }
      } catch (error) {
        console.error('Error fetching token:', error)
      }
    }

    fetchUserRoles()
  }, [currentUser])

  if (placeholder) {
    return children
  }

  if (!currentUser) {
    navigate('/login')
    return (
      <Routes>
        <Route path="/login" element={<LogIn />} />
      </Routes>
    )
  }

  if (isAuthorised(roles, userRoles)) {
    return children
  } else {
    return <UnauthMsg />
  }
}

export default PrivateRoute
