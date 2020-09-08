import express from 'express'
import multiparty from 'multiparty'
import fileType from 'file-type'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'

import db from '../libs/dynamo'
import s3 from '../libs/s3'
import sg from '../libs/sg'
import { authMiddleware } from '../libs/middleware'
import { fetchSubstack, fetchMedium } from '../libs/integrations'

const router = express.Router()
router.use(authMiddleware)

// PROFILE ROUTES //

// POST /protect/profile - update profile data for auth'd user
router.post('/profile', async (req, res) => {

  // body: {email: email, authId: authId, profile: Profile}

  await db.update({
    TableName: 'profiles',
    Key: { email: req.body.email },
    UpdateExpression: "set username = :x, components = :y",
    ExpressionAttributeValues: {
      ":x": req.body.profile.username,
      ":y": req.body.profile.components
    }
  })

  res.status(200).send('successfully updated profile')


  // db.update({
  //   TableName: 'profiles',
  //   Key: { email: req.body.email },
  //   UpdateExpression: "set username = :x, components = :y",
  //   ExpressionAttributeValues: {
  //     ":x": req.body.profile.username,
  //     ":y": req.body.profile.components
  //   }
  // }).then(data => {
  //   console.log('response from db update', data)
  //   res.status(200).send('successfully updated profile')
  // }).catch(err => {
  //   console.log(err)
  //   res.status(500).end('failed to update profile')
  // })

})

// POST /protect/upload-image - uploads a new image for a profile
// also need to try to delete profiles prev photo on new upload
router.post('/upload-image/:username', async (req, res) => {

  // body: {username: username, formData: formData}
  const username = req.params.username

  // first delete the existing headshot image
  const profile = await db.query({
    TableName: "profiles",
    IndexName: "username-index",
    KeyConditionExpression: "username = :key",
    ExpressionAttributeValues: {
      ":key": username
    },
    ProjectionExpression: "username, components"
  })

  if (profile.Items.length >= 1) {
    const image = profile.Items[0].components.find((comp: any) => comp.type === 'headshot').props.image
    await s3.delete({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `${image}`,
    })
    console.log('just deleted image with name:', image)
  }


  const imageId = uuidv4()
  const form = new multiparty.Form()

  form.parse(req, async (err, fields, files) => {

    const buffer = fs.readFileSync(files.file[0].path)
    const type = await fileType.fromBuffer(buffer)

    const data = await s3.upload({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `images/${imageId}.${type.ext}`,
      ACL: 'public-read',
      Body: buffer,
    })

    res.status(200).json({ image: data.Key })

  })
})

router.post('/fetch-substack', async (req, res) => {
  const substackUrl = req.body.substackUrl
  const substack = await fetchSubstack(substackUrl)
  res.status(200).send(substack)

  // fetchSubstack(substackUrl)
  // .then(substack => {
  //   res.status(200).send(substack)
  // }).catch(err => {
  //   console.log(err)
  //   res.status(500).end('failed to add substack')
  // })
})

router.post('/fetch-medium', async (req, res) => {
  const mediumUrl = req.body.mediumUrl
  const medium = await fetchMedium(mediumUrl)
  res.status(200).send(medium)

  // fetchMedium(mediumUrl)
  // .then(medium => {
  //   res.status(200).send(medium)
  // }).catch(err => {
  //   console.error(err)
  //   res.status(500).end('failed to add medium')
  // })
})


// ONBOARDING/INVITED ROUTES //

// GET /protect/onboard/check - checks if a user has been onboarded
router.post('/onboard/check', async (req, res) => {

  const data = await db.get({
    TableName: 'profiles',
    Key: { email: req.body.email }
  })

  if (data.Item !== undefined && data.Item !== null && 'username' in data.Item) {
    res.status(200).json({ onboarded: true, profile: data.Item })
  } else {
    res.status(200).json({ onboarded: false })
  }
})

// POST /protect/invite/check - checks if email has been invited
router.post('/invite/check', async (req, res) => {

  const email = req.body.email

  const data = await db.get({
    TableName: 'invites',
    Key: { email }
  })

  if (data.Item !== undefined && data.Item !== null) {
    res.status(200).send(true) // this email has been invited
  } else {
    res.status(200).send(false) // this email has not been invited
  }
})


// POST /protect/invite - invite a new user
router.post('/invite', async (req, res) => {

  const invitedEmail = req.body.invitedEmail
  const senderEmail = req.body.senderEmail

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
    Key: { email: senderEmail }
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



  // // check if email in invites table
  // db.get({
  //   TableName: 'invites',
  //   Key: { email: invitedEmail }
  // }).then(data => {
  //   if (data.Item !== undefined && data.Item !== null) {
  //     // email has already been invited, dont send invite
  //   } else {
  //     // email has not been invited, do things
  //     db.put({
  //       TableName: 'invites',
  //       Item: { email: invitedEmail }
  //     })
  //     .then(data => console.log('response from db put', data))
  //     .catch(err => console.log(err))
    
  //     // get inviter name and send email
  //     db.get({
  //       TableName: 'profiles',
  //       Key: { email: senderEmail }
  //     }).then(data => {
    
  //       const name = data.Item.components.find((component: any ) => component.type === 'name').props.name
    
  //       sg.send({
  //         to: invitedEmail,
  //         from: {'email': 'hello@corner.so', 'name' : 'Corner'},
  //         subject: `${name} invited you to join Corner`,
  //         text: 'Grab your own Corner of the Internet',
  //         html: `Your friend ${name} has invited you to join Corner, a place for young people with big ideas on the internet. <br/> <br/> Create your account by visiting <a href="https://corner.so">corner.so</a>.`,
  //       }).then(data => {
  //         console.log('response from sendgrid', data)
  //         res.status(200)
  //       }).catch(err => {
  //         console.log('sendgrid error', err)
  //         res.status(500)
  //       })
    
  //     }).catch(err => {
  //       console.log(err)
  //       res.status(500)
  //     })
  //   }
  // }).catch(err => {
  //   console.log(err)
  //   res.status(500)
  // })

})


export default router