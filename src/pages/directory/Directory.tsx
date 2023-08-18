import React from 'react'
import MenuCard from '../../components/MenuCard'
import { Container, Heading } from '@chakra-ui/react'

const Directory = () => {
  const menuItems = [{ number: 1, title: 'Earth' }]

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
