import React from 'react'
import MenuCard from '../../components/MenuCard'
import { Container, Heading } from '@chakra-ui/react'
import { useChurchId } from '../../contexts/IdContext'
import { query, collection, where, doc } from '@firebase/firestore'
import {
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
} from 'reactfire'
import { ApolloWrapper } from '@jaedag/admin-portal-react-core'
import useClickCard from '../../hooks/useClickCard'

const CountriesByContinent = () => {
  const { continentId } = useChurchId()
  const { campId } = useClickCard()
  const type = 'countries'

  const firestore = useFirestore()

  const campRef = doc(firestore, 'camps', campId as string)

  const ref = doc(campRef, 'continents', continentId)
  const { data: continent } = useFirestoreDocData(ref)

  const countriesCollection = collection(campRef, 'countries')
  const countriesQuery = query(
    countriesCollection,
    where('upperChurchId', '==', continentId)
  )

  const { status, data: countries } = useFirestoreCollectionData(
    countriesQuery,
    {
      idField: 'id',
    }
  )

  const loading = !countries || !continent

  let error = ''
  if (status === 'error') {
    error = 'Error'
  }

  return (
    <ApolloWrapper data={countries} loading={loading} error={error}>
      <Container>
        <Heading my={6}>Countries in {continent?.name}</Heading>
        {countries?.map((item, index) => (
          <MenuCard
            paidRegistrations={item?.paidRegistrations}
            registrations={item?.registrations}
            name={item.name}
            id={item.id}
            type={type}
            key={index}
            route={'/camp/country-profile'}
          />
        ))}
      </Container>
    </ApolloWrapper>
  )
}

export default CountriesByContinent
