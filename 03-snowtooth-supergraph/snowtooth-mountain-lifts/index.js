const { ApolloServer } = require("@apollo/server");
const {
  startStandaloneServer,
} = require("@apollo/server/standalone");
const { buildSubgraphSchema } = require("@apollo/subgraph");
const { gql } = require("graphql-tag");
const lifts = require("./lift-data.json");
const fs = require("fs");

const gqlFile = fs.readFileSync(
  "./lifts-schema.graphql",
  "UTF-8"
);
const typeDefs = gql(gqlFile);

const resolvers = {
  Query: {
    allLifts: (root, { status }) =>
      !status
        ? lifts
        : lifts.filter((lift) => lift.status === status),
    Lift: (root, { id }) =>
      lifts.find((lift) => id === lift.id),
    liftCount: (root, { status }) =>
      !status
        ? lifts.length
        : lifts.filter((lift) => lift.status === status)
            .length,
  },
  Mutation: {
    setLiftStatus: (root, { id, status }) => {
      let updatedLift = lifts.find(
        (lift) => id === lift.id
      );
      updatedLift.status = status;
      return updatedLift;
    },
  },
  Trail: {
    liftAccess: (trail) =>
      lifts.filter((lift) =>
        lift.trails.includes(trail.id)
      ),
  },
  Lift: {
    trailAccess: (lift) =>
      lift.trails.map((id) => ({
        __typename: "Trail",
        id,
      })),
    __resolveReference: ({ id }) =>
      lifts.find((lift) => lift.id === id),
  },
};

async function startApolloServer() {
  const server = new ApolloServer({
    schema: buildSubgraphSchema({
      typeDefs,
      resolvers,
    }),
  });
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  console.log(`Server running at ${url}`);
}
startApolloServer();
