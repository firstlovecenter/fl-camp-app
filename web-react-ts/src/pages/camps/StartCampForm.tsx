import React, { useEffect, useState } from 'react'
import {
  Container,
  Heading,
  Box,
  Button,
  FormControl,
  Checkbox,
  FormLabel,
  NumberInput,
  NumberInputField,
  HStack,
} from '@chakra-ui/react'
import { Input, Select } from '../../components/ui'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import {
  collection,
  addDoc,
  getDocs,
  where,
  query,
  Timestamp,
  DocumentData,
} from 'firebase/firestore'
import { useFirestore } from 'reactfire'
import { SelectOptions } from '../../../global'
import { CAMP_LEVEL_OPTIONS } from '../../utils/constants'

type InitialValues = {
  campName: string
  campLevel: string
  startDate: Date | string
  endDate: Date | string
  registrationDeadline: Date | string
  paymentDeadline: Date | string
  planet: string
  continent?: string
  country?: string
  campus?: string
  enableSelfService: boolean
  publicSlug?: string
  maxParticipants: number
  paymentMethods: string[]
  paymentAmountDue: number
  autoAssignRooms: boolean
  genderSegregation: boolean
  groupingDimensions: {
    name: string
    required: boolean
    values: string[]
    order: number
  }[]
}

const campLevelReference = (campLevel: string, values: InitialValues) =>
  ({
    planet: values?.planet,
    continent: values?.continent,
    country: values?.country,
    campus: values?.campus,
  }[campLevel] || values?.planet)

const formatDate = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // Adding 1 because months are zero-indexed
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const StartCampForm = () => {
  const date = new Date()
  const formattedDate = formatDate(date)
  const navigate = useNavigate()
  const firestore = useFirestore()
  const [planets, setPlanets] = useState<SelectOptions[]>([])
  const [continents, setContinents] = useState<SelectOptions[]>([])
  const [countries, setCountries] = useState<SelectOptions[]>([])
  const [campuses, setCampuses] = useState<SelectOptions[]>([])

  const initialValues: InitialValues = {
    campName: '',
    campLevel: '',
    startDate: formattedDate,
    endDate: formattedDate,
    registrationDeadline: formattedDate,
    paymentDeadline: formattedDate,
    planet: '',
    continent: '',
    country: '',
    campus: '',
    enableSelfService: false,
    publicSlug: '',
    maxParticipants: 100,
    paymentMethods: ['cash'],
    paymentAmountDue: 0,
    autoAssignRooms: false,
    genderSegregation: true,
    groupingDimensions: [
      { name: 'Area', required: true, values: [], order: 1 },
    ],
  }

  const validationSchema = Yup.object({
    campName: Yup.string().required('Camp name is a required field'),
    campLevel: Yup.string().required('Camp Level is a required field'),
    startDate: Yup.date().required('Camp Start Date is a required field'),
    endDate: Yup.date()
      .required('Camp End Date is a required field')
      .test('endDate', 'You cannot end a camp before today', function (value) {
        return value && !isBefore(value, new Date())
      }),
    registrationDeadline: Yup.date()
      .required('Registration Deadline Date is a required field')
      .test(
        'registrationDeadline',
        'Registration deadline cannot be before today',
        function (value) {
          return value && !isBefore(value, new Date())
        }
      ),
    paymentDeadline: Yup.date()
      .required('Payment Deadline Date is a required field')
      .test(
        'paymentDeadline',
        'Payment deadline cannot be before today',
        function (value) {
          return value && !isBefore(value, new Date())
        }
      ),
    planet: Yup.string().required('Planet is a required field'),
    continent: Yup.string().when('campLevel', ([campLevel], schema) => {
      return campLevel === 'continent'
        ? schema.required('Continent is a required field')
        : schema
    }),
    country: Yup.string().when('campLevel', ([campLevel], schema) => {
      return campLevel === 'country'
        ? schema.required('Country is a required field')
        : schema
    }),
    campus: Yup.string().when('campLevel', ([campLevel], schema) => {
      return campLevel === 'campus'
        ? schema.required('Campus is a required field')
        : schema
    }),
    enableSelfService: Yup.boolean().required(
      'Enable Self-Service Registration'
    ),
    publicSlug: Yup.string().when(
      'enableSelfService',
      ([enableSelfService], schema) => {
        return enableSelfService
          ? schema.required('Public Link Slug is a required field')
          : schema.notRequired()
      }
    ),
    maxParticipants: Yup.number().required(
      'Max Participants is a required field'
    ),
    paymentMethods: Yup.array().required('Payment Methods is a required field'),
    paymentAmountDue: Yup.number().required(
      'Payment Amount Due is a required field'
    ),
    autoAssignRooms: Yup.boolean().required(
      'Auto Assign Rooms is a required field'
    ),
    genderSegregation: Yup.boolean().required(
      'Gender Segregation is a required field'
    ),
    groupingDimensions: Yup.array().required(
      'Grouping Dimensions is a required field'
    ),
  })

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<InitialValues>({
    resolver: yupResolver<InitialValues>(validationSchema),
    defaultValues: initialValues,
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'groupingDimensions',
  })

  const watchCampLevel = watch('campLevel')
  const watchWorld = watch('planet')
  const watchContinent = watch('continent')
  const watchCountry = watch('country')
  const watchEnableSelfService = watch('enableSelfService')

  const onSubmit = async (values: InitialValues) => {
    try {
      const levelId = campLevelReference(watchCampLevel, values)
      const data = {
        name: values?.campName,
        campLevel: values?.campLevel,
        campType: values?.campLevel,
        startDate: Timestamp.fromDate(values?.startDate as Date),
        endDate: Timestamp.fromDate(values?.endDate as Date),
        registrationDeadline: Timestamp.fromDate(
          values?.registrationDeadline as Date
        ),
        paymentDeadline: Timestamp.fromDate(values?.paymentDeadline as Date),
        levelId: levelId,
      }

      const docRef = await addDoc(collection(firestore, 'camps'), data)
      console.log('Document written with ID: ', docRef.id)

      navigate('/camps')
    } catch (error) {
      console.log('Error adding document: ', error)
    }
  }

  const fetchOptions = async (collectionRef: any, setOptions: any) => {
    try {
      const querySnapshot = await getDocs(collectionRef)
      const options: SelectOptions[] = querySnapshot.docs.map(
        (doc: DocumentData) => ({
          key: doc.data().name,
          value: doc.id,
        })
      )
      setOptions(options)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    const fetchPlanets = () =>
      fetchOptions(collection(firestore, 'planets'), setPlanets)
    fetchPlanets()
  }, [firestore])

  useEffect(() => {
    const fetchContinents = () => {
      try {
        if (watchWorld !== undefined && watchWorld !== '') {
          fetchOptions(
            query(
              collection(firestore, 'continents'),
              where('upperChurchId', '==', watchWorld)
            ),
            setContinents
          )
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchContinents()
  }, [firestore, watchWorld])

  useEffect(() => {
    const fetchCountries = () => {
      try {
        if (watchContinent !== undefined && watchContinent !== '') {
          fetchOptions(
            query(
              collection(firestore, 'countries'),
              where('upperChurchId', '==', watchContinent)
            ),
            setCountries
          )
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchCountries()
  }, [firestore, watchContinent])

  useEffect(() => {
    const fetchCampuses = () => {
      try {
        if (watchCountry !== undefined && watchCountry !== '') {
          fetchOptions(
            query(
              collection(firestore, 'campuses'),
              where('upperChurchId', '==', watchCountry)
            ),
            setCampuses
          )
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchCampuses()
  }, [firestore, watchCountry])

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
            options={CAMP_LEVEL_OPTIONS}
            control={control}
            errors={errors}
          />
        </Box>

        {(watchCampLevel === 'planet' ||
          watchCampLevel === 'continent' ||
          watchCampLevel === 'country' ||
          watchCampLevel === 'campus') && (
          <Box my={3}>
            <Select
              name="planet"
              placeholder="planet"
              label="Select Planet"
              options={planets}
              control={control}
              errors={errors}
            />
          </Box>
        )}

        {(watchCampLevel === 'continent' ||
          watchCampLevel === 'country' ||
          watchCampLevel === 'campus') && (
          <Box my={3}>
            <Select
              name="continent"
              placeholder="Continent"
              label="Select Continent"
              options={continents}
              control={control}
              errors={errors}
            />
          </Box>
        )}

        {(watchCampLevel === 'country' || watchCampLevel === 'campus') && (
          <Box my={3}>
            <Select
              name="country"
              placeholder="Country"
              label="Select Country"
              options={countries}
              control={control}
              errors={errors}
            />
          </Box>
        )}

        {watchCampLevel === 'campus' && (
          <Box my={3}>
            <Select
              name="campus"
              placeholder="Campus"
              label="Select Campus"
              options={campuses}
              control={control}
              errors={errors}
            />
          </Box>
        )}

        <Box my={3}>
          <Input
            name="startDate"
            placeholder="Camp Start"
            label="Camp Start"
            type="date"
            control={control}
            errors={errors}
          />
        </Box>

        <Box my={3}>
          <Input
            name="endDate"
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

        <Box my={3}>
          <FormControl>
            <Controller
              name="enableSelfService"
              control={control}
              render={({ field }) => (
                <Checkbox
                  isChecked={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                >
                  Enable Self-Service Registration
                </Checkbox>
              )}
            />
          </FormControl>
        </Box>

        {watchEnableSelfService && (
          <Box my={3}>
            <Input
              name="publicSlug"
              label="Public Link Slug"
              placeholder="summer-camp-2026"
              control={control}
              errors={errors}
            />
          </Box>
        )}

        <Box my={3}>
          <FormControl>
            <FormLabel>Max Participants</FormLabel>
            <Controller
              name="maxParticipants"
              control={control}
              render={({ field }) => (
                <NumberInput
                  {...field}
                  onChange={(_, val) => field.onChange(val)}
                >
                  <NumberInputField />
                </NumberInput>
              )}
            />
          </FormControl>
        </Box>

        <Box my={3}>
          <FormLabel>Grouping Dimensions</FormLabel>
          {fields.map((field, index) => (
            <HStack key={field.id} mb={2}>
              <Controller
                name={`groupingDimensions.${index}.name`}
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Dimension Name"
                    label="Dimension Name"
                    control={control}
                    errors={errors}
                  />
                )}
              />
              <Controller
                name={`groupingDimensions.${index}.required`}
                control={control}
                render={({ field }) => (
                  <Checkbox
                    isChecked={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  >
                    Required
                  </Checkbox>
                )}
              />
              <Button onClick={() => remove(index)} size="sm">
                Remove
              </Button>
            </HStack>
          ))}
          <Button
            onClick={() =>
              append({
                name: '',
                required: false,
                values: [],
                order: fields.length + 1,
              })
            }
            size="sm"
            mt={2}
          >
            Add Dimension
          </Button>
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

const isBefore = (value: any, currentDate: Date) => {
  return value < currentDate
}
