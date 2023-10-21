import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react'
import React from 'react'
import { GiHamburgerMenu } from 'react-icons/gi'
import { useNavigate } from 'react-router-dom'
import { ColorModeSwitcher } from '../components/ColorModeSwitcher'
import { useUserContext } from 'contexts/UserContext'
import { useAuth } from 'contexts/AuthContext'

function Navigation() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef(null)
  const navigate = useNavigate()
  const { userProfile } = useUserContext()
  const { logout } = useAuth()

  const handleClick = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (err) {
      console.log('err', err)
    }
  }

  let menuItems = []
  switch (userProfile) {
    case 'globalAdmin':
      menuItems = [
        {
          name: 'Home',
          link: '/',
        },
        {
          name: 'Camps',
          link: '/camps',
        },
        {
          name: 'Users',
          link: '/users',
        },
      ]
      break
    default:
      menuItems = [
        {
          name: 'Home',
          link: '/',
        },
      ]
      break
  }

  return (
    <>
      <IconButton
        colorScheme="gray"
        aria-label="Side Nav Toggle"
        size="lg"
        position="fixed"
        bottom={4}
        right={6}
        zIndex={2}
        isRound
        ref={btnRef}
        onClick={onOpen}
        icon={<GiHamburgerMenu />}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
        size={{ base: 'full', md: 'xs', lg: 'xs' }}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>

          <DrawerBody>
            {menuItems.map((item) => (
              <Button
                key={item.name}
                paddingY={8}
                marginY={2}
                width="100%"
                onClick={() => {
                  navigate(item.link)
                  onClose()
                }}
              >
                {item.name}
              </Button>
            ))}
          </DrawerBody>

          <DrawerFooter justifyContent={'space-between'}>
            <Button colorScheme="red" onClick={handleClick}>
              Log out
            </Button>
            <ColorModeSwitcher />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
export default Navigation
