module.exports = `
  type Query {
    info: String!
    listings: [Listings]!
  }
  type Listings {
    id: ID!
    description: String
  }

`