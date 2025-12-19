const { buildSchema } = require("graphql");

module.exports = buildSchema(`
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
    orders: [Order]
    order(id: ID!): Order
  }

  type Mutation {
    createOrder(
      user_id: Int!
      product_id: Int!
      quantity: Int!
    ): Order

    deleteOrder(id: ID!): String
  }
`);
