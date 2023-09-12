import { useAuth } from 'contexts/AuthContext'
import LogIn from './LogIn'
import { UnauthMsg } from './UnauthMsg'
import { useEffect, useState } from 'react'

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

  if (!currentUser) {
    return <LogIn />
  }

  if (isAuthorised(roles, userRoles)) {
    return children
  } else {
    return <UnauthMsg />
  }
}

export default PrivateRoute
