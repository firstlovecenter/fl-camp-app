import { useState } from 'react'

type Card = {
  id: string
  type: string
}

const useClickCard = () => {
  const [userId, setUserId] = useState(
    sessionStorage.getItem('userId') ? sessionStorage.getItem('userId') : ''
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
    }
  }

  return { clickCard, userId, setUserId }
}

export default useClickCard
