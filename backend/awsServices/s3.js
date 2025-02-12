import { HeadBucketCommand, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '../awsConfig.js';
import fs from "fs";
import path from "path";

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

async function uploadPDFtoS3(filePath, folderName) {
    try {
        const fileStream = fs.createReadStream(filePath);
        const fileName = path.basename(filePath);

        const uploadParams = {
        Bucket: bucketName,
        Key: `${folderName}/${fileName}`,
        Body: fileStream,
        ContentType: "application/pdf",
        };

        const command = new PutObjectCommand(uploadParams);
        const response = await s3.send(command);

        console.log(`File uploaded successfully: ${uploadParams.Key}`);
        return response;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
}

  //const filePath = "./backend/CDCR_2301_B.pdf"; //from root directory (outsiders)
  //const folderName = "testuploads";
  
  //uploadPDFtoS3(filePath, folderName);

export { putObjToS3, getUserDataFromS3, checkS3Connection, uploadPDFtoS3, };
