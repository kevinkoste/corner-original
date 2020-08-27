import express from 'express'
import bodyParser from 'body-parser'

// libs and routers
import { corsMiddleware, loggerMiddleware } from './libs/middleware'
import protectRouter from './routes/protect'
import publicRouter from './routes/public'

const app = express()
app.use(bodyParser.json())
app.use(corsMiddleware)
app.use(loggerMiddleware)

app.get('/', (req, res) => res.send('Profile API home'))
app.use('/static', express.static('static'))
app.use('/protect', protectRouter)
app.use('/public', publicRouter)

app.listen(process.env.APP_PORT, () => {
  console.log(`The server is listening on port ${process.env.APP_PORT}!`)
})