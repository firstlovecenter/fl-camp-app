import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  Alert,
  AlertIcon,
  AlertDescription,
} from '@chakra-ui/react'
import { ImageUpload, Input, Select } from '@jaedag/admin-portal-react-core'
import React, { useState } from 'react'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { useFirestore, useFirestoreDocData } from 'reactfire'
import { useNavigate } from 'react-router-dom'
import useClickCard from 'hooks/useClickCard'

const AddUserForm = () => {
  const [error, setError] = useState('')
  const [showAlert, setShowAlert] = useState(false)
  const navigate = useNavigate()
  const { userId } = useClickCard()

  const firestore = useFirestore()
  const userEmail = userId as string
  const ref = doc(firestore, 'users', userEmail)
  const { status, data: user } = useFirestoreDocData(ref)

  const auth = getAuth()

  const date = new Date('1990-01-01')

  const initialValues = {
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
    phone: user?.phone,
    dob: user?.dob,
    pictureUrl: user?.image_url,
  }

  const validationSchema = Yup.object({
    firstName: Yup.string().required('First name is a required field'),
    lastName: Yup.string().required('Last name is a required field'),
    email: Yup.string().required().email('Email is a required field'),
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
    setValue,
    watch,
  } = useForm<typeof initialValues>({
    resolver: yupResolver(validationSchema),
    defaultValues: initialValues,
  })

  const firstName = watch('firstName')
  const lastName = watch('lastName')
  const email = watch('email')

  const onSubmit = async (values: typeof initialValues) => {
    try {
      const userRef = doc(firestore, 'users', user?.email)
      await setDoc(
        userRef,
        {
          firstName: values?.firstName,
          lastName: values?.lastName,
          email: values?.email,
          phone: values?.phone,
          dob: values?.dob.toISOString().slice(0, 10),
          image_url: values?.pictureUrl,
        },
        { merge: true }
      )

      navigate('/user-profile')
    } catch (error: any) {
      if (error?.code === 'auth/email-already-in-use') {
        setError('Email already in use')
        setShowAlert(true)
      }
    }

    console.log(values)
  }

  return (
    <Container p={6}>
      <Heading>Add An Admin</Heading>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box my={3}>
          <Input
            name="firstName"
            label="First Name"
            placeholder="First Name"
            control={control}
            errors={errors}
          />
        </Box>

        <Box my={3}>
          <Input
            name="lastName"
            placeholder="Last Name"
            label="Last Name"
            control={control}
            errors={errors}
          />
        </Box>

        <Box my={3}>
          <Input
            name="email"
            placeholder="Email"
            label="Email Address"
            control={control}
            errors={errors}
          />
        </Box>

        <Box my={3}>
          <Input
            name="dob"
            placeholder="Date of Birth"
            label="Date of Birth"
            type="date"
            control={control}
            errors={errors}
          />
        </Box>

        <Box my={3}>
          <Input
            name="phone"
            placeholder="Eg. +233 241 23 456"
            label="Phone Number"
            control={control}
            errors={errors}
          />
        </Box>

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

        {showAlert && (
          <Alert status="error">
            <AlertIcon />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button
          marginTop={10}
          type="submit"
          size="lg"
          width="100%"
          isLoading={isSubmitting}
          colorScheme="whatsapp"
        >
          Submit
        </Button>
      </form>
    </Container>
  )
}

export default AddUserForm
