
import {checkUserExists,
   addUserToTable, 
   getUserList, 
   deleteUser,
   updateUserInfo,
   getUserByID} from "./awsServices/dynamoDB.js";

export const handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  try {
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