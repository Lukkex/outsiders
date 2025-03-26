const { S3Client } = require ("@aws-sdk/client-s3");
const { DynamoDBClient } = require ("@aws-sdk/client-dynamodb");
const {DynamoDBDocumentClient} = require ("@aws-sdk/lib-dynamodb");
const dotenv = require ("dotenv");
dotenv.config();

const s3 = new S3Client({ region: process.env.AWS_REGION });
const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const dynamoDB = DynamoDBDocumentClient.from(client);

module.exports = {s3, dynamoDB};

