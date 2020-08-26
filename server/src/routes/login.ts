import express from 'express'
import cotterNode from 'cotter-node'
import cotterToken from 'cotter-token-js'

// import db from '../libs/dynamo'
// import s3 from '../libs/s3'

const router = express.Router()

// EXAMPLE LOGIN ENDPOINT
router.post('/login', (req, res) => {
  console.log(req.body)

  // Validate access token
  const access_token = req.body.oauth_token.access_token;

  cotterNode
    .CotterValidateJWT(req.body.oauth_token.access_token)
    .then(valid => {
      if (!valid) throw Error('Invalid access token')

      const decoded = new cotterToken.CotterAccessToken(access_token)
      res.status(200).json(decoded.payload).end()
    })
    .catch(err => {
      res.status(403).end(err)
    })

  // try {
  //   valid = await cotterNode.CotterValidateJWT(access_token);
  // } catch (e) {
  //   valid = false;
  // }
  // if (!valid) {
  //   res.status(403).end("Invalid access token");
  //   return;
  // }

  // (Optional) Read access token
  // let decoded = new cotterToken.CotterAccessToken(access_token);
  // console.log(decoded);
    
  // (Optional) Register or Login User

  // (Optional) Set access token as cookie
  
})



// TO VALIDATE LATER ON:
// // Install Dependency
// yarn add cotter-node

// // Validate token
// import { CotterValidateJWT } from "cotter-node";

// try {
//   var valid = await CotterValidateJWT(token);
// } catch (e) {
//   console.log(e);
// }


export default router


