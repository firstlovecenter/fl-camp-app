import React, { useEffect } from 'react'
import MenuCard from '../../components/MenuCard'
import { Container, Heading } from '@chakra-ui/react'
import { collection, getDocs } from '@firebase/firestore'
import { db } from 'firebase'

const Directory = () => {
  const menuItems = [{ number: 1, title: 'Earth' }]
  const queryEarth = async () => {
    // const firestore = useFirestore()
    const earthCollection = await getDocs(collection(db, 'countries'))

    const res: { id: string }[] = []

    earthCollection.forEach((item) => {
      res.push({
        id: item.id,
        ...item.data(),
      })
    })

    return res
  }

  const fetchData = async () => {
    const res = await queryEarth()
    console.log(res)
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
