import express from 'express'
import bodyParser from 'body-parser'

// libs and routers
import cors from 'cors'
import { corsMiddleware, loggerMiddleware } from './libs/middleware'
import protectRouter from './routes/protect'
import publicRouter from './routes/public'

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(loggerMiddleware)

app.get('/', (req, res) => res.send('Corner API home fuck'))

app.use('/static', express.static('static'))
app.use('/protect', protectRouter)
app.use('/public', publicRouter)

app.listen(8000, () => {
  console.log(`The server is listening on port 8000!`)
})