import express from 'express'
import CotterNode from 'cotter-node'
import CotterToken from 'cotter-token-js'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import cheerio from 'cheerio'

import { processSiteTitle, getModeAndFreq } from '../libs/utils'
import db from '../libs/dynamo'


const router = express.Router()

// // POST /public/login - handles login or signup
// router.post('/login', (req, res) => {

//   // Get access token from body
//   const access_token = req.body.oauth_token.access_token

//   // Validate access token
//   CotterNode
//     .CotterValidateJWT(access_token)
//     .then(valid => {
//       if (!valid) throw Error('Invalid access token')

//       console.log('token is valid, updating table')

//       // Get authId from decoded token and email from body
//       const decoded = new CotterToken.CotterAccessToken(access_token)
//       const authId = decoded.getClientUserID()
//       const email = req.body.email

//       // now add (or update if returning) user to db
//       db.update({
//         TableName: 'profiles',
//         Key: { email: email },
//         UpdateExpression: "set authId = :x",
//         ExpressionAttributeValues: {
//           ":x": authId
//         }
//       }).then(data => {

//         console.log('data from profiles tables after updating authId:', data)

//         // then check if the user has been invited
//         db.get({
//           TableName: 'invites',
//           Key: { email: email }
//         }).then(data => {
//           console.log('data from invites table ater getting email', data)
//           if (data.Item !== undefined && data.Item !== null) {
//             // person has been invited
//             res.status(200).send(true)
//           } else {
//             res.status(200).send(false)
//           }
//         }).catch(err => {
//           console.log(err)
//           res.status(500)
//         })
//       }).catch(err => {
//         console.log(err)
//         res.status(500).end(err)
//       })
//     })
//     .catch(err => {
//       console.log(err)
//       res.status(403).end(err)
//     })
// })


// POST /public/login - handles login or signup
router.post('/login', async (req, res) => {

  // Get access token from body
  const access_token = req.body.oauth_token.access_token

  const valid = await CotterNode.CotterValidateJWT(access_token)
  if (!valid) {
    res.status(403).end('Invalid Access Token')
  }

  // Get authId from decoded token and email from body
  const decoded = new CotterToken.CotterAccessToken(access_token)
  const authId = decoded.getClientUserID()
  const email = req.body.email

  const checkRes = await db.get({
    TableName: 'invites',
    Key: { email }
  })

  if (checkRes.Item !== undefined && checkRes.Item !== null) {
    // user does not exist, add to db
    await db.update({
      TableName: 'profiles',
      Key: { email },
      UpdateExpression: "set authId = :x, socialId = :y",
      ExpressionAttributeValues: {
        ":x": authId,
        ":y": uuidv4().toString()
      }
    })
  } else {
    // user exists, update authId
    await db.update({
      TableName: 'profiles',
      Key: { email },
      UpdateExpression: "set authId = :x",
      ExpressionAttributeValues: {
        ":x": authId
      }
    })
  }

  // check if user has been invited
  const inviteRes = await db.get({
    TableName: 'invites',
    Key: { email }
  })

  if (inviteRes.Item !== undefined && inviteRes.Item !== null) {
    // person has been invited
    res.status(200).send(true)
  } else {
    res.status(200).send(false)
  }

})


// GET /public/profile - public route to access profile information
router.get('/profile', (req, res, next) => {

  if (!('username' in req.query)) {
    res.status(200).send(false)
  }

  const username = req.query.username

  db.query({
    TableName: "profiles",
    IndexName: "username-index",
    KeyConditionExpression: "username = :key",
    ExpressionAttributeValues: {
      ":key": username
    },
    ProjectionExpression: "username, components"
  }).then(data => {
    if (data.Items.length < 1 || data.Items[0].username !== username) {
      res.status(200).send(false)
    } else {
      const profile = {
        username: data.Items[0].username,
        components: data.Items[0].components
      }
      res.status(200).send(profile)
    }
  }).catch(err => next(err))
})

// GET /public/all-profiles - public route to access all profiles
router.get('/all-profiles', (req, res) => {

  db.scan({
    TableName: 'profiles',
    ProjectionExpression: "username, components"
  }).then(data => {

    res.status(200).send(data.Items)

  }).catch(err => {
    console.log(err)
    res.status(500)
  })
})

// GET /public/availability/:username - public route to access profile information
router.get('/availability/:username', (req, res) => {

  const username = req.params.username

  db.query({
    TableName: "profiles",
    IndexName: "username-index",
    KeyConditionExpression: "username = :key",
    ExpressionAttributeValues: {
        ":key": username
    }
  }).then(data => {
    if (data.Items.length < 1 || data.Items[0].username !== username) {
      // username is available
      res.status(200).send(true)
    } else {
      // username is not available
      res.status(200).send(false)
    }
  }).catch(err => {
    console.log(err)
    res.status(500)
  })
})



// GET /public/employer/:url - gets employer data from url
router.get('/employer/:url', (req, res) => {

  // body: { url: url }
  // need domain.topleveldomain, ie google.com
  // req.params.url

  const parsedUrl = 'http://' + req.params.url

  axios.get(parsedUrl)
  .then(data => {

    const $ = cheerio.load(data.data)

    // scrape all of these, process them
    const title = $('head > title').text()
    const ogtitle = $("meta[property='og:title']").attr("content")
    const ogsitename = $("meta[property='og:site_name']").attr("content")

    const all = []
    if (title !== undefined && title !== null) {
      all.push(processSiteTitle(title))
    }
    if (ogtitle !== undefined && ogtitle !== null) {
      all.push(processSiteTitle(ogtitle))
    }
    if (ogsitename !== undefined && ogsitename !== null) {
      all.push(processSiteTitle(ogsitename))
    }

    const { mode, greatestFreq } = getModeAndFreq(all)

    let result: string
    if (greatestFreq > 1) {
      result = mode.trim()
    } else {
      all.sort((a,b) => a.length - b.length)
      result = all[0].trim()
    }

    res.status(200).send(result)
  })
  .catch(err => {
    res.status(200).send('')
  })

})


export default router


