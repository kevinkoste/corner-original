import AWS from 'aws-sdk'

const s3 = new AWS.S3()

export default {
  upload: (params: AWS.S3.PutObjectRequest) => s3.upload(params).promise(),
  delete: (params: AWS.S3.DeleteObjectRequest) =>
    s3.deleteObject(params).promise(),
}
