/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser(
    $filter: ModelSubscriptionUserFilterInput
    $owner: String
  ) {
    onCreateUser(filter: $filter, owner: $owner) {
      id
      name
      images {
        items {
          id
          tags
          content
          historical
          createdAt
          updatedAt
          userImagesId
          owner
        }
        nextToken
      }
      createdAt
      updatedAt
      owner
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
      name
      images {
        items {
          id
          tags
          content
          historical
          createdAt
          updatedAt
          userImagesId
          owner
        }
        nextToken
      }
      createdAt
      updatedAt
      owner
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
      name
      images {
        items {
          id
          tags
          content
          historical
          createdAt
          updatedAt
          userImagesId
          owner
        }
        nextToken
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onCreateImages = /* GraphQL */ `
  subscription OnCreateImages(
    $filter: ModelSubscriptionImagesFilterInput
    $owner: String
  ) {
    onCreateImages(filter: $filter, owner: $owner) {
      id
      tags
      content
      historical
      createdAt
      updatedAt
      userImagesId
      owner
    }
  }
`;
export const onUpdateImages = /* GraphQL */ `
  subscription OnUpdateImages(
    $filter: ModelSubscriptionImagesFilterInput
    $owner: String
  ) {
    onUpdateImages(filter: $filter, owner: $owner) {
      id
      tags
      content
      historical
      createdAt
      updatedAt
      userImagesId
      owner
    }
  }
`;
export const onDeleteImages = /* GraphQL */ `
  subscription OnDeleteImages(
    $filter: ModelSubscriptionImagesFilterInput
    $owner: String
  ) {
    onDeleteImages(filter: $filter, owner: $owner) {
      id
      tags
      content
      historical
      createdAt
      updatedAt
      userImagesId
      owner
    }
  }
`;
