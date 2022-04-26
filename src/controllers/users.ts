import express from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { genrateToken, verifyToken } from '../helpers/genrateToken';
import { UserModel } from "../db/models/user";
import { errorHandler } from '../helpers/errorHandler';
import { NextFunction } from 'express';
import sendEmail from "../helpers/send-email";
const user = UserModel.getInstance();
const jwtSecretKey: string = process.env.JWT_TOKEN_SECRET;
const jwtActivationKey: string = process.env.JWT_TOKEN_ACTIVATION;
export class UserCon {

    public async signup(req: express.Request, res: express.Response, next: NextFunction) {
        if (!user.strongPassword(req.body.password))
            return res.status(400).send("Password should be complex");
        const user1 = await user.model.findOne({
            'email': req.body.email
        });
        if (user1) return res.status(400).send('This mail already exists.');
        const salt = await bcrypt.genSalt(10);
        let password = await bcrypt.hash(req.body.password, salt);
        const newUser = await user.model.create({ password, username: req.body.username, email: req.body.email });
        const token = genrateToken({
            email: newUser.email,
            id: newUser._id
        }, jwtActivationKey, { expiresIn: '5m' });
        sendEmail(newUser, token);
        res.send('Check your inbox to activate your account in the next five menets.');
        // next(new Error('Could not send a verfication mail!'));
    }

    public async login(req: express.Request, res: express.Response) {
        if (!(req.body.email || req.body.password)) {
            return res.status(400).send("No provided username or password");
        }
        const user2 = await user.model.findOne({
            email: req.body.email
        })
            .select("email password _id isAdmin activated");

        if (!user2) return res.status(400).send("Invalid email or password");
        if (!user2.activated) return res.status(401).send('This account is not activated');
        //Now we've found that user
        //we need next to check for his password and see if it's correct
        const validPassword = await user.comparePassword(req.body.password, user2.password);
        if (!validPassword)
            return res.status(400).send("Invalid email or password");
        // if (!user.activate) return res.send("Account hasn't been activated yet, please check your email to complete activation");
        const token = genrateToken({
            email: user2.email,
            id: user2._id
        }, jwtSecretKey, {});
        res.header('x-auth-token', token).send('Done');
    }

    public async activate(req: express.Request, res: express.Response, next: NextFunction) {
        const token = req.query.token;
        if (!token)
            return res.status(401).send('No provided token');
        jwt.verify(token, jwtActivationKey, (err, decoded) => {
            if (err)
                return res.status(401).send('Invalid token');
            errorHandler.handleError(err);
            user.model.findOneAndUpdate({ _id: decoded.id }, { activated: true }, (err, result) => {
                if (err) {
                    return errorHandler.handleError(err);
                }
                if (!result) {
                    next(new Error('User not found'));
                }
                else {
                    res.send('Account activated successfully');
                }
            })
        });
    }

    public async forgetPass(req: Request, res: Response, next: NextFunction) {
        const user1 = await user.model.findOne({
            email: req.body.email
        })
            .select("email password _id activated");
        if (!user1) return res.status(400).send('Incorrect email');
        if (!user1.activated) return res.status(401).send('This account is not activated');


    }
    public async changePass(req: Request, res: Response, next: NextFunction) {
        const user2 = await user.model.findOne({
            email: req.currentUser.email
        })
            .select("password");
        const validPassword = await user.comparePassword(req.body.oldPassword, user2.password);
        if (!validPassword)
            return res.status(400).send("Old password is wrong");
        if (!user.strongPassword(req.body.newPassword))
            return res.status(400).send("New password should be complex");
        if (req.body.newPassword === req.body.oldPassword)
            return res.status(400).send("New password should be different");
        const salt = await bcrypt.genSalt(10);
        let newPassword = await bcrypt.hash(req.body.newPassword, salt);
        user.model.findOneAndUpdate({ email: req.currentUser.email }, { password: newPassword }, (err, result) => {
            if (err) {
                return errorHandler.handleError(err);
            }
            else {
                res.send('Password changed successfully');
            }
        });
    }
}
