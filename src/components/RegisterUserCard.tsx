import React, { useState } from 'react'
import { Card, CardBody, Flex, Avatar, Text, Button } from '@chakra-ui/react'
import useCustomColors from 'hooks/useCustomColors'
import useClickCard from 'hooks/useClickCard'
import { UserCampData, UserData } from '../../global'
import { useFirestore, useFirestoreDocData } from 'reactfire'
import { useAuth } from 'contexts/AuthContext'
import { setDoc, doc, getDoc, updateDoc } from '@firebase/firestore'
import { capitalizeFirstLetter } from 'utils/utils'

const RegisterUserCard = ({ user }: { user: UserData }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const { registerMemberCardBackground } = useCustomColors()
  const { campId } = useClickCard()
  const firestore = useFirestore()
  const { currentUser } = useAuth()

  const { clickCard } = useClickCard()

  if (user?.camp_camper) {
    const showButton = user?.camp_camper?.some(
      (camp) => camp?.campId === (campId as string)
    )
    if (showButton) setIsRegistered(true)
  }

  const fullName =
    capitalizeFirstLetter(user?.firstName) +
    ' ' +
    capitalizeFirstLetter(user?.lastName)
  const displayName =
    fullName.length > 15 ? fullName.substring(0, 15) + '...' : fullName

  const adminDocReference = doc(
    firestore,
    'users',
    currentUser?.email as string
  )

  const { status, data: adminDoc } = useFirestoreDocData(adminDocReference)

  const adminCamp = adminDoc?.camp_admin.find(
    (camp: UserCampData) =>
      camp.campId === campId && camp.role?.includes('campusAdmin')
  )

  const registerCamper = async () => {
    try {
      await setDoc(doc(firestore, 'registrations', campId + user?.email), {
        campId: campId,
        firstName: user.firstName,
        lastName: user?.lastName,
        email: user?.email,
        gender: user?.gender,
        phoneNumber: user?.phoneNumber,
        whatsappNumber: user?.whatsappNumber,
        campusRef: adminCamp?.campusRef,
      })

      const userReference = doc(firestore, 'users', user?.email)
      const camper = await getDoc(userReference)
      const camp = await getDoc(doc(firestore, 'camps', campId as string))
      const camperCamps = camper.data()?.camp_camper || []

      const campCamper = [...camperCamps]

      const newCampObject = {
        campId: campId,
        name: camp?.data()?.name,
      }

      campCamper.push(newCampObject)

      await updateDoc(userReference, {
        camp_camper: campCamper,
      })
    } catch (error) {
      console.log(error)
    }
  }

  const handleClick = async () => {
    setIsLoading(true)
    const card = { type: 'User', id: user.email }
    clickCard(card)
    await registerCamper()
    setIsLoading(false)

    setIsRegistered(true)
  }

  return (
    <Card
      maxW="md"
      bg={registerMemberCardBackground}
      variant={'unstyled'}
      my={4}
    >
      <CardBody>
        <Flex>
          <Flex flex="1" gap="4" alignItems="center">
            <Avatar name={fullName} src={user?.image_url} size="sm" />
            <Text isTruncated>{displayName}</Text>
          </Flex>
          {isRegistered ? (
            <Button size="sm">Remove</Button>
          ) : (
            <Button
              size="sm"
              colorScheme={'telegram'}
              isLoading={isLoading}
              loadingText="Registering..."
              onClick={() => handleClick()}
            >
              Register
            </Button>
          )}
        </Flex>
      </CardBody>
    </Card>
  )
}

export default RegisterUserCard
