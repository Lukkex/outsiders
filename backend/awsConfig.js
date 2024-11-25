import { S3Client } from "@aws-sdk/client-s3";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { CognitoUserPool } from "amazon-cognito-identity-js";
import dotenv from "dotenv";
dotenv.config();

const s3 = new S3Client({ region: process.env.AWS_REGION, 
    credentials:{accessKeyId: process.env.AWS_ACCESS_KEY, 
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY} });

const dynamoDB = new DynamoDBClient({ region: process.env.AWS_REGION, 
    credentials: {accessKeyId: process.env.AWS_ACCESS_KEY, 
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY} });

const poolData = {
            UserPoolId: 'us-east-2_DV3IxSuyC',
            ClientId: '33ehk4pmjrp7rfqudshm5t9fsk',
            ClientSecret: 'sj4cfd23l001jqh57k9citl2703rqks36cf724a5m6ndl8srsne',      
        };
        
const cognito = new CognitoUserPool(poolData);

export {s3, dynamoDB, cognito, poolData};

