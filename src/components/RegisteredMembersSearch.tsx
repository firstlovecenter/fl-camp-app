import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { FormControl, Input, Box, Center, Skeleton } from '@chakra-ui/react'
import { Registration } from '../../global'

import {
  fetchInitialCampRegistrations,
  searchCampRegistrations,
} from 'queries/SearchQueries'
import { NO_USERS_FOUND_TEXT } from 'utils/constants'
import { ApolloWrapper } from '@jaedag/admin-portal-react-core'
import RegisteredUsersCard from './RegisteredUsersCard'

const RegisterMembersSearch = ({ campId }: { campId: string }) => {
  const [userData, setUserData] = useState<Registration[]>([])
  const [loading, setLoading] = useState<boolean>(true) // Set initial loading to true
  const [cardText, setCardText] = useState<string>('Type to begin your search')

  const { handleSubmit, control } = useForm({
    defaultValues: {
      userSearch: '',
    },
  })

  const fetchInitialMembers = async () => {
    const initialMembersResult = await fetchInitialCampRegistrations(campId)
    setUserData(initialMembersResult)
    setLoading(false) // Set loading to false once data is fetched
  }

  useEffect(() => {
    fetchInitialMembers()
  })

  const onRemoveCamper = async (userId: string) => {
    setUserData((userData) =>
      userData.filter((user) => user.whatsappNumber !== userId)
    )
  }

  const onSubmit = async (data: { userSearch: string }) => {
    setLoading(true)
    const searchResult = await searchCampRegistrations(data.userSearch, campId)
    setLoading(false)

    if (searchResult.length === 0) {
      setCardText(NO_USERS_FOUND_TEXT)
      console.log('No users found')
    } else {
      setCardText('') // Clear the "no users found" text
    }

    console.log('searchResult', searchResult)
    setUserData(searchResult)
  }

  return (
    <ApolloWrapper data={userData} loading={loading}>
      <Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl my={1}>
            <Controller
              name="userSearch"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="userSearch"
                  placeholder="Search User"
                  aria-describedby="User Search"
                  py={6}
                  variant="filled"
                />
              )}
            />
          </FormControl>
        </form>

        {loading ? (
          <Skeleton height="60px" mt={4} />
        ) : (
          <Box mt={4}>
            {userData.length > 0 ? (
              userData.map((user, index) => (
                <RegisteredUsersCard
                  user={user}
                  key={index}
                  onRemove={() => onRemoveCamper(user?.whatsappNumber)}
                />
              ))
            ) : (
              <Center>{cardText}</Center>
            )}
          </Box>
        )}
      </Box>
    </ApolloWrapper>
  )
}

export default RegisterMembersSearch
