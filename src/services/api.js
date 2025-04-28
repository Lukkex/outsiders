import { fetchAuthSession } from "aws-amplify/auth";

export const getUploadUrl = async (fileName, user) => {
    try {
        const apiEndpoint = "https://1emayg1gl7.execute-api.us-west-1.amazonaws.com/dev/upload";

        const session = await fetchAuthSession();
        const sessionToken = session.tokens.idToken;

        // Construct Authorization Header
        const headers = {
            "Content-Type": "application/json",
            "x-amz-security-token": sessionToken, // Required for temporary credentials
        };

        const response = await fetch(apiEndpoint, {
            mode: 'no-cors',
            method: "POST",
            headers,
            body: JSON.stringify({ fileName, user }),
        });

        if (!response.ok) {
            throw new Error("Failed to get upload URL");
        }

        const data = await response.json();
        return data.uploadURL;
    } catch (error) {
        console.error("Error fetching upload URL:", error);
        return null;
    }
};