import React, { useEffect, useState } from 'react'
import MenuCard from '../../components/MenuCard'
import { Container, Heading } from '@chakra-ui/react'
import { collection, getDocs } from '@firebase/firestore'
import { db } from 'firebase'
import { DataItem } from 'utils/types'

const Directory = () => {
  const [menuItems, setMenuItems] = useState<DataItem[]>([])
  const queryEarth = async () => {
    // const firestore = useFirestore()
    const earthCollection = await getDocs(collection(db, 'earth'))

    const res: {
      id: string
      paidRegistrations: number
      registrations: any
      name: any
    }[] = []

    earthCollection.forEach((item) => {
      res.push({
        id: item.id,
        paidRegistrations: item.data().paidRegistrations,
        registrations: item.data().registrations,
        name: item.data().name,
        ...item.data(),
      })
    })

    return res
  }

  const fetchData = async () => {
    const res = await queryEarth()
    console.log(res)
    setMenuItems(res)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Container>
      <Heading my={6}>Directory</Heading>
      {menuItems.map((item, index) => (
        <MenuCard
          registrations={item.registrations}
          paidRegistrations={item.paidRegistrations}
          name={item.name}
          id={item.id}
          key={index}
          type={'earth'}
          route={'/continents-by-earth'}
        />
      ))}
    </Container>
  )
}

export default Directory
