import { v4 as uuidv4 } from 'uuid'
import passport from 'passport'
import magicPassport from 'passport-magic'
const { Strategy } = magicPassport

import { User } from '../models/User'
import magic from '../libs/magic'
import db from '../libs/dynamo'

const strategy = new Strategy(async (user, done) => {

  const userMetadata = await magic.users.getMetadataByIssuer(user.issuer)

  const authRes = await db.get({
    TableName: 'auth',
    Key: { authId: user.issuer }
  })
  const existingUser = authRes.Item

  if (!existingUser) {
    // Sign up new user

    const newUserId = uuidv4()

    const updateRes = await db.update({
      TableName: 'auth',
      Key: { authId: user.issuer },
      UpdateExpression: "set userId = :x, email = :y, lastLogin = :z",
      ExpressionAttributeValues: {
        ":x": newUserId,
        ":y": userMetadata.email,
        ":z": user.claim.iat
      },
      ReturnValues: "ALL_NEW"
    })

    return done(null, updateRes.Attributes as User)

  } else {
    // Login existing user

    if (user.claim.iat <= existingUser.lastLoginAt) {
      return done(null, false, {
        message: `Replay attack detected for user ${user.issuer}}.`
      })
    }

    const updateRes = await db.update({
      TableName: 'auth',
      Key: { authId: user.issuer },
      UpdateExpression: "set lastLogin = :x",
      ExpressionAttributeValues: {
        ":x": user.claim.iat
      },
      ReturnValues: "ALL_NEW"
    })

    return done(null, updateRes.Attributes as User)
  }
})

passport.use(strategy)

/* Implement Session Behavior */

/* Defines what data are stored in the user session */
passport.serializeUser((user: User, done) => {
  done(null, user.authId)
})

/* Populates user data in the req.user object */
passport.deserializeUser(async (id: string, done) => {
  const authRes = await db.get({
    TableName: 'auth',
    Key: { authId: id }
  })

  const existingUser = authRes.Item

  if (existingUser) {
    done(null, existingUser)
  } else {
    done('error', null)
  }
})

export default passport