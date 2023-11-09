import React from 'react'
import { Card, CardBody, Flex, Avatar, Text, Button } from '@chakra-ui/react'
import useCustomColors from 'hooks/useCustomColors'
import useClickCard from 'hooks/useClickCard'
import { UserCampData } from '../../global'
import { useFirestore } from 'reactfire'
import { addDoc, collection } from '@firebase/firestore'

const RegisterUserCard = ({
  name,
  email,
  image,
  camp_camper,
  onOpenSelectCampusModal,
}: {
  name: string
  email: string
  image: string
  camp_camper: UserCampData[] | undefined
  onOpenSelectCampusModal: () => void
}) => {
  const { registerMemberCardBackground } = useCustomColors()
  const { campId } = useClickCard()
  const firestore = useFirestore()

  const { clickCard } = useClickCard()

  let showButton = false

  if (camp_camper) {
    showButton = camp_camper?.some(
      (camp) => camp?.campId === (campId as string)
    )
  }
  const displayName = name.length > 15 ? name.substring(0, 15) + '...' : name

  const registerCamper = async () => {
    const docRef = await addDoc(collection(firestore, 'registrations'), {
      campId: campId,
      country: 'Japan',
    })
  }

  const handleClick = async () => {
    const card = { type: 'User', id: email }
    clickCard(card)
    onOpenSelectCampusModal()
  }

  return (
    <Card maxW="md" bg={registerMemberCardBackground} variant={'unstyled'}>
      <CardBody>
        <Flex>
          <Flex flex="1" gap="4" alignItems="center">
            <Avatar name={name} src={image} size="sm" />
            <Text isTruncated>{displayName}</Text>
          </Flex>
          {showButton ? (
            <Button size="sm">Remove </Button>
          ) : (
            <Button
              size="sm"
              colorScheme={'telegram'}
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
