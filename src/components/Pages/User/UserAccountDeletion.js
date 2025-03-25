// File: accountDeletion.js
const AWS = require("aws-sdk");

// Configure AWS SDK
AWS.config.update({
  region: "us-west-1", // Replace with your AWS region
});

// Initialize AWS services
const cognito = new AWS.CognitoIdentityServiceProvider();
const s3 = new AWS.S3();

// Function to delete an account
async function deleteAccount(username, userPoolId, bucketName) {
  try {
    // Step 1: Delete user from Cognito User Pool
    await cognito
      .adminDeleteUser({
        UserPoolId: userPoolId,
        Username: username,
      })
      .promise();
    console.log(`Deleted user ${username} from Cognito`);

    //Delete user's files from S3
    const listParams = {
      Bucket: bucketName,
      Prefix: `${username}/`, // Unsure if we use username as our prefix for tables
    };

    // List all objects under the prefix
    const listedObjects = await s3.listObjectsV2(listParams).promise();

    if (listedObjects.Contents.length > 0) {
      // Prepare objects for deletion
      const deleteParams = {
        Bucket: bucketName,
        Delete: {
          Objects: listedObjects.Contents.map((object) => ({
            Key: object.Key,
          })),
        },
      };

      // Deletes objects in S3
      await s3.deleteObjects(deleteParams).promise();
      console.log(`Deleted files for ${username} from S3 bucket ${bucketName}`);
    } else {
      console.log(`No files found for ${username} in S3 bucket ${bucketName}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Account and files deleted successfully." }),
    };
  } catch (error) {
    console.error("Error deleting account:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to delete account.",
        error: error.message,
      }),
    };
  }
}

const userPoolId = ""; // Replace with Cognito User Pool ID
const username = ""; // grab the users name (email) and insert here
const bucketName = ""; // Replace S3 bucket name

deleteAccount(username, userPoolId, bucketName).then((response) => console.log(response));
