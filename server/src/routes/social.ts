// import express from 'express'
// import { v4 as uuidv4 } from 'uuid'
// import fs from 'fs'

// import { authMiddleware } from '../libs/middleware'
// import db from '../libs/dynamo'

// const router = express.Router()
// router.use(authMiddleware)

// // SOCIAL ROUTES //

// // POST /social/follow - follow a new user
// router.post('/follow', async (req, res) => {

//   // body: {email: email, profile: Profile}
//   const email = req.body.email
//   const username = req.body.username // this is the username to be followed

//   // get socialId of calling user
//   const profileRes = await db.get({ TableName: 'profiles', Key: { email } })
//   const socialId = profileRes.Item.socialId

//   // get socialId of user to be followed
//   const followProfileRes = await db.query({
//     TableName: "profiles",
//     IndexName: "username-index",
//     KeyConditionExpression: "username = :key",
//     ExpressionAttributeValues: {
//       ":key": username
//     }
//   })
//   const followSocialId = followProfileRes.Items[0].socialId

//   // update calling user row in social
//   await db.update({
//     TableName: 'social',
//     Key: { id: socialId },

//     UpdateExpression: 'set #following = list_append(if_not_exists(#following, :empty_list), :follow)',
//     ExpressionAttributeNames: {
//       '#following': 'following'
//     },
//     ExpressionAttributeValues: {
//       ':follow': [{
//         socialId: followSocialId,
//         timestamp: Date.now()
//       }],
//       ':empty_list': []
//     }
//   })

//   // update followed user row in social
//   await db.update({
//     TableName: 'social',
//     Key: { id: followSocialId },

//     UpdateExpression: 'set #following = list_append(if_not_exists(#following, :empty_list), :follow)',
//     ExpressionAttributeNames: {
//       '#following': 'following'
//     },
//     ExpressionAttributeValues: {
//       ':follow': [{
//         socialId: socialId,
//         timestamp: Date.now()
//       }],
//       ':empty_list': []
//     }
//   })

//   res.status(200)

// })


// export default router