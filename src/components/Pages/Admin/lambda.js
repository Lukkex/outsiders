import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import {
  CognitoIdentityProviderClient,
  AdminGetUserCommand,
  ListUsersCommand
  
} from "@aws-sdk/client-cognito-identity-provider";

// DynamoDB & Cognito setup
const dbClient = new DynamoDBClient({ region: "us-west-1" });
const ddb = DynamoDBDocumentClient.from(dbClient);
const cognito = new CognitoIdentityProviderClient({ region: "us-west-1" });
const USER_POOL_ID = "us-west-1_gp60TrWKN";

// Shared CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS,GET,POST,DELETE",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
};

export const handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  // Debug logging: see CloudWatch for these
  console.log("resource:", event.resource);
  console.log("resourcePath:", event.requestContext.resourcePath);

  let response;
  try {
    // Route to name-lookup if the resource matches
    if (
      event.httpMethod === "POST" &&
      (event.path?.endsWith("/get-user-names") || event.resource?.endsWith("/get-user-names"))
    ) {
      response = await handleGetUserNames(event);
    } else {
      // Otherwise handle the standard RSVP routes
      switch (event.httpMethod) {
        case "GET":
          response = await handleGetRequest(event);
          break;
        case "POST":
          response = await handlePostRequest(event);
          break;
        case "DELETE":
          response = await handleDeleteRequest(event);
          break;
        default:
          response = {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ message: "Invalid request type" })
          };
      }
    }
  } catch (err) {
    // Return CORS headers even on unexpected errors
    response = {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: err.message })
    };
  }

  return response;
};

async function handleGetRequest(event) {
  const body = event.body ? JSON.parse(event.body) : {};
  const userID = body.userID || event.queryStringParameters?.userID;
  const eventId = body.eventId || event.queryStringParameters?.eventId;

  if (userID) {
    // Query all RSVPs by userID
    const result = await ddb.send(new QueryCommand({
      TableName: "UserEvent",
      KeyConditionExpression: "userID = :uid",
      ExpressionAttributeValues: { ":uid": userID }
    }));
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(result.Items)
    };
  } else if (eventId) {
    // Query by eventId via GSI "ByEventId"
    const result = await ddb.send(new QueryCommand({
      TableName: "UserEvent",
      IndexName: "ByEventId",
      KeyConditionExpression: "eventId = :eid",
      ExpressionAttributeValues: { ":eid": eventId }
    }));
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(result.Items)
    };
  } else {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Missing userID or eventId" })
    };
  }
}

async function handlePostRequest(event) {
  const { userID, eventId } = JSON.parse(event.body || "{}");

  if (!userID || !eventId) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Missing userID or eventId" })
    };
  }

  await ddb.send(new PutCommand({
    TableName: "UserEvent",
    Item: { userID, eventId }
  }));

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({ message: "RSVP successful!" })
  };
}

async function handleDeleteRequest(event) {
  const { userID, eventId } = JSON.parse(event.body || "{}");

  if (!userID || !eventId) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Missing userID or eventId" })
    };
  }

  await ddb.send(new DeleteCommand({
    TableName: "UserEvent",
    Key: { userID, eventId }
  }));

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({ message: "Un-RSVP successful!" })
  };
}

async function handleGetUserNames(event) {
  const { userIDs } = JSON.parse(event.body || "{}");
  const results = await Promise.all(userIDs.map(async sub => {
    try {
      const { Users } = await cognito.send(new ListUsersCommand({
        UserPoolId: USER_POOL_ID,
        // filter on the "sub" attribute
        Filter: `sub = "${sub}"`,
        Limit: 1
      }));
      if (Users.length > 0) {
        const attrs = Users[0].Attributes;
        const getAttr = name => attrs.find(a => a.Name === name)?.Value;
        const given  = getAttr("given_name");
        const family = getAttr("family_name");
        const email  = getAttr("email");
        const displayName = given && family
          ? `${given} ${family}`
          : given || email || sub;
        return { userID: sub, name: displayName };
      } else {
        return { userID: sub, name: sub };
      }
    } catch {
      return { userID: sub, name: sub };
    }
  }));

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify(results),
  };
}