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
  Link,
  Text,
} from '@chakra-ui/react'
import { useAuth } from 'contexts/AuthContext'
import * as Yup from 'yup'
import { useState } from 'react'
import { Input } from '@jaedag/admin-portal-react-core'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'

const ForgotPassword = () => {
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const { resetPassword, currentUser } = useAuth()
  const navigate = useNavigate()

  const initialValues = {
    email: '',
  }

  const validationSchema = Yup.object({
    email: Yup.string().email().required(),
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
      await resetPassword(values.email)
      setMessage('Check your inbox for further instructions')
    } catch (error) {
      setError('Failed to reset password')
    }
  }

  return (
    <Container>
      <Center height="80vh">
        <Container>
          <Card>
            <CardBody>
              <Heading textAlign={'center'} marginBottom={4}>
                Password Reset
              </Heading>
              {error && (
                <Alert status="error">
                  <AlertIcon />
                  <AlertTitle>Error!</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {message && (
                <Alert status="success">
                  <AlertIcon />
                  <AlertTitle>Success!</AlertTitle>
                  <AlertDescription>{message}</AlertDescription>
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

                <Button
                  width="100%"
                  type="submit"
                  size="lg"
                  marginTop={5}
                  isLoading={isSubmitting}
                >
                  Reset Password
                </Button>
              </form>

              <Container marginTop={3}>
                <Text
                  textAlign="center"
                  color="blue.500"
                  onClick={() => navigate('/login')}
                >
                  Login
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

export default ForgotPassword
