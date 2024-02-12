import { extendType, floatArg, nonNull, objectType, stringArg } from "nexus";
import { NexusGenObjects } from "../../nexus-typegen";
import { Product } from "../entities/Product";
import { Context } from "../types/Context";

export const ProductType = objectType({
    name: "Product",
    definition(t) {
        t.nonNull.int("id");
        t.nonNull.string("name");
        t.nonNull.string("description");
        t.nonNull.float("price");
    }
    });



export const productsQuery = extendType({
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("products", {
            type: "Product",
            resolve: (_parent,_args,context : Context,_info) : Promise<Product[]> => {
                const { connection } = context;
                return connection.query("SELECT * FROM product");
            }
        });
    }
});

export const CreateProduct = extendType({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("createProduct", {
            type: "Product",
            args: {
                name: nonNull(stringArg()),
                description: nonNull(stringArg()),
                price: nonNull(floatArg())
            },
            resolve: (_parent, args, _context, _info) : Promise<Product> => {
                const {name, description, price} = args;
                return Product.create({name, description, price}).save();
            }
        })
    },
});
    