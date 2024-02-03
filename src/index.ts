import { ApolloServer } from "apollo-server";

import { schema } from "./schema";

const boot = () => {
    const server = new ApolloServer({
        schema
    });
    server.listen().then(({ url }) => {
        console.log(`🚀 Server ready at ${url}`);
    });
}

boot();