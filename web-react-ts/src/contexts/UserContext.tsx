import React, {
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react'

interface UserContextType {
  userRoles: string[]
  setUserRoles: (roles: string[]) => void
  userProfile: string
  setUserProfile: (userProfile: string) => void
}

const UserContext = createContext<UserContextType>({
  userProfile: '',
  setUserProfile: () => null,
  userRoles: [],
  setUserRoles: () => null,
})

export const useUserContext = () => {
  return useContext(UserContext)
}

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [userRoles, setUserRoles] = useState<string[]>(
    JSON.parse(sessionStorage.getItem('userRoles') || '[]')
  )

  const setUserRolesArray = (roles: string[]) => {
    setUserRoles(roles)
    sessionStorage.setItem('userRoles', JSON.stringify(roles))
  }

  const [userProfile, setUserProfile] = useState<string>(
    sessionStorage.getItem('userProfile') ?? ''
  )

  const setUserProfileText = (userProfile: string) => {
    setUserProfile(userProfile)
    sessionStorage.setItem('userProfile', userProfile)
  }

  const value = useMemo(
    () => ({
      userRoles,
      setUserRoles: setUserRolesArray,
      userProfile,
      setUserProfile: setUserProfileText,
    }),
    [userRoles]
  )

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
