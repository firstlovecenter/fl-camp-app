import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { FormControl, Input, Box, Center } from '@chakra-ui/react'
import UserListCard from './UserListCard'
import { UserData } from '../../global'
import { useFirestore } from 'reactfire'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { capitalizeFirstLetter } from 'utils/utils'

type UserSearchProp = {
  users: UserData[]
}

const UserSearch = () => {
  const firestore = useFirestore()

  const [userData, setUserData] = useState<UserData[]>([])

  const { handleSubmit, control } = useForm({
    defaultValues: {
      userSearch: '',
    },
  })

  const onSubmit = (data: any) => {
    searchName(data.userSearch)
  }

  const searchName = async (name: string) => {
    const usersData: UserData[] = []

    const userRef = collection(firestore, 'users')
    const queryFirstName = query(
      userRef,
      where('firstName', '>=', name.toLowerCase()),
      where('firstName', '<=', name.toLowerCase() + '\uf8ff')
    )
    const docs = await getDocs(queryFirstName)

    const queryLastName = query(
      userRef,
      where('lastName', '>=', name.toLowerCase()),
      where('lastName', '<=', name.toLowerCase() + '\uf8ff')
    )
    const docs2 = await getDocs(queryLastName)

    docs?.forEach((userDoc: any) => {
      usersData.push(userDoc.data())
    })

    docs2?.forEach((userDoc: any) => {
      usersData.push(userDoc.data())
    })

    setUserData(usersData)
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
            <UserListCard
              id={user?.id}
              name={
                capitalizeFirstLetter(user?.firstName) +
                ' ' +
                capitalizeFirstLetter(user?.lastName)
              }
              key={index}
              role={user?.roles}
              image={user?.image_url}
            />
          ))
        ) : (
          <Box>
            <Center>No Users Found</Center>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default UserSearch
