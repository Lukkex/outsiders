import { fetchUserAttributes, getCurrentUser, fetchAuthSession, signOut } from "aws-amplify/auth";
import { CognitoIdentityProviderClient, ListUsersInGroupCommand } from "@aws-sdk/client-cognito-identity-provider";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";

const REGION = "us-west-1";
const USER_POOL_ID = "us-west-1_gp60TrWKN";
const IDENTITY_POOL_ID = "us-west-1:4820a351-3879-423b-93e0-6a28b3e92d4e";

async function getAuthenticatedCredentials() {
  const session = await fetchAuthSession();
  return fromCognitoIdentityPool({
      clientConfig: { region: REGION },
      identityPoolId: IDENTITY_POOL_ID,
      logins: {
          [`cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`]: session.tokens.idToken.toString(),
      },
  });
}

const cognitoClient = new CognitoIdentityProviderClient({
  region: REGION,
  credentials: await getAuthenticatedCredentials()
});

export async function getCurrentUserInfo() {
    try {
        const user = await getCurrentUser();
        const attributes = await fetchUserAttributes(); 

        console.log("Full User Object:", user);
        console.log("Fetched Attributes:", attributes);

        return {
            sub: attributes.sub || "No sub found",
            email: attributes.email || "No email found",
            given_name: attributes.given_name || "No given name found",
            family_name: attributes.family_name || "No family name found"
        };
    } catch (error) {
        console.error("Error fetching user info:", error);
        return null;
    }
}

export async function getUserRole() {
    try {
        const session = await fetchAuthSession();
        const accessToken = session.tokens?.accessToken;

        const roles = accessToken?.payload["cognito:groups"] || [];
        console.log("User roles:", roles);

        return roles;
    } catch (error) {
        console.error("Error fetching user role:", error);
        return [];
    }
}

export async function getAuthToken() {
    try {
        const session = await fetchAuthSession();
        console.log("Full Auth Session:", session);
        return session.tokens?.idToken?.toString() || null;
    } catch (error) {
        console.error("Error fetching auth token:", error);
        return null;
    }
}

export async function signOutUser() {
    try {
        await signOut();
    } catch (error) {
        console.error("Error signing out:", error);
    }
}


export async function fetchUsersInGroup(groupName) {
  try {
      console.log(`Fetching users in group: ${groupName}`);

      const command = new ListUsersInGroupCommand({
          UserPoolId: USER_POOL_ID,
          GroupName: groupName,
      });

      const response = await cognitoClient.send(command);
      console.log("Fetched users:", response.Users);

      return response.Users.map(user => ({
        given_name: user.Attributes.find(attr => attr.Name === "given_name")?.Value || "No First Name",
        family_name: user.Attributes.find(attr => attr.Name === "family_name")?.Value || "No Last Name",
        email: user.Attributes.find(attr => attr.Name === "email")?.Value || "No Email",
        preferred_prisons: user.Attributes.find(attr => attr.Name === "custom:preferred_prisons")?.Value || "Unknown",
        created_at: user.UserCreateDate
    }));
  } catch (error) {
      console.error("Error fetching users:", error);
      return [];
  }
}


