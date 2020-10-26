import { v4 as uuidv4 } from 'uuid'
import passport from 'passport'
import { Strategy } from 'passport-magic'

import magic from './magic'
import AuthModel, { Auth } from '../models/Auth'

const strategy = new Strategy(async (user, done) => {
  const userMetadata = await magic.users.getMetadataByIssuer(user.issuer)

  const existingAuth = await AuthModel.findOne({ authId: user.issuer }).exec()

  // Log in existing user
  if (existingAuth) {
    await AuthModel.updateOne(
      { authId: user.issuer },
      { lastLogin: user.claim.iat }
    ).exec()

    return done(null, {
      authId: existingAuth.authId,
      userId: existingAuth.userId,
      email: existingAuth.email,
      lastLogin: user.claim.iat,
    })
  }

  // Sign up new user
  const newUser: Auth = {
    authId: user.issuer,
    userId: uuidv4(),
    email: userMetadata.email || '',
    lastLogin: user.claim.iat,
  }

  await AuthModel.findOneAndUpdate({ authId: user.issuer }, newUser, {
    upsert: true,
    new: true,
    useFindAndModify: true,
  }).exec()

  return done(null, newUser)
})

passport.use(strategy)

/* Implement Session Behavior */

/* Defines what data are stored in the user session */
passport.serializeUser((user: Auth, done) => {
  done(null, user.authId)
})

/* Populates user data in the req.user object */
passport.deserializeUser(async (id: string, done) => {
  const user = await AuthModel.findOne({ authId: id }).exec()

  if (user) {
    return done(null, user)
  }
  return done('error', null)
})

export default passport

// const strategy = new Strategy(async (user, done) => {
//   const userMetadata = await magic.users.getMetadataByIssuer(user.issuer)

//   const authRes = await db.get({
//     TableName: 'auth',
//     Key: { authId: user.issuer },
//   })
//   const existingUser = authRes.Item

//   // Sign up new user
//   if (!existingUser) {
//     const newUserId = uuidv4()

//     const updateRes = await db.update({
//       TableName: 'auth',
//       Key: { authId: user.issuer },
//       UpdateExpression: 'set userId = :x, email = :y, lastLogin = :z',
//       ExpressionAttributeValues: {
//         ':x': newUserId,
//         ':y': userMetadata.email,
//         ':z': user.claim.iat,
//       },
//       ReturnValues: 'ALL_NEW',
//     })

//     return done(null, updateRes.Attributes as UserType)
//   }

//   // Login existing user
//   if (user.claim.iat <= existingUser.lastLoginAt) {
//     return done(null, false, {
//       message: `Replay attack detected for user ${user.issuer}}.`,
//     })
//   }

//   const updateRes = await db.update({
//     TableName: 'auth',
//     Key: { authId: user.issuer },
//     UpdateExpression: 'set lastLogin = :x',
//     ExpressionAttributeValues: {
//       ':x': user.claim.iat,
//     },
//     ReturnValues: 'ALL_NEW',
//   })

//   return done(null, updateRes.Attributes as UserType)
// })

// passport.use(strategy)

// /* Implement Session Behavior */

// /* Defines what data are stored in the user session */
// passport.serializeUser((user: UserType, done) => {
//   done(null, user.authId)
// })

// /* Populates user data in the req.user object */
// passport.deserializeUser(async (id: string, done) => {
//   const authRes = await db.get({
//     TableName: 'auth',
//     Key: { authId: id },
//   })

//   const existingUser = authRes.Item

//   if (existingUser) {
//     done(null, existingUser)
//   } else {
//     done('error', null)
//   }
// })

// export default passport
