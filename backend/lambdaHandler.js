
import {checkUserExists,
   addUserToTable, 
   getUserList, 
   deleteUser,
   updateUserInfo,
   getUserByID,
   importFromS3} from "./awsServices/dynamoDB.js";

export const handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    if(event.Records) {
      //Search for s3 event notifcation and extract event message details
      for (const record of event.Records) {
      const bucket = record.s3.bucket.name;
      const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
      const keyParts = key.split('/');
      console.log(`object created in bucket ${bucket} with key ${key}`);
      //ex; "key": "uploads/wencaiyang2%40csus.edu/2025_04_14/CDCR+2311+-+Background+Security+Clearance+Application.pdf",
      const userid = keyParts[1];
      const filename = keyParts[3];
      //Stores new object created in bucket
      await importFromS3(userid, filename, bucket, key);

      }
      body = { message: "S3 object metadata stored successfully." };
    }
     

    console.log("Received event:", JSON.stringify(event, null, 2));
    if (event.triggerSource === "PostConfirmation_ConfirmSignUp") {
        return await postSignUpTrigger(event)
    }
    switch (`${event.httpMethod} ${event.resource}`) { //.routekey is for HTTP API, use .httpMethod and .resource for REST API e.g., "GET" and "/Users"
      case "DELETE /User/{userID}":
        body = await deleteUser(event.pathParameters.userID)
        break;

      case "GET /User/{userID}":
        body = await getUserByID(event.pathParameters.userID)
        break;

      case "GET /Users":
        body = await getUserList(); 
        break;

      case "PUT /User/{userID}":
        const userData = JSON.parse(event.body);
        body = await updateUserInfo(event.pathParameters.userID, 
          userData.firstName, 
          userData.lastName, 
          userData.email);
        break;

      default:
        throw new Error(`Unsupported route: "${event.httpMethod} ${event.resource}"`);
    }
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers,
  };

};

export async function postSignUpTrigger(event) {
    console.log("Post Sign-Up confirmation");

    const userID = event.request.userAttributes.sub;
    const email = event.request.userAttributes.email;
    const firstName = event.request.userAttributes.given_name || "";
    const lastName = event.request.userAttributes.family_name || "";

    if (!userID || !email ) {
        console.error("Missing required user attributes");
        return event;
    }

    try {
       await addUserToTable(userID, firstName, lastName, email);
       console.log(`User ${userID} added to DynamoDB.` );
    } catch (error) {
        console.error("Error in postSignUpTrigger:", error);
        throw error;
    }

    return event;
}