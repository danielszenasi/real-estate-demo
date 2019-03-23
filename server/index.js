const { Prisma } = require('prisma-binding')
const { ApolloServer, gql } = require('apollo-server-lambda')
const { typeDefs: td } = require('../src/lambda/generated/prisma-client/prisma-schema')

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
        listings: (parent, args, context, info) => {
            return context.prisma.query.artists({}, info)
        },
        hello: (_, { name }) => `Hello ${name || 'world'}`
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: req => ({
        ...req,
        prisma: new Prisma({
            typeDefs: td,
            endpoint: 'https://dsz-real-estate-0dedd42c3f.herokuapp.com/dsz-real-estate-service/dev',
        }),
    }),
})

exports.handler = server.createHandler()