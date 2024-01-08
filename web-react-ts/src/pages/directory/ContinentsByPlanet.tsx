import React from 'react'
import MenuCard from '../../components/MenuCard'
import { Container, Heading } from '@chakra-ui/react'
import { useChurchId } from '../../contexts/IdContext'
import { collection, query, where } from '@firebase/firestore'
import { useFirestore, useFirestoreCollectionData } from 'reactfire'
import { ApolloWrapper } from '@jaedag/admin-portal-react-core'
import useClickCard from '../../hooks/useClickCard'

const ContinentsByPlanet = () => {
  const { planetId } = useChurchId()
  const { campId } = useClickCard()
  const type = 'continents'

  const firestore = useFirestore()
  const campContinentsCollection = collection(
    firestore,
    'camps',
    campId as string,
    'continents'
  )
  const continentsQuery = query(
    campContinentsCollection,
    where('upperChurchId', '==', planetId)
    // orderBy('name', 'asc')
  )

  const { status, data: continents } = useFirestoreCollectionData(
    continentsQuery,
    {
      idField: 'id',
    }
  )

  console.log(continents)

  const loading = !continents

  let error = ''
  if (status === 'error') {
    error = 'Error'
  }

  return (
    <ApolloWrapper data={continents} loading={loading} error={error}>
      <Container>
        <Heading my={6}>Continents By Planet</Heading>
        {continents?.map((item, index) => (
          <MenuCard
            paidRegistrations={item?.paidRegistrations}
            registrations={item?.registrations}
            id={item.id}
            name={item.name}
            key={index}
            type={type}
            route={'/camp/continent-profile'}
          />
        ))}
      </Container>
    </ApolloWrapper>
  )
}

export default ContinentsByPlanet
