const { prisma } = require('../generated/prisma-client')

exports.handler = async function (event, context, callback) {
  const body = JSON.stringify(await prisma.listings());
  callback(null, {
    statusCode: 200,
    body,
  });
};