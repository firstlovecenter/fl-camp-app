import React, { useEffect, useState } from 'react'
import { Card, CardBody, Flex, Avatar, Text, Button } from '@chakra-ui/react'
import useCustomColors from '../hooks/useCustomColors'
import useClickCard from '../hooks/useClickCard'
import { Registration, UserCampData } from '../../global'
import { useFirestore } from 'reactfire'
import { doc, getDoc, updateDoc, deleteDoc } from '@firebase/firestore'
import { capitalizeFirstLetter } from '../utils/utils'

const RegisteredUsersCard = ({
  user,
  onRemove,
}: {
  user: Registration
  onRemove: () => void
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const { registerMemberCardBackground } = useCustomColors()
  const { campId } = useClickCard()
  const firestore = useFirestore()

  const fullName =
    capitalizeFirstLetter(user?.firstName) +
    ' ' +
    capitalizeFirstLetter(user?.lastName)
  const displayName =
    fullName.length > 15 ? fullName.substring(0, 15) + '...' : fullName

  const removeCamper = async () => {
    try {
      // Delete registration document
      await deleteDoc(
        doc(
          firestore,
          'camps',
          campId as string,
          'registrations',
          user?.whatsappNumber as string
        )
      )

      const userReference = doc(firestore, 'users', user?.email)
      const camper = await getDoc(userReference)
      const camperCamps = camper.data()?.camp_camper || []

      // Remove the camp from the camp_camper array
      const updatedCampCamper = camperCamps.filter(
        (camp: UserCampData) => camp.campId !== campId
      )

      // Update the user document
      await updateDoc(userReference, {
        camp_camper: updatedCampCamper,
      })

      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }

  const handleRemoval = async () => {
    setIsLoading(true)
    const result = await removeCamper()
    onRemove()
    setIsLoading(false)
    if (result) {
      setIsRegistered(false)
    }
  }

  useEffect(() => {
    if (user?.campId === campId) {
      setIsRegistered(true)
    }
  }, [user, campId])

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
            <Avatar name={fullName} src={''} size="sm" />
            <Text isTruncated>{displayName}</Text>
          </Flex>
          <Button
            size="sm"
            isLoading={isLoading}
            loadingText="Removing..."
            onClick={() => handleRemoval()}
          >
            Remove
          </Button>
        </Flex>
      </CardBody>
    </Card>
  )
}

export default RegisteredUsersCard
