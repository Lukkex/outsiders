import { putObjToS3, getUserDataFromS3, checkS3Connection } from './awsServices/s3.js';
import { checkUserExists, addUserToTable } from './awsServices/user.js';
import { signUp, signIn } from './awsServices/cognito.js';

async function main() {
    /*
    const userID = "777";
    const firstName = "qwer";
    const lastName = "asdf";
    const email = "qwerasdf@exmaple.com";
    
    try {
        const isBucketConnected = await checkS3Connection();
        if (isBucketConnected == false) {
            return 
        } 

        const userExists = await checkUserExists(userID);
        if (userExists) {
            console.log(`User ${userID} already exists.`)
            return;
        } else {
            
            await putObjToS3(userID, firstName, lastName, email);
            console.log("User data upload to S3")

            //Short delay before getting object
            await new Promise(resolve => setTimeout(resolve, 2000));

            const userData = await getUserDataFromS3(userID);

            await addUserToTable(userData.userID, userData.firstName, userData.lastName, userData.email);
        }

        
    
    } catch (error) {
        console.error("Error in main function:", error);
    }
    */

    const payload_signup_data = {
        first_name: "William",
        last_name: "Lorence",
        email: "williamlorence@csus.edu",
        password: "eee",
        confirm_password: "eee"
    };

    const payload_signup_string = JSON.stringify(payload_signup_data);
    const payload_signup = JSON.parse(payload_signup_string);
    console.log(payload_signup);
    console.log(payload_signup.first_name);

    signUp(payload_signup);
}

main();

