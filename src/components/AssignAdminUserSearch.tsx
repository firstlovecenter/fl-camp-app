import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { FormControl, Input, Box, Center } from '@chakra-ui/react'

import { UserData } from '../../global'
import AdminUserSearchCard from './AdminUserSearchCard'
import searchName from 'queries/SearchQueries'
import { capitalizeFirstLetter } from 'utils/utils'

type UserSearchProp = {
  modal: () => void
}

const AssignAdminUserSearch = ({ modal }: UserSearchProp) => {
  const [userData, setUserData] = useState<UserData[]>([])
  const [cardText, setCardText] = useState<string>('Type to begin your search')

  const { handleSubmit, control } = useForm({
    defaultValues: {
      userSearch: '',
    },
  })

  const noUsersFoundText = 'No Users Found'

  const onSubmit = async (data: any) => {
    const searchResult = await searchName(data.userSearch)
    if (searchResult.length === 0) {
      setCardText(noUsersFoundText)
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
            <AdminUserSearchCard
              email={user?.email}
              name={
                capitalizeFirstLetter(user?.firstName) +
                ' ' +
                capitalizeFirstLetter(user?.lastName)
              }
              key={index}
              modal={modal}
              image={user?.image_url}
            />
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

export default AssignAdminUserSearch
