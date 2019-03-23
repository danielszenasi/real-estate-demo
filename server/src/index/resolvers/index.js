module.exports = {
    Query: {
        listings: (parent, args, context) => {
            return context.prisma.listings();
        }
    },
};