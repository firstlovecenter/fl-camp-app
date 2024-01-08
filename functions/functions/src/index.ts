/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest, onCall } from 'firebase-functions/v2/https'
import * as logger from 'firebase-functions/logger'
import { onDocumentCreated } from 'firebase-functions/v2/firestore'

import { initializeApp } from 'firebase-admin/app'

initializeApp()

import {
  addAdminUser,
  addClaims,
  addClaimsToTesters,
  createUser,
  removeClaims,
} from './add-user'
import { createCampDirectoryLevels, registerCampUser } from './registration'

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const addAdmin = onRequest(async (req, res) => {
  // Grab the text parameter.

  const addadminresult = await addAdminUser(req.body)
  // if
  logger.log('addadminresult', addadminresult)

  // Send back a message that we've successfully written the message
  res.json({ result: 'User added' })
})

export const addTestersClaims = onRequest({ cors: true }, async (req, res) => {
  // Grab the text parameter.

  console.log('req.body', req.body)

  const additionResult = await addClaimsToTesters(req.body.email)
  // if
  logger.log('addClaims', additionResult)

  // Send back a message that we've successfully written the message
  res.json({ result: 'User added', resultDetails: additionResult })
})

export const removeClaimsFromTesters = onRequest(async (req, res) => {
  // Grab the text parameter.

  console.log('req.body', req.body)

  const removalResult = await removeClaims(
    req?.body?.email,
    req?.body?.permission
  )
  // if
  logger.log('addClaims', removalResult)

  // Send back a message that we've successfully written the message
  res.json({ result: 'Claims removed', resultDetails: removalResult })
})

export const addClaimsToUsers = onRequest(async (req, res) => {
  // Grab the text parameter.

  console.log('req.body', req.body)

  const additionResult = await addClaims(
    req?.body?.email,
    req?.body?.permission
  )
  // if
  logger.log('addClaims', additionResult)

  // Send back a message that we've successfully written the message
  res.json({ result: 'Claims added', resultDetails: additionResult })
})

export const addClaimsToUsersCallable = onCall(async (req: any) => {
  // Grab the text parameter.

  console.log('req.body', req.body)

  const additionResult = await addClaims(
    req?.data?.email,
    req?.data?.permission
  )
  // if
  logger.log('addClaims', additionResult)

  // Send back a message that we've successfully written the message
  return { result: 'Claims added', resultDetails: additionResult }
})

export const createUserCallable = onCall(async (req: any) => {
  const userResult = await createUser(req?.data?.email, req?.data?.password)

  return { result: userResult }
})

export { registerCampUser }

export const createCampDirectory = onDocumentCreated(
  'camps/{campId}',
  (event: { data: any }) => {
    const snapshot = event.data
    if (!snapshot) {
      console.log('No data associated with the event')
      return
    }

    console.log('snapshot', snapshot.id)
    const data = snapshot.data()

    createCampDirectoryLevels(data, snapshot.id)

    // access a particular field as you would any JS property
    // const name = data.name
    console.log('data', data)

    // perform more operations ...
  }
)
