const dotenv = require ("dotenv");
dotenv.config();
const { S3Client } = require ("@aws-sdk/client-s3");
const { DynamoDBClient } = require ("@aws-sdk/client-dynamodb");
const {DynamoDBDocumentClient} = require ("@aws-sdk/lib-dynamodb");


const s3 = new S3Client({ region: process.env.AWS_REGION });
const client = new DynamoDBClient({ region: process.env.AWS_REGION, credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },});
const dynamoDB = DynamoDBDocumentClient.from(client);
console.log("Loaded AWS_REGION:", process.env.AWS_REGION);
module.exports = {s3, dynamoDB};

