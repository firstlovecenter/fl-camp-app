import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Card,
  CardBody,
  Center,
  Container,
  Heading,
  InputGroup,
  InputRightElement,
  Link,
  Text,
} from '@chakra-ui/react'
import { useAuth } from 'contexts/AuthContext'
import * as Yup from 'yup'
import { useState } from 'react'
import { Input } from '@jaedag/admin-portal-react-core'
import { yupResolver } from '@hookform/resolvers/yup'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'

const LogIn = () => {
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const handleClick = () => setShow(!show)
  const { login, currentUser } = useAuth()
  const navigate = useNavigate()

  const initialValues = {
    email: '',
    password: '',
  }

  const validationSchema = Yup.object({
    email: Yup.string().email().required(),
    password: Yup.string().min(6).required(),
  })

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<typeof initialValues>({
    resolver: yupResolver(validationSchema),
    defaultValues: initialValues,
  })

  const onSubmit = async (values: typeof initialValues) => {
    try {
      await login(values.email, values.password)
      navigate('/')
    } catch (error) {
      setError('Failed to log in')
    }
  }

  return (
    <Container>
      <Center height="80vh">
        <Container>
          <Card>
            <CardBody>
              <Heading textAlign={'center'} marginBottom={4}>
                Log In
              </Heading>
              {error && (
                <Alert status="error">
                  <AlertIcon />
                  <AlertTitle>Error!</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Text>{JSON.stringify(currentUser?.email)}</Text>

              <form onSubmit={handleSubmit(onSubmit)}>
                <Input
                  name="email"
                  label="Email"
                  size="lg"
                  control={control}
                  errors={errors}
                />
                <InputGroup size="lg" marginY={5}>
                  <Input
                    // paddingRight="4.5rem"
                    name="password"
                    type={show ? 'text' : 'password'}
                    placeholder="Enter password"
                    control={control}
                    errors={errors}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                      {show ? 'Hide' : 'Show'}
                    </Button>
                  </InputRightElement>
                </InputGroup>

                <Button
                  width="100%"
                  type="submit"
                  size="lg"
                  marginTop={5}
                  isLoading={isSubmitting}
                >
                  Log In
                </Button>
              </form>

              <Container marginTop={3}>
                <Text
                  textAlign="center"
                  color="blue.500"
                  onClick={() => navigate('/forgot-password')}
                >
                  Forgot Password?
                </Text>
              </Container>
            </CardBody>
          </Card>
          <Center width={'100%'} marginTop={2}>
            <Text>
              Need an account?{' '}
              <Link as={RouterLink} to="/signup">
                Sign Up
              </Link>
            </Text>
          </Center>
        </Container>
      </Center>
    </Container>
  )
}

export default LogIn
