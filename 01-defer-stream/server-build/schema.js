"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
const graphql_1 = require("graphql");
const sleep = (t = 1000) => new Promise(res => setTimeout(res, t));
const Cat = new graphql_1.GraphQLObjectType({
    name: "Cat",
    fields: {
        name: {
            type: graphql_1.GraphQLString,
            resolve: () => "Biscuit"
        },
        hangingInThere: {
            type: graphql_1.GraphQLBoolean,
            resolve: () => true
        },
        favoriteColor: {
            type: graphql_1.GraphQLString,
            resolve: async () => {
                await sleep(5000);
                return "green!";
            }
        }
    }
});
const Query = new graphql_1.GraphQLObjectType({
    name: "Query",
    fields: {
        catInformation: {
            type: Cat,
            resolve: () => ({})
        },
        streamCats: {
            type: graphql_1.GraphQLList(graphql_1.GraphQLString),
            resolve: async function* () {
                for (const item of ["Biscuit", "Jungle", "Ovi"]) {
                    yield item;
                    await sleep(2000);
                }
            }
        }
    }
});
exports.schema = new graphql_1.GraphQLSchema({
    query: Query,
    directives: [...graphql_1.specifiedDirectives]
});
