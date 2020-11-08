import express from 'express'

import { Auth } from '../models/Auth'
import UserModel from '../models/User'
import passport from '../libs/passport'
import magic from '../libs/magic'

const router = express.Router()

// POST /auth/login - handles login or signup, on success return user data
router.post('/login', passport.authenticate('magic'), async (req, res) => {
  if (!req.user) {
    res.status(401).end('Could not log user in.')
  }

  const { userId, email } = req.user as Auth

  // let existingUser = null
  // try {
  //   existingUser = await UserModel.findOne({ userId: userId }).exec()
  //   console.log('mongo response from findOne', existingUser)
  // } catch (err) {
  //   console.log('mongodb error getting UserModel', err)
  // }
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
  // try {
  //   const newUser = new UserModel({ userId: userId })
  //   await newUser.save()
  // } catch (err) {
  //   console.log('mongo save new user error:', err)
  // }
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
