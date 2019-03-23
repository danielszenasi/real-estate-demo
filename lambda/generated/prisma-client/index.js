"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_lib_1 = require("prisma-client-lib");
var typeDefs = require("./prisma-schema").typeDefs;

var models = [
  {
    name: "Address",
    embedded: false
  },
  {
    name: "Listing",
    embedded: false
  },
  {
    name: "Building",
    embedded: false
  },
  {
    name: "Neighborhood",
    embedded: false
  }
];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: `https://dsz-real-estate-0dedd42c3f.herokuapp.com/dsz-real-estate-service/dev`
});
exports.prisma = new exports.Prisma();
