import {gethUserList } from "./awsServices/dynamoDB.js";

exports.handler = async (event) => {
    try {
        const users = await gethUserList();
        return {
            statusCode: 200,
            body: JSON.stringify(users),
            headers: {"Content-Type": "application/json"}
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({error: "Could not retrieve user data"})
        }
    }
}