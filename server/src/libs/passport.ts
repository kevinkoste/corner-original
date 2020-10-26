import { v4 as uuidv4 } from 'uuid'
import passport from 'passport'
import { Strategy } from 'passport-magic'

import magic from './magic'
import AuthModel, { Auth } from '../models/Auth'

const strategy = new Strategy(async (user, done) => {
  console.log('in magic strategy with user:', user)

  let userMetadata = null
  try {
    console.log('calling getMetaDataByIssuer')
    userMetadata = await magic.users.getMetadataByIssuer(user.issuer)
  } catch (err) {
    console.log('error while calling getMetaDataByIssuer', err, err?.data)
  }

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
    email: userMetadata?.email || '',
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
