import {
    fetchUserAttributes,
    getCurrentUser,
    fetchAuthSession,
    signOut,
  } from "aws-amplify/auth";
  import {
    CognitoIdentityProviderClient,
    ListUsersInGroupCommand,
    AdminAddUserToGroupCommand,
    AdminRemoveUserFromGroupCommand,
    AdminDeleteUserCommand,
    ListUsersCommand,
    AdminListGroupsForUserCommand
  } from "@aws-sdk/client-cognito-identity-provider";
  import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
  
  const REGION = "us-west-1";
  const USER_POOL_ID = "us-west-1_gp60TrWKN";
  const IDENTITY_POOL_ID = "us-west-1:4820a351-3879-423b-93e0-6a28b3e92d4e";
  
  const getCognitoClient = async () => {
    const session = await fetchAuthSession();
    const credentials = await fromCognitoIdentityPool({
      clientConfig: { region: REGION },
      identityPoolId: IDENTITY_POOL_ID,
      logins: {
        [`cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`]: session.tokens.idToken.toString(),
      },
    })();
  
    return new CognitoIdentityProviderClient({
      region: REGION,
      credentials,
    });
  };
  
  export async function getCurrentUserInfo() {
    try {
      const user = await getCurrentUser();
      const attributes = await fetchUserAttributes();
      return {
        sub: attributes.sub || "No sub found",
        email: attributes.email || "No email found",
        given_name: attributes.given_name || "No given name found",
        family_name: attributes.family_name || "No family name found",
        preferred_prisons: attributes["custom:preferred_prisons"] || "No preferred prisons",
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
      return roles;
    } catch (error) {
      console.error("Error fetching user role:", error);
      return [];
    }
  }
  
  export async function fetchUsersInGroup(groupName) {
    try {
      const client = await getCognitoClient();
      const command = new ListUsersInGroupCommand({
        UserPoolId: USER_POOL_ID,
        GroupName: groupName,
      });
      const response = await client.send(command);
  
      return response.Users.map((user) => ({
        username: user.Username,
        given_name: user.Attributes.find((attr) => attr.Name === "given_name")?.Value || "No First Name",
        family_name: user.Attributes.find((attr) => attr.Name === "family_name")?.Value || "No Last Name",
        email: user.Attributes.find((attr) => attr.Name === "email")?.Value || "No Email",
        preferred_prisons: user.Attributes.find((attr) => attr.Name === "custom:preferred_prisons")?.Value?.split(", ") || [],
        created_at: user.UserCreateDate,
      }));
    } catch (error) {
      console.error("Error fetching users in group:", error);
      return [];
    }
  }
  
  export async function fetchAllUsers() {
    try {
      const client = await getCognitoClient();
      const listCommand = new ListUsersCommand({
        UserPoolId: USER_POOL_ID,
      });
  
      const response = await client.send(listCommand);
  
      const usersWithGroups = await Promise.all(
        response.Users.map(async (user) => {
          const groupsCommand = new AdminListGroupsForUserCommand({
            Username: user.Username,
            UserPoolId: USER_POOL_ID,
          });
          const groupResponse = await client.send(groupsCommand);
          const groups = groupResponse.Groups?.map((g) => g.GroupName) || [];
  
          return {
            username: user.Username,
            given_name: user.Attributes.find((attr) => attr.Name === "given_name")?.Value || "No First Name",
            family_name: user.Attributes.find((attr) => attr.Name === "family_name")?.Value || "No Last Name",
            email: user.Attributes.find((attr) => attr.Name === "email")?.Value || "No Email",
            preferred_prisons: user.Attributes.find((attr) => attr.Name === "custom:preferred_prisons")?.Value?.split(", ") || [],
            created_at: user.UserCreateDate,
            groups,
          };
        })
      );
  
      return usersWithGroups;
    } catch (error) {
      console.error("Error fetching all users:", error);
      return [];
    }
  }
  
  export async function promoteUser(username) {
    try {
      const client = await getCognitoClient();
      const command = new AdminAddUserToGroupCommand({
        UserPoolId: USER_POOL_ID,
        Username: username,
        GroupName: "admin",
      });
      await client.send(command);
    } catch (error) {
      console.error("Error promoting user:", error);
    }
  }
  
  export async function demoteUser(username) {
    try {
      const client = await getCognitoClient();
      const command = new AdminRemoveUserFromGroupCommand({
        UserPoolId: USER_POOL_ID,
        Username: username,
        GroupName: "admin",
      });
      await client.send(command);
    } catch (error) {
      console.error("Error demoting user:", error);
    }
  }
  
  export async function deleteUser(username) {
    try {
      const client = await getCognitoClient();
      const command = new AdminDeleteUserCommand({
        UserPoolId: USER_POOL_ID,
        Username: username,
      });
      await client.send(command);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }