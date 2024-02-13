"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProduct = exports.productsQuery = exports.ProductType = void 0;
const nexus_1 = require("nexus");
const Product_1 = require("../entities/Product");
const User_1 = require("../entities/User");
exports.ProductType = (0, nexus_1.objectType)({
    name: "Product",
    definition(t) {
        t.nonNull.int("id");
        t.nonNull.string("name");
        t.nonNull.string("description");
        t.nonNull.float("price");
        t.nonNull.int("creatorId");
        t.field("creator", {
            type: "User",
            resolve: (parent, _args, context, _info) => {
                return User_1.User.findOne({ where: { id: Number(parent.creatorId) } });
            }
        });
    }
});
exports.productsQuery = (0, nexus_1.extendType)({
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("products", {
            type: "Product",
            resolve: (_parent, _args, context, _info) => __awaiter(this, void 0, void 0, function* () {
                const { connection } = context;
                const products = yield connection.getRepository(Product_1.Product).find();
                return products;
            })
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
            resolve: (_parent, args, context, _info) => __awaiter(this, void 0, void 0, function* () {
                const { name, description, price } = args;
                const { userId } = context;
                if (!userId) {
                    throw new Error("Unauthorized");
                }
                return Product_1.Product.create({ name, description, price, creatorId: Number(userId) }).save();
            })
        });
    },
});
