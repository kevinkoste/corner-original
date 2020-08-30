import express from 'express'
import bodyParser from 'body-parser'

// libs and routers
import { corsMiddleware, loggerMiddleware } from './libs/middleware'
import protectRouter from './routes/protect'
import publicRouter from './routes/public'

const app = express()

app.get('/', (req, res) => res.send('Corner API home'))

app.use(bodyParser.json())
app.use(corsMiddleware)
app.use(loggerMiddleware)

app.use('/static', express.static('static'))
app.use('/protect', protectRouter)
app.use('/public', publicRouter)

app.listen(8000, () => {
  console.log(`The server is listening on port 8000!`)
})