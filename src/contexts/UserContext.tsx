import React, {
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react'

interface UserContextType {
  userProfile: string
  setUserProfile: (userProfile: string) => void
}

const UserContext = createContext<UserContextType>({
  userProfile: '',
  setUserProfile: () => null,
})

export const useUser = () => {
  return useContext(UserContext)
}

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [userProfile, setUserProfile] = useState<string>(
    sessionStorage.getItem('userProfile') ?? ''
  )

  const setUserProfileText = (userProfile: string) => {
    setUserProfile(userProfile)
    sessionStorage.setItem('userProfile', userProfile)
  }

  const value = useMemo(
    () => ({
      userProfile,
      setUserProfile: setUserProfileText,
    }),
    [userProfile]
  )

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
