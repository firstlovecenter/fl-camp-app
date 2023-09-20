import { DeleteIcon } from '@chakra-ui/icons'
import { Flex, Spacer, IconButton, Box, Text } from '@chakra-ui/react'
import React from 'react'

const formatAdminRole = (role: string) => {
  switch (role) {
    case 'campusAdmin':
      return 'Campus Admin'
    case 'countryAdmin':
      return 'Country Admin'
    case 'Member':
      return 'Member'
    default:
      return 'Admin'
  }
}
const formatCampTitle = (title: string) => {
  if (title && title.length > 10) {
    return title.substring(0, 10) + '...'
  }
  return 'No Title'
}
const UserCampsCard = ({ camp }: { camp: any }) => {
  if (!('role' in camp)) {
    camp.role = 'Member'
  }
  const { name, role } = camp
  return (
    <Box mb={2}>
      <Flex>
        <Text fontSize="sm" noOfLines={[1, 2]}>
          {formatCampTitle(name)}
        </Text>
        <Spacer />
        <Text fontSize="sm" color="gray.400" mr={2}>
          {formatAdminRole(role)}
        </Text>
        <IconButton
          colorScheme="red"
          aria-label="Delete Icon"
          variant="outline"
          size="xs"
          icon={<DeleteIcon />}
        />
      </Flex>
    </Box>
  )
}
export default UserCampsCard
