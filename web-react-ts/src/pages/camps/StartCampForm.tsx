import React, { useEffect, useState } from 'react'
import { Container, Heading, Box, Button } from '@chakra-ui/react'
import { Input, Select } from '@jaedag/admin-portal-react-core'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import {
  collection,
  addDoc,
  getDocs,
  where,
  query,
  Timestamp,
} from 'firebase/firestore'
import { useFirestore } from 'reactfire'
import { SelectOptions } from '../../../global'
import { CAMP_LEVEL_OPTIONS } from '../../utils/constants'
import { FormData } from '../../../global'

const campLevelReference = (campLevel: string, values: FormData) => {
  switch (campLevel) {
    case 'planet':
      return values?.planet as string
    case 'continent':
      return values?.continent as string
    case 'country':
      return values?.country as string
    case 'campus':
      return values?.campus as string
    default:
      return values?.planet as string
  }
}

const StartCampForm = () => {
  const date = new Date('1990-01-01')
  const navigate = useNavigate()
  const firestore = useFirestore()
  const [planets, setPlanets] = useState<SelectOptions[]>([])
  const [continents, setContinents] = useState<SelectOptions[]>([])
  const [countries, setCountries] = useState<SelectOptions[]>([])
  const [campuses, setCampuses] = useState<SelectOptions[]>([])

  const initialValues = {
    campName: '',
    campLevel: '',
    campStart: date,
    campEnd: date,
    registrationDeadline: date,
    paymentDeadline: date,
    world: '' || undefined,
    continent: '' || undefined,
    country: '' || undefined,
    campus: '' || undefined,
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
    world: Yup.string(),
    continent: Yup.string(),
    country: Yup.string(),
    campus: Yup.string(),
  })

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: initialValues,
  })

  const watchCampLevel = watch('campLevel')
  const watchWorld = watch('planet')
  const watchContinent = watch('continent')
  const watchCountry = watch('country')

  const onSubmit = async (values: FormData) => {
    const levelId = campLevelReference(watchCampLevel, values)
    const data = {
      name: values?.campName,
      campLevel: values?.campLevel,
      campType: values?.campLevel,
      startDate: Timestamp.fromDate(values?.campStart),
      endDate: Timestamp.fromDate(values?.campEnd),
      registrationDeadline: Timestamp.fromDate(values?.registrationDeadline),
      paymentDeadline: Timestamp.fromDate(values?.paymentDeadline),
      levelId: levelId,
    }

    const docRef = await addDoc(collection(firestore, 'camps'), data)
    console.log('Document written with ID: ', docRef.id)

    navigate('/camps')
  }

  useEffect(() => {
    const fetchPlanets = async () => {
      try {
        const planetsCollections = collection(firestore, 'planets')

        const planets: SelectOptions[] = []
        const querySnapshot = await getDocs(planetsCollections)
        querySnapshot.docs.map((doc) =>
          planets.push({ key: doc.data().name, value: doc.id })
        )

        setPlanets(planets)
      } catch (error) {
        console.error(error)
      }
    }

    fetchPlanets()
  }, [firestore, watchCampLevel])

  useEffect(() => {
    const fetchContinents = async () => {
      try {
        if (watchWorld) {
          const continentsCollection = collection(firestore, 'continents')

          const continents: SelectOptions[] = []
          const continentsQuery = query(
            continentsCollection,
            where('upperChurchId', '==', watchWorld)
          )
          const querySnapshot = await getDocs(continentsQuery)
          querySnapshot.docs.map((doc) =>
            continents.push({ key: doc.data().name, value: doc.id })
          )

          setContinents(continents)
        }
      } catch (error) {
        console.error(error)
      }
    }

    fetchContinents()
  }, [firestore, watchWorld])

  useEffect(() => {
    const fetchCountries = async () => {
      if (watchContinent) {
        try {
          const countriesCollection = collection(firestore, 'countries')

          const countriesQuery = query(
            countriesCollection,
            where('upperChurchId', '==', watchContinent)
          )

          const countriesSnapshot = await getDocs(countriesQuery)

          const data = countriesSnapshot.docs.map((doc) => ({
            key: doc.data().name,
            value: doc.id,
          }))

          setCountries(data)
        } catch (error) {
          console.error(error)
        }
      } else {
        setCountries([])
      }
    }

    fetchCountries()
  }, [firestore, watchContinent])

  useEffect(() => {
    const fetchCampuses = async () => {
      if (watchCountry) {
        try {
          const campusesCollection = collection(firestore, 'campuses')

          const campusesQuery = query(
            campusesCollection,
            where('upperChurchId', '==', watchCountry)
          )

          const campusesSnapshot = await getDocs(campusesQuery)

          const data = campusesSnapshot.docs.map((doc) => ({
            key: doc.data().name,
            value: doc.id,
          }))

          setCampuses(data)
        } catch (error) {
          console.error(error)
        }
      } else {
        setCampuses([])
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
