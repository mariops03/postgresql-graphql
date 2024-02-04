import { makeSchema } from "nexus";
import { join } from "path";
import * as tipos from "./graphql"

export const schema = makeSchema({
  types: tipos,
  outputs: {
    schema: join(process.cwd(), "schema.graphql"),
    typegen: join(process.cwd(), "nexus-typegen.ts"),
  },
});

