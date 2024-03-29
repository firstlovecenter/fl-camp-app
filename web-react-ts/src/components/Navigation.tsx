import React from 'react'
import {
  Box,
  Button,
  Divider,
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

import { GiHamburgerMenu } from 'react-icons/gi'
import { useNavigate } from 'react-router-dom'
import { ColorModeSwitcher } from './ColorModeSwitcher'
import { useUserContext } from '../contexts/UserContext'
import FLCOutlineLogo from '../assets/flcOutlineLogo'
import { useAuth } from '../contexts/AuthContext'
import useCustomColors from '../hooks/useCustomColors'
import { FaChevronRight } from 'react-icons/fa'

function Navigation() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef(null)
  const navigate = useNavigate()
  const { userProfile } = useUserContext()

  const { userInfo } = useAuth()
  const { navBg, sideBarBackground } = useCustomColors()

  const menuItems: { name: string; link: string }[] = []

  let homeLink = ''
  switch (userProfile) {
    case 'globalAdmin':
      homeLink = '/global-admin'
      break
    case 'campusAdmin':
    case 'countryAdmin':
    case 'continentAdmin':
      homeLink = '/admin'
      break
    case 'campCamper':
      homeLink = '/camp-camper'
      break
    default:
      homeLink = '/'
      break
  }

  const defaultMenuItems = [
    {
      name: 'Home',
      link: homeLink,
    },
    { name: 'Switch Role', link: '/' },
  ]
  const adminMenuItems = [
    {
      name: 'Camps',
      link: '/camps',
    },
  ]

  switch (userProfile) {
    case 'globalAdmin':
    case 'campusAdmin':
    case 'countryAdmin':
    case 'continentAdmin':
      menuItems.push(...defaultMenuItems, ...adminMenuItems)
      break
    default:
      menuItems.push(...defaultMenuItems)
      break
  }

  const handleMenuItemClick = (link: string) => {
    navigate(link)
    onClose() // Close the drawer after navigation
  }

  return (
    <Box bg={navBg} width={'100vw'} px={5}>
      <HStack justifyContent={'space-between'}>
        <Box maxW={'80px'} onClick={() => navigate('/')}>
          <FLCOutlineLogo />
        </Box>
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
        size={{ base: 'full', md: 'xs', lg: 'xs' }}
      >
        <DrawerOverlay />
        <DrawerContent bg={sideBarBackground}>
          <DrawerHeader m={1}>
            <DrawerCloseButton />
          </DrawerHeader>

          <DrawerBody marginTop={5} padding={0}>
            {menuItems.map((item) => (
              <Box key={item.name}>
                <Button
                  padding={10}
                  rounded={0}
                  width="100%"
                  onClick={() => handleMenuItemClick(item.link)}
                  justifyContent="space-between"
                  bg={navBg}
                  fontWeight="medium"
                >
                  {item.name}
                  <FaChevronRight />
                </Button>
                <Divider borderColor={sideBarBackground} />
              </Box>
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
              <Image
                src={userInfo.image_url}
                boxSize={10}
                objectFit="cover"
                rounded={'full'}
              />
              <div>
                <Text textTransform={'capitalize'} fontWeight={'medium'}>{`${
                  userInfo.firstName || ''
                } ${userInfo.lastName || ''}`}</Text>
                <Text fontSize={'xs'}>{userInfo.email}</Text>
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
