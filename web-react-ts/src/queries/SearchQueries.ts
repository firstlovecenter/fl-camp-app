import { Registration, UserData } from '../../global'
import {
  collection,
  query,
  where,
  getDocs,
  limit,
  DocumentData,
  QuerySnapshot,
} from 'firebase/firestore'
import { db } from '../firebase'

const searchName = async (name: string) => {
  const usersData: UserData[] = []

  const userRef = collection(db, 'users')
  const queryFirstName = query(
    userRef,
    where('firstName', '>=', name.toLowerCase()),
    where('firstName', '<=', name.toLowerCase() + '\uf8ff')
  )

  const docs = await getDocs(queryFirstName)

  const queryLastName = query(
    userRef,
    where('lastName', '>=', name.toLowerCase()),
    where('lastName', '<=', name.toLowerCase() + '\uf8ff')
  )
  const docs2 = await getDocs(queryLastName)

  docs?.forEach((userDoc: DocumentData) => {
    usersData.push(userDoc.data())
  })

  docs2?.forEach((userDoc: DocumentData) => {
    usersData.push(userDoc.data())
  })

  return usersData
}

const searchCampRegistrations = async (name: string, camp: string) => {
  const usersData: Registration[] = []
  const uniqueWhatsappNumbers = new Set<string>()

  const userRef = collection(db, 'camps', camp, 'registrations')
  const queryFirstName = query(
    userRef,
    where('firstName', '>=', name.toLowerCase()),
    where('firstName', '<=', name.toLowerCase() + '\uf8ff')
  )

  const queryLastName = query(
    userRef,
    where('lastName', '>=', name.toLowerCase()),
    where('lastName', '<=', name.toLowerCase() + '\uf8ff')
  )
  const [docsFirstName, docsLastName] = await Promise.all([
    getDocs(queryFirstName),
    getDocs(queryLastName),
  ])

  const processDocs = (docs: QuerySnapshot<DocumentData>) => {
    docs.forEach((userDoc: DocumentData) => {
      const userData = userDoc.data()
      const whatsappNumber = userData.whatsappNumber

      if (!uniqueWhatsappNumbers.has(whatsappNumber)) {
        uniqueWhatsappNumbers.add(whatsappNumber)
        usersData.push(userData)
      }
    })
  }

  processDocs(docsFirstName)
  processDocs(docsLastName)

  console.log('usersData', usersData)

  return usersData
}

const fetchInitialCampRegistrations = async (camp: string) => {
  const usersData: Registration[] = []

  const userRef = collection(db, 'camps', camp, 'registrations')
  const queryRegistrations = query(userRef, limit(15))

  const docs = await getDocs(queryRegistrations)

  docs?.forEach((userDoc: DocumentData) => {
    usersData.push(userDoc.data())
  })

  return usersData
}

export { searchName, searchCampRegistrations, fetchInitialCampRegistrations }
