import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { FormControl, Input, Box, Center } from '@chakra-ui/react'
import UserListCard from './UserListCard'
import { UserData } from '../../global'
import { capitalizeFirstLetter } from 'utils/utils'
import searchName from 'queries/SearchQueries'
import {
  collection,
  query,
  getDocs,
  DocumentData,
  limit,
} from 'firebase/firestore'
import { db } from 'firebase'

const UserSearch = () => {
  const [userData, setUserData] = useState<DocumentData>([])
  const [cardText, setCardText] = useState<string>('Type to begin your search')

  useEffect(() => {
    const data = async () => {
      const usersData: DocumentData = []
      const userRef = collection(db, 'users')
      const q = query(userRef, limit(5))
      console.log(q)
      const querySanp = await getDocs(q)
      querySanp.forEach((doc) => {
        usersData.push(doc.data())
      })
      setUserData(usersData)
    }
    data()
  }, [])
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
        <Box mb={4}>
          <Center>{cardText}</Center>
        </Box>
        {userData?.map((user: UserData, index: number) => (
          <UserListCard
            id={user?.email}
            name={
              capitalizeFirstLetter(user?.firstName) +
              ' ' +
              capitalizeFirstLetter(user?.lastName)
            }
            key={index}
            role={user?.roles}
            image={user?.image_url}
          />
        ))}
      </Box>
    </Box>
  )
}

export default UserSearch
