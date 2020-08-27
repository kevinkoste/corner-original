import express from 'express'
import CotterNode from "cotter-node"
import cors from 'cors'

export const corsMiddleware = cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true)
    if (process.env.ALLOWED_ORIGINS.indexOf(origin) === -1) {
      return callback(
        new Error("This server's CORS policy does not allow access from the specified origin."), false)
    }
    return callback(null, true)
  }
})

export const loggerMiddleware = (req: express.Request, res: express.Response, next: any) => {
  console.log(`${req.method} ${req.path}`)
  next()
}

export const authMiddleware = (req: express.Request, res: express.Response, next: any) => {
  if (!('authorization' in req.headers)) {
    res.status(401).end('Authorization header missing')
  }
  const auth = req.headers.authorization
  const bearer = auth.split(' ')
  const access_token = bearer[1]

  CotterNode.CotterValidateJWT(access_token)
    .then(valid => {
      console.log('just got validate response:', valid)
      if (!valid) throw Error('Invalid access token')
    })
    .catch(err => {
      console.log(err)
      res.status(403).end(err)
    })

  next()
}


