import React from 'react'
import { useNavigate } from 'react-router-dom'
import MenAtWork from '../assets/men-at-work-shivendu-shukla.webp'
import './UnauthMsg.css'
import { Button, Container } from '@chakra-ui/react'

export const UnauthMsg = () => {
  const navigate = useNavigate()

  return (
    <div className="bg-img" style={{ backgroundImage: `url(${MenAtWork})` }}>
      <Container className="message text-center">
        {/* <!--Web Logo and text--> */}

        {`Sorry! There was an error trying to view this page, but we are working on it!`}
        <div className="pt-3">
          <Button
            colorScheme="blue"
            size="lg"
            onClick={() => {
              navigate('/')
            }}
          >
            Click Here To Go Home
          </Button>
        </div>
      </Container>
    </div>
  )
}
