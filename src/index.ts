import { ApolloServer } from "apollo-server";

import { schema } from "./schema";
import typeormConfig from "./typeorm.config";

const boot = async () => {

    await typeormConfig.initialize();
    const server = new ApolloServer({
        schema
    });
    server.listen({ port: 3000 }).then(({ url }) => {
        console.log(`🚀 Server ready at ${url}`);
    });
}

boot();