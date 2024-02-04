"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsQuery = exports.ProductType = void 0;
const nexus_1 = require("nexus");
exports.ProductType = (0, nexus_1.objectType)({
    name: "Product",
    definition(t) {
        t.nonNull.int("id");
        t.nonNull.string("name");
        t.nonNull.string("description");
        t.nonNull.float("price");
    }
});
let products = [
    {
        id: 1,
        name: "Product 1",
        description: "Description of product 1",
        price: 100.0
    },
    {
        id: 2,
        name: "Product 2",
        description: "Description of product 2",
        price: 200.0
    },
    {
        id: 3,
        name: "Product 3",
        description: "Description of product 3",
        price: 300.0
    },
    {
        id: 4,
        name: "Product 4",
        description: "Description of product 4",
        price: 400.0
    },
    {
        id: 5,
        name: "Product 5",
        description: "Description of product 5",
        price: 500.0
    }
];
exports.productsQuery = (0, nexus_1.extendType)({
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("products", {
            type: "Product",
            resolve: () => products
        });
    }
});
