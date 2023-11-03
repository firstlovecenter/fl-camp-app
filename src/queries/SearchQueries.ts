import { UserData } from '../../global'
import { collection, query, where, getDocs } from 'firebase/firestore'
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
  const usersData: UserData[] = []
  console.log('camp', camp)
  const userRef = collection(db, 'users', camp, 'registrations')
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

export { searchName, searchCampRegistrations }
