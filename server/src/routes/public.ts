import express from 'express'
import axios from 'axios'
import cheerio from 'cheerio'

import { processSiteTitle, getModeAndFreq } from '../libs/utils'
import db from '../libs/dynamo'

const router = express.Router()

// GET /public/profile - public route to access profile information
router.get('/profile', async (req, res, next) => {

  if (!('username' in req.query)) {
    return res.status(200).send(false)
  }

  const username = req.query.username

  const data = await db.query({
    TableName: "profiles",
    IndexName: "username-index",
    KeyConditionExpression: "username = :key",
    ExpressionAttributeValues: {
      ":key": username
    },
    ProjectionExpression: "username, components"
  })

  if (data.Items.length < 1 || data.Items[0].username !== username) {
    res.status(200).send(false)
  } else {
    const profile = {
      username: data.Items[0].username,
      components: data.Items[0].components
    }
    res.status(200).send(profile)
  }
})

// GET /public/all-profiles - public route to access all profiles
router.get('/all-profiles', async (req, res) => {

  const data = await db.scan({
    TableName: 'profiles',
    ProjectionExpression: "username, components"
  })

  if (data.Items) {
    res.status(200).send(data.Items)
  } else {
    res.status(500)
  }
})

// GET /public/availability - public route to test username availability
router.get('/availability', async (req, res) => {

  if (!('username' in req.query)) {
    return res.status(200).send(false)
  }
  const username = req.query.username

  const data = await db.query({
    TableName: "profiles",
    IndexName: "username-index",
    KeyConditionExpression: "username = :key",
    ExpressionAttributeValues: {
        ":key": username
    }
  })

  if (data.Items.length < 1 || data.Items[0].username !== username) {
    // username is available
    res.status(200).send(true)
  } else {
    // username is not available
    res.status(200).send(false)
  }
})


// GET /public/employer/:url - gets employer data from url
router.get('/employer', async (req, res) => {

  if (!('domain' in req.query)) {
    return res.status(200).send(false)
  }
  const parsedDomain = 'http://' + req.query.domain

  const page = await axios.get(parsedDomain)

  const $ = cheerio.load(page.data)

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


export default router


