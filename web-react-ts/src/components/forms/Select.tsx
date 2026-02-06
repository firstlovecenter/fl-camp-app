import React from 'react'
import {
  FormControl,
  FormLabel,
  Select as ChakraSelect,
  FormErrorMessage,
  SelectProps as ChakraSelectProps,
} from '@chakra-ui/react'
import { Control, Controller, FieldErrors, Path } from 'react-hook-form'

interface SelectOption {
  key: string
  value: string
}

interface SelectProps<T extends Record<string, any>>
  extends Omit<ChakraSelectProps, 'name'> {
  name: Path<T>
  label: string
  control: Control<T>
  errors: FieldErrors<T>
  options: SelectOption[]
  placeholder?: string
}

function Select<T extends Record<string, any>>({
  name,
  label,
  control,
  errors,
  options,
  placeholder,
  ...rest
}: SelectProps<T>) {
  const error = errors[name]

  return (
    <FormControl isInvalid={!!error} mb={4}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <ChakraSelect
            {...field}
            id={name}
            placeholder={placeholder}
            {...rest}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.key}
              </option>
            ))}
          </ChakraSelect>
        )}
      />
      <FormErrorMessage>
        {error && typeof error.message === 'string' ? error.message : ''}
      </FormErrorMessage>
    </FormControl>
  )
}

export default Select
