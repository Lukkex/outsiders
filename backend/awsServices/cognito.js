import { AuthenticationDetails } from 'amazon-cognito-identity-js';
import { cognito, poolData } from '../awsConfig.js';
import { createHmac } from 'crypto';

/*
const poolData = {
    userPoolId: 'us-east-2_BKPaJxc2U',
    clientId: '3uck76gdq78repffumsd92jgiq'       
};

const userPool = new CognitoUserPool(poolData);

AWS.config.update({
    region: 'us-east-2',
});
*/

const signUp = async (payload) => {

    try {

        const first_name = payload.first_name;
        const last_name = payload.last_name;
        const username = payload.email;
        const password = payload.password;
        const confirm_password = payload.confirm_password;

        const hasher = createHmac('sha256', poolData.ClientSecret);
        hasher.update(`${username}${poolData.ClientId}`);
        const secretHash = hasher.digest('base64');

        if (password !== confirm_password) {
            console.log('Error during sign-up:', 'Passwords do not match');
            return;
        }

        const attributeList = [
            { Name: 'email', Value: username },
            { Name: 'given_name', Value: first_name },
            { Name: 'family_name', Value: last_name },
        ];

        const signUpPromise = (username, password, attributes, secretHash) => {
            return new Promise((resolve, reject) => {
                cognito.signUp(username, password, attributes, null, (err, result) => {
                    if (err) {
                        reject(err); // Pass the error to the caller
                    } else {
                        resolve(result); // Pass the result to the caller
                    }
                }, secretHash);
            });
        };

        const result = await signUpPromise(username, password, attributeList, secretHash);

        console.log('User signed up:', result.user.getUsername());

    } catch (error) {
        console.error('Error during sign-up:', error.message || error);
    }

};

const signIn = (payload) => {

    email = payload['email']
    password = payload['password']
    
    const authenticationDetails = new AuthenticationDetails({
        Username: email,
        Password: password,
    });

    const cognitoUser = new CognitoUser({
        Username: email,
        Pool: cognito,
    });

    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
            console.log('Access token:', result.getAccessToken().getJwtToken());
        },
        onFailure: (err) => {
            console.error(err.message || JSON.stringify(err));
        },
    });
    
};

export { signUp, signIn };