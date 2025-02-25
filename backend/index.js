import { putObjToS3, getUserDataFromS3, checkS3Connection } from './awsServices/s3.js';
import { checkUserExists, addUserToTable, fetchUserList } from './awsServices/dynamoDB.js';
import express from "express";
import dotenv from "dotenv";
dotenv.config();

async function main() {
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
    
    const app = express();
    const PORT = process.env.PORT || 5000;

    app.get("wen-Test-stage", async (req, res) => {
        try {
            const response = await fetch("https://any99dk2qk.execute-api.us-west-1.amazonaws.com/wen-Test-stage");

            if (!response.ok) throw Error("Failed to fetch users from gateway");
            const users = await response.json();
            res.json(users);
        } catch (error) {
            console.error("Error getting user list:", error);
            res.status(500).json({ error: "Failed to retrieve users" });
        }
    });

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

}

main();

