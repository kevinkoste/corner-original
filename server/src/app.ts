import express from 'express'
import session from 'express-session'
import mongoose from 'mongoose'
import connectMongo from 'connect-mongo'

import passport from './libs/passport'
import connectDb from './libs/mongo'
import { corsMiddleware, loggerMiddleware } from './libs/middleware'

import authRouter from './routes/auth'
import protectRouter from './routes/protect'
import publicRouter from './routes/public'
import socialRouter from './routes/social'

try {
  await connectDb()
} catch (err) {
  console.log('mongo error', err)
}

const app = express()

const MongoStore = connectMongo(session)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(
  session({
    name: 'corner-sid',
    secret: process.env.SESSION_SECRET || 'xyz',
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 * 2, // 2 weeks
      secure: process.env.NODE_ENV === 'production',
      httpOnly: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : false,
    },
  })
)

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1) // trust first proxy
}

app.use(passport.initialize())
app.use(passport.session())

app.use(loggerMiddleware)
app.use(corsMiddleware)

app.get('/', (req, res) => {
  return res.send(`
    Corner API accepting requests from origins:
    ${process.env.ALLOWED_ORIGINS!}
  `)
})

app.use('/static', express.static('static'))
app.use('/auth', authRouter)
app.use('/public', publicRouter)
app.use('/protect', protectRouter)
app.use('/social', socialRouter)

app.listen(process.env.PORT || 8000, () => {
  console.log(`The server is listening on port ${process.env.PORT || 8000}!`)
})
