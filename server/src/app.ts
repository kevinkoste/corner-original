import express from 'express'
import bodyParser from 'body-parser'

// libs and routers
import cors from './libs/cors'
import profileRouter from './routes/profile'
import loginRouter from './routes/login'

const app = express()
app.use(bodyParser.json())
app.use(cors)

app.get('/', (req, res) => {
  res.send('The sedulous hyena ate the antelope!')
})

app.use('/auth', loginRouter)
app.use('/profile', profileRouter)
app.use('/static', express.static('static'))

app.listen(process.env.APP_PORT, () => {
  console.log(`The server is listening on port ${process.env.APP_PORT}!`)
})