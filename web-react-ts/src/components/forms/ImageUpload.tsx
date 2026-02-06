import React, { useState } from 'react'
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Box,
  Image,
  VStack,
} from '@chakra-ui/react'
import { Control, Controller, FieldErrors, Path } from 'react-hook-form'

interface ImageUploadProps<T extends Record<string, any>> {
  name: Path<T>
  label?: string
  control: Control<T>
  errors: FieldErrors<T>
  placeholder?: string
}

function ImageUpload<T extends Record<string, any>>({
  name,
  label,
  control,
  errors,
  placeholder = 'Choose image...',
}: ImageUploadProps<T>) {
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const error = errors[name]

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: any) => void
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      onChange(file)
    }
  }

  return (
    <FormControl isInvalid={!!error} mb={4}>
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <VStack align="start" spacing={4}>
            <Input
              id={name}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, onChange)}
              placeholder={placeholder}
            />
            {previewUrl && (
              <Box>
                <Image
                  src={previewUrl}
                  alt="Preview"
                  maxH="200px"
                  maxW="200px"
                  objectFit="cover"
                  borderRadius="md"
                />
              </Box>
            )}
          </VStack>
        )}
      />
      <FormErrorMessage>
        {error && typeof error.message === 'string' ? error.message : ''}
      </FormErrorMessage>
    </FormControl>
  )
}

export default ImageUpload
