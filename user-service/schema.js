const { buildSchema } = require("graphql");

module.exports = buildSchema(`
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
  }

  type Query {
    users: [User]
    user(id: ID!): User
  }

  type Mutation {
    createUser(
      name: String!
      email: String!
      role: String!
    ): User

    deleteUser(id: ID!): String
  }
`);
