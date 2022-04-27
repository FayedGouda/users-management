
import jwt from 'jsonwebtoken';
export function verify(token: string, secret: string) {
    return new Promise<any>((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                reject(err);
            }
            resolve(decoded);
        });
    });
}