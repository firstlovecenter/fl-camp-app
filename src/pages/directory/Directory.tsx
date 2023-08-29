import React, { useEffect, useState } from 'react'
import MenuCard from '../../components/MenuCard'
import { Container, Heading } from '@chakra-ui/react'
import { collection, getDocs, query, orderBy } from '@firebase/firestore'
import { db } from 'firebase'
import { DataItem } from 'utils/MenuDataTypes'
import { menuItemsPlaceholder } from 'utils/placeholders'
import { useFirestore, useFirestoreCollectionData } from 'reactfire'
import { ApolloWrapper } from '@jaedag/admin-portal-react-core'

const Directory = () => {
  const firestore = useFirestore()
  const earthCollection = collection(firestore, 'earth')
  const earthQuery = query(earthCollection, orderBy('name', 'asc'))

  const { status, data: earth } = useFirestoreCollectionData(earthQuery, {
    idField: 'id',
  })

  const loading = !earth

  let error = ''
  if (status === 'error') {
    error = 'Error'
  }

  return (
    <ApolloWrapper data={earth} loading={loading} error={error}>
      <Container>
        <Heading my={6}>Directory</Heading>
        {earth?.map((item, index) => (
          <MenuCard
            registrations={item.registrations}
            paidRegistrations={item.paidRegistrations}
            name={item.name}
            id={item.id}
            key={index}
            type={'earth'}
            route={'/earth-profile'}
          />
        ))}

        {earth?.length === 0 && (
          <>
            {menuItemsPlaceholder.map((item, index) => (
              <MenuCard
                registrations={item.registrations}
                paidRegistrations={item.paidRegistrations}
                name={item.name}
                id={item.id}
                key={index}
                type={'earth'}
                route={'/continents-by-earth'}
              />
            ))}
          </>
        )}
      </Container>
    </ApolloWrapper>
  )
}

export default Directory
