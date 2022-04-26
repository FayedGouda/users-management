import jwt from 'jsonwebtoken';
import express from 'express';
const jwtSecretKey = process.env.JWT_TOKEN_SECRET;
export class Auth {

    public isAuth(req: express.Request, res: express.Response, next) {
        const token = req.headers['x-auth-token'];
        // console.log(token);
        if (token) {
            jwt.verify(token, jwtSecretKey, (err, decoded) => {
                if (err) {
                    console.log(err);
                    res.status(401).send('Invalid token');
                } else {
                    req.currentUser = decoded;
                    //next takes you to the next middleware(route)
                    //NOTE :NEXT ROUTE WOULD NOT BE ACCESSED IF THE TOKEN IS NOT AUTHENTICATED(VERIFIED)
                    next();
                }
            });
        } else {
            res.status(401).send('No provided token');
        }
    }
    // public isAdmin(req: express.Request, res: express.Response, next) {
    //     if (!req.currentUser.isAdmin) return res.status(403).send('Access Denied');
    //     next();
    // }
}