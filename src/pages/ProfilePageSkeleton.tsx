import { Center } from '@chakra-ui/layout'
import { Card, CardBody, CardHeader, Skeleton, VStack } from '@chakra-ui/react'
import useCustomColors from 'hooks/useCustomColors'

const ProfilePageSkeleton = () => {
  const { navBg } = useCustomColors()
  return (
    <Center height={'80vh'}>
      <VStack alignItems={'center'} textAlign="center">
        <Card bg={navBg} width={'24rem'} my={6}>
          <CardHeader>
            <Center>
              <Skeleton height={'3rem'} width="60%" />
            </Center>
          </CardHeader>
          <CardBody>
            <VStack>
              <Skeleton rounded={'full'} height={'56'} width={'56'} />
              <Skeleton height="3rem" width="80%" />
              <Skeleton height="1rem" mb={5} width="60%" />
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Center>
  )
}

export default ProfilePageSkeleton
