import express from 'express'

import { Auth } from '../models/Auth'
import UserModel from '../models/User'
import { authMiddleware } from '../libs/middleware'

const router = express.Router()
router.use(authMiddleware)

// SOCIAL ROUTES //

// POST /social/follow - follow a user by username
router.post('/follow', async (req, res) => {
  const { userId } = req.user as Auth
  const { username } = req.body // username to be followed

  // get userId associated with username
  const followedUser = await UserModel.findOne({ username: username }).exec()
  if (!followedUser) {
    return res.send(false)
  }

  // add both follows to db
  await Promise.all([
    UserModel.updateOne(
      { userId: userId },
      {
        $push: {
          following: {
            userId: followedUser.userId,
            timestamp: Date.now(),
          },
        },
      },
      { upsert: true }
    ),
    UserModel.updateOne(
      { userId: followedUser.userId },
      {
        $push: {
          followers: {
            userId: userId,
            timestamp: Date.now(),
          },
        },
      },
      { upsert: true }
    ),
  ])

  return res.status(200).send(true)
})

export default router
