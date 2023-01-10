/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateUserInput = {
  id?: string | null,
  name: string,
};

export type ModelUserConditionInput = {
  name?: ModelStringInput | null,
  and?: Array< ModelUserConditionInput | null > | null,
  or?: Array< ModelUserConditionInput | null > | null,
  not?: ModelUserConditionInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type User = {
  __typename: "User",
  id: string,
  name: string,
  images?: ModelImagesConnection | null,
  createdAt: string,
  updatedAt: string,
  owner?: string | null,
};

export type ModelImagesConnection = {
  __typename: "ModelImagesConnection",
  items:  Array<Images | null >,
  nextToken?: string | null,
};

export type Images = {
  __typename: "Images",
  id: string,
  tags: string,
  content: string,
  historical: Array< string | null >,
  createdAt: string,
  updatedAt: string,
  userImagesId: string,
  owner?: string | null,
};

export type UpdateUserInput = {
  id: string,
  name?: string | null,
};

export type DeleteUserInput = {
  id: string,
};

export type CreateImagesInput = {
  id?: string | null,
  tags: string,
  content: string,
  historical: Array< string | null >,
  userImagesId: string,
};

export type ModelImagesConditionInput = {
  tags?: ModelStringInput | null,
  content?: ModelStringInput | null,
  historical?: ModelStringInput | null,
  and?: Array< ModelImagesConditionInput | null > | null,
  or?: Array< ModelImagesConditionInput | null > | null,
  not?: ModelImagesConditionInput | null,
  userImagesId?: ModelIDInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type UpdateImagesInput = {
  id: string,
  tags?: string | null,
  content?: string | null,
  historical?: Array< string | null > | null,
  userImagesId: string,
};

export type DeleteImagesInput = {
  id: string,
};

export type ModelUserFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  and?: Array< ModelUserFilterInput | null > | null,
  or?: Array< ModelUserFilterInput | null > | null,
  not?: ModelUserFilterInput | null,
};

export type ModelUserConnection = {
  __typename: "ModelUserConnection",
  items:  Array<User | null >,
  nextToken?: string | null,
};

export type ModelImagesFilterInput = {
  id?: ModelIDInput | null,
  tags?: ModelStringInput | null,
  content?: ModelStringInput | null,
  historical?: ModelStringInput | null,
  and?: Array< ModelImagesFilterInput | null > | null,
  or?: Array< ModelImagesFilterInput | null > | null,
  not?: ModelImagesFilterInput | null,
  userImagesId?: ModelIDInput | null,
};

export type ModelSubscriptionUserFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionUserFilterInput | null > | null,
  or?: Array< ModelSubscriptionUserFilterInput | null > | null,
};

export type ModelSubscriptionIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionImagesFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  tags?: ModelSubscriptionStringInput | null,
  content?: ModelSubscriptionStringInput | null,
  historical?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionImagesFilterInput | null > | null,
  or?: Array< ModelSubscriptionImagesFilterInput | null > | null,
};

export type CreateUserMutationVariables = {
  input: CreateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type CreateUserMutation = {
  createUser?:  {
    __typename: "User",
    id: string,
    name: string,
    images?:  {
      __typename: "ModelImagesConnection",
      items:  Array< {
        __typename: "Images",
        id: string,
        tags: string,
        content: string,
        historical: Array< string | null >,
        createdAt: string,
        updatedAt: string,
        userImagesId: string,
        owner?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type UpdateUserMutationVariables = {
  input: UpdateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type UpdateUserMutation = {
  updateUser?:  {
    __typename: "User",
    id: string,
    name: string,
    images?:  {
      __typename: "ModelImagesConnection",
      items:  Array< {
        __typename: "Images",
        id: string,
        tags: string,
        content: string,
        historical: Array< string | null >,
        createdAt: string,
        updatedAt: string,
        userImagesId: string,
        owner?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type DeleteUserMutationVariables = {
  input: DeleteUserInput,
  condition?: ModelUserConditionInput | null,
};

export type DeleteUserMutation = {
  deleteUser?:  {
    __typename: "User",
    id: string,
    name: string,
    images?:  {
      __typename: "ModelImagesConnection",
      items:  Array< {
        __typename: "Images",
        id: string,
        tags: string,
        content: string,
        historical: Array< string | null >,
        createdAt: string,
        updatedAt: string,
        userImagesId: string,
        owner?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type CreateImagesMutationVariables = {
  input: CreateImagesInput,
  condition?: ModelImagesConditionInput | null,
};

export type CreateImagesMutation = {
  createImages?:  {
    __typename: "Images",
    id: string,
    tags: string,
    content: string,
    historical: Array< string | null >,
    createdAt: string,
    updatedAt: string,
    userImagesId: string,
    owner?: string | null,
  } | null,
};

export type UpdateImagesMutationVariables = {
  input: UpdateImagesInput,
  condition?: ModelImagesConditionInput | null,
};

export type UpdateImagesMutation = {
  updateImages?:  {
    __typename: "Images",
    id: string,
    tags: string,
    content: string,
    historical: Array< string | null >,
    createdAt: string,
    updatedAt: string,
    userImagesId: string,
    owner?: string | null,
  } | null,
};

export type DeleteImagesMutationVariables = {
  input: DeleteImagesInput,
  condition?: ModelImagesConditionInput | null,
};

export type DeleteImagesMutation = {
  deleteImages?:  {
    __typename: "Images",
    id: string,
    tags: string,
    content: string,
    historical: Array< string | null >,
    createdAt: string,
    updatedAt: string,
    userImagesId: string,
    owner?: string | null,
  } | null,
};

export type GetUserQueryVariables = {
  id: string,
};

export type GetUserQuery = {
  getUser?:  {
    __typename: "User",
    id: string,
    name: string,
    images?:  {
      __typename: "ModelImagesConnection",
      items:  Array< {
        __typename: "Images",
        id: string,
        tags: string,
        content: string,
        historical: Array< string | null >,
        createdAt: string,
        updatedAt: string,
        userImagesId: string,
        owner?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type ListUsersQueryVariables = {
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUsersQuery = {
  listUsers?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      id: string,
      name: string,
      images?:  {
        __typename: "ModelImagesConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetImagesQueryVariables = {
  id: string,
};

export type GetImagesQuery = {
  getImages?:  {
    __typename: "Images",
    id: string,
    tags: string,
    content: string,
    historical: Array< string | null >,
    createdAt: string,
    updatedAt: string,
    userImagesId: string,
    owner?: string | null,
  } | null,
};

export type ListImagesQueryVariables = {
  filter?: ModelImagesFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListImagesQuery = {
  listImages?:  {
    __typename: "ModelImagesConnection",
    items:  Array< {
      __typename: "Images",
      id: string,
      tags: string,
      content: string,
      historical: Array< string | null >,
      createdAt: string,
      updatedAt: string,
      userImagesId: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
  owner?: string | null,
};

export type OnCreateUserSubscription = {
  onCreateUser?:  {
    __typename: "User",
    id: string,
    name: string,
    images?:  {
      __typename: "ModelImagesConnection",
      items:  Array< {
        __typename: "Images",
        id: string,
        tags: string,
        content: string,
        historical: Array< string | null >,
        createdAt: string,
        updatedAt: string,
        userImagesId: string,
        owner?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnUpdateUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
  owner?: string | null,
};

export type OnUpdateUserSubscription = {
  onUpdateUser?:  {
    __typename: "User",
    id: string,
    name: string,
    images?:  {
      __typename: "ModelImagesConnection",
      items:  Array< {
        __typename: "Images",
        id: string,
        tags: string,
        content: string,
        historical: Array< string | null >,
        createdAt: string,
        updatedAt: string,
        userImagesId: string,
        owner?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnDeleteUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
  owner?: string | null,
};

export type OnDeleteUserSubscription = {
  onDeleteUser?:  {
    __typename: "User",
    id: string,
    name: string,
    images?:  {
      __typename: "ModelImagesConnection",
      items:  Array< {
        __typename: "Images",
        id: string,
        tags: string,
        content: string,
        historical: Array< string | null >,
        createdAt: string,
        updatedAt: string,
        userImagesId: string,
        owner?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnCreateImagesSubscriptionVariables = {
  filter?: ModelSubscriptionImagesFilterInput | null,
  owner?: string | null,
};

export type OnCreateImagesSubscription = {
  onCreateImages?:  {
    __typename: "Images",
    id: string,
    tags: string,
    content: string,
    historical: Array< string | null >,
    createdAt: string,
    updatedAt: string,
    userImagesId: string,
    owner?: string | null,
  } | null,
};

export type OnUpdateImagesSubscriptionVariables = {
  filter?: ModelSubscriptionImagesFilterInput | null,
  owner?: string | null,
};

export type OnUpdateImagesSubscription = {
  onUpdateImages?:  {
    __typename: "Images",
    id: string,
    tags: string,
    content: string,
    historical: Array< string | null >,
    createdAt: string,
    updatedAt: string,
    userImagesId: string,
    owner?: string | null,
  } | null,
};

export type OnDeleteImagesSubscriptionVariables = {
  filter?: ModelSubscriptionImagesFilterInput | null,
  owner?: string | null,
};

export type OnDeleteImagesSubscription = {
  onDeleteImages?:  {
    __typename: "Images",
    id: string,
    tags: string,
    content: string,
    historical: Array< string | null >,
    createdAt: string,
    updatedAt: string,
    userImagesId: string,
    owner?: string | null,
  } | null,
};
