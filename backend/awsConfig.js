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

const awsCreds = {
    aws_project_region: "us-west-1",
    aws_cognito_region: "us-west-1",
    aws_user_pools_id: "us-east-1_ATVGJk4CW",
    aws_user_pools_web_client_id:"7jubasd14o6kf5co7vhvkavsbm"
};

export {s3, dynamoDB, awsCreds};

