import express from 'express'
import cors from 'cors'


export const loggerMiddleware = (req: express.Request, res: express.Response, next: any) => {
  console.log(`${req.method.padEnd(8, ' ')} ${req.path}`)
  next()
}

export const corsMiddleware = cors({
  credentials: true,
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true)
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

// short-circuits the request and sends 401 if not authenticated
export const authMiddleware = (req: express.Request, res: express.Response, next: any) => {

  if (req.isAuthenticated()) {
    next()
  } else {
    res.status(401).end(`Unable to authenticate request`)
  }
}
