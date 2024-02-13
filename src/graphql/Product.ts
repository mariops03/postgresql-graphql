import { extendType, floatArg, nonNull, objectType, stringArg } from "nexus";
import { NexusGenObjects } from "../../nexus-typegen";
import { Product } from "../entities/Product";
import { Context } from "../types/Context";
import { User } from "../entities/User";

export const ProductType = objectType({
    name: "Product",
    definition(t) {
        t.nonNull.int("id");
        t.nonNull.string("name");
        t.nonNull.string("description");
        t.nonNull.float("price");
        t.nonNull.int("creatorId");
        t.field("creator", {
            type: "User",
            resolve: (parent, _args, context: Context, _info) : Promise<User | null> => {
                return User.findOne({ where: { id: Number(parent.creatorId) } });
            }
        });
    }
    });

export const productsQuery = extendType({
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("products", {
            type: "Product",
            resolve: async (_parent, _args, context: Context, _info) : Promise<NexusGenObjects['Product'][]> => {
                const { connection } = context;
                const products = await connection.getRepository(Product).find();
                return products;
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
            resolve: async (_parent, args, context : Context, _info) : Promise<NexusGenObjects['Product']> => {
                const {name, description, price} = args;
                const { userId } = context;
                if (!userId) {
                    throw new Error("Unauthorized");
                }
            
                return Product.create({ name, description, price, creatorId: Number(userId) }).save();
            }
            
        })
    },
});
    