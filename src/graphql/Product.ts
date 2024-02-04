import { extendType, objectType } from "nexus";
import { NexusGenObjects } from "../../nexus-typegen";

export const ProductType = objectType({
    name: "Product",
    definition(t) {
        t.nonNull.int("id");
        t.nonNull.string("name");
        t.nonNull.string("description");
        t.nonNull.float("price");
    }
    });

let products:NexusGenObjects["Product"][] = [
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

export const productsQuery = extendType({
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("products", {
            type: "Product",
            resolve: (_parent,_args,_context,_info) => products
        });
    }
});