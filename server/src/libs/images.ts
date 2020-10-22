import multiparty from 'multiparty'
import sharp from 'sharp'
import { v4 as uuidv4 } from 'uuid'

import db from '../libs/dynamo'
import s3 from '../libs/s3'


// promisify multiparty.Form.parse to return [fields, files]
export const parseForm = (req: any) => new Promise<any>((resolve, reject) => {

  const form = new multiparty.Form()
  form.parse(req, (err, fields, files) => {
      if (err) return reject(err)
      return resolve([fields, files])
  })
})

// parallel delete images for a given userId
export const deleteImagesForUser = async (userId: string) => {

  const resUser = await db.get({
    TableName: 'users',
    Key: { userId: userId }
  })

  if (resUser.Item) {
    const imageId = resUser.Item.components.find((comp: any) => comp.type === 'headshot').props.image

    await Promise.all([
      s3.delete({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: `small/${imageId}`,
      }),
      s3.delete({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: `medium/${imageId}`,
      }),
      s3.delete({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: `large/${imageId}`,
      })
    ])

    return
  } else {
    return
  }
}

// parallel image resize and upload for small, medium, and large
export const uploadImagesForUser = async (buffer: Buffer) => {

  const imageId = uuidv4() + '.jpg'

  const [ smallImg, medImg, largeImg ] = await Promise.all([
    sharp(buffer)
      .resize(120, 120, {fit: 'cover'})
      .jpeg({ quality: 80 })
      .toBuffer(),
    sharp(buffer)
      .resize(480, 480, {fit: 'cover'})
      .jpeg({ quality: 90 })
      .toBuffer(),
    sharp(buffer)
      .resize(720, 720, {fit: 'cover'})
      .jpeg({ quality: 100 })
      .toBuffer()
  ])

  await Promise.all([
    s3.upload({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `small/${imageId}`,
      ACL: 'public-read',
      Body: smallImg,
      CacheControl: 'max-age=604800'
    }),
    s3.upload({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `medium/${imageId}`,
      ACL: 'public-read',
      Body: medImg,
      CacheControl: 'max-age=604800'
    }),
    s3.upload({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `large/${imageId}`,
      ACL: 'public-read',
      Body: largeImg,
      CacheControl: 'max-age=604800'
    }),
  ])

  return imageId
}
