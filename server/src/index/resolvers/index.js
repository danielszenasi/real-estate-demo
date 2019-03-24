const GraphQLJSON = require('graphql-type-json');
const numeral = require('numeral');

module.exports = {
    Query: {
        listings: (parent, args, context) => {
            return context.prisma.listings();
        }
    },
    JSON: GraphQLJSON,
    Listing: {
        address: (parent, { id }, context) => {
            return context.prisma
                .listing({
                    id: parent.id
                })
                .address();
        },
        priceFormatted: parent => numeral(parent.price).format('$ 0,0[.]00'),
    },
    Address: {
        display: parent => {
            var Directional = {
                "N": "North",
                "NE": "Northeast",
                "E": "East",
                "SE": "Southeast",
                "S": "South",
                "SW": "Southwest",
                "W": "West",
                "NW": "Northwest",
            };

            const prefix = parent.prefix ? Directional[parent.prefix] ? Directional[parent.prefix] : parent.prefix : ''

            return `${parent.number} ${prefix} ${parent.street} ${parent.type} ${parent.unit}`
        }
    }
};