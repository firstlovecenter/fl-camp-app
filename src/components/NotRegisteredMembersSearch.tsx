import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { FormControl, Input, Box, Center } from '@chakra-ui/react'
import { UserData } from '../../global'
import { searchName } from 'queries/SearchQueries'
import { NO_USERS_FOUND_TEXT } from 'utils/constants'
import RegisterUserCard from './RegisterUserCard'

const NotRegisteredMembersSearch = () => {
  const [userData, setUserData] = useState<UserData[]>([])
  const [cardText, setCardText] = useState<string>('Type to begin your search')

  const { handleSubmit, control } = useForm({
    defaultValues: {
      userSearch: '',
    },
  })

  const onSubmit = async (data: { userSearch: string }) => {
    const searchResult = await searchName(data.userSearch)
    if (searchResult.length === 0) {
      setCardText(NO_USERS_FOUND_TEXT)
    }
    setUserData(searchResult)
  }

  return (
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

      <Box mt={4}>
        {userData.length > 0 ? (
          userData?.map((user, index) => (
            <RegisterUserCard user={user} key={index} />
          ))
        ) : (
          <Box>
            <Center>{cardText}</Center>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default NotRegisteredMembersSearch
