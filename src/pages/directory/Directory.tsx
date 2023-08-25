import React, { useEffect, useState } from 'react'
import MenuCard from '../../components/MenuCard'
import { Container, Heading } from '@chakra-ui/react'
import { collection, getDocs } from '@firebase/firestore'
import { db } from 'firebase'
import { DataItem } from 'utils/types'

const Directory = () => {
  const originalmenuItems = [{ number: 1, title: 'Earth' }]
  const [menuItems, setMenuItems] = useState<DataItem[]>([])
  const queryEarth = async () => {
    // const firestore = useFirestore()
    const earthCollection = await getDocs(collection(db, 'countries'))

    const res: {
      id: string
      paidRegistrations: any
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
          number={item.number}
          title={item.title}
          key={index}
          route={'/continents-by-earth'}
        />
      ))}
    </Container>
  )
}

export default Directory
