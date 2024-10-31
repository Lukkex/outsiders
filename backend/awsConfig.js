import { S3Client } from "@aws-sdk/client-s3";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import dotenv from "dotenv";
dotenv.config();

const s3 = new S3Client({ region: process.env.AWS_REGION, 
    credentials:{accessKeyId: process.env.AWS_ACCESS_KEY, 
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY} });
const dynamoDB = new DynamoDBClient({ region: process.env.AWS_REGION, 
    credentials: {accessKeyId: process.env.AWS_ACCESS_KEY, 
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY} });

export {s3, dynamoDB};

