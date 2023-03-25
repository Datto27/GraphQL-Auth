
export const userTypeDefs = `#graphql

  type User {
    id: ID
    username: String!
    password: String!
  }

  type AuthRes {
    id: ID
    username: String
    accessToken: String
    refreshToken: String
  }

  input UserInput {
    username: String!
    password: String!
  }

  type Query {
    users: [User!]!
    user(id: ID): User
  }

  type Mutation {
    userRegister(user:UserInput): AuthRes
    userLogin(user:UserInput): AuthRes
  }
`