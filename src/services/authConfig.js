import { Auth } from 'aws-amplify';

export const authConfig = {
  region: "us-west-1",
  userPoolId: "us-west-1_gp60TrWKN",
  userPoolWebClientId: "3ggq31t0j4pqnl692671qelmsh",
  identityPoolId: "us-west-1:4820a351-3879-423b-93e0-6a28b3e92d4e",
  authenticationFlowType: "USER_SRP_AUTH",
};

// Function to get the authenticated user's token
export async function getAuthToken() {
  try {
    const user = await Auth.currentAuthenticatedUser();
    return user.signInUserSession.idToken.jwtToken;
  } catch (error) {
    console.error("Error fetching auth token:", error);
    return null;
  }
}

// Function to get the current authenticated user
export async function getCurrentUser() {
  try {
    return await Auth.currentAuthenticatedUser();
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

// Function to check if the user belongs to the 'admin' or 'basic_users' groups
export async function getUserRole() {
  try {
    const user = await Auth.currentAuthenticatedUser();
    const groups = user.signInUserSession.accessToken.payload["cognito:groups"] || [];

    if (groups.includes("admin")) {
      return "admin";
    } else if (groups.includes("basic_users")) {
      return "basic_users";
    } else {
      return "unknown";
    }
  } catch (error) {
    console.error("Error fetching user role:", error);
    return "unknown";
  }
}
