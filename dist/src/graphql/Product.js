"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProduct = exports.productsQuery = exports.ProductType = void 0;
const nexus_1 = require("nexus");
const Product_1 = require("../entities/Product");
exports.ProductType = (0, nexus_1.objectType)({
    name: "Product",
    definition(t) {
        t.nonNull.int("id");
        t.nonNull.string("name");
        t.nonNull.string("description");
        t.nonNull.float("price");
    }
});
exports.productsQuery = (0, nexus_1.extendType)({
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("products", {
            type: "Product",
            resolve: (_parent, _args, context, _info) => {
                const { connection } = context;
                return connection.query("SELECT * FROM product");
            }
        });
    }
});
exports.CreateProduct = (0, nexus_1.extendType)({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("createProduct", {
            type: "Product",
            args: {
                name: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                description: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                price: (0, nexus_1.nonNull)((0, nexus_1.floatArg)())
            },
            resolve: (_parent, args, _context, _info) => {
                const { name, description, price } = args;
                return Product_1.Product.create({ name, description, price }).save();
            }
        });
    },
});
