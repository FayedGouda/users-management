import jwt from 'jsonwebtoken';
export const genrateToken = (payload: Object, secretKey: string, options?: Object) => {
    return jwt.sign(payload, secretKey, options);
}