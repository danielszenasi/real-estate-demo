
module.exports = {
    listings: (_, args, context, info) => {
        return context.prisma.query.listings({}, info)
    }
}