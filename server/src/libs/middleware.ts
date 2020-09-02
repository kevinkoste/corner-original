import express from 'express'
import CotterNode from "cotter-node"
import cors from 'cors'

export const corsMiddleware = cors({
  credentials: true,
  origin: (origin, callback) => {
    if (!origin) {
      return callback(
        null,
        true
      )
    }
    if (process.env.ALLOWED_ORIGINS.indexOf(origin) === -1) {
      return callback(
        new Error("This server's CORS policy does not allow access from the specified origin."),
        false
      )
    }
    return callback(null, true)
  }
})

export const loggerMiddleware = (req: express.Request, res: express.Response, next: any) => {
  console.log(`${req.method} ${req.path}`)
  next()
}

export const authMiddleware = (req: express.Request, res: express.Response, next: any) => {

  console.log('in authMiddleware')

  if (!('authorization' in req.headers)) {
    res.status(401).end('Authorization header missing')
  }
  const auth = req.headers.authorization
  const accessToken = auth.split(' ')[1]

  CotterNode.CotterValidateJWT(accessToken)
  .then(valid => {
    console.log('auth validated:', valid)
    if (!valid) throw Error('Invalid access token')
    next()
  })
  .catch(err => {
    console.log(err)
    res.status(403).end(err)
  })  
}


