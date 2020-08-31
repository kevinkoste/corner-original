import express from 'express'
import bodyParser from 'body-parser'

// libs and routers
import { corsMiddleware, loggerMiddleware } from './libs/middleware'
import protectRouter from './routes/protect'
import publicRouter from './routes/public'

const app = express()

app.use(corsMiddleware)
app.use(bodyParser.json())
app.use(loggerMiddleware)

app.get('/', (req, res) => res.send(`Corner API accepting requests from origins: ${process.env.ALLOWED_ORIGINS}`))

app.use('/static', express.static('static'))
app.use('/protect', protectRouter)
app.use('/public', publicRouter)

app.listen(process.env.PORT || 8000, () => {
  console.log(`The server is listening on port ${process.env.PORT || 8000}!`)
})