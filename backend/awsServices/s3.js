import { HeadBucketCommand, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '../awsConfig.js';



const bucketName = process.env.S3_BUCKET;

async function putObjToS3(userID, firstName, lastName, email) {
    const objectKey = `${userID}.json`;
    const userData = JSON.stringify({userID, firstName, lastName, email});

    const params = {
        Bucket:  bucketName,
        Key: objectKey,
        Body: userData,
        ContentType: 'application/json'
    };

    try {
        const command = new PutObjectCommand(params);
        const data = await s3.send(command);
        console.log("File uploaded to S3 bucket:", data);
        return data;
    } catch (error) {
        console.error("Error uploading to S3 bucket:", error);
        throw error;
    }
}

// function convert stream to a string
const streamToString = async (stream) => {
    const chunks = [];
    for await (const chunk of stream) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks).toString("utf-8");
}

async function getUserDataFromS3(userID) {
    const objectKey = `${userID}.json`

    const params = {
        Bucket: bucketName,
        Key: objectKey
    };

    try {
        const command = new GetObjectCommand(params);
        const data = await s3.send(command);
        if (!data.Body) {
            throw new Error("No data found in S3 object.");
        }
        //convert stream to string
        const bodyString = await streamToString(data.Body);
        console.log("User data retrieved from S3:", bodyString);
        return JSON.parse(bodyString);
    }catch (error) {
        console.error("Error retrieveing user data from S3:", error);
        throw error;
    }
    
}

async function checkS3Connection() {
    const params = {Bucket: bucketName}
    try {
        const command = new HeadBucketCommand(params);
        await s3.send(command);
        console.log("S3 bucket connection successful.");
        return true;
    } catch (error) {
        console.error("Error connecting to S3 bucket.", error.message);
        return false
    }
}

export { putObjToS3, getUserDataFromS3, checkS3Connection };
