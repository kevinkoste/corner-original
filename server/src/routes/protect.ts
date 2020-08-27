import express from 'express'
import multiparty from 'multiparty'
import fileType from 'file-type'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'

import { authMiddleware } from '../libs/middleware'
import db from '../libs/dynamo'
import s3 from '../libs/s3'


const router = express.Router()
router.use(authMiddleware)

// protect/onboard - Updates the user Item in the db with username and data attribute
router.post('/onboard', (req, res) => {

  console.log('request body:', req.body)
  console.log('request headers:', req.headers)

  const email = req.body.email

  console.log('email is:', email)

  db.put({
    TableName: 'profiles',
    Item: {
      email: req.body.email,
      username: req.body.username,
      data: req.body.data
    }
  }).then(data => {
    res.status(200)
  }).catch(err => {
    console.log(err)
    res.status(500)
  })
})

// protect/:username - upload new profile data for auth'd user
router.post('/:username', (req, res) => {

  const username = req.params.username

  console.log(req.body)

  db.put({
    TableName: "profiles",
    Item: req.body
  }).then(data => {
    console.log('Sucessful put to Dynamodb')
    res.status(200).send('Successfully saved profile')
  }).catch(err => {
    console.log(err)
    res.status(500).send('Unable to save profile')
  })

})

// protect/:username/upload-image - uploads a new image for a profile
// also need to try to delete profiles prev photo on new upload
router.post('/:username/upload-image', (req, res) => {

  console.log('handling image upload')
  const username = req.params.username

  const imageId = uuidv4()
  const form = new multiparty.Form()

  form.parse(req, async (err, fields, files) => {

    const buffer = fs.readFileSync(files.file[0].path)
    const type = await fileType.fromBuffer(buffer)

    s3.upload({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `images/${imageId}.${type.ext}`,
      ACL: 'public-read',
      Body: buffer,
    })
    .then(data => {
      console.log('response from s3', data)
      res.status(200).json({
        image: data.Key
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500)
    })
  })
  

})










export default router


