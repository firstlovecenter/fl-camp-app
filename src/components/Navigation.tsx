import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  IconButton,
  Image,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import React from 'react'
import { GiHamburgerMenu } from 'react-icons/gi'
import { useNavigate } from 'react-router-dom'
import { ColorModeSwitcher } from '../components/ColorModeSwitcher'
import { useUserContext } from 'contexts/UserContext'
import logo from '../assets/Logo.svg'
import { useAuth } from 'contexts/AuthContext'
import useCustomColors from 'hooks/useCustomColors'

function Navigation() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef(null)
  const navigate = useNavigate()
  const { userProfile } = useUserContext()
  const { userInfo } = useAuth()
  const { navBg } = useCustomColors()

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
    <Box bg={navBg} width={'100vw'} py={2} px={5}>
      <HStack justifyContent={'space-between'}>
        <Image src={logo} width={'80px'} />
        <IconButton
          colorScheme="gray"
          aria-label="Side Nav Toggle"
          bg="none"
          ref={btnRef}
          onClick={onOpen}
          icon={<GiHamburgerMenu size={25} />}
        />
      </HStack>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
        size={{ sm: 'sm' }}
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

          <DrawerFooter justifyContent={'space-between'} bg={navBg}>
            <HStack
              gap={3}
              onClick={() => {
                onClose()
                navigate('/profile')
              }}
              cursor={'pointer'}
            >
              <Image src={userInfo.image_url} width={10} rounded={'full'} />
              <div>
                <Text
                  textTransform={'capitalize'}
                  fontWeight={'medium'}
                >{`${userInfo.firstName} ${userInfo.lastName}`}</Text>
                <Text fontSize={'sm'}>{userInfo.email}</Text>
              </div>
            </HStack>
            <ColorModeSwitcher />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  )
}
export default Navigation
