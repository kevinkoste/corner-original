import express from 'express'

import { User } from '../models/User'
import { authMiddleware } from '../libs/middleware'
import db from '../libs/dynamo'

const router = express.Router()
router.use(authMiddleware)

// SOCIAL ROUTES //

// POST /social/follow - follow a user by username
router.post('/follow', async (req, res) => {
  const { userId, email, lastLogin } = req.user as User

  // this is the username to be followed
  const username = req.body.username

  // first get userId associated with that username
  const followUserRes = await db.query({
    TableName: "users",
    IndexName: "username-index",
    KeyConditionExpression: "username = :key",
    ExpressionAttributeValues: {
      ":key": username
    }
  })
  const followedUserId = followUserRes.Items[0].userId

  // add both follows to db
  await Promise.all([
    db.update({
      TableName: 'users',
      Key: { userId: userId },
      UpdateExpression: 'set #following = list_append(if_not_exists(#following, :empty_list), :follow)',
      ExpressionAttributeNames: {
        '#following': 'following'
      },
      ExpressionAttributeValues: {
        ':follow': [{
          userId: followedUserId,
          timestamp: Date.now()
        }],
        ':empty_list': []
      }
    }),
    await db.update({
      TableName: 'users',
      Key: { userId: followedUserId },
      UpdateExpression: 'set #followers = list_append(if_not_exists(#followers, :empty_list), :follow)',
      ExpressionAttributeNames: {
        '#followers': 'followers'
      },
      ExpressionAttributeValues: {
        ':follow': [{
          userId: userId,
          timestamp: Date.now()
        }],
        ':empty_list': []
      }
    })
  ])

  return res.status(200).send(true)

})


export default router
