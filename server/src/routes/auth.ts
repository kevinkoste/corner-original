import express from 'express'

import { Auth } from '../models/Auth'
import UserModel from '../models/User'
import passport from '../libs/passport'
import magic from '../libs/magic'
// import db from '../libs/dynamo'

const router = express.Router()

// POST /auth/login - handles login or signup, on success return user data
router.post('/login', passport.authenticate('magic'), async (req, res) => {
  if (!req.user) {
    res.status(401).end('Could not log user in.')
  }

  const { userId, email } = req.user as Auth

  const existingUser = await UserModel.findOne({ userId: userId }).exec()

  if (existingUser) {
    // user exists
    if (existingUser.username) {
      // user is onboarded
      console.log('returning user is onboarded')
      return res.status(200).json({
        userId: userId,
        email: email,
        username: existingUser.username,
        onboarded: true,
      })
    }

    // user is not onboarded
    console.log('returning user is not onboarded')
    return res.status(200).json({
      userId: userId,
      email: email,
      onboarded: false,
    })
  }

  // user is brand new
  console.log('new user')
  const newUser = new UserModel({ userId: userId })
  await newUser.save()
  return res.status(200).send({
    userId: userId,
    email: email,
    onboarded: false,
  })
})

// POST /auth/check - handles session check
router.post('/check', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).end(`No session found`)
  }
  const { userId, email } = req.user as Auth

  const user = await UserModel.findOne({ userId: userId })

  if (user?.username) {
    return res.status(200).json({
      userId: userId,
      email: email,
      onboarded: true,
      username: user.username,
    })
  }

  return res.status(200).json({
    userId: userId,
    email: email,
    onboarded: false,
  })
})

// POST /auth/logout - handles logout
router.post('/logout', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).end(`User is not logged in.`)
  }
  const { authId } = req.user as Auth
  await magic.users.logoutByIssuer(authId)
  req.logout()
  return res.status(200).end()
})

export default router

// import express from 'express'

// import { Auth } from '../models/Auth'
// import UserModel from '../models/User'
// import passport from '../libs/passport'
// import magic from '../libs/magic'
// import db from '../libs/dynamo'

// const router = express.Router()

// // POST /auth/login - handles login or signup, on success return user data
// router.post('/login', passport.authenticate('magic'), async (req, res) => {
//   if (req.user) {
//     const { userId, email } = req.user as Auth

//     const userRes = await db.get({
//       TableName: 'users',
//       Key: { userId: userId },
//     })

//     if (userRes.Item) {
//       console.log('found user in users table')

//       if (userRes.Item.username) {
//         // user exists and has username (therefore is onboarded)
//         console.log('user has a username, sending response now')
//         res.status(200).json({
//           userId: userId,
//           email: email,
//           username: userRes.Item.username,
//           onboarded: true,
//         })
//       } else {
//         // user exists but doesn't have username (not yet onboarded)
//         res.status(200).send({
//           userId: userId,
//           email: email,
//           onboarded: false,
//         })
//       }
//     } else {
//       // try to patch data from profiles table into users table
//       console.log('checking if user is present in old table...')
//       const oldRes = await db.get({
//         TableName: 'profiles',
//         Key: { email: email },
//       })

//       if (oldRes.Item) {
//         console.log('found user in old table, updating new table')
//         const newRes = await db.update({
//           TableName: 'users',
//           Key: { userId: userId },
//           UpdateExpression: 'set username = :x, components = :y',
//           ExpressionAttributeValues: {
//             ':x': oldRes.Item.username,
//             ':y': oldRes.Item.components,
//           },
//           ReturnValues: 'ALL_NEW',
//         })
//         res.status(200).json({
//           userId: userId,
//           email: email,
//           username: newRes.Attributes?.username,
//           onboarded: true,
//         })
//       } else {
//         // user is brand new (not yet onboarded)
//         console.log('user not found in old table, user is brand new')
//         await db.put({
//           TableName: 'users',
//           Item: { userId: userId },
//         })
//         res.status(200).send({
//           userId: userId,
//           email: email,
//           onboarded: false,
//         })
//       }
//     }
//   } else {
//     res.status(401).end('Could not log user in.')
//   }
// })

// // POST /auth/check - handles session check
// router.post('/check', async (req, res) => {
//   if (!req.isAuthenticated()) {
//     return res.status(401).end(`No session found`)
//   }
//   const { userId, email } = req.user as Auth

//   const user = await UserModel.findOne({ userId: userId })

//   if (user?.username) {
//     return res.status(200).json({
//       userId: userId,
//       email: email,
//       onboarded: true,
//       username: user.username,
//     })
//   }

//   return res.status(200).json({
//     userId: userId,
//     email: email,
//     onboarded: false,
//   })
// })

// // POST /auth/logout - handles logout
// router.post('/logout', async (req, res) => {
//   if (!req.isAuthenticated()) {
//     return res.status(401).end(`User is not logged in.`)
//   }
//   const { authId } = req.user as Auth
//   await magic.users.logoutByIssuer(authId)
//   req.logout()
//   return res.status(200).end()
// })

// export default router
