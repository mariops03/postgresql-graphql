import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Product } from "./entities/Product";

dotenv.config();

export default new DataSource({
    type: "postgres",
    url: process.env.CONNECTION_STRING,
    entities: [Product],
    synchronize: true,
});
