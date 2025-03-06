/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createTask = /* GraphQL */ `
  mutation CreateTask(
    $input: CreateTaskInput!
    $condition: ModelTaskConditionInput
  ) {
    createTask(input: $input, condition: $condition) {
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
export const updateTask = /* GraphQL */ `
  mutation UpdateTask(
    $input: UpdateTaskInput!
    $condition: ModelTaskConditionInput
  ) {
    updateTask(input: $input, condition: $condition) {
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
export const deleteTask = /* GraphQL */ `
  mutation DeleteTask(
    $input: DeleteTaskInput!
    $condition: ModelTaskConditionInput
  ) {
    deleteTask(input: $input, condition: $condition) {
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
export const createPrivateNote = /* GraphQL */ `
  mutation CreatePrivateNote(
    $input: CreatePrivateNoteInput!
    $condition: ModelPrivateNoteConditionInput
  ) {
    createPrivateNote(input: $input, condition: $condition) {
      id
      content
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const updatePrivateNote = /* GraphQL */ `
  mutation UpdatePrivateNote(
    $input: UpdatePrivateNoteInput!
    $condition: ModelPrivateNoteConditionInput
  ) {
    updatePrivateNote(input: $input, condition: $condition) {
      id
      content
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const deletePrivateNote = /* GraphQL */ `
  mutation DeletePrivateNote(
    $input: DeletePrivateNoteInput!
    $condition: ModelPrivateNoteConditionInput
  ) {
    deletePrivateNote(input: $input, condition: $condition) {
      id
      content
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const createUserProfile = /* GraphQL */ `
  mutation CreateUserProfile(
    $input: CreateUserProfileInput!
    $condition: ModelUserProfileConditionInput
  ) {
    createUserProfile(input: $input, condition: $condition) {
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
export const updateUserProfile = /* GraphQL */ `
  mutation UpdateUserProfile(
    $input: UpdateUserProfileInput!
    $condition: ModelUserProfileConditionInput
  ) {
    updateUserProfile(input: $input, condition: $condition) {
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
export const deleteUserProfile = /* GraphQL */ `
  mutation DeleteUserProfile(
    $input: DeleteUserProfileInput!
    $condition: ModelUserProfileConditionInput
  ) {
    deleteUserProfile(input: $input, condition: $condition) {
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
export const createFormSubmission = /* GraphQL */ `
  mutation CreateFormSubmission(
    $input: CreateFormSubmissionInput!
    $condition: ModelFormSubmissionConditionInput
  ) {
    createFormSubmission(input: $input, condition: $condition) {
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
export const updateFormSubmission = /* GraphQL */ `
  mutation UpdateFormSubmission(
    $input: UpdateFormSubmissionInput!
    $condition: ModelFormSubmissionConditionInput
  ) {
    updateFormSubmission(input: $input, condition: $condition) {
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
export const deleteFormSubmission = /* GraphQL */ `
  mutation DeleteFormSubmission(
    $input: DeleteFormSubmissionInput!
    $condition: ModelFormSubmissionConditionInput
  ) {
    deleteFormSubmission(input: $input, condition: $condition) {
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
export const createEvent = /* GraphQL */ `
  mutation CreateEvent(
    $input: CreateEventInput!
    $condition: ModelEventConditionInput
  ) {
    createEvent(input: $input, condition: $condition) {
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
export const updateEvent = /* GraphQL */ `
  mutation UpdateEvent(
    $input: UpdateEventInput!
    $condition: ModelEventConditionInput
  ) {
    updateEvent(input: $input, condition: $condition) {
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
export const deleteEvent = /* GraphQL */ `
  mutation DeleteEvent(
    $input: DeleteEventInput!
    $condition: ModelEventConditionInput
  ) {
    deleteEvent(input: $input, condition: $condition) {
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
export const createInfo = /* GraphQL */ `
  mutation CreateInfo(
    $input: CreateInfoInput!
    $condition: ModelInfoConditionInput
  ) {
    createInfo(input: $input, condition: $condition) {
      id
      title
      content
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateInfo = /* GraphQL */ `
  mutation UpdateInfo(
    $input: UpdateInfoInput!
    $condition: ModelInfoConditionInput
  ) {
    updateInfo(input: $input, condition: $condition) {
      id
      title
      content
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteInfo = /* GraphQL */ `
  mutation DeleteInfo(
    $input: DeleteInfoInput!
    $condition: ModelInfoConditionInput
  ) {
    deleteInfo(input: $input, condition: $condition) {
      id
      title
      content
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createUserFormBridge = /* GraphQL */ `
  mutation CreateUserFormBridge(
    $input: CreateUserFormBridgeInput!
    $condition: ModelUserFormBridgeConditionInput
  ) {
    createUserFormBridge(input: $input, condition: $condition) {
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
export const updateUserFormBridge = /* GraphQL */ `
  mutation UpdateUserFormBridge(
    $input: UpdateUserFormBridgeInput!
    $condition: ModelUserFormBridgeConditionInput
  ) {
    updateUserFormBridge(input: $input, condition: $condition) {
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
export const deleteUserFormBridge = /* GraphQL */ `
  mutation DeleteUserFormBridge(
    $input: DeleteUserFormBridgeInput!
    $condition: ModelUserFormBridgeConditionInput
  ) {
    deleteUserFormBridge(input: $input, condition: $condition) {
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
export const createUserInfoBridge = /* GraphQL */ `
  mutation CreateUserInfoBridge(
    $input: CreateUserInfoBridgeInput!
    $condition: ModelUserInfoBridgeConditionInput
  ) {
    createUserInfoBridge(input: $input, condition: $condition) {
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
export const updateUserInfoBridge = /* GraphQL */ `
  mutation UpdateUserInfoBridge(
    $input: UpdateUserInfoBridgeInput!
    $condition: ModelUserInfoBridgeConditionInput
  ) {
    updateUserInfoBridge(input: $input, condition: $condition) {
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
export const deleteUserInfoBridge = /* GraphQL */ `
  mutation DeleteUserInfoBridge(
    $input: DeleteUserInfoBridgeInput!
    $condition: ModelUserInfoBridgeConditionInput
  ) {
    deleteUserInfoBridge(input: $input, condition: $condition) {
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
export const createUserEventBridge = /* GraphQL */ `
  mutation CreateUserEventBridge(
    $input: CreateUserEventBridgeInput!
    $condition: ModelUserEventBridgeConditionInput
  ) {
    createUserEventBridge(input: $input, condition: $condition) {
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
export const updateUserEventBridge = /* GraphQL */ `
  mutation UpdateUserEventBridge(
    $input: UpdateUserEventBridgeInput!
    $condition: ModelUserEventBridgeConditionInput
  ) {
    updateUserEventBridge(input: $input, condition: $condition) {
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
export const deleteUserEventBridge = /* GraphQL */ `
  mutation DeleteUserEventBridge(
    $input: DeleteUserEventBridgeInput!
    $condition: ModelUserEventBridgeConditionInput
  ) {
    deleteUserEventBridge(input: $input, condition: $condition) {
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
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
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
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
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
