import { useState } from 'react'

type Card = {
  id: string
  type: string
}

const useClickCard = () => {
  const [userId, setUserId] = useState(
    sessionStorage.getItem('userId') ? sessionStorage.getItem('userId') : ''
  )

  const [campId, setCampId] = useState(
    sessionStorage.getItem('campId') ? sessionStorage.getItem('campId') : ''
  )

  const clickCard = (card: Card) => {
    if (!card) {
      return null
    }

    switch (card.type) {
      case 'User':
        setUserId(card.id)
        sessionStorage.setItem('userId', card.id)
        break
      case 'Camp':
        setCampId(card.id)
        sessionStorage.setItem('campId', card.id)
        break
    }
  }

  return { clickCard, userId, setUserId, campId, setCampId }
}

export default useClickCard
