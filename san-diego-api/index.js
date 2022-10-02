const { ApolloServer } = require("apollo-server");
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

const server = new ApolloServer({
  typeDefs,
  resolvers,
  mocks: true,
  mockEntireSchema: false,
});

server
  .listen({ port: process.env.PORT || 4000 })
  .then(({ url }) => {
    console.log(`Server running at ${url}`);
  });
