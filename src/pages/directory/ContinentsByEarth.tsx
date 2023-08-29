import MenuCard from '../../components/MenuCard'
import { Container, Heading } from '@chakra-ui/react'
import { useChurchId } from 'contexts/IdContext'
import { collection, query, where } from '@firebase/firestore'
import { useFirestore, useFirestoreCollectionData } from 'reactfire'
import { ApolloWrapper } from '@jaedag/admin-portal-react-core'

const ContinentsByEarth = () => {
  const { earthId } = useChurchId()
  const type = 'continents'

  const firestore = useFirestore()
  const continentsCollection = collection(firestore, type)
  const continentsQuery = query(
    continentsCollection,
    where('earthId', '==', earthId)
    // orderBy('name', 'asc')
  )

  const { status, data: continents } = useFirestoreCollectionData(
    continentsQuery,
    {
      idField: 'id',
    }
  )

  const loading = !continents

  let error = ''
  if (status === 'error') {
    error = 'Error'
  }

  return (
    <ApolloWrapper data={continents} loading={loading} error={error}>
      <Container>
        <Heading my={6}>Continents By Earth</Heading>
        {continents?.map((item, index) => (
          <MenuCard
            paidRegistrations={item.paidRegistrations}
            registrations={item.registrations}
            id={item.id}
            name={item.name}
            key={index}
            type={type}
            route={'/continent-profile'}
          />
        ))}
      </Container>
    </ApolloWrapper>
  )
}

export default ContinentsByEarth
