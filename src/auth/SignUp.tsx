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
import { yupResolver } from '@hookform/resolvers/yup'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'

const SignUp = () => {
  const [error, setError] = useState('')
  const { signup } = useAuth()
  const navigate = useNavigate()

  const initialValues = {
    email: '',
    password: '',
    passwordConfirm: '',
  }

  const validationSchema = Yup.object({
    email: Yup.string().email().required(),
    password: Yup.string().min(6).required(),
    passwordConfirm: Yup.string()
      .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
      .required('Required'),
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
      await signup(values.email, values.password)
      navigate('/')
    } catch (error) {
      setError('Failed to create an account')
    }
  }

  return (
    <Container>
      <Center height="100vh">
        <Container>
          <Heading textAlign={'center'} marginBottom={7}>
            Sign Up
          </Heading>
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
              size="lg"
              name="email"
              control={control}
              errors={errors}
              placeholder="Email"
              _placeholder={{ opacity: 1, color: 'whiteAlpha.700' }}
              backgroundColor={'#21242F'}
            />
            <Input
              marginY={2}
              size="lg"
              fontSize="1rem"
              type="password"
              height="3.5rem"
              name="password"
              placeholder="Password"
              _placeholder={{ opacity: 1, color: 'whiteAlpha.700' }}
              control={control}
              errors={errors}
              backgroundColor={'#21242F'}
            />

            <Input
              size="lg"
              fontSize="1rem"
              type="password"
              height="3.5rem"
              name="confirmPassword"
              placeholder="Confirm Password"
              _placeholder={{ opacity: 1, color: 'whiteAlpha.700' }}
              control={control}
              errors={errors}
              backgroundColor={'#21242F'}
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
              Sign Up
            </Button>
          </form>
          <Center width={'100%'} marginTop={2}>
            <Text>
              Already have an account?{' '}
              <Link as={RouterLink} color={'cyan.700'} to="/login">
                Log In
              </Link>
            </Text>
          </Center>
        </Container>
      </Center>
    </Container>
  )
}

export default SignUp
