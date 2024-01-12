import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useToast } from '@chakra-ui/react'
import { useFirestore } from 'reactfire'
import { auth, db } from '../firebase'
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
import { doc, getDoc, DocumentData, setDoc } from 'firebase/firestore'

export interface ValueProps {
  email: string
  password?: string
  passwordConfirm?: string
  phone: string
  dob: Date
  pictureUrl: string
  firstName: string
  lastName: string
  gender: string
}

interface CreateDocumentProps {
  values: ValueProps
}

interface AuthContextType {
  currentUser: User
  signup: (email: string, password: string) => Promise<UserCredential>
  login: (email: string, password: string) => Promise<UserCredential>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateEmail: (email: string) => Promise<void>
  updatePassword: (password: string) => Promise<void>
  createUserDocument: ({ values }: CreateDocumentProps) => void
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
  createUserDocument: () => null,
  userInfo: [],
})

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
  const toast = useToast()
  const firestore = useFirestore()

  const signup = (email: string, password: string) => {
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

  const createUserDocument = async ({ values }: CreateDocumentProps) => {
    try {
      const data = {
        firstName: values?.firstName.toLowerCase(),
        lastName: values?.lastName.toLowerCase(),
        email: values?.email,
        phone: values?.phone,
        dob: values?.dob.toISOString().slice(0, 10),
        image_url: values?.pictureUrl,
        gender: values?.gender,
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

  const getUsers = async (user: User | null) => {
    if (!user || !user.email) return
    const userDoc = doc(db, 'users', user.email)
    const userSnapShot = await getDoc(userDoc)

    return userSnapShot.exists() ? userSnapShot.data() : null
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user as User)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    let isMounted = true

    const Retrieval = async () => {
      const map = await getUsers(currentUser)
      if (!map || !isMounted) return

      setUserInfo(map)
    }
    Retrieval()

    return () => {
      isMounted = false // Set isMounted to false when the component unmounts
    }
  }, [currentUser])

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
    createUserDocument,
    userInfo,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
