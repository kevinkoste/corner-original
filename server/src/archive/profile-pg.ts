import express from 'express'
import db from './db'

const router = express.Router()

router.get('/', (req, res, next) => {
  SelectAllProfiles()
    .then(data => {
      res.status(200).send(data.rows)
    })
    .catch(err => {
      res.status(500).send('Internal Server Error')
    })
})

router.get('/:username', (req, res, next) => {
  SelectProfileByName(req.params.username)
    .then(data => {
      res.status(200).send(data.rows[0])
    })
    .catch(err => {
      res.status(500).send('Internal Server Error')
    })
})

const SelectProfileByName = (username: string) => {
  console.log('in SelectProfileWhere')
  return db.query(`SELECT * FROM profiles WHERE username=$1`, [username])
}

const SelectAllProfiles = () => {
  console.log('in SelectProfileWhere')
  return db.query(`SELECT * FROM profiles`)
}


export default router