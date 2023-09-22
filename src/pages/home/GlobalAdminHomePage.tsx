import {
  Avatar,
  Box,
  Center,
  Container,
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
  Skeleton,
  Flex,
  Spacer,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import useCustomColors from 'hooks/useCustomColors'
import {
  collection,
  getCountFromServer,
  query,
  where,
  doc,
} from 'firebase/firestore'
import { useFirestore, useFirestoreDocData } from 'reactfire'
import { db } from 'firebase'
import { ApolloWrapper } from '@jaedag/admin-portal-react-core'
import { useNavigate } from 'react-router-dom'
import { useUserContext } from 'contexts/UserContext'
import { useAuth } from 'contexts/AuthContext'

interface CampCounts {
  totalCount: number
  activeTotalCount: number
}

const GlobalAdminHomePage = () => {
  const { currentUser } = useAuth()
  const firestore = useFirestore()
  const [campCounts, setCampCounts] = useState<CampCounts>({
    totalCount: 0,
    activeTotalCount: 0,
  })
  const navigate = useNavigate()
  const {
    homePageCardBackground,
    homePageCardText,
    homePageCardTextEmphasis,
    homePageCardSubtitle,
    homePageOptionsSubtitle,
  } = useCustomColors()

  const email = currentUser?.email || ' '

  const ref = doc(firestore, 'users', email)
  const { status, data: user } = useFirestoreDocData(ref)

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

  const loading =
    !campCounts.totalCount || !campCounts.activeTotalCount || !user

  return (
    <ApolloWrapper data={campCounts} loading={loading}>
      <Container px={6}>
        <Box mt={6}>
          <Flex minWidth="max-content" alignItems="center" gap="2">
            <Spacer />
            <Center>
              <Wrap>
                <WrapItem>
                  <Avatar
                    name={user?.firstName + ' ' + user?.lastName}
                    src={user?.image_url}
                    size="lg"
                  />
                </WrapItem>
              </Wrap>
            </Center>
          </Flex>
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
              onClick={() => navigate('/users')}
            >
              <CardBody>
                <Text fontSize="lg">Manage Users</Text>
                <Text fontSize="sm" color={homePageOptionsSubtitle}>
                  Add admins, members
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
        </Box>
      </Container>
    </ApolloWrapper>
  )
}

export default GlobalAdminHomePage
