import express from 'express'
import fs from 'fs'
import multiparty from 'multiparty'
import fileType from 'file-type'
import sharp from 'sharp'
import { v4 as uuidv4 } from 'uuid'

import { User } from '../models/User'
import { authMiddleware } from '../libs/middleware'
import { fetchSubstack, fetchMedium } from '../libs/integrations'
import db from '../libs/dynamo'
import s3 from '../libs/s3'
import sg from '../libs/sg'


const router = express.Router()
router.use(authMiddleware)

// PROFILE ROUTES //

// GET /protect/profile - get personal profile data
router.get('/profile', async (req, res) => {
  const { userId, email, lastLogin } = req.user as User

  const userRes = await db.get({
    TableName: 'users',
    Key: { userId: userId }
  })

  if (!(userRes.Item)) {
    // patch data from profiles table into users table
    console.log('patching in old data from profiles table...')
    const oldRes = await db.get({
      TableName: 'profiles',
      Key: { email: email }
    })

    const newRes = await db.update({
      TableName: 'users',
      Key: { userId: userId },
      UpdateExpression: "set username = :x, profile = :y, email = :z",
      ExpressionAttributeValues: {
        ":x": oldRes.Item.username,
        ":y": oldRes.Item.components,
        ":z": email
      },
      ReturnValues: "ALL_NEW"
    })

    res.status(200).json({
      userId: userId,
      email: email,
      username: newRes.Attributes.username,
      profile: newRes.Attributes.profile
    })

  } else {
    // send data directly from new users table
    res.status(200).json({
      userId: userId,
      email: email,
      username: userRes.Item.username,
      profile: userRes.Item.profile
    })
  }
})

// POST /protect/profile - update profile data for auth'd user
router.post('/profile', async (req, res) => {
  const { userId, email, lastLogin } = req.user as User

  // body: { profile: Profile }

  await db.update({
    TableName: 'users',
    Key: { userId: userId },
    UpdateExpression: "set username = :x, components = :y",
    ExpressionAttributeValues: {
      ":x": req.body.profile.username,
      ":y": req.body.profile.components
    }
  })

  res.status(200).send('successfully updated profile')
})

// POST /protect/upload-image - uploads a new image for a profile
// also need to try to delete profiles prev photo on new upload
router.post('/profile/image', async (req, res) => {
  const { userId, email, lastLogin } = req.user as User

  // first delete the existing headshot image
  const profile = await db.get({
    TableName: 'users',
    Key: { userId: userId }
  })
  // const profile = await db.get({
  //   TableName: "users",
  //   IndexName: "username-index",
  //   KeyConditionExpression: "username = :key",
  //   ExpressionAttributeValues: {
  //     ":key": username
  //   },
  //   ProjectionExpression: "username, components"
  // })

  if (profile.Item) {
    const image = profile.Item.components.find((comp: any) => comp.type === 'headshot').props.image
    await s3.delete({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `${image}`,
    })
  }

  const imageId = uuidv4()
  const form = new multiparty.Form()

  form.parse(req, async (err, fields, files) => {

    const buffer = fs.readFileSync(files.file[0].path)
    // const type = await fileType.fromBuffer(buffer)

    const img = await sharp(buffer)
      .resize(480, 480, { fit: 'inside' })
      .jpeg({ quality: 75 })
      .toBuffer()

    const resS3 = await s3.upload({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `images/${imageId}.jpg`,
      ACL: 'public-read',
      Body: img,
      CacheControl: 'max-age=604800'
    })

    res.status(200).json({ image: resS3.Key })

  })
})

router.post('/fetch-substack', async (req, res) => {
  const substackUrl = req.body.substackUrl
  const substack = await fetchSubstack(substackUrl)
  res.status(200).send(substack)
})

router.post('/fetch-medium', async (req, res) => {
  const mediumUrl = req.body.mediumUrl
  const medium = await fetchMedium(mediumUrl)
  res.status(200).send(medium)
})


// ONBOARDING/INVITED ROUTES //

// GET /protect/onboard/check - checks if a user has been onboarded
router.post('/onboard/check', async (req, res) => {
  const { userId, email, lastLogin } = req.user as User

  const data = await db.get({
    TableName: 'profiles',
    Key: { email: email }
  })

  if (data.Item !== undefined && data.Item !== null && 'username' in data.Item) {
    res.status(200).json({ onboarded: true, profile: data.Item })
  } else {
    res.status(200).json({ onboarded: false })
  }
})

// POST /protect/invite/check - checks if email has been invited
router.post('/invite/check', async (req, res) => {
  const { userId, email, lastLogin } = req.user as User

  const data = await db.get({
    TableName: 'invites',
    Key: { email: email }
  })

  if (data.Item !== undefined && data.Item !== null) {
    res.status(200).send(true) // this email has been invited
  } else {
    res.status(200).send(false) // this email has not been invited
  }
})


// POST /protect/invite - invite a new user
router.post('/invite', async (req, res) => {
  const { userId, email, lastLogin } = req.user as User

  const invitedEmail = req.body.invitedEmail

  // check if email in invites table
  const inviteData = await db.get({
    TableName: 'invites',
    Key: { email: invitedEmail }
  })

  // email has already been invited, end
  if (inviteData.Item !== undefined && inviteData.Item !== null) {
    res.status(200).json({ status: 'email already invited' })
    return
  }

  // put to invites table async
  await db.put({
    TableName: 'invites',
    Item: { email: invitedEmail }
  })

  // get sender data from profiles table
  const senderData = await db.get({
    TableName: 'profiles',
    Key: { email: email }
  })

  const name = senderData.Item.components.find((component: any ) => component.type === 'name').props.name

  await sg.send({
    to: invitedEmail,
    from: {'email': 'hello@corner.so', 'name' : 'Corner'},
    subject: `${name} invited you to join Corner`,
    text: 'Grab your own Corner of the Internet',
    html: `Your friend ${name} has invited you to join Corner, a place for young people with big ideas on the internet. <br/> <br/> Create your account by visiting <a href="https://corner.so">corner.so</a>.`,
  })

  res.status(200).json({ status: 'email sent' })

})


export default router