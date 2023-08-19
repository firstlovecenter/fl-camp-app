import React from 'react'
import MenuCard from '../../components/MenuCard'
import { Container, Heading } from '@chakra-ui/react'

const ContinentsByEarth = () => {
  const menuItems = [
    { number: 500, title: 'Africa' },
    { number: 2, title: 'Europe' },
    { number: 3, title: 'Asia' },
    { number: 4, title: 'North America' },
    { number: 4, title: 'South America' },
    { number: 4, title: 'Australia' },
  ]
  return (
    <Container>
      <Heading my={6}>Breakdown by Continents</Heading>
      {menuItems.map((item, index) => (
        <MenuCard
          number={item.number}
          title={item.title}
          key={index}
          route={'/countries-by-continent'}
        />
      ))}
    </Container>
  )
}

export default ContinentsByEarth
