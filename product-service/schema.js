const { buildSchema } = require("graphql");

module.exports = buildSchema(`
  type Product {
    id: ID!
    name: String!
    price: Int!
    stock: Int!
    seller_id: Int!
  }

  type Query {
    products: [Product]
    product(id: ID!): Product
  }

  type Mutation {
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
  }
`);
