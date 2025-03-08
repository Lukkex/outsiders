import { S3Client } from "@aws-sdk/client-s3";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {DynamoDBDocumentClient} from "@aws-sdk/lib-dynamodb";
import dotenv from "dotenv";
dotenv.config();

const s3 = new S3Client({ region: process.env.AWS_REGION });
const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const dynamoDB = DynamoDBDocumentClient.from(client);

export {s3, dynamoDB};

