import { DataSource } from "typeorm";

export type Context = {
    connection: DataSource;
    userId?: number | undefined;
};