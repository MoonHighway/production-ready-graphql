const { ApolloServer, gql } = require("apollo-server");
const { readFileSync } = require("fs");
const { buildSubgraphSchema } = require("@apollo/subgraph");

const typeDefs = gql(readFileSync("./typeDefs.graphql", "UTF-8"));

const server = new ApolloServer({
  schema: buildSubgraphSchema({
    typeDefs,
    resolvers: {
      Customer: {
        __resolveReference({ username }) {
          console.log("resolving ref: ", username);
          return {
            name: "Federated Customer",
            username,
            dateCreated: "2/22/2022 2:22 PM",
          };
        },
      },
      Pet: {
        inCareOf({ id }) {
          console.log("finding pet: ", id);
          return {
            username: "sAmple",
            name: "Sample Person",
            dateCreated: "2/22/2022 2:22 PM",
          };
        },
      },
      Mutation: {
        login(parent, { username }) {
          return {
            username,
            name: "Sample Person",
            dateCreated: "2/22/2022 2:22 PM",
          };
        },
        createAccount(parent, { input }) {
          return {
            username: input.username,
            name: input.name,
            dateCreated: new Date().toISOString(),
          };
        },
      },
      Query: {
        totalCustomers: () => 42,
        me: () => ({
          username: "chillymilly",
          name: "Milly Madison",
          dateCreated: "2/22/2022 2:22 PM",
        }),
        allCustomers: () => [
          {
            username: "chillymilly",
            name: "Milly Madison",
            dateCreated: "2/22/2022 2:22 PM",
          },
          {
            username: "aBanks",
            name: "Alex Banks",
            dateCreated: "2/22/2022 2:22 PM",
          },
          {
            username: "ePorcello",
            name: "Eve Porcello",
            dateCreated: "2/22/2022 2:22 PM",
          },
        ],
      },
    },
  }),
});

server.listen(process.env.PORT || 4001).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
