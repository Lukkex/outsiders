import { DeleteItemCommand, 
    GetItemCommand, 
    PutItemCommand, 
    ScanCommand, 
    UpdateItemCommand } from '@aws-sdk/client-dynamodb';
    
import { dynamoDB } from '../awsConfig.js';


async function checkUserExists(userID) {
    const params = {
        TableName: "userTable",
        Key: {
            userID 
        }
    };
    
    try {
        const command = new GetItemCommand(params);
        const data = await dynamoDB.send(command);
        if(data.Item) {
            return true 
        }
        else return false; 
    } catch (error) {
        console.error("Error checking if user exists:", error);
        throw error;
    }
}

async function addUserToTable(userID, firstName, lastName, email) {
    const params = {
        TableName: "userTable",
        Item: { 
            userID,
            firstName,
            lastName,
            email,
        }
    };

    try {
        const command = new PutItemCommand(params);
        const data = await dynamoDB.send(command);
        return data;
    } catch (error) {
        console.error("Error adding user data to DynamoDB:", error)
        throw error;
    }
}

async function getUserByID(userID) {
    const params = {
        TableName: "userTable",
        Key: {
            userID
        }
    };

    try {
        const command = new GetItemCommand(params);
        const data = await dynamoDB.send(command);
        return data.Item;
    } catch (error) {
        console.error("Error retrieving user information:", error);
        throw error;
    }
}

async function getUserList() {
    const params = { TableName: "userTable"};

    try{
        const command = new ScanCommand(params);
        const response = await dynamoDB.send(command);
        //Return empty array if no items found
        if (!response.Items || response.Items.length === 0) {
            return [];
        }
        return response.Items;
    } catch(error) {
        console.error("Error retrieving list of users:", error);
        return [];
    }
}

async function updateUserInfo(userID, firstName, lastName, email) {
    if (!userID) {
        throw new Error("UserID is required for updating user information.");
    }

    //Prepare update field dynamically
    let updateFields = [];
    let expressionAttributeValues = {};
    //Check which field is being updated, add to updateField only if value is provided
    if (firstName) {
        updateFields.push("firstName = :fn"); //:fn is a placehold that hold new value for firstName
        expressionAttributeValues[":fn"] = firstName;
    }
    if (lastName) {
        updateFields.push("lastName = :ln");
        expressionAttributeValues[":ln"] = lastName;
    }
    if (email) {
        updateFields.push("email = :email");
        expressionAttributeValues[":email"] = email;
    }
    //Ensures field are not empty
    if (updateFields.length === 0) {
        throw new Error("Field must not be empty!");
    }
    //Builds the UpdateExpression string  Ex: "SET firstName = :fn, lastName = :ln"
    const updateExpression = "SET " + updateFields.join(",");

    const params = {
        TableName: "userTable",
        Key: { userID: userID }, 
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: "ALL_NEW" //Returns the updated items
    };

    try {
        const command = new UpdateItemCommand(params);
        const response = await dynamoDB.send(command);
        console.log("User information updated:", response.Attributes);
        return response.Attributes;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
}

async function deleteUser(userID) {
    const params = {
        TableName: "userTable",
        Key: {userID: userID}
    };

    try {
        const command = new DeleteItemCommand(params);
        await dynamoDB.send(command);
        console.log(`User ${userID} deleted successfully.`);
    } catch(error) {
        console.error("Error deleting user:", error);
        throw error;
    }
}

export { checkUserExists, addUserToTable, getUserList, deleteUser, updateUserInfo, getUserByID};

