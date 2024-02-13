import * as jwt from 'jsonwebtoken';

export interface AuthToken {
    userId: number;
}

export const auth = (header: string | undefined): AuthToken | null => {
    if (!header) {
        return null;
    }
    const token = header.split(" ")[1];
    try {
        return jwt.verify(token, process.env.JWT_TOKEN as jwt.Secret) as AuthToken;
    } catch (e) {
        return null;
    }
}