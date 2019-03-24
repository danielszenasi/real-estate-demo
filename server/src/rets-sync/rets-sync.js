const { prisma } = require("./generated/prisma-client");
const rets = require('rets-client');
const parserAddress = require('parse-address');

const { RETS_USERNAME, RETS_LOGIN_URL, RETS_PASSWORD } = process.env;

var clientSettings = {
    loginUrl: RETS_LOGIN_URL,
    username: RETS_USERNAME,
    password: RETS_PASSWORD,
    version: 'RETS/1.7',
    userAgent: 'RETS node-client/5.2',
    method: 'GET'
};

exports.handler = function (event, context, callback) {

    rets.getAutoLogoutClient(clientSettings, function (client) {

        client.search.query("Listing", "Listing", "(BuildingPets=1)", { limit: 100, offset: 0 })
            .then(function (searchData) {

                const insert = async listing => {
                    const parsed = parserAddress.parseLocation(listing.Address);
                    const address = {
                        ...parsed,
                        zip: listing.Zip,
                        latitude: listing.Latitude,
                        longitude: parseFloat(listing.Longitude),
                        number: parseFloat(listing.UnitNumber)
                    }
                    return prisma.createListing({
                        address: { create: { ...address } },
                        description: listing.MarketingDescription,
                        price: parseFloat(listing.OriginalPrice),
                        propertyType: listing.PropertyType,
                        yearBuilt: parseInt(listing.YearBuilt),
                    })
                }


                searchData.results.reduce(async (previousPromise, listing) => {
                    await previousPromise;
                    console.log(listing)
                    return insert(listing);
                }, Promise.resolve());

                callback(null, {
                    statusCode: 200,
                    body: "Hello, World"
                });
            })
    })


};