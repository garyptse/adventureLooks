/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const user = /* GraphQL */ `
  query User($userID: String) {
    user(userID: $userID) {
      userID
      images {
        imageID
        blurb
      }
      id
      createdAt
      updatedAt
      owner
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      userID
      images {
        imageID
        blurb
      }
      id
      createdAt
      updatedAt
      owner
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
        userID
        images {
          imageID
          blurb
        }
        id
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
