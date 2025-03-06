import { API, graphqlOperation } from "aws-amplify";
import awsmobile from "../aws-exports";

// Initialize Amplify API
API.configure(awsmobile);

// Function to fetch data from AppSync
export async function fetchGraphQLData(query) {
  try {
    const result = await API.graphql(graphqlOperation(query));
    return result.data;
  } catch (error) {
    console.error("GraphQL query failed:", error);
    return null;
  }
}
