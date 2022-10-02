const { ApolloServer, gql } = require("apollo-server");
const { GraphQLScalarType } = require("graphql");
const fs = require("fs")

const lifts = require("./data/lifts.json");
const trails = require("./data/trails.json");

const typeDefs = fs.readFileSync("./typeDefs.graphql", "UTF-8")
const resolvers = {
  Query: {
    allLifts: (parent, { status }) =>
      !status ? lifts : lifts.filter(lift => lift.status === status),
    findLiftById: (parent, { id }) => lifts.find(lift => id === lift.id),
    liftCount: (parent, { status }) =>
      !status
        ? lifts.length
        : lifts.filter(lift => lift.status === status).length,
    allTrails: (parent, { status }) =>
      !status ? trails : trails.filter(trail => trail.status === status),
    findTrailByName: (parent, { name }) =>
      trails.find(trail => name === trail.name),
    trailCount: (parent, { status }) =>
      !status
        ? trails.length
        : trails.filter(trail => trail.status === status).length
  },
  Mutation: {
    setLiftStatus: (parent, { id, status }) => {
      let updatedLift = lifts.find(lift => id === lift.id);
      updatedLift.status = status;
      return {
        lift: updatedLift,
        changed: new Date()
      };
    },
    setTrailStatus: (parent, { id, status }) => {
      let updatedTrail = trails.find(trail => id === trail.id);
      updatedTrail.status = status;
      return updatedTrail;
    }
  },
  Lift: {
    trailAccess: parent =>
      parent.trails.map(id => trails.find(t => id === t.id))
  },
  Trail: {
    accessedByLifts: parent =>
      parent.lift.map(id => lifts.find(l => id === l.id))
  },
  DateTime: new GraphQLScalarType({
    name: "DateTime",
    description: "A valid date time value.",
    parseValue: value => new Date(value),
    serialize: value => new Date(value).toISOString(),
    parseLiteral: ast => new Date(ast.value)
  })
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen({port: process.env.PORT || 4000}).then(({ url }) => {
  console.log(`Server running at ${url}`);
});