import { useAuth } from 'contexts/AuthContext'
import LogIn from './LogIn'
import { UnauthMsg } from './UnauthMsg'

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

const PrivateRoute: (props: ProtectedRouteProps) => JSX.Element = (props) => {
  const { children, roles, placeholder } = props
  const { currentUser } = useAuth()

  let userRoles: Role[] = []

  if (!currentUser) {
    return <LogIn />
  }

  if (currentUser) {
    currentUser
      .getIdTokenResult()
      .then((token) => {
        userRoles = token?.claims?.roles
      })
      .catch((error) => {
        console.error('Error fetching token:', error)
      })
  }

  if (isAuthorised(roles, userRoles)) {
    return children
  } else {
    return <UnauthMsg />
  }
}

export default PrivateRoute
