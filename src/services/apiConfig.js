import { Amplify } from 'aws-amplify';
import { GraphQLAPI, graphqlOperation } from '@aws-amplify/api-graphql';
import awsconfig from '../aws-exports';
import { listTasks, listUserProfiles, listFormSubmissions } from '../graphql/queries';

Amplify.configure(awsconfig);

export async function fetchTasks() {
  try {
    const result = await GraphQLAPI.graphql(graphqlOperation(listTasks));
    return result.data.listTasks.items;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
}

export async function fetchUserProfiles() {
  try {
    const result = await GraphQLAPI.graphql(graphqlOperation(listUserProfiles));
    return result.data.listUserProfiles.items;
  } catch (error) {
    console.error("Error fetching user profiles:", error);
    return [];
  }
}

export async function fetchFormSubmissions() {
  try {
    const result = await GraphQLAPI.graphql(graphqlOperation(listFormSubmissions));
    return result.data.listFormSubmissions.items;
  } catch (error) {
    console.error("Error fetching form submissions:", error);
    return [];
  }
}
