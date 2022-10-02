const { ApolloServer, gql } = require("apollo-server");
const { buildSubgraphSchema } = require("@apollo/subgraph");
const lifts = require("./lift-data.json");
const fs = require("fs");

const gqlFile = fs.readFileSync("./lifts-schema.graphql", "UTF-8")
const typeDefs = gql(gqlFile)

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

const server = new ApolloServer({
  schema: buildSubgraphSchema({
    typeDefs,
    resolvers,
  }),
});

server.listen(process.env.PORT).then(({ url }) => {
  console.log(
    `🚠 Snowtooth Lift Service running at ${url}`
  );
});
