import React from 'react'
import { Container, Heading, Box, Button } from '@chakra-ui/react'
import { Input, Select } from '@jaedag/admin-portal-react-core'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { collection, addDoc } from 'firebase/firestore'
import { useFirestore } from 'reactfire'

const CampLevelOptions = [
  { key: 'Global', value: 'global' },
  { key: 'Continent', value: 'continent' },
  { key: 'Country', value: 'country' },
  { key: 'Campus', value: 'campus' },
]

const StartCampForm = () => {
  const date = new Date('1990-01-01')
  const navigate = useNavigate()
  const firestore = useFirestore()

  const initialValues = {
    campName: '',
    campLevel: '',
    campStart: date,
    campEnd: date,
    registrationDeadline: date,
    paymentDeadline: date,
  }

  const validationSchema = Yup.object({
    campName: Yup.string().required('Camp name is a required field'),
    campLevel: Yup.string().required('Camp Level is a required field'),
    campStart: Yup.date().required('Camp Start Date is a required field'),
    campEnd: Yup.date()
      .required('Camp End Date is a required field')
      .min(new Date(), 'You cannot end a camp before today'),
    registrationDeadline: Yup.date()
      .required('Registration Deadline Date is a required field')
      .min(new Date(), 'Registration deadline cannot be before today'),
    paymentDeadline: Yup.date()
      .required('Payment Deadline Date is a required field')
      .min(new Date(), 'Payment deadline cannot be before today'),
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
    const data = {
      name: values?.campName,
      campLevel: values?.campLevel,
      campType: values?.campLevel,
      startDate: values?.campStart.toISOString().slice(0, 10),
      endDate: values?.campEnd.toISOString().slice(0, 10),
      registrationDeadline: values?.registrationDeadline
        .toISOString()
        .slice(0, 10),
      paymentDeadline: values?.paymentDeadline.toISOString().slice(0, 10),
    }

    const docRef = await addDoc(collection(firestore, 'camps'), data)
    console.log('Document written with ID: ', docRef.id)

    navigate('/camps')
  }

  return (
    <Container p={6}>
      <Heading>Start A Camp</Heading>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box my={3}>
          <Input
            name="campName"
            label="Camp Name"
            placeholder="Camp Name"
            control={control}
            errors={errors}
          />
        </Box>

        <Box my={3}>
          <Select
            name="campLevel"
            placeholder="Camp Level"
            label="Camp Level"
            options={CampLevelOptions}
            control={control}
            errors={errors}
          />
        </Box>

        <Box my={3}>
          <Input
            name="campStart"
            placeholder="Camp Start"
            label="Camp Start"
            type="date"
            control={control}
            errors={errors}
          />
        </Box>

        <Box my={3}>
          <Input
            name="campEnd"
            placeholder="Camp End"
            label="Camp End"
            type="date"
            control={control}
            errors={errors}
          />
        </Box>

        <Box my={3}>
          <Input
            name="registrationDeadline"
            placeholder="Registration Deadline"
            label="Registration Deadline"
            type="date"
            control={control}
            errors={errors}
          />
        </Box>

        <Box my={3}>
          <Input
            name="paymentDeadline"
            placeholder="Payment Deadline"
            label="Payment Deadline"
            type="date"
            control={control}
            errors={errors}
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

export default StartCampForm
