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

// PROFILE ROUTES //

// POST /protect/profile - update profile data for auth'd user
router.post('/profile', (req, res) => {

  // body: {email: email, authId: authId, profile: Profile}

  console.log('in protect/profile with body:')
  console.log(req.body)

  db.update({
    TableName: 'profiles',
    Key: { email: req.body.email },
    UpdateExpression: "set username = :x, components = :y",
    ExpressionAttributeValues: {
      ":x": req.body.profile.username,
      ":y": req.body.profile.components
    }
  }).then(data => {
    console.log('response from db update', data)
    res.status(200).send('successfully updated profile')
  }).catch(err => {
    console.log(err)
    res.status(500).end('failed to update profile')
  })

})

// POST /protect/upload-image/:username - uploads a new image for a profile
// also need to try to delete profiles prev photo on new upload
router.post('/upload-image/:username', (req, res) => {

  const username = req.params.username

  console.log('handling image upload for:', username)

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


// ONBOARDING/INVITED ROUTES //

// GET /protect/onboard/check - checks if a user has been onboarded
router.post('/onboard/check', (req, res) => {

  db.get({
    TableName: 'profiles',
    Key: { email: req.body.email }
  }).then(data => {
    console.log('found in db:', data.Item)
    if ('components' in data.Item) {
      res.status(200).send(true)
    } else {
      res.status(200).send(false)
    }
  }).catch(err => {
    console.log(err)
    res.status(500)
  })
})

// POST /protect/invite/check - checks if email has been invited
router.post('/invite/check', (req, res) => {

  const email = req.body.email

  db.get({
    TableName: 'invites',
    Key: { email: email }
  }).then(data => {
    console.log(data)
    if ('email' in data.Item) {
      // person has been invited
      res.status(200).send(true)
    } else {
      // email has not been invited
      res.status(200).send(false)
    }
  }).catch(err => {
    console.log(err)
    res.status(500)
  })
})

// POST /protect/get-username - checks if email has been invited
router.post('/get-username', (req, res) => {

  const email = req.body.email

  db.get({
    TableName: 'profiles',
    Key: { email: email }
  }).then(data => {
    console.log('db response for get-username check', data)

    if (data.Item !== undefined && data.Item !== null) {
      res.status(200).json({ username: data.Item.username })
    } else {
      res.status(400).end('user not found')
    }

  }).catch(err => {
    console.log(err)
    res.status(500)
  })
})


export default router