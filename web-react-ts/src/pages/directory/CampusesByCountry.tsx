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

const CampusesByCountry = () => {
  const { countryId } = useChurchId()
  const type = 'campuses'

  const firestore = useFirestore()

  const ref = doc(firestore, 'countries', countryId)
  const { data: country } = useFirestoreDocData(ref)

  const campusesCollection = collection(firestore, type)
  const campusesQuery = query(
    campusesCollection,
    where('countryRef', '==', countryId)
    // orderBy('name', 'asc')
  )

  const { status, data: campuses } = useFirestoreCollectionData(campusesQuery, {
    idField: 'id',
  })

  const loading = !campuses || !country

  let error = ''
  if (status === 'error') {
    error = 'Error'
  }

  return (
    <ApolloWrapper data={campuses} loading={loading} error={error}>
      <Container>
        <Heading my={6}>Campuses in {country?.name}</Heading>
        {campuses?.map((item, index) => (
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
    </ApolloWrapper>
  )
}

export default CampusesByCountry
