import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { HttpsError } from 'firebase-functions/v2/https'

const addAdminUser = async (user: any) => {
  try {
    const userRecord = await getAuth().createUser({
      email: user?.email,
      emailVerified: false,
      phoneNumber: user?.phoneNumber,
      displayName: user?.firstName + ' ' + user?.lastName,
      photoURL: user?.photoURL,
      disabled: false,
    })

    await getAuth().setCustomUserClaims(userRecord?.uid, {
      campAdmin: true,
    })

    const userDetails = await getAuth().getUser(userRecord?.uid)
    const email = userDetails?.email ?? ''
    if (userDetails.customClaims !== null) {
      await getFirestore()
        .collection('users')
        .doc(email)
        .set({ firstName: user?.firstName, lastName: user?.lastName })

      // const actionCodeSettings = {
      //   url: 'https://fl-camp-app.netlify.app/',
      //   handleCodeInApp: false,
      // }

      // try {
      //   const link = getAuth().generatePasswordResetLink(
      //     userEmail,
      //     actionCodeSettings
      //   )
      //   // return sendCustomPasswordResetEmail(userEmail, displayName, link)
      // } catch (error) {}

      return 'success'
    }
  } catch (error) {
    console.log('Error creating new user:', error)
  }

  return 'response'
}

const createUser = async (email: string, password: string) => {
  try {
    const userRecord = await getAuth().createUser({
      email: email,
      emailVerified: false,
      password: password,
      disabled: false,
    })

    return userRecord
  } catch (error) {
    console.log('Error creating new user:', error)
    return error
  }
}

const addClaimsToTesters = async (email: string) => {
  try {
    const userRecord = await getAuth().getUserByEmail(email)
    await getAuth().setCustomUserClaims(userRecord?.uid, {
      roles: ['campAdmin', 'globalAdmin', 'campCamper'],
    })

    return 'success'
  } catch (error) {
    console.log('Error updating user:', error)
    return error
  }
}

const removeClaims = async (email: string, permission: string) => {
  try {
    const userRecord = await getAuth().getUserByEmail(email)

    const userDetails = await getAuth().getUser(userRecord?.uid)
    if (userDetails?.customClaims?.roles.length > 0) {
      const roles: string[] = userDetails?.customClaims?.roles

      if (roles.includes(permission)) {
        const index = roles.indexOf(permission)

        const slicedArray = [
          ...roles.slice(0, index),
          ...roles.slice(index + 1),
        ]

        try {
          await getAuth().setCustomUserClaims(userRecord?.uid, {
            roles: slicedArray,
          })

          return 'roles removed are :' + permission
        } catch (error) {
          console.log(error)
          return error
        }
      } else {
        return 'user does not have role'
      }
    } else {
      return 'no roles to remove'
    }
  } catch (error) {
    console.log('Error updating user:', error)
    return error
  }
}

const addClaims = async (email: string, permission: string) => {
  try {
    const userRecord = await getAuth().getUserByEmail(email)

    const userDetails = await getAuth().getUser(userRecord?.uid)
    console.log('userDetails', userDetails?.customClaims)
    console.log('userDetails', userDetails?.customClaims?.roles)
    if (userDetails?.customClaims?.roles.length > 0) {
      const roles: string[] = userDetails?.customClaims?.roles

      if (roles.includes(permission)) {
        return 'user already has role'
      }

      roles.push(permission)

      await getAuth().setCustomUserClaims(userRecord?.uid, {
        roles: roles,
      })

      return 'roles added are :' + permission
    } else {
      const roles: string[] = []
      roles.push(permission)
      await getAuth().setCustomUserClaims(userRecord?.uid, {
        roles: roles,
      })
      return 'roles added are :' + permission
    }
  } catch (error) {
    console.log('Error updating user:', error)
    throw new HttpsError('already-exists', error as string)
  }
}

export { addAdminUser, addClaimsToTesters, removeClaims, addClaims, createUser }
