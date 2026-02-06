import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Container,
  Heading,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Checkbox,
  VStack,
  Text,
  useToast,
  Alert,
  AlertIcon,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { httpsCallable } from 'firebase/functions'
import { functions, db } from '../../firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'

export const SelfRegister: React.FC = () => {
  const { campSlug } = useParams<{ campSlug: string }>()
  const navigate = useNavigate()
  const toast = useToast()
  const { register, handleSubmit } = useForm()
  const [camp, setCamp] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [createAccount, setCreateAccount] = useState(false)

  useEffect(() => {
    const fetchCamp = async () => {
      const q = query(
        collection(db, 'camps'),
        where('publicSlug', '==', campSlug)
      )
      const snapshot = await getDocs(q)

      if (!snapshot.empty) {
        setCamp({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() })
      }
      setLoading(false)
    }

    fetchCamp()
  }, [campSlug])

  const onSubmit = async (data: any) => {
    setLoading(true)

    try {
      const registerFunc = httpsCallable(functions, 'registerSelfService')
      const result = await registerFunc({
        campSlug,
        personalInfo: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          gender: data.gender,
        },
        groupingValues: camp.groupingDimensions.reduce((acc: any, dim: any) => {
          acc[dim.name] = data[`grouping_${dim.name}`]
          return acc
        }, {}),
        createAccount,
        password: data.password,
      })

      toast({
        title: 'Registration Successful!',
        description: 'Check your email for payment instructions.',
        status: 'success',
        duration: 5000,
      })

      // Redirect to payment or confirmation
      const { paymentLink, participantId } = result.data as any
      if (paymentLink) {
        window.location.href = paymentLink
      } else {
        navigate(`/registration-complete/${participantId}`)
      }
    } catch (error: any) {
      toast({
        title: 'Registration Failed',
        description: error.message,
        status: 'error',
        duration: 5000,
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Container>Loading...</Container>
  if (!camp) return <Container>Camp not found</Container>

  return (
    <Container maxW="lg" py={10}>
      <Heading mb={6}>{camp.name} - Registration</Heading>
      <Text mb={4}>{camp.description}</Text>

      {new Date() > camp.registration?.end?.toDate() && (
        <Alert status="warning" mb={4}>
          <AlertIcon />
          Registration has closed
        </Alert>
      )}

      <Box as="form" onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>First Name</FormLabel>
            <Input {...register('firstName', { required: true })} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Last Name</FormLabel>
            <Input {...register('lastName', { required: true })} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Phone Number</FormLabel>
            <Input type="tel" {...register('phone', { required: true })} />
          </FormControl>

          <FormControl>
            <FormLabel>Email (Optional - needed for account)</FormLabel>
            <Input type="email" {...register('email')} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Gender</FormLabel>
            <Select {...register('gender', { required: true })}>
              <option value="">Select...</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </Select>
          </FormControl>

          {/* Dynamic grouping dimension fields */}
          {camp.groupingDimensions?.map((dim: any) => (
            <FormControl key={dim.name} isRequired={dim.required}>
              <FormLabel>{dim.name}</FormLabel>
              <Select
                {...register(`grouping_${dim.name}`, {
                  required: dim.required,
                })}
              >
                <option value="">Select...</option>
                {dim.values.map((val: string) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </Select>
            </FormControl>
          ))}

          <Checkbox onChange={(e) => setCreateAccount(e.target.checked)}>
            Create account to track registration (requires email & password)
          </Checkbox>

          {createAccount && (
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input type="password" {...register('password')} />
            </FormControl>
          )}

          <Button
            type="submit"
            colorScheme="blue"
            width="full"
            isLoading={loading}
          >
            Register & Proceed to Payment
          </Button>
        </VStack>
      </Box>
    </Container>
  )
}
