const { ApolloServer } = require("@apollo/server");
const {
  startStandaloneServer,
} = require("@apollo/server/standalone");
const fs = require("fs");

const typeDefs = fs.readFileSync(
  "./typeDefs.graphql",
  "UTF-8"
);
const resolvers = {
  Query: {
    details: {
      population: 1415000,
      avgTemp: 73,
      sunshine: true,
    },
  },
};

async function startApolloServer() {
  const server = new ApolloServer({ typeDefs, resolvers });
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  console.log(`Server running at ${url}`);
}
startApolloServer();
