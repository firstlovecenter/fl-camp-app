import { useState, useCallback, useEffect } from 'react'

type Card = {
  id: string
  type: string
}

const useClickCard = () => {
  const [userId, setUserId] = useState(sessionStorage.getItem('userId') || '')
  const [campId, setCampId] = useState(sessionStorage.getItem('campId') || '')
  const [email, setEmail] = useState(sessionStorage.getItem('email') || '')

  const clickCard = useCallback(
    (card: Card) => {
      if (!card) {
        return null
      }

      switch (card.type) {
        case 'User':
          setUserId(card.id)
          break
        case 'Camp':
          setCampId(card.id)
          break
        case 'email':
          setEmail(card.id)
          break
        default:
          break
      }
    },
    [setUserId, setCampId, setEmail]
  )

  useEffect(() => {
    sessionStorage.setItem('userId', userId)
  }, [userId])

  useEffect(() => {
    sessionStorage.setItem('campId', campId)
  }, [campId])

  useEffect(() => {
    sessionStorage.setItem('email', email)
  }, [email])

  return { clickCard, userId, setUserId, campId, setCampId, email, setEmail }
}

export default useClickCard
