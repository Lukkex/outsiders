/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateTask = /* GraphQL */ `
  subscription OnCreateTask($filter: ModelSubscriptionTaskFilterInput) {
    onCreateTask(filter: $filter) {
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
export const onUpdateTask = /* GraphQL */ `
  subscription OnUpdateTask($filter: ModelSubscriptionTaskFilterInput) {
    onUpdateTask(filter: $filter) {
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
export const onDeleteTask = /* GraphQL */ `
  subscription OnDeleteTask($filter: ModelSubscriptionTaskFilterInput) {
    onDeleteTask(filter: $filter) {
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
export const onCreatePrivateNote = /* GraphQL */ `
  subscription OnCreatePrivateNote(
    $filter: ModelSubscriptionPrivateNoteFilterInput
    $owner: String
  ) {
    onCreatePrivateNote(filter: $filter, owner: $owner) {
      id
      content
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onUpdatePrivateNote = /* GraphQL */ `
  subscription OnUpdatePrivateNote(
    $filter: ModelSubscriptionPrivateNoteFilterInput
    $owner: String
  ) {
    onUpdatePrivateNote(filter: $filter, owner: $owner) {
      id
      content
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onDeletePrivateNote = /* GraphQL */ `
  subscription OnDeletePrivateNote(
    $filter: ModelSubscriptionPrivateNoteFilterInput
    $owner: String
  ) {
    onDeletePrivateNote(filter: $filter, owner: $owner) {
      id
      content
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onCreateUserProfile = /* GraphQL */ `
  subscription OnCreateUserProfile(
    $filter: ModelSubscriptionUserProfileFilterInput
    $owner: String
  ) {
    onCreateUserProfile(filter: $filter, owner: $owner) {
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
export const onUpdateUserProfile = /* GraphQL */ `
  subscription OnUpdateUserProfile(
    $filter: ModelSubscriptionUserProfileFilterInput
    $owner: String
  ) {
    onUpdateUserProfile(filter: $filter, owner: $owner) {
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
export const onDeleteUserProfile = /* GraphQL */ `
  subscription OnDeleteUserProfile(
    $filter: ModelSubscriptionUserProfileFilterInput
    $owner: String
  ) {
    onDeleteUserProfile(filter: $filter, owner: $owner) {
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
export const onCreateFormSubmission = /* GraphQL */ `
  subscription OnCreateFormSubmission(
    $filter: ModelSubscriptionFormSubmissionFilterInput
    $owner: String
  ) {
    onCreateFormSubmission(filter: $filter, owner: $owner) {
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
export const onUpdateFormSubmission = /* GraphQL */ `
  subscription OnUpdateFormSubmission(
    $filter: ModelSubscriptionFormSubmissionFilterInput
    $owner: String
  ) {
    onUpdateFormSubmission(filter: $filter, owner: $owner) {
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
export const onDeleteFormSubmission = /* GraphQL */ `
  subscription OnDeleteFormSubmission(
    $filter: ModelSubscriptionFormSubmissionFilterInput
    $owner: String
  ) {
    onDeleteFormSubmission(filter: $filter, owner: $owner) {
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
export const onCreateEvent = /* GraphQL */ `
  subscription OnCreateEvent($filter: ModelSubscriptionEventFilterInput) {
    onCreateEvent(filter: $filter) {
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
export const onUpdateEvent = /* GraphQL */ `
  subscription OnUpdateEvent($filter: ModelSubscriptionEventFilterInput) {
    onUpdateEvent(filter: $filter) {
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
export const onDeleteEvent = /* GraphQL */ `
  subscription OnDeleteEvent($filter: ModelSubscriptionEventFilterInput) {
    onDeleteEvent(filter: $filter) {
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
export const onCreateInfo = /* GraphQL */ `
  subscription OnCreateInfo($filter: ModelSubscriptionInfoFilterInput) {
    onCreateInfo(filter: $filter) {
      id
      title
      content
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateInfo = /* GraphQL */ `
  subscription OnUpdateInfo($filter: ModelSubscriptionInfoFilterInput) {
    onUpdateInfo(filter: $filter) {
      id
      title
      content
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteInfo = /* GraphQL */ `
  subscription OnDeleteInfo($filter: ModelSubscriptionInfoFilterInput) {
    onDeleteInfo(filter: $filter) {
      id
      title
      content
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateUserFormBridge = /* GraphQL */ `
  subscription OnCreateUserFormBridge(
    $filter: ModelSubscriptionUserFormBridgeFilterInput
    $owner: String
  ) {
    onCreateUserFormBridge(filter: $filter, owner: $owner) {
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
export const onUpdateUserFormBridge = /* GraphQL */ `
  subscription OnUpdateUserFormBridge(
    $filter: ModelSubscriptionUserFormBridgeFilterInput
    $owner: String
  ) {
    onUpdateUserFormBridge(filter: $filter, owner: $owner) {
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
export const onDeleteUserFormBridge = /* GraphQL */ `
  subscription OnDeleteUserFormBridge(
    $filter: ModelSubscriptionUserFormBridgeFilterInput
    $owner: String
  ) {
    onDeleteUserFormBridge(filter: $filter, owner: $owner) {
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
export const onCreateUserInfoBridge = /* GraphQL */ `
  subscription OnCreateUserInfoBridge(
    $filter: ModelSubscriptionUserInfoBridgeFilterInput
    $owner: String
  ) {
    onCreateUserInfoBridge(filter: $filter, owner: $owner) {
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
export const onUpdateUserInfoBridge = /* GraphQL */ `
  subscription OnUpdateUserInfoBridge(
    $filter: ModelSubscriptionUserInfoBridgeFilterInput
    $owner: String
  ) {
    onUpdateUserInfoBridge(filter: $filter, owner: $owner) {
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
export const onDeleteUserInfoBridge = /* GraphQL */ `
  subscription OnDeleteUserInfoBridge(
    $filter: ModelSubscriptionUserInfoBridgeFilterInput
    $owner: String
  ) {
    onDeleteUserInfoBridge(filter: $filter, owner: $owner) {
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
export const onCreateUserEventBridge = /* GraphQL */ `
  subscription OnCreateUserEventBridge(
    $filter: ModelSubscriptionUserEventBridgeFilterInput
    $owner: String
  ) {
    onCreateUserEventBridge(filter: $filter, owner: $owner) {
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
export const onUpdateUserEventBridge = /* GraphQL */ `
  subscription OnUpdateUserEventBridge(
    $filter: ModelSubscriptionUserEventBridgeFilterInput
    $owner: String
  ) {
    onUpdateUserEventBridge(filter: $filter, owner: $owner) {
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
export const onDeleteUserEventBridge = /* GraphQL */ `
  subscription OnDeleteUserEventBridge(
    $filter: ModelSubscriptionUserEventBridgeFilterInput
    $owner: String
  ) {
    onDeleteUserEventBridge(filter: $filter, owner: $owner) {
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
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser(
    $filter: ModelSubscriptionUserFilterInput
    $owner: String
  ) {
    onCreateUser(filter: $filter, owner: $owner) {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser(
    $filter: ModelSubscriptionUserFilterInput
    $owner: String
  ) {
    onUpdateUser(filter: $filter, owner: $owner) {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser(
    $filter: ModelSubscriptionUserFilterInput
    $owner: String
  ) {
    onDeleteUser(filter: $filter, owner: $owner) {
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
