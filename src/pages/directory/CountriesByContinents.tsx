import React from 'react'
import MenuCard from '../../components/MenuCard'
import { Container, Heading } from '@chakra-ui/react'

const CountriesByContinent = () => {
  const menuItems = [
    { number: 500, title: 'Ghana' },
    { number: 2, title: 'Botswana' },
    { number: 3, title: 'Ivory Coast' },
    { number: 4, title: 'Sierra Leone' },
    { number: 4, title: 'Liberia' },
    { number: 4, title: 'Niger' },
  ]
  return (
    <Container>
      <Heading my={6}>Countries</Heading>
      {menuItems.map((item, index) => (
        <MenuCard
          number={item.number}
          title={item.title}
          key={index}
          route={'/campuses-by-country'}
        />
      ))}
    </Container>
  )
}

export default CountriesByContinent
