import MenuCard from '../../components/MenuCard'
import { Container, Heading } from '@chakra-ui/react'
import { useChurchId } from 'contexts/IdContext'
import { query, collection, where, doc } from '@firebase/firestore'
import {
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
} from 'reactfire'
import { ApolloWrapper } from '@jaedag/admin-portal-react-core'

const CountriesByContinent = () => {
  const { continentId } = useChurchId()
  const type = 'countries'

  const firestore = useFirestore()

  const ref = doc(firestore, 'continents', continentId)
  const { data: continent } = useFirestoreDocData(ref)

  const countriesCollection = collection(firestore, type)
  const countriesQuery = query(
    countriesCollection,
    where('continentRef', '==', continentId)
    // orderBy('name', 'asc')
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
            paidRegistrations={item.paidRegistrations}
            registrations={item.registrations}
            name={item.name}
            id={item.id}
            type={type}
            key={index}
            route={'/country-profile'}
          />
        ))}
      </Container>
    </ApolloWrapper>
  )
}

export default CountriesByContinent
