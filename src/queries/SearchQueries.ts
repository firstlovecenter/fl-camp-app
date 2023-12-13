import { Registration, UserData } from '../../global'
import { collection, query, where, getDocs, limit } from 'firebase/firestore'
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

  docs?.forEach((userDoc: any) => {
    usersData.push(userDoc.data())
  })

  docs2?.forEach((userDoc: any) => {
    usersData.push(userDoc.data())
  })

  return usersData
}

const searchCampRegistrations = async (name: string, camp: string) => {
  const usersData: Registration[] = []

  const userRef = collection(db, 'camps', camp, 'registrations')
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

  console.log('docs', docs)
  console.log('docs2', docs2)

  docs?.forEach((userDoc: any) => {
    console.log('userDoc', userDoc)
    usersData.push(userDoc.data())
  })

  docs2?.forEach((userDoc: any) => {
    usersData.push(userDoc.data())
  })

  console.log('usersData', usersData)

  return usersData
}

const fetchInitialCampRegistrations = async (camp: string) => {
  const usersData: Registration[] = []

  const userRef = collection(db, 'camps', camp, 'registrations')
  const queryRegistrations = query(userRef, limit(15))

  const docs = await getDocs(queryRegistrations)

  console.log('docs', docs)

  docs?.forEach((userDoc: any) => {
    usersData.push(userDoc.data())
  })

  return usersData
}

export { searchName, searchCampRegistrations, fetchInitialCampRegistrations }
