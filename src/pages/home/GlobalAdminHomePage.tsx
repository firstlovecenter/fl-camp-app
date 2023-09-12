import {
  Avatar,
  Box,
  Center,
  Container,
  SimpleGrid,
  Wrap,
  WrapItem,
  Heading,
  Text,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
  Card,
  CardBody,
  Divider,
  Tag,
  SkeletonText,
  Skeleton,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import useCustomColors from 'hooks/useCustomColors'
import { useFirestore } from 'reactfire'
import {
  collection,
  getCountFromServer,
  query,
  where,
} from 'firebase/firestore'
import { db } from 'firebase'
import { ApolloWrapper } from '@jaedag/admin-portal-react-core'
import { useNavigate } from 'react-router-dom'

interface CampCounts {
  totalCount: number
  activeTotalCount: number
}

const GlobalAdminHomePage = () => {
  const [campCounts, setCampCounts] = useState<CampCounts>({
    totalCount: 0,
    activeTotalCount: 0,
  })
  const navigate = useNavigate()
  const {
    bg,
    homePageCardBackground,
    homePageCardText,
    homePageCardTextEmphasis,
    homePageCardSubtitle,
    homePageOptionsSubtitle,
  } = useCustomColors()

  useEffect(() => {
    const getCampsCount = async () => {
      try {
        const coll = collection(db, 'camps')
        const snapshot = await getCountFromServer(coll)
        const { count: totalCount } = snapshot.data()

        const q = query(coll, where('campStatus', '==', true))
        const activeCampSnapshot = await getCountFromServer(q)
        const { count: activeTotalCount } = activeCampSnapshot.data()

        setCampCounts({ totalCount, activeTotalCount })
      } catch (error) {
        console.error(error)
      }
    }

    getCampsCount()
  }, [])

  const loading = !campCounts.totalCount || !campCounts.activeTotalCount
  return (
    <ApolloWrapper data={campCounts} loading={loading}>
      <Container px={6}>
        <Box mt={6}>
          <SimpleGrid columns={3} spacing={4}>
            <Box bg={bg} height="80px"></Box> <Box bg={bg} height="80px"></Box>{' '}
            <Center>
              <Wrap>
                <WrapItem>
                  <Avatar
                    name="Dan Abrahmov"
                    src="https://bit.ly/dan-abramov"
                    size="lg"
                  />
                </WrapItem>
              </Wrap>
            </Center>
          </SimpleGrid>
        </Box>
        <Box>
          <Heading>Welcome</Heading>
          <Box mt={3}>
            <Text>
              Get started with the camp app to efficiently monitor your camp
            </Text>
          </Box>

          <Box mt={6}>
            <Card bg={homePageCardBackground}>
              <CardBody>
                <StatGroup>
                  <Stat>
                    <Center>
                      <StatNumber color={homePageCardTextEmphasis}>
                        <Skeleton isLoaded={!loading} noOfLines={1}>
                          {campCounts?.activeTotalCount}
                        </Skeleton>
                      </StatNumber>
                    </Center>
                    <Center>
                      <StatLabel color={homePageCardSubtitle}>
                        Active Camps
                      </StatLabel>
                    </Center>
                  </Stat>
                  <Center height="50px">
                    <Divider orientation="vertical" />
                  </Center>
                  <Stat>
                    <Center>
                      <StatNumber color={homePageCardText}>
                        <Skeleton isLoaded={!loading} noOfLines={1}>
                          {campCounts?.totalCount}
                        </Skeleton>
                      </StatNumber>
                    </Center>
                    <Center>
                      <StatLabel color={homePageCardSubtitle}>
                        Total Camps
                      </StatLabel>
                    </Center>
                  </Stat>
                </StatGroup>
              </CardBody>
            </Card>
          </Box>
        </Box>
        <Box mt={6}>
          <Tag>Quick Links</Tag>
          <Box mt={2}>
            <Card
              borderLeft="4px"
              borderColor="red.500"
              bg={homePageCardBackground}
            >
              <CardBody>
                <Text fontSize="lg">Manage Admins</Text>
                <Text fontSize="sm" color={homePageOptionsSubtitle}>
                  Add Admins for continents
                </Text>
              </CardBody>
            </Card>
          </Box>
          <Box mt={2}>
            <Card
              borderLeft="4px"
              borderColor="green.500"
              bg={homePageCardBackground}
            >
              <CardBody>
                <Text fontSize="lg">Start a Camp</Text>
                <Text fontSize="sm" color={homePageOptionsSubtitle}>
                  Start a Camp
                </Text>
              </CardBody>
            </Card>
          </Box>
          <Box mt={2}>
            <Card
              borderLeft="4px"
              borderColor="yellow.500"
              bg={homePageCardBackground}
            >
              <CardBody>
                <Text fontSize="lg">Global Camp Stats</Text>
                <Text fontSize="sm" color={homePageOptionsSubtitle}>
                  View Statistics for Camps globally
                </Text>
              </CardBody>
            </Card>
          </Box>
          <Box mt={2}>
            <Card
              borderLeft="4px"
              borderColor="blue.500"
              bg="gray.800"
              onClick={() => navigate('/users')}
            >
              <CardBody>
                <Text fontSize="lg">Add Users</Text>
                <Text fontSize="sm" color={homePageOptionsSubtitle}>
                  Add users to the camp app
                </Text>
              </CardBody>
            </Card>
          </Box>
        </Box>
      </Container>
    </ApolloWrapper>
  )
}

export default GlobalAdminHomePage
