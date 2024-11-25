import { GetItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { dynamoDB } from '../awsConfig.js';

const tableName = process.env.DYNAMODB_USER_TABLE;

async function checkUserExists(userID) {
    
    const params = {
        TableName: tableName,
        Key: {
            userID: { S: userID} //the S specify attribute type as string, capitalized
        }
    };
    
    try {
        const command = new GetItemCommand(params);
        const data = await dynamoDB.send(command);
        return !!data.Item;
        /*
        if(data.Item) {
            return true //user exists in database
        }
        else return false; //user does not exists, then process
        */
    } catch (error) {
        console.error("Error checking if user exists:", error);
        throw error;
    }
}

async function addUserToTable(userID, firstName, lastName, email, hashedPassword) {
    const params = {
        TableName: tableName,
        Item: {
            userID: { S: userID},
            firstName: { S: firstName},
            lastName: { S: lastName},
            email: { S: email},
            password: { S: hashedPassword}
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

export { checkUserExists, addUserToTable };

