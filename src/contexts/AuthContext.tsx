import { auth, db } from 'firebase'
import {
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateEmail as updateEmailAuth,
  updatePassword as updatePasswordAuth,
} from 'firebase/auth'
import { doc, getDoc, DocumentData } from 'firebase/firestore'
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

interface AuthContextType {
  currentUser: User
  signup: (email: string, password: string) => Promise<UserCredential>
  login: (email: string, password: string) => Promise<UserCredential>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateEmail: (email: string) => Promise<void>
  updatePassword: (password: string) => Promise<void>
  userInfo: DocumentData
}

const AuthContext = createContext<AuthContextType>({
  currentUser: {} as User,
  signup: () => Promise.resolve({} as UserCredential),
  login: () => Promise.resolve({} as UserCredential),
  logout: () => Promise.resolve(),
  resetPassword: () => Promise.resolve(),
  updateEmail: () => Promise.resolve(),
  updatePassword: () => Promise.resolve(),
  userInfo: [],
})

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User>({} as User)
  const [userInfo, setUserInfo] = useState<DocumentData>([])
  const [loading, setLoading] = useState(true)

  const signup = (email: string, password: string) => {
    console.log('here')
    return createUserWithEmailAndPassword(auth, email, password)
  }

  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password)
  }

  const logout = () => {
    return signOut(auth)
  }

  const resetPassword = (email: string) => {
    return sendPasswordResetEmail(auth, email)
  }

  const updateEmail = (email: string) => {
    return updateEmailAuth(currentUser, email)
  }

  const updatePassword = (password: string) => {
    return updatePasswordAuth(currentUser, password)
  }

  const getUsers = async (user: User | null) => {
    if (!user || !user.email) return
    const userDoc = await doc(db, 'users', user.email)
    const userSnapShot = await getDoc(userDoc)

    return (await userSnapShot.exists()) ? userSnapShot.data() : null
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user as User)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    const Retrieval = async () => {
      const map = await getUsers(currentUser)
      if (!map) return
      setUserInfo(map)
    }
    Retrieval()
  }, [currentUser])

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
    userInfo,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
