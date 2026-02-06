import React, { useState } from 'react'
import {
  Button,
  Input,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  useToast,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react'
import { httpsCallable } from 'firebase/functions'
import { functions } from '../../firebase'

interface PaymentAuditModalProps {
  isOpen: boolean
  onClose: () => void
  participantId: string
  participantName: string
  currentPaid: number
  amountDue: number
}

export const PaymentAuditModal: React.FC<PaymentAuditModalProps> = ({
  isOpen,
  onClose,
  participantId,
  participantName,
  currentPaid,
  amountDue,
}) => {
  const [amount, setAmount] = useState(0)
  const [method, setMethod] = useState('cash')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  const handleSubmit = async () => {
    setLoading(true)

    try {
      const updatePayment = httpsCallable(functions, 'updatePaymentManual')
      const result = await updatePayment({
        participantId,
        amount,
        method,
        note,
      })

      toast({
        title: 'Payment Updated',
        description: `New status: ${result.data.newState}`,
        status: 'success',
        duration: 3000,
      })

      onClose()
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Record Payment: {participantName}</ModalHeader>
        <ModalBody>
          <FormControl mb={3}>
            <FormLabel>
              Amount Paid (Already: {currentPaid}/{amountDue})
            </FormLabel>
            <NumberInput value={amount} onChange={(_, val) => setAmount(val)}>
              <NumberInputField />
            </NumberInput>
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Method</FormLabel>
            <Select value={method} onChange={(e) => setMethod(e.target.value)}>
              <option value="cash">Cash</option>
              <option value="mobile_money">Mobile Money</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="paystack">Paystack (Manual)</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Note (Optional)</FormLabel>
            <Input value={note} onChange={(e) => setNote(e.target.value)} />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose} mr={3}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit} isLoading={loading}>
            Record Payment
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
