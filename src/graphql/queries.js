/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getTask = /* GraphQL */ `
  query GetTask($id: ID!) {
    getTask(id: $id) {
      id
      title
      description
      status
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listTasks = /* GraphQL */ `
  query ListTasks(
    $filter: ModelTaskFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTasks(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        description
        status
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getPrivateNote = /* GraphQL */ `
  query GetPrivateNote($id: ID!) {
    getPrivateNote(id: $id) {
      id
      content
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const listPrivateNotes = /* GraphQL */ `
  query ListPrivateNotes(
    $filter: ModelPrivateNoteFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPrivateNotes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        content
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getUserProfile = /* GraphQL */ `
  query GetUserProfile($id: ID!) {
    getUserProfile(id: $id) {
      id
      username
      email
      role
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const listUserProfiles = /* GraphQL */ `
  query ListUserProfiles(
    $filter: ModelUserProfileFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserProfiles(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        username
        email
        role
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getFormSubmission = /* GraphQL */ `
  query GetFormSubmission($id: ID!) {
    getFormSubmission(id: $id) {
      id
      userID
      prisonLocation
      submissionDate
      status
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const listFormSubmissions = /* GraphQL */ `
  query ListFormSubmissions(
    $filter: ModelFormSubmissionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listFormSubmissions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userID
        prisonLocation
        submissionDate
        status
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getEvent = /* GraphQL */ `
  query GetEvent($id: ID!) {
    getEvent(id: $id) {
      id
      eventName
      eventDate
      location
      description
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listEvents = /* GraphQL */ `
  query ListEvents(
    $filter: ModelEventFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listEvents(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        eventName
        eventDate
        location
        description
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getInfo = /* GraphQL */ `
  query GetInfo($id: ID!) {
    getInfo(id: $id) {
      id
      title
      content
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listInfos = /* GraphQL */ `
  query ListInfos(
    $filter: ModelInfoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listInfos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        content
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getUserFormBridge = /* GraphQL */ `
  query GetUserFormBridge($id: ID!) {
    getUserFormBridge(id: $id) {
      id
      userID
      formID
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const listUserFormBridges = /* GraphQL */ `
  query ListUserFormBridges(
    $filter: ModelUserFormBridgeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserFormBridges(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userID
        formID
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getUserInfoBridge = /* GraphQL */ `
  query GetUserInfoBridge($id: ID!) {
    getUserInfoBridge(id: $id) {
      id
      userID
      infoID
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const listUserInfoBridges = /* GraphQL */ `
  query ListUserInfoBridges(
    $filter: ModelUserInfoBridgeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserInfoBridges(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userID
        infoID
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getUserEventBridge = /* GraphQL */ `
  query GetUserEventBridge($id: ID!) {
    getUserEventBridge(id: $id) {
      id
      userID
      eventID
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const listUserEventBridges = /* GraphQL */ `
  query ListUserEventBridges(
    $filter: ModelUserEventBridgeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserEventBridges(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userID
        eventID
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      username
      email
      role
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        username
        email
        role
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
