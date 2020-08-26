import express from 'express'
import multiparty from 'multiparty'
import fileType from 'file-type'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'

import db from '../libs/dynamo'
import s3 from '../libs/s3'

const router = express.Router()

router.get('/:username', (req, res) => {

  db.get({
    TableName: "profiles",
    Key: { username: req.params.username }
  }).then(data => {
    console.log(data)
    res.status(200).send(data.Item)
  }).catch(err => {
    console.log(err)
    res.status(500)
  })

})

router.post('/', (req, res) => {

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

router.post('/upload-image', (req, res) => {

  console.log('handling image upload')

  const name = uuidv4()
  const form = new multiparty.Form()

  form.parse(req, async (err, fields, files) => {

    const buffer = fs.readFileSync(files.file[0].path)
    const type = await fileType.fromBuffer(buffer)

    s3.upload({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `images/${name}.${type.ext}`,
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