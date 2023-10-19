import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
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
import { Link as RouterLink } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import useCustomColors from 'hooks/useCustomColors'

const ForgotPassword = () => {
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const { resetPassword } = useAuth()
  const { inputFieldBackground } = useCustomColors()

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
      <Center height="100vh">
        <Container>
          <Heading textAlign={'center'} marginBottom={4}>
            Password Reset
          </Heading>
          {error && (
            <Alert
              marginBottom={4}
              flexWrap={'wrap'}
              borderRadius={7}
              justifyContent={'center'}
              status="error"
            >
              <AlertIcon />
              <AlertTitle>Error!</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {message && (
            <Alert
              marginBottom={4}
              flexWrap={'wrap'}
              borderRadius={7}
              justifyContent={'center'}
              status="success"
            >
              <AlertIcon />
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              fontSize="1rem"
              height="3.5rem"
              name="email"
              placeholder="Email"
              _placeholder={{ opacity: 1, color: 'whiteAlpha.700' }}
              size="lg"
              control={control}
              errors={errors}
              backgroundColor={inputFieldBackground}
            />

            <Button
              width="100%"
              type="submit"
              backgroundColor="cyan.700"
              size="lg"
              marginTop={7}
              padding={7}
              isLoading={isSubmitting}
            >
              Reset Password
            </Button>
          </form>

          <Container>
            <Center width={'100%'} marginTop={3}>
              <Text>
                Already have an account?{' '}
                <Link as={RouterLink} color="cyan.700" to="/login">
                  Login
                </Link>
              </Text>
            </Center>
          </Container>
          <Center width={'100%'} marginTop={1}>
            <Text>
              Need an account?{' '}
              <Link as={RouterLink} color="cyan.700" to="/sign-up">
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
