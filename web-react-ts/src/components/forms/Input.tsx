import React from 'react'
import {
  FormControl,
  FormLabel,
  Input as ChakraInput,
  FormErrorMessage,
  InputProps as ChakraInputProps,
} from '@chakra-ui/react'
import { Control, Controller, FieldErrors, Path } from 'react-hook-form'

interface InputProps<T extends Record<string, any>>
  extends Omit<ChakraInputProps, 'name'> {
  name: Path<T>
  label: string
  control: Control<T>
  errors: FieldErrors<T>
  placeholder?: string
  type?: string
}

function Input<T extends Record<string, any>>({
  name,
  label,
  control,
  errors,
  placeholder,
  type = 'text',
  ...rest
}: InputProps<T>) {
  const error = errors[name]

  return (
    <FormControl isInvalid={!!error} mb={4}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <ChakraInput
            {...field}
            id={name}
            type={type}
            placeholder={placeholder}
            {...rest}
          />
        )}
      />
      <FormErrorMessage>
        {error && typeof error.message === 'string' ? error.message : ''}
      </FormErrorMessage>
    </FormControl>
  )
}

export default Input
