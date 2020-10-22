import express from 'express'
import fs from 'fs'

import { User } from '../models/User'
import { authMiddleware } from '../libs/middleware'
import { fetchSubstack, fetchMedium } from '../libs/integrations'
import { parseForm, deleteImagesForUser, uploadImagesForUser } from '../libs/images'
import db from '../libs/dynamo'
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
  const profile = req.body.profile

  await db.update({
    TableName: 'users',
    Key: { userId: userId },
    UpdateExpression: "set username = :x, components = :y",
    ExpressionAttributeValues: {
      ":x": profile.username,
      ":y": profile.components
    }
  })

  res.status(200).send('successfully updated profile')
})

// POST /protect/upload-image - uploads a new image for a profile
// also need to try to delete profiles prev photo on new upload
router.post('/profile/image', async (req, res) => {
  const { userId, email, lastLogin } = req.user as User

  const [fields, files] = await parseForm(req)
  const buffer = fs.readFileSync(files.file[0].path)

  const [ _, imageId ] = await Promise.all([
    deleteImagesForUser(userId),
    uploadImagesForUser(buffer)
  ])

  res.status(200).json({ image: imageId })

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
  const { email } = req.user as User

  const data = await db.get({
    TableName: 'invites',
    Key: { email: email }
  })

  if (data.Item) {
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

  if (inviteData.Item) {
    // email has already been invited
    return res.status(200).send(false)
  } else {
    // successful invite, send response then continue below
    res.status(200).send(true)
  }

  // put to invites table async
  await db.put({
    TableName: 'invites',
    Item: { email: invitedEmail }
  })

  // update invited list for sender, and get name in response
  const senderData = await db.update({
    TableName: 'users',
    Key: { userId: userId },
    UpdateExpression: 'set #invited = list_append(if_not_exists(#invited, :empty_list), :invite)',
    ExpressionAttributeNames: {
      '#invited': 'invited'
    },
    ExpressionAttributeValues: {
      ':invite': [{
        email: invitedEmail,
        timestamp: Date.now()
      }],
      ':empty_list': []
    },
    ReturnValues: "ALL_NEW"
  })

  const name = senderData.Attributes.components.find((component: any ) => component.type === 'name').props.name

  await sg.send({
    to: invitedEmail,
    from: {'email': 'hello@corner.so', 'name' : 'Corner'},
    subject: `${name} invited you to join Corner`,
    text: `Curate your internet presence`,
    html: `
      Your friend ${name} has invited you to join Corner.
      <br/><br/>
      Visit <a href="https://corner.so">corner.so</a> to start.
    `
  })

})


export default router