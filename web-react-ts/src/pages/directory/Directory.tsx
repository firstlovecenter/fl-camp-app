import React from 'react'
import MenuCard from '../../components/MenuCard'
import { Container, Heading } from '@chakra-ui/react'
import { collection, query, orderBy } from '@firebase/firestore'

import { menuItemsPlaceholder } from '../../utils/placeholders'
import { useFirestore, useFirestoreCollectionData } from 'reactfire'
import { ApolloWrapper } from '@jaedag/admin-portal-react-core'
import useClickCard from '../../hooks/useClickCard'

const Directory = () => {
  const firestore = useFirestore()
  const { campId } = useClickCard()
  const campPlanetsCollection = collection(
    firestore,
    'camps',
    campId as string,
    'planets'
  )
  const campPlanetsQuery = query(campPlanetsCollection)

  const { status, data: planets } = useFirestoreCollectionData(
    campPlanetsQuery,
    {
      idField: 'id',
    }
  )
  console.log(planets)

  const loading = !planets

  let error = ''
  if (status === 'error') {
    error = 'Error'
  }

  return (
    <ApolloWrapper data={planets} loading={loading} error={error}>
      <Container>
        <Heading my={6}>Directory</Heading>
        {planets?.map((item, index) => (
          <MenuCard
            registrations={item?.registrations}
            paidRegistrations={item?.paidRegistrations}
            name={item.name}
            id={item.id}
            key={index}
            type={'planet'}
            route={'/camp/planet-profile'}
          />
        ))}

        {planets?.length === 0 && (
          <>
            {menuItemsPlaceholder.map((item, index) => (
              <MenuCard
                registrations={item.registrations}
                paidRegistrations={item.paidRegistrations}
                name={item.name}
                id={item.id}
                key={index}
                type={'planet'}
                route={'/continents-by-planet'}
              />
            ))}
          </>
        )}
      </Container>
    </ApolloWrapper>
  )
}

export default Directory
