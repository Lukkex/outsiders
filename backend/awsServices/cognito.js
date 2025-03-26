import { CognitoIdenityProviderClient, SignUpCommand, ConfirmSignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { Pass } from "aws-cdk-lib/aws-stepfunctions";
import dotenv from "dotenv";

const client = new CognitoIdenityProviderClient({region: process.env.AWS_REGION});
const clientId = process.env.CLIENT_ID
async function signUp(email, password) {
    params = {
        ClientId: clientId,
        Username: email,
        Password: password,
        UserAttributes: [{
            Name: "email"
        }]
    };
    try {
        const command = new SignUpCommand(params);
        const response = await client.send(command);

        const userConfirmed = response.UserConfirmed;
        const userUID = response.UserSub;
        const codeDetail = response.CodeDeliveryDetails;

        return response;
    } catch (error) {
        throw new Error(error.message);
    }
    
};

async function confirmSignUp(email, confirmationCode) {
    const params = {
        ClientId: clientId,
        Username: email,
        ConfirmationCode: confirmationCode,
    };
    try {
        const command = new ConfirmSignUpCommand(params);
        const response = await client.send(command);
    } catch (error) {
        throw new Error(error.message);
    }
};

export {signUp, confirmSignUp};