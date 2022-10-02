const { ApolloServer, gql } = require("apollo-server");
const { buildSubgraphSchema } = require("@apollo/subgraph");
const trails = require("./trail-data.json");
const findEasiestTrail = require("./findEasiestTrail");
const fs = require("fs");

const gqlFile = fs.readFileSync("./trails-schema.graphql", "UTF-8");
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

const server = new ApolloServer({
  schema: buildSubgraphSchema({
    typeDefs,
    resolvers,
  }),
});

server.listen(process.env.PORT).then(({ url }) => {
  console.log(
    `🏔 Snowtooth - trail Service running at ${url}`
  );
});
