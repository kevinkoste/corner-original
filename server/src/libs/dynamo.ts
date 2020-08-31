import AWS from "aws-sdk"

const client = new AWS.DynamoDB.DocumentClient()

export default {
  get   : (params: AWS.DynamoDB.DocumentClient.GetItemInput) => client.get(params).promise(),
  put   : (params: AWS.DynamoDB.DocumentClient.PutItemInput) => client.put(params).promise(),
  query : (params: AWS.DynamoDB.DocumentClient.QueryInput) => client.query(params).promise(),
  update: (params: AWS.DynamoDB.DocumentClient.UpdateItemInput) => client.update(params).promise(),
  delete: (params: AWS.DynamoDB.DocumentClient.DeleteItemInput) => client.delete(params).promise(),
  scan  : (params: AWS.DynamoDB.DocumentClient.ScanInput) => client.scan(params).promise()
}