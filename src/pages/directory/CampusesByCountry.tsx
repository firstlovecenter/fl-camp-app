import React from 'react'
import MenuCard from '../../components/MenuCard'
import { Container, Heading } from '@chakra-ui/react'

const CampusesByCountry = () => {
  const menuItems = [
    { number: 500, title: 'Adenta' },
    { number: 2, title: 'Ho' },
    { number: 3, title: 'Kumasi' },
    { number: 4, title: 'UCC' },
    { number: 4, title: 'Kwabenya' },
    { number: 4, title: 'Galatians' },
  ]
  return (
    <Container>
      <Heading my={6}>Breakdown by Campus</Heading>
      {menuItems.map((item, index) => (
        <MenuCard
          number={item.number}
          title={item.title}
          key={index}
          route={'/add-an-admin'}
        />
      ))}
    </Container>
  )
}

export default CampusesByCountry
