const { ApolloServer } = require("apollo-server");
const { ApolloGateway } = require("@apollo/gateway");

const gateway = new ApolloGateway();

const start = async () => {
  const server = new ApolloServer({
    gateway
  });
  server.listen(process.env.PORT).then(({ url }) => {
    console.log(
      ` ⛷ - The Snowtooth Gateway running at ${url}`
    );
  });
};

start();
