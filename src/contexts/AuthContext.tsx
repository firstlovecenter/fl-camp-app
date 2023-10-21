import { useToast } from '@chakra-ui/react'
import { doc, setDoc } from 'firebase/firestore'
import { useFirestore } from 'reactfire'
import { auth } from 'firebase'
import {
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateEmail as updateEmailAuth,
  updatePassword as updatePasswordAuth,
  AuthErrorCodes,
} from 'firebase/auth'
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

export interface ValueProps {
  email: string
  password?: string
  passwordConfirm?: string
  phone: string
  dob: Date
  pictureUrl: string
  firstName: string
  lastName: string
}

interface CreateDocumentProps {
  values: ValueProps
  email: string
  userCredential: UserCredential
  addUser: boolean
}

interface AuthContextType {
  currentUser: User
  signup: (email: string, password: string) => Promise<UserCredential>
  login: (email: string, password: string) => Promise<UserCredential>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateEmail: (email: string) => Promise<void>
  updatePassword: (password: string) => Promise<void>
  createUserDocument: ({
    values,
    email,
    userCredential,
    addUser,
  }: CreateDocumentProps) => void
}

const AuthContext = createContext<AuthContextType>({
  currentUser: {} as User,
  signup: () => Promise.resolve({} as UserCredential),
  login: () => Promise.resolve({} as UserCredential),
  logout: () => Promise.resolve(),
  resetPassword: () => Promise.resolve(),
  updateEmail: () => Promise.resolve(),
  updatePassword: () => Promise.resolve(),
  createUserDocument: () => null,
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
  const [loading, setLoading] = useState(true)
  const toast = useToast()
  const firestore = useFirestore()

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

  const createUserDocument = async ({
    values,
    email,
    userCredential,
    addUser,
  }: CreateDocumentProps) => {
    try {
      if (addUser) {
        if (userCredential) {
          await sendPasswordResetEmail(auth, email)
          console.log('add user')
        }
      }
      const data = {
        firstName: values?.firstName.toLowerCase(),
        lastName: values?.lastName.toLowerCase(),
        email: values?.email,
        phone: values?.phone,
        dob: values?.dob.toISOString().slice(0, 10),
        image_url: values?.pictureUrl,
      }

      await setDoc(doc(firestore, 'users', values?.email), { ...data })

      toast({
        title: 'Account created.',
        description: "We've created your account for you.",
        status: 'success',
        duration: 4000,
        isClosable: true,
      })
    } catch (error) {
      if (AuthErrorCodes.EMAIL_EXISTS) {
        toast({
          title: 'Error.',
          description: 'Email already in use.',
          status: 'error',
          duration: 4000,
          isClosable: true,
        })
      } else {
        console.log('user creation encountered an error', error)
      }
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user as User)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
    createUserDocument,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
