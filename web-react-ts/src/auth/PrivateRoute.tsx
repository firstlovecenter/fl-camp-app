import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { UnauthMsg } from './UnauthMsg'
import { useEffect, useState } from 'react'
import { Role } from '../../global'
import { Navigate } from 'react-router-dom'

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

  if (placeholder) {
    return children
  }

  if (!currentUser) {
    return <Navigate to="/login" />
  }

  if (isAuthorised(roles, userRoles)) {
    return children
  } else {
    return <UnauthMsg />
  }
}

export default PrivateRoute
