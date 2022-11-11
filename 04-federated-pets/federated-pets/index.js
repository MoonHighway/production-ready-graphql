const { ApolloServer, gql } = require("apollo-server");
const { readFileSync } = require("fs");
const { buildSubgraphSchema } = require("@apollo/subgraph");
const { data } = require("./sample-pets.json");

const typeDefs = gql(
  readFileSync("./typeDefs.graphql", "UTF-8")
);

const server = new ApolloServer({
  schema: buildSubgraphSchema({
    typeDefs,
    resolvers: {
      Pet: {
        __resolveReference({ id }) {
          console.log("resolving ref for pet: ", id);
          return data.allPets[5];
        },
      },
      Customer: {
        currentPets({ username }) {
          console.log("finding customer: ", username);
          return data.allPets.slice(2, 5);
        },
        checkoutHistory({ username }) {
          console.log("finding customer: ", username);
          return [
            {
              pet: data.allPets[3],
              late: false,
              checkOutDate: "2/02/2022 2:22 PM",
              checkInDate: "2/22/2022 2:22 PM",
            },
            {
              pet: data.allPets[4],
              late: true,
              checkOutDate: "2/02/2022 2:22 PM",
              checkInDate: "2/22/2022 2:22 PM",
            },
          ];
        },
      },
      Mutation: {
        checkOut: () => ({
          pet: data.allPets[0],
          checkOutDate: "2/22/2022 2:22PM",
        }),
        checkIn: () => ({
          pet: data.allPets[0],
          checkOutDate: "2/22/2022 2:22PM",
          checkInDate: "2/22/2022 2:22PM",
          late: false,
        }),
      },
      Query: {
        totalPets: () => data.allPets.length,
        allPets: () => data.allPets,
        petById(parent, { id }) {
          return data.allPets.find((p) => p.id === id);
        },
      },
    },
  }),
});

server.listen(process.env.PORT || 4002).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
