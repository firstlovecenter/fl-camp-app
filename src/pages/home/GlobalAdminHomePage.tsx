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
  StatArrow,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  Card,
  CardBody,
  Divider,
  Tag,
} from '@chakra-ui/react'
import React from 'react'
import useCustomColors from 'hooks/useCustomColors'

function GlobalAdminHomePage() {
  const {
    bg,
    homePageCardBackground,
    homePageCardText,
    homePageCardTextEmphasis,
    homePageCardSubtitle,
    homePageOptionsSubtitle,
  } = useCustomColors()
  return (
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
                    <StatNumber color={homePageCardTextEmphasis}>25</StatNumber>
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
                    <StatNumber color={homePageCardText}>750</StatNumber>
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
      </Box>
    </Container>
  )
}

export default GlobalAdminHomePage
