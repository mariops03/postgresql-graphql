"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMutation = exports.AuthType = void 0;
const nexus_1 = require("nexus");
const User_1 = require("../entities/User");
const argon2_1 = __importDefault(require("argon2"));
const jwt = __importStar(require("jsonwebtoken"));
exports.AuthType = (0, nexus_1.objectType)({
    name: "Auth",
    definition(t) {
        t.nonNull.string("token"),
            t.nonNull.field("user", {
                type: "User",
            });
    },
});
exports.AuthMutation = (0, nexus_1.extendType)({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("login", {
            type: "Auth",
            args: {
                username: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                password: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
            },
            resolve: (_parent, args, context, _info) => __awaiter(this, void 0, void 0, function* () {
                const { username, password } = args;
                const user = yield context.connection.getRepository(User_1.User).findOne({
                    where: { username },
                });
                if (!user) {
                    throw new Error("Invalid login");
                }
                const valid = yield argon2_1.default.verify(user.password, password);
                if (!valid) {
                    throw new Error("Invalid login");
                }
                const token = jwt.sign({ userId: user.id }, process.env.JWT_TOKEN, {
                    expiresIn: "30m",
                });
                return {
                    user,
                    token,
                };
            }),
        });
        t.nonNull.field("register", {
            type: "Auth",
            args: {
                username: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                password: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                email: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
            },
            resolve: (_parent, args, context, _info) => __awaiter(this, void 0, void 0, function* () {
                const { username, password, email } = args;
                const hashedPassword = yield argon2_1.default.hash(password);
                try {
                    const result = yield context.connection
                        .createQueryBuilder()
                        .insert()
                        .into(User_1.User)
                        .values({
                        username,
                        password: hashedPassword,
                        email,
                    })
                        .returning("*")
                        .execute();
                    const newUser = result.raw[0];
                    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_TOKEN, {
                        expiresIn: "30m",
                    });
                    return {
                        user: newUser,
                        token: token,
                    };
                }
                catch (err) {
                    throw new Error("Error while registering user");
                }
            })
        });
    },
});
