
export const userTypeDefs = `#graphql

  type User {
    id: ID
    username: String!
    password: String!
    loginCount: Int
  }

  type AuthRes {
    id: ID
    username: String
    loginCount: String
    accessToken: String
    refreshToken: String
  }

  input UserInput {
    username: String!
    password: String!
    loginCount: Int = 0
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