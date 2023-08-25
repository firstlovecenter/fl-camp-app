import React, { useEffect, useState } from 'react'
import MenuCard from '../../components/MenuCard'
import { Container, Heading } from '@chakra-ui/react'
import { useId } from 'contexts/IdContext'
import { CampusesDataItem } from 'utils/MenuDataTypes'
import { query, collection, where, getDocs } from '@firebase/firestore'
import { db } from 'firebase'

const CampusesByCountry = () => {
  const { countryId } = useId()
  const type = 'campuses'

  const [menuItems, setMenuItems] = useState<CampusesDataItem[]>([])
  const menuList = async (type: string) => {
    const q = query(collection(db, type), where('countryRef', '==', countryId))

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

  const fetchData = async () => {
    const res = await menuList(type)

    setMenuItems(res)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Container>
      <Heading my={6}>Breakdown by Campus</Heading>
      {menuItems.map((item, index) => (
        <MenuCard
          paidRegistrations={item.paidRegistrations}
          registrations={item.registrations}
          name={item.name}
          id={item.id}
          type={type}
          key={index}
          route={'/campus-profile'}
        />
      ))}
    </Container>
  )
}

export default CampusesByCountry
