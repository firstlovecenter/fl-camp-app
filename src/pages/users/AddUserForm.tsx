import { Box, Button, Container, Heading } from '@chakra-ui/react'
import {
  ImageUpload,
  Input,
  PHONE_NUM_REGEX,
} from '@jaedag/admin-portal-react-core'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { ValueProps, useAuth } from 'contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import useCustomColors from 'hooks/useCustomColors'

const AddUserForm = () => {
  const auth = getAuth()
  const date = new Date('1990-01-01')
  const { createUserDocument } = useAuth()
  const navigate = useNavigate()
  const { inputFieldBackground } = useCustomColors()
  const initialValues: ValueProps = {
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
      await createUserWithEmailAndPassword(
        auth,
        values?.email,
        import.meta.env.VITE_DEFAULT_PASSWORD
      )
      const addUser = true
      await createUserDocument({ values, email, addUser })
      navigate('/users')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Container p={6}>
      <Heading textAlign={'center'} my={9}>
        Add A User
      </Heading>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          mb={2}
          fontSize={15}
          height={59}
          _placeholder={{ opacity: 1, color: 'whiteAlpha.700' }}
          backgroundColor={inputFieldBackground}
          name="firstName"
          placeholder="First Name"
          control={control}
          errors={errors}
        />

        <Input
          mb={2}
          fontSize={15}
          height={59}
          _placeholder={{ opacity: 1, color: 'whiteAlpha.700' }}
          backgroundColor={inputFieldBackground}
          name="lastName"
          placeholder="Last Name"
          control={control}
          errors={errors}
        />

        <Input
          mb={2}
          fontSize={15}
          height={59}
          _placeholder={{ opacity: 1, color: 'whiteAlpha.700' }}
          backgroundColor={inputFieldBackground}
          name="email"
          placeholder="Email"
          control={control}
          errors={errors}
        />

        <Input
          mb={2}
          fontSize={15}
          height={59}
          _placeholder={{ opacity: 1, color: 'whiteAlpha.700' }}
          backgroundColor={inputFieldBackground}
          name="dob"
          placeholder="Date of Birth"
          type="date"
          control={control}
          errors={errors}
        />

        <Input
          mb={2}
          fontSize={15}
          height={59}
          _placeholder={{ opacity: 1, color: 'whiteAlpha.700' }}
          backgroundColor={inputFieldBackground}
          name="phone"
          placeholder="Eg. +233 241 23 456"
          control={control}
          errors={errors}
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
