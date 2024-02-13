import { extendType, nonNull, stringArg, objectType } from "nexus";
import { User } from "../entities/User";
import { Context } from "../types/Context";
import argon2 from "argon2";
import * as jwt from "jsonwebtoken";

export const AuthType = objectType({
  name: "Auth",
  definition(t) {
    t.nonNull.string("token"),
      t.nonNull.field("user", {
        type: "User",
      });
  },
});

export const AuthMutation = extendType({
    type: "Mutation",
    definition(t) {
    t.nonNull.field("register", {
      type: "Auth",
      args: {
        username: nonNull(stringArg()),
        password: nonNull(stringArg()),
        email: nonNull(stringArg()),
      },
      resolve: async (_parent, args, context: Context, _info) => {
        const { username, password, email } = args;
        const hashedPassword = await argon2.hash(password);

        try {
            const result = await context.connection
                .createQueryBuilder()
                .insert()
                .into(User)
                .values({
                    username,
                    password: hashedPassword,
                    email,
                })
                .returning("*")
                .execute();

            const newUser = result.raw[0];

            const token = jwt.sign(
                { userId: newUser.id, username: newUser.username },
                process.env.JWT_TOKEN as jwt.Secret,
                {
                    expiresIn: "30m",
                }
            );

            return {
                user: newUser,
                token: token,
            };
        } catch (err) {
            throw new Error("Error while registering user");
        }
      }
    });
  },
});