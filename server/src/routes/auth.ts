import express from 'express'

import { User } from '../models/User'
import passport from '../libs/passport'
import magic from '../libs/magic'


const router = express.Router()

// POST /auth/login - handles login or signup
router.post('/login', passport.authenticate('magic'), async (req, res) => {
  if (req.user) {
    res.status(200).send('Successful login')
  } else {
    res.status(401).end('Could not log user in.')
  }
})

// POST /auth/logout - handles logout
router.post('/logout', async (req, res) => {
  if (req.isAuthenticated()) {
    await magic.users.logoutByIssuer((req.user as User).userId)
    req.logout()
    res.status(200).end()
  } else {
    res.status(401).end(`User is not logged in.`)
  }
})

export default router

