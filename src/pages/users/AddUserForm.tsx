import { Box, Button, Container, Heading, useToast } from '@chakra-ui/react'
import {
  ImageUpload,
  Input,
  PHONE_NUM_REGEX,
} from '@jaedag/admin-portal-react-core'
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
import { useFirestore } from 'reactfire'
import { useNavigate } from 'react-router-dom'

const AddUserForm = () => {
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const toast = useToast()

  const auth = getAuth()
  const firestore = useFirestore()

  const date = new Date('1990-01-01')

  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: date,
    pictureUrl: '',
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
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values?.email,
        import.meta.env.VITE_DEFAULT_PASSWORD
      )

      if (userCredential) {
        await sendPasswordResetEmail(auth, email)

        const data = {
          firstName: values?.firstName.toLowerCase(),
          lastName: values?.lastName.toLowerCase(),
          email: values?.email,
          phone: values?.phone,
          dob: values?.dob.toISOString().slice(0, 10),
          image_url: values?.pictureUrl,
        }

        await setDoc(doc(firestore, 'users', values?.email), data)

        toast({
          title: 'Account created.',
          description: "We've created your account for you.",
          status: 'success',
          duration: 4000,
          isClosable: true,
        })

        navigate('/users')
      }
    } catch (error: any) {
      if (error?.code === 'auth/email-already-in-use') {
        setError('Email already in use')

        toast({
          title: 'Error.',
          description: 'Email already in use.',
          status: 'error',
          duration: 4000,
          isClosable: true,
        })
      }
    }
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
