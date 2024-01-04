import React from 'react'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Center,
  Container,
  Heading,
} from '@chakra-ui/react'
import { useAuth } from '../contexts/AuthContext'
import * as Yup from 'yup'
import { useState } from 'react'
import { Input } from '@jaedag/admin-portal-react-core'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import useCustomColors from '../hooks/useCustomColors'

const UpdateProfile = () => {
  const [error, setError] = useState('')
  const { currentUser, updateEmail, updatePassword } = useAuth()
  const navigate = useNavigate()
  const { inputFieldBackground } = useCustomColors()
  const [message, setMessage] = useState('')

  const initialValues = {
    email: currentUser.email ?? '',
    password: '',
    passwordConfirm: '',
  }

  const validationSchema = Yup.object({
    email: Yup.string().email().required(),
    password: Yup.string().min(6).required(),
    passwordConfirm: Yup.string()
      .required()
      .oneOf([Yup.ref('password')], 'Passwords must match'),
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
    const promises = []
    if (values.email !== currentUser.email) {
      promises.push(updateEmail(values.email ?? ''))
    }
    if (values.password) {
      promises.push(updatePassword(values.password ?? ''))
    }

    try {
      await Promise.all(promises)
      setMessage('Profile updated')
      navigate('/')
    } catch (error) {
      setError('Failed to update account')
    }
  }

  return (
    <Container>
      <Center height="100vh">
        <Container>
          <Heading textAlign={'center'} marginBottom={7}>
            Update Profile
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
              mb={2}
              fontSize={15}
              height={59}
              backgroundColor={inputFieldBackground}
              _placeholder={{ opacity: 1, color: 'whiteAlpha.700' }}
              name="email"
              control={control}
              errors={errors}
            />
            <Input
              mb={2}
              fontSize={15}
              height={59}
              backgroundColor={inputFieldBackground}
              _placeholder={{ opacity: 1, color: 'whiteAlpha.700' }}
              type="password"
              name="password"
              placeholder="Leave blank to keep the same"
              control={control}
              errors={errors}
            />

            <Input
              mb={2}
              fontSize={15}
              height={59}
              backgroundColor={inputFieldBackground}
              _placeholder={{ opacity: 1, color: 'whiteAlpha.700' }}
              type="password"
              name="passwordConfirm"
              placeholder="Leave blank to keep the same"
              control={control}
              errors={errors}
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
              Update
            </Button>
            <Button
              width="100%"
              type="submit"
              colorScheme="red"
              size="lg"
              marginTop={2}
              padding={7}
              onClick={() => navigate('/')}
            >
              Cancel
            </Button>
          </form>
        </Container>
      </Center>
    </Container>
  )
}

export default UpdateProfile
