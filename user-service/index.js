const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema");
const resolvers = require("./resolvers");

const app = express();

const PORT = process.env.PORT || 4001;

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: resolvers,
    graphiql: true
  })
);

app.listen(PORT, () => {
  console.log(`User Service running at http://localhost:${PORT}/graphql`);
});
