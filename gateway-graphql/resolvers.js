const axios = require("axios");

const USER_SERVICE =
  process.env.USER_SERVICE_URL || "http://localhost:4001/graphql";

const PRODUCT_SERVICE =
  process.env.PRODUCT_SERVICE_URL || "http://localhost:4002/graphql";

const ORDER_SERVICE =
  process.env.ORDER_SERVICE_URL || "http://localhost:4003/graphql";

const callService = async (url, query) => {
  try {
    const response = await axios.post(url, { query });
    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }
    return response.data.data;
  } catch (error) {
    if (error.code === 'ECONNREFUSED' || error.message.includes('ECONNREFUSED')) {
      throw new Error("Downstream service tidak aktif");
    }
    throw error;
  }
};

module.exports = {
  users: async () =>
    (await callService(
      USER_SERVICE,
      `query { users { id name email role } }`
    )).users,

  user: async ({ id }) =>
    (await callService(
      USER_SERVICE,
      `query { user(id:${id}) { id name email role } }`
    )).user,

  createUser: async (args) =>
    (await callService(
      USER_SERVICE,
      `
      mutation {
        createUser(
          name:"${args.name}"
          email:"${args.email}"
          role:"${args.role}"
        ) {
          id
          name
          email
          role
        }
      }
      `
    )).createUser,

  deleteUser: async ({ id }) =>
    (await callService(
      USER_SERVICE,
      `
      mutation {
        deleteUser(id:${id})
      }
      `
    )).deleteUser,

  products: async () =>
    (await callService(
      PRODUCT_SERVICE,
      `query { products { id name price stock seller_id } }`
    )).products,

  product: async ({ id }) =>
    (await callService(
      PRODUCT_SERVICE,
      `query { product(id:${id}) { id name price stock seller_id } }`
    )).product,

  createProduct: async (args) =>
    (await callService(
      PRODUCT_SERVICE,
      `
      mutation {
        createProduct(
          name:"${args.name}"
          price:${args.price}
          stock:${args.stock}
          seller_id:${args.seller_id}
        ) {
          id
          name
          price
          stock
          seller_id
        }
      }
      `
    )).createProduct,

  updateProductStock: async (args) =>
    (await callService(
      PRODUCT_SERVICE,
      `
      mutation {
        updateProductStock(
          product_id:${args.product_id}
          seller_id:${args.seller_id}
          stock:${args.stock}
        ) {
          id
          name
          price
          stock
          seller_id
        }
      }
      `
    )).updateProductStock,

  deleteProduct: async (args) =>
    (await callService(
      PRODUCT_SERVICE,
      `
      mutation {
        deleteProduct(
          product_id:${args.product_id}
          seller_id:${args.seller_id}
        )
      }
      `
    )).deleteProduct,

  orders: async () =>
    (await callService(
      ORDER_SERVICE,
      `
      query {
        orders {
          id
          user_id
          product_id
          product_name
          quantity
          price
          total_price
          created_at
        }
      }
      `
    )).orders,

  order: async ({ id }) =>
    (await callService(
      ORDER_SERVICE,
      `
      query {
        order(id:${id}) {
          id
          user_id
          product_id
          product_name
          quantity
          price
          total_price
          created_at
        }
      }
      `
    )).order,

  createOrder: async (args) =>
    (await callService(
      ORDER_SERVICE,
      `
      mutation {
        createOrder(
          user_id:${args.user_id}
          product_id:${args.product_id}
          quantity:${args.quantity}
        ) {
          id
          user_id
          product_id
          product_name
          quantity
          price
          total_price
          created_at
        }
      }
      `
    )).createOrder,

  deleteOrder: async ({ id }) =>
    (await callService(
      ORDER_SERVICE,
      `
      mutation {
        deleteOrder(id:${id})
      }
      `
    )).deleteOrder
};
