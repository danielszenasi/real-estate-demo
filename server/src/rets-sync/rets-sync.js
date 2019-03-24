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

                    const buildingExists = await prisma.$exists.address({
                        AND: {
                            unit: listing.UnitNumber,
                            latitude: parseFloat(listing.Latitude),
                            longitude: parseFloat(listing.Longitude)
                        }
                    });

                    if (buildingExists) {
                        return false;
                    }

                    const address = {
                        ...parsed,
                        zip: listing.Zip,
                        latitude: parseFloat(listing.Latitude),
                        longitude: parseFloat(listing.Longitude),
                        unit: listing.UnitNumber,
                        city: listing.City,
                        images: listing.ImageListOriginal.split(','),
                        numberOfBathrooms: parseFloat(listing.NumBaths),
                        numberOfBedrooms: parseInt(listing.NumBedrooms),
                        numberOfRooms: parseFloat(listing.NumRooms),
                    }

                    let newListing = {
                        address: { create: { ...address } },
                        description: listing.MarketingDescription,
                        price: parseFloat(listing.OriginalPrice),
                        yearBuilt: parseInt(listing.YearBuilt),
                    }

                    const buildingExists = await prisma.$exists.building({
                        name: listing.BuildingName
                    });

                    if (buildingExists) {
                        newListing = {
                            ...newListing,
                            building: { connect: { name: listing.BuildingName } },
                        }
                    } else {
                        newListing = {
                            ...newListing,
                            building: { create: { name: listing.BuildingName } },
                        }
                    }

                    const neighborhoodExists = await prisma.$exists.neighborhood({
                        name: listing.Neighborhood
                    });

                    if (neighborhoodExists) {
                        newListing = {
                            ...newListing,
                            neighborhood: { connect: { name: listing.Neighborhood } },
                        }
                    } else {
                        newListing = {
                            ...newListing,
                            neighborhood: { create: { name: listing.Neighborhood } },
                        }
                    }

                    const propertyTypeExists = await prisma.$exists.propertyType({
                        name: listing.PropertyType
                    });

                    if (propertyTypeExists) {
                        newListing = {
                            ...newListing,
                            propertyType: { connect: { name: listing.PropertyType, } },
                        }
                    } else {
                        newListing = {
                            ...newListing,
                            propertyType: { create: { name: listing.PropertyType, } },
                        }
                    }

                    return prisma.createListing(newListing)
                }


                searchData.results.reduce(async (previousPromise, listing) => {
                    await previousPromise;
                    return insert(listing);
                }, Promise.resolve());

                callback(null, {
                    statusCode: 200,
                    body: "Hello, World"
                });
            })
    })


};