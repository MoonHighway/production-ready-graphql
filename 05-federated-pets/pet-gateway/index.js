const { ApolloServer } = require("apollo-server");
const {
  ApolloGateway,
  IntrospectAndCompose,
} = require("@apollo/gateway");

const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      {
        name: "pets",
        url: "https://federated-mock-pets.herokuapp.com",
      },
      {
        name: "customers",
        url: "https://federated-mock-customers.herokuapp.com",
      },
    ],
  }),
});

const start = async () => {
  const server = new ApolloServer({
    gateway,
  });
  server.listen(process.env.PORT).then(({ url }) => {
    console.log(
      ` ⛷ - The Snowtooth Gateway running at ${url}`
    );
  });
};

start();
