const { ApolloServer } = require("@apollo/server");
const {
  startStandaloneServer,
} = require("@apollo/server/standalone");
const { buildSubgraphSchema } = require("@apollo/subgraph");
const { gql } = require("graphql-tag");
const trails = require("./trail-data.json");
const findEasiestTrail = require("./findEasiestTrail");
const fs = require("fs");

const gqlFile = fs.readFileSync(
  "./trails-schema.graphql",
  "UTF-8"
);
const typeDefs = gql(gqlFile);

const resolvers = {
  Query: {
    allTrails: (root, { status }) =>
      !status
        ? trails
        : trails.filter((trail) => trail.status === status),
    Trail: (root, { id }) =>
      trails.find((trail) => id === trail.id),
    trailCount: (root, { status }) =>
      !status
        ? trails.length
        : trails.filter((trail) => trail.status === status)
            .length,
  },
  Mutation: {
    setTrailStatus: (root, { id, status }) => {
      let updatedTrail = trails.find(
        (trail) => id === trail.id
      );
      updatedTrail.status = status;
      return updatedTrail;
    },
  },
  Trail: {
    __resolveReference: (reference) =>
      trails.find((trail) => trail.id === reference.id),
  },
  Lift: {
    easyWayDown: (lift) => {
      const waysDown = trails.filter((trail) =>
        trail.lift.includes(lift.id)
      );
      return findEasiestTrail(waysDown);
    },
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
