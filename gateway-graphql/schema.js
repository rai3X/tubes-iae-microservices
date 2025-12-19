const { buildSchema } = require("graphql");

module.exports = buildSchema(`
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
  }

  type Product {
    id: ID!
    name: String!
    price: Int!
    stock: Int!
    seller_id: Int!
  }

  type Order {
    id: ID!
    user_id: Int!
    product_id: Int!
    product_name: String!
    quantity: Int!
    price: Int!
    total_price: Int!
    created_at: String!
  }

  type Query {
    users: [User]
    user(id: ID!): User

    products: [Product]
    product(id: ID!): Product

    orders: [Order]
    order(id: ID!): Order
  }

  type Mutation {
    createUser(
      name: String!
      email: String!
      role: String!
    ): User

    deleteUser(id: ID!): String

    createProduct(
      name: String!
      price: Int!
      stock: Int!
      seller_id: Int!
    ): Product

    updateProductStock(
      product_id: ID!
      seller_id: ID!
      stock: Int!
    ): Product

    deleteProduct(
      product_id: ID!
      seller_id: ID!
    ): String

    createOrder(
      user_id: ID!
      product_id: ID!
      quantity: Int!
    ): Order

    deleteOrder(id: ID!): String
  }
`);
