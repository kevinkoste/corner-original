import passport from 'passport'
import { Strategy } from 'passport-magic'
import { v4 as uuidv4 } from 'uuid'

import magic from './magic'
import AuthModel, { Auth } from '../models/Auth'

passport.use(
  new Strategy(async (user, done) => {
    const existingAuth = await AuthModel.findOne({ authId: user.issuer }).exec()

    // console.log(
    //   'in passport-magic strategy, found existingAuth object: ',
    //   existingAuth
    // )

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
    // first get email from Magic metadata
    let userMetadata = null
    try {
      userMetadata = await magic.users.getMetadataByIssuer(user.issuer)
    } catch (err) {
      console.log('error while calling getMetaDataByIssuer', err, err?.data)
    }

    // then create Auth object and save to db
    console.log('signing up new user, creating new Auth object')
    const newAuth = new AuthModel({
      authId: user.issuer,
      userId: uuidv4(),
      email: userMetadata?.email || '',
      lastLogin: user.claim.iat,
    })
    await newAuth.save()

    return done(null, newAuth)
  })
)

/* Implement Session Behavior */

/* Defines what data are stored in the user session */
passport.serializeUser((user: Auth, done) => {
  // console.log('in serializeUser with auth object:', user)

  done(null, user.authId)
})

/* Populates user data in the req.user object */
passport.deserializeUser(async (id: string, done) => {
  const user = await AuthModel.findOne({ authId: id }).exec()
  // console.log('in deserializeUser with auth object:', user)

  if (user) {
    return done(null, user)
  }
  return done('error', null)
})

export default passport
