import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const dbClient = new DynamoDBClient({ region: "us-west-1" });
const ddb = DynamoDBDocumentClient.from(dbClient);
const cognito = new CognitoIdentityProviderClient({ region: "us-west-1" });
const USER_POOL_ID = "us-west-1_gp60TrWKN";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS,GET,POST,DELETE",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
};

export const handler = async (event) => {
  
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  try {
    if (event.httpMethod === "POST" && event.path?.endsWith("/get-user-names")) {
      return await handleGetUserNames(event);
    }

    if (event.httpMethod === "DELETE" && event.resource?.includes("/events/")) {
      return await handleDeleteEventRequest(event);
    }

    switch (event.httpMethod) {
      case "GET":
        return await handleGetRequest(event);
      case "POST":
        return await handlePostRequest(event);
      case "DELETE":
        return await handleDeleteRequest(event);
      default:
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ message: "Invalid request type" }),
        };
    }
  } catch (err) {
    console.error("Lambda Error:", err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: err.message }),
    };
  }
};

async function handleGetRequest(event) {
  let userID, eventId;

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    userID = body.userID || event.queryStringParameters?.userID;
    eventId = body.eventId || event.queryStringParameters?.eventId;
  } catch {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Invalid JSON body" }),
    };
  }

  if (userID) {
    const result = await ddb.send(new QueryCommand({
      TableName: "UserEvent",
      KeyConditionExpression: "userID = :uid",
      ExpressionAttributeValues: { ":uid": userID },
    }));
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(result.Items),
    };
  } else if (eventId) {
    const result = await ddb.send(new QueryCommand({
      TableName: "UserEvent",
      IndexName: "ByEventId",
      KeyConditionExpression: "eventId = :eid",
      ExpressionAttributeValues: { ":eid": eventId },
    }));
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(result.Items),
    };
  } else {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Missing userID or eventId" }),
    };
  }
}

async function handlePostRequest(event) {
  let userID, eventId;
  try {
    const body = JSON.parse(event.body || "{}");
    userID = body.userID;
    eventId = body.eventId;
  } catch {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Invalid JSON body" }),
    };
  }

  if (!userID || !eventId) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Missing userID or eventId" }),
    };
  }

  await ddb.send(new PutCommand({
    TableName: "UserEvent",
    Item: { userID, eventId },
  }));

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({ message: "RSVP successful!" }),
  };
}

async function handleDeleteRequest(event) {
  console.log("RAW DELETE body:", event.body);

  let userID, eventId;
  try {
    let body = event.body;
    if (typeof body === "string") {
      body = JSON.parse(body);
    }

    userID = body.userID;
    eventId = body.eventId;
  } catch (err) {
    console.error("Error parsing DELETE body:", err);
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Invalid JSON body" }),
    };
  }

  if (!userID || !eventId) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Missing userID or eventId" }),
    };
  }

  console.log(`Deleting RSVP for userID=${userID} and eventId=${eventId}`);

  try {
    await ddb.send(new DeleteCommand({
      TableName: "UserEvent",
      Key: { userID, eventId },
    }));

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Un-RSVP successful!" }),
    };
  } catch (err) {
    console.error("DynamoDB delete error:", err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Failed to delete RSVP" }),
    };
  }
}

async function handleDeleteEventRequest(event) {
  const eventID = event.pathParameters?.eventID;
  if (!eventID) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Missing eventID in path" }),
    };
  }

  // Delete the event from Events table
  await ddb.send(new DeleteCommand({
    TableName: "Events",
    Key: { eventID }
  }));

  // Delete all RSVPs for this event
  const rsvps = await ddb.send(new QueryCommand({
    TableName: "UserEvent",
    IndexName: "ByEventId",
    KeyConditionExpression: "eventId = :eid",
    ExpressionAttributeValues: { ":eid": eventID },
  }));

  await Promise.all(rsvps.Items.map(rsvp =>
    ddb.send(new DeleteCommand({
      TableName: "UserEvent",
      Key: { userID: rsvp.userID, eventId: eventID },
    }))
  ));

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({ message: "Event and RSVPs deleted successfully." }),
  };
}

async function handleGetUserNames(event) {
  let userIDs = [];
  try {
    const body = JSON.parse(event.body || "{}");
    userIDs = body.userIDs || [];
  } catch {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Invalid JSON body" }),
    };
  }

  const results = await Promise.all(userIDs.map(async (sub) => {
    try {
      const { Users } = await cognito.send(new ListUsersCommand({
        UserPoolId: USER_POOL_ID,
        Filter: `sub = "${sub}"`,
        Limit: 1,
      }));

      if (Users.length > 0) {
        const attrs = Users[0].Attributes;
        const getAttr = (name) => attrs.find(a => a.Name === name)?.Value;
        const given = getAttr("given_name");
        const family = getAttr("family_name");
        const email = getAttr("email");
        const displayName = given && family ? `${given} ${family}` : given || email || sub;
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
