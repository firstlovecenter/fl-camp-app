import React, { useEffect, useState } from 'react'
import MenuCard from '../../components/MenuCard'
import { Container, Heading } from '@chakra-ui/react'
import { useId } from 'contexts/IdContext'
import { collection, getDocs, query, where } from '@firebase/firestore'
import { db } from 'firebase'
import { ContinentsDataItem } from 'utils/MenuDataTypes'

const ContinentsByEarth = () => {
  const { earthId } = useId()
  const type = 'continents'

  const [menuItems, setMenuItems] = useState<ContinentsDataItem[]>([])
  const menuList = async (type: string) => {
    const q = query(collection(db, type), where('earthId', '==', earthId))

    const querySnapshot = await getDocs(q)

    const res: {
      id: string
      paidRegistrations: number
      registrations: number
      name: string
    }[] = []

    querySnapshot.forEach((item) => {
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await menuList(type)
        setMenuItems(res)
      } catch (error) {
        console.log(error)
      }
    }

    fetchData()
  }, [])

  return (
    <Container>
      <Heading my={6}>Breakdown by Continents</Heading>
      {menuItems.map((item, index) => (
        <MenuCard
          paidRegistrations={item.paidRegistrations}
          registrations={item.registrations}
          id={item.id}
          name={item.name}
          key={index}
          type={type}
          route={'/continent-profile'}
        />
      ))}
    </Container>
  )
}

export default ContinentsByEarth
