import React from 'react'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Center,
  Container,
  Heading,
  Link,
  Text,
} from '@chakra-ui/react'
import {
  ImageUpload,
  Input,
  PHONE_NUM_REGEX,
  Select,
} from '@jaedag/admin-portal-react-core'
import { useAuth } from '../contexts/AuthContext'
import * as Yup from 'yup'
import { useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import useCustomColors from '../hooks/useCustomColors'

const SignUp = () => {
  const [error, setError] = useState('')
  const { signup, createUserDocument } = useAuth()
  const navigate = useNavigate()
  const { inputFieldBackground } = useCustomColors()
  const date = new Date()

  const initialValues = {
    email: '',
    password: '',
    passwordConfirm: '',
    phone: '',
    dob: date,
    pictureUrl: '',
    firstName: '',
    lastName: '',
    gender: '',
  }

  const validationSchema = Yup.object({
    firstName: Yup.string().required('First name is a required field'),
    lastName: Yup.string().required('Last name is a required field'),
    gender: Yup.string().required('Gender is a required field'),
    email: Yup.string().email().required(),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    passwordConfirm: Yup.string()
      .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
      .required('Please confirm your password'),
    dob: Yup.date()
      .required('Date of birth is a required field')
      .max(new Date(), "You can't be born after today"),
    phone: Yup.string()
      .matches(
        PHONE_NUM_REGEX,
        `Phone Number must start with + and country code (eg. '+233')`
      )
      .required('Phone number is a required field'),
    pictureUrl: Yup.string().required('You must upload a picture'),
  })

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<typeof initialValues>({
    resolver: yupResolver(validationSchema),
    defaultValues: initialValues,
  })

  const firstName = watch('firstName')
  const lastName = watch('lastName')
  const email = watch('email')

  const onSubmit = async (values: typeof initialValues) => {
    try {
      await signup(values.email, values.password)
      await createUserDocument({ values })
      navigate('/')
    } catch (error) {
      setError('Failed to create an account')
      console.log('err', error)
    }
  }

  return (
    <Container my="5rem">
      <Center>
        <Container>
          <Heading textAlign={'center'} marginBottom={7}>
            Sign Up
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              mb={2}
              fontSize={15}
              height={59}
              name="firstName"
              control={control}
              errors={errors}
              placeholder="First Name"
              _placeholder={{ opacity: 1, color: 'whiteAlpha.700' }}
              backgroundColor={inputFieldBackground}
            />
            <Input
              mb={2}
              fontSize={15}
              height={59}
              name="lastName"
              control={control}
              errors={errors}
              placeholder="Last Name"
              _placeholder={{ opacity: 1, color: 'whiteAlpha.700' }}
              backgroundColor={inputFieldBackground}
            />
            <Input
              mb={2}
              fontSize={15}
              height={59}
              name="email"
              control={control}
              errors={errors}
              placeholder="Email"
              _placeholder={{ opacity: 1, color: 'whiteAlpha.700' }}
              backgroundColor={inputFieldBackground}
            />
            <Input
              mb={2}
              fontSize={15}
              type="password"
              height={59}
              name="password"
              placeholder="Password"
              _placeholder={{ opacity: 1, color: 'whiteAlpha.700' }}
              control={control}
              errors={errors}
              backgroundColor={inputFieldBackground}
            />

            <Input
              mb={2}
              fontSize={15}
              type="password"
              height={59}
              name="passwordConfirm"
              placeholder="Confirm Password"
              _placeholder={{ opacity: 1, color: 'whiteAlpha.700' }}
              control={control}
              errors={errors}
              backgroundColor={inputFieldBackground}
            />
            <Box mb={2}>
              <Select
                name="gender"
                placeholder="Gender"
                label="Gender"
                options={[
                  { key: 'Male', value: 'male' },
                  { key: 'Female', value: 'female' },
                ]}
                control={control}
                errors={errors}
              />
            </Box>

            <Input
              mb={2}
              name="dob"
              placeholder="Date of Birth"
              type="date"
              fontSize={15}
              height={59}
              _placeholder={{ opacity: 1, color: 'whiteAlpha.700' }}
              control={control}
              errors={errors}
              backgroundColor={inputFieldBackground}
            />
            <Input
              mb={2}
              name="phone"
              placeholder="Eg. +233 241 23 456"
              fontSize={15}
              height={59}
              _placeholder={{ opacity: 1, color: 'whiteAlpha.700' }}
              control={control}
              errors={errors}
              backgroundColor={inputFieldBackground}
            />
            <Box overflow="clip" my={6}>
              <ImageUpload
                name="pictureUrl"
                initialValue={initialValues.pictureUrl}
                uploadPreset="developer-tests"
                cloudinaryAccount="firstlovecenter"
                user={{
                  id: email ?? '',
                  firstName: firstName ?? '',
                  lastName: lastName ?? '',
                }}
                setValue={setValue}
                control={control}
                errors={errors}
                placeholder="Upload New Picture"
                aria-describedby="ImageUpload"
              />
            </Box>

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
