import express from 'express'
import CotterNode from 'cotter-node'
import CotterToken from 'cotter-token-js'

import db from '../libs/dynamo'

const router = express.Router()

// POST /public/login - handles login or signup
router.post('/login', (req, res) => {

  // Get access token from body
  const access_token = req.body.oauth_token.access_token

  // Validate access token
  CotterNode
    .CotterValidateJWT(access_token)
    .then(valid => {
      if (!valid) throw Error('Invalid access token')

      console.log('token is valid, updating table')

      // Get authId from decoded token and email from body
      const decoded = new CotterToken.CotterAccessToken(access_token)
      const authId = decoded.getClientUserID()
      const email = req.body.email

      // now add (or update if returning) user to db
      db.update({
        TableName: 'profiles',
        Key: { email: email },
        UpdateExpression: "set authId = :x",
        ExpressionAttributeValues: {
          ":x": authId
        }
      }).then(data => {

        console.log('data from profiles tables after updating authId:', data)

        // then check if the user has been invited
        db.get({
          TableName: 'invites',
          Key: { email: email }
        }).then(data => {
          console.log('data from invites table ater getting email', data)
          if (data.Item !== {}) {
            // person has been invited
            res.status(200).send(true)
          } 
          res.status(200).send(false)
        }).catch(err => {
          console.log(err)
          res.status(500)
        })
      }).catch(err => {
        console.log(err)
        res.status(500).end(err)
      })
    })
    .catch(err => {
      console.log(err)
      res.status(403).end(err)
    })
})


// GET /public/profile/:username - public route to access profile information
router.get('/profile/:username', (req, res) => {

  const username = req.params.username

  db.query({
    TableName: "profiles",
    IndexName: "username-index",
    KeyConditionExpression: "username = :key",
    ExpressionAttributeValues: {
        ":key": username
    }
  }).then(data => {
    console.log(data)
    if (data.Items.length < 1 || data.Items[0].username !== username) {
      res.status(404).send('Profile not found')
    } else {
      const profile = {
        username: data.Items[0].username,
        components: data.Items[0].components
      }
      res.status(200).send(profile)
    }
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
    console.log(data)
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

export default router


