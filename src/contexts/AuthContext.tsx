import { useToast } from '@chakra-ui/react'
import { useFirestore } from 'reactfire'
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
  AuthErrorCodes,
} from 'firebase/auth'
import { doc, getDoc, DocumentData, setDoc } from 'firebase/firestore'
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
  createUserDocument: ({ values, email, addUser }: CreateDocumentProps) => void
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
  const getUsers = async (user: User | null) => {
    if (!user || !user.email) return
    const userDoc = await doc(db, 'users', user.email)
    const userSnapShot = await getDoc(userDoc)

    return (await userSnapShot.exists()) ? userSnapShot.data() : null
  const createUserDocument = async ({
    values,
    email,
    addUser,
  }: CreateDocumentProps) => {
    try {
      if (addUser) {
        await sendPasswordResetEmail(auth, email)
        console.log('add user')
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
  const getUsers = async (user: User | null) => {
    if (!user || !user.email) return
    const userDoc = await doc(db, 'users', user.email)
    const userSnapShot = await getDoc(userDoc)

    return (await userSnapShot.exists()) ? userSnapShot.data() : null
  const createUserDocument = async ({
    values,
    email,
    addUser,
  }: CreateDocumentProps) => {
    try {
      if (addUser) {
        await sendPasswordResetEmail(auth, email)
        console.log('add user')
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
    createUserDocument,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
