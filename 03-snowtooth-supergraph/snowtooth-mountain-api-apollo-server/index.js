const { ApolloServer } = require("@apollo/server");
const {
  startStandaloneServer,
} = require("@apollo/server/standalone");
const { ApolloGateway } = require("@apollo/gateway");

const gateway = new ApolloGateway();

async function startApolloServer() {
  const server = new ApolloServer({ gateway });
  const { url } = await startStandaloneServer(server, {
    listen: { port: 5000 },
  });
  console.log(`Server running at ${url}`);
}
startApolloServer();
