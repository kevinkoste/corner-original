import express from 'express'
import CotterNode from 'cotter-node'
import CotterToken from 'cotter-token-js'

import db from '../libs/dynamo'

const router = express.Router()

// public/login - handles login or signup
router.post('/login', (req, res) => {

  // Get access token from body
  const access_token = req.body.oauth_token.access_token

  // Validate access token
  CotterNode
    .CotterValidateJWT(access_token)
    .then(valid => {
      if (!valid) throw Error('Invalid access token')

      // Get authId from decoded token and email from body
      const decoded = new CotterToken.CotterAccessToken(access_token)
      const authId = decoded.getClientUserID()
      const email = req.body.email

      console.log('authId is:', authId)
      console.log('email is:', email)

      // now check if user exists in the db based on email
      db.get({
        TableName: 'profiles',
        Key: { email: email }
      }).then(data => {
        console.log('db get result:', data)

        // if email doesn't exist, put new Item to db and tell client to onboard (successful signup)
        if (isEmpty(data)) {
          db.put({
            TableName: 'profiles',
            Item: {
              email: email,
              authId: authId,
            }
          }).then(data => {
            res.status(200).send('Onboard this fool!')
          }).catch(err => {
            console.log(err)
            res.status(500)
          })

        // if email exists and token matches, send 200 and do nothing (successful login)
        } else if (data.Item.authId === authId) {
          res.status(200).send('Successful login')

        // item exists but token doesnt match... not sure what to do here yet.
        } else {
          res.status(200).send('Successful login, but your token is ass')
        }
  
      }).catch(err => {
        console.log(err)
        res.status(500)
      })
    })
    .catch(err => {
      res.status(403).end(err)
    })
})

const isEmpty = (obj: Object): boolean => {
  return Object.keys(obj).length === 0 && obj.constructor === Object
}


// public/profile/:username - public route to access profile information
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
        data: data.Items[0].data
      }
      res.status(200).send(profile)
    }
  }).catch(err => {
    console.log(err)
    res.status(500)
  })
})

export default router


