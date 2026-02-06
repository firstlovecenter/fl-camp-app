import { onRequest } from 'firebase-functions/v2/https'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import * as crypto from 'crypto'

const db = getFirestore()

export const paystackWebhook = onRequest(async (req, res) => {
  // Verify Paystack signature
  const secret = process.env.PAYSTACK_SECRET_KEY
  const hash = crypto
    .createHmac('sha512', secret!)
    .update(JSON.stringify(req.body))
    .digest('hex')

  if (hash !== req.headers['x-paystack-signature']) {
    res.status(401).send('Invalid signature')
    return
  }

  const event = req.body

  if (event.event === 'charge.success') {
    const { reference, amount, customer } = event.data

    // Find participant by reference (format: campId_participantId)
    const [campId, participantId] = reference.split('_')

    const participantRef = db.collection('camp_participants').doc(participantId)
    const participant = await participantRef.get()

    if (!participant.exists) {
      console.error(`Participant ${participantId} not found`)
      res.status(404).send('Participant not found')
      return
    }

    const currentPaid = participant.data()?.paymentDetails?.amountPaid || 0
    const amountDue = participant.data()?.paymentDetails?.amountDue || 0
    const newTotalPaid = currentPaid + amount / 100 // Paystack returns kobo

    const newState = newTotalPaid >= amountDue ? 'paid' : 'partial'

    // Update participant
    await participantRef.update({
      'paymentDetails.amountPaid': newTotalPaid,
      'paymentDetails.method': 'paystack',
      'paymentDetails.transactionRef': reference,
      'paymentDetails.auditHistory': FieldValue.arrayUnion({
        actorId: 'system_paystack',
        timestamp: FieldValue.serverTimestamp(),
        action: 'payment_received',
        note: `Paystack payment: ${amount / 100}`,
        previousValue: currentPaid,
        newValue: newTotalPaid,
      }),
      'states.payment': newState,
      updatedAt: FieldValue.serverTimestamp(),
    })

    // Log to payments collection
    await db.collection('payments').add({
      campId,
      participantId,
      userId: participant.data()?.userId,
      amount: amount / 100,
      method: 'paystack',
      status: 'success',
      transactionRef: reference,
      webhookData: event.data,
      audit: {
        actorId: 'system_paystack',
        timestamp: FieldValue.serverTimestamp(),
        action: 'webhook_processed',
      },
      createdAt: FieldValue.serverTimestamp(),
    })

    console.log(`Payment processed: ${participantId}, ${newState}`)
  }

  res.status(200).send('OK')
})

// Manual payment update (callable function)
export const updatePaymentManual = onCall(async (request) => {
  const { participantId, amount, method, note } = request.data
  const actorId = request.auth?.uid

  if (!actorId) {
    throw new HttpsError('unauthenticated', 'Must be logged in')
  }

  // Check if actor is camp admin (verify custom claims)
  const participantRef = db.collection('camp_participants').doc(participantId)
  const participant = await participantRef.get()

  if (!participant.exists) {
    throw new HttpsError('not-found', 'Participant not found')
  }

  const campId = participant.data()?.campId

  // TODO: Verify actorId has admin role for campId (check custom claims)

  const currentPaid = participant.data()?.paymentDetails?.amountPaid || 0
  const amountDue = participant.data()?.paymentDetails?.amountDue || 0
  const newTotalPaid = currentPaid + amount

  const newState = newTotalPaid >= amountDue ? 'paid' : 'partial'

  await participantRef.update({
    'paymentDetails.amountPaid': newTotalPaid,
    'paymentDetails.method': method,
    'paymentDetails.auditHistory': FieldValue.arrayUnion({
      actorId,
      timestamp: FieldValue.serverTimestamp(),
      action: 'manual_payment',
      note: note || `Manual payment: ${amount}`,
      previousValue: currentPaid,
      newValue: newTotalPaid,
    }),
    'states.payment': newState,
    updatedAt: FieldValue.serverTimestamp(),
  })

  return { success: true, newState }
})
