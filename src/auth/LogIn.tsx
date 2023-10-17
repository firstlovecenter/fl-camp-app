import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Center,
  Container,
  Image,
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
import logo from '../assets/CampLogo.svg'

const LogIn = () => {
  const [error, setError] = useState('')
  const { login } = useAuth()
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
      <Center height="100vh">
        <Container>
          <Center marginBottom="3rem">
            <Image src={logo} />
          </Center>
          {error && (
            <Alert status="error">
              <AlertIcon />
              <AlertTitle>Error!</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              fontSize="1rem"
              height="3.5rem"
              name="email"
              size="lg"
              control={control}
              errors={errors}
              placeholder="Username"
              _placeholder={{ opacity: 1, color: 'whiteAlpha.700' }}
              backgroundColor={'#21242F'}
            />
            <Input
              size="lg"
              marginY={2}
              fontSize="1rem"
              height="3.5rem"
              name="password"
              placeholder="Password"
              _placeholder={{ opacity: 1, color: 'whiteAlpha.700' }}
              control={control}
              errors={errors}
              backgroundColor={'#21242F'}
            />

            <Text
              textAlign="end"
              color="whiteAlpha.700"
              onClick={() => navigate('/forgot-password')}
            >
              Forgot Password?
            </Text>

            <Button
              width="100%"
              type="submit"
              backgroundColor="cyan.700"
              size="lg"
              marginTop={7}
              padding={7}
              isLoading={isSubmitting}
            >
              Login
            </Button>
          </form>

          <Center width={'100%'} marginTop={2}>
            <Text>
              Need an account?{' '}
              <Link as={RouterLink} color={'cyan.700'} to="/sign-up">
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
