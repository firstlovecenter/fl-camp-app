import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Container, FormControl, Input, Box } from '@chakra-ui/react'
import UserListCard from './UserListCard'

type UserSearchProp = {
  users: UserData[]
}

const UserSearch = ({ users }: UserSearchProp) => {
  const userDataLoaded = users

  const [userData, setUserData] = useState<UserData[]>([])

  useEffect(() => {
    setUserData(userDataLoaded)
  }, [userDataLoaded])

  const { handleSubmit, control } = useForm({
    defaultValues: {
      userSearch: '',
    },
  })

  const onSubmit = (data: any) => {
    setUserData(
      userDataLoaded.filter(
        (user: UserData) =>
          user.firstName
            .toLowerCase()
            .includes(data.userSearch.toLowerCase()) ||
          user.lastName.toLowerCase().includes(data.userSearch.toLowerCase())
      )
    )
  }

  return (
    <div>
      <Container className="mt-3">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl>
            <Controller
              name="userSearch"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="userSearch"
                  placeholder="Search User"
                  aria-describedby="User Search"
                />
              )}
            />
          </FormControl>
        </form>
      </Container>

      <Box mt={4}>
        {userData?.map((user, index) => (
          <UserListCard
            id={user?.id}
            name={user?.firstName + ' ' + user?.lastName}
            key={index}
            role={user?.roles}
          />
        ))}
      </Box>
    </div>
  )
}

export default UserSearch
