module.exports = /* GraphQL */ `
  type Query {
    listings: [Listings!]!
  }
  type Listings {
    id: ID!
  }
`;