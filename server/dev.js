
const { GraphQLServer } = require("graphql-yoga");
const { prisma } = require("./src/index/generated/prisma-client");
const typeDefs = require("./src/index/schema");
const resolvers = require("./src/index/resolvers");

const server = new GraphQLServer({
    typeDefs,
    resolvers,
    context: {
        prisma
    }
});

server.start().then(() => {
    console.log("Server started on http://localhost:4000");
});