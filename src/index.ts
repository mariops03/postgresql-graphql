import { ApolloServer } from "apollo-server";

import { schema } from "./schema";
import typeormConfig from "./typeorm.config";
import { Context } from "./types/Context";
import { auth } from "./middleware/auth";

const boot = async () => {

    const connection =  await typeormConfig.initialize();
    const server = new ApolloServer({
        schema,
        context: ({req}): Context => {
            const token = req.headers.authorization;
            auth(token);
            return { connection, userId: token? auth(token)?.userId : undefined}
        },
    });
    server.listen({ port: 3000 }).then(({ url }) => {
        console.log(`🚀 Server ready at ${url}`);
    });
}

boot();