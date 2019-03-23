const { prisma } = require('../src/lambda/generated/prisma-client')
const { ApolloServer, gql } = require('apollo-server-lambda')

const typeDefs = gql`
  type Query {
    hello(name: String): String
    listings: [Listings]
  }

  type Listings {
    id: ID!
    description: String
  }
`

const resolvers = {
    Query: {
        listings: (parent, args, context) => {
            return context.prisma.listings()
        },
        hello: (_, { name }) => `Hello ${name || 'world'}`
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: {
        prisma,
    },
})

exports.handler = server.createHandler()