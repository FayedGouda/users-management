import express from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { genrateToken } from '../helpers/genrateToken';
import { UserModel } from "../db/models/user";
import { NextFunction } from 'express';
import sendEmail from "../helpers/send-email"; 
import { verify } from "../helpers/TokenVerifcation";
;
export class UserController {
    user: UserModel | any;
    jwtSecretKey = process.env.JWT_TOKEN_SECRET;
    jwtActivationKey = process.env.JWT_TOKEN_ACTIVATION;
    constructor(private usermodel: UserModel | any) {
        this.user = usermodel;
    }
    public async signup(body: {
        password: string,
        email: string,
        username: string,
    }): Promise<string> {
        const strongRegex = new RegExp(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,30})'
        );
        if (!strongRegex.test(body.password)) throw new Error("Password should be complex");
        const user1 = await this.user.model.findOne({
            'email': body.email
        });
        if (user1) throw new Error('This mail already exists.');
        const salt = await bcrypt.genSalt(10);
        let password = await bcrypt.hash(body.password, salt);
        const newUser = await this.user.model.create({ password, username: body.username, email: body.email });
        const token = jwt.sign({
            email: newUser.email,
            id: newUser._id
        },
            this.jwtActivationKey, { expiresIn: '5m' }
        );
        sendEmail(newUser, token);
        return 'Check your inbox to activate your account in the next five menets.';
    }

    public async login(body: {
        password: string,
        email: string
    }) {
        if (!(body.email || body.password)) {
            throw new Error("No provided username or password");
        }
        const user2 = await this.user.model.findOne({
            email: body.email
        })
            .select("email password _id isAdmin activated");
        if (!user2) throw new Error("Invalid email or password");
        if (!user2.activated) throw new Error("Invalid email or password");
        //Now we've found that user
        //we need next to check for his password and see if it's correct
        const validPassword = await this.user.comparePassword(body.password, user2.password);
        if (!validPassword)
            throw new Error("Invalid email or password");
        // if (!user.activate) return res.send("Account hasn't been activated yet, please check your email to complete activation");
        const token = genrateToken({
            email: user2.email,
            _id: user2._id,
            isAdmin: user2.isAdmin
        },
            this.jwtSecretKey
        );
        return token;
    }

    public async activate(token:string) {
       
        if (!token)
            throw new Error('No provided token');
        try {
            const decoded = await verify(token, this.jwtActivationKey);
            const result = await this.user.model.findOneAndUpdate({ _id: decoded.id }, { activated: true });
                if (!result) {
                    throw new Error("Could not activate account");
                }
                else {
                    return('Account activated successfully');
                }
        } catch (error) {
            throw error;
        }
    }

    public async forgetPass(req: express.Request, res: express.Response, next: NextFunction) {
        const user1 = await this.user.model.findOne({
            email: req.body.email
        })
            .select("email password _id activated");
        if (!user1) return res.status(400).send('Incorrect email');
        if (!user1.activated) return res.status(401).send('This account is not activated');


    }
    public async changePass(req:express.Request) {
        const user2 = await this.user.model.findOne({
            email: req.currentUser.email
        })
            .select("password");
        const validPassword = await this.user.comparePassword(req.body.oldPassword, user2.password);
        if (!validPassword)
            throw new Error("Old password is wrong");
        if (!this.user.strongPassword(req.body.newPassword))
            throw new Error("New password should be complex");
        if (req.body.newPassword === req.body.oldPassword)
            throw new Error("New password should be different");
        const salt = await bcrypt.genSalt(10);
        let newPassword = await bcrypt.hash(req.body.newPassword, salt);
        const result = await this.user.model.findOneAndUpdate({ email: req.currentUser.email }, { password: newPassword };
            
            
            if (!result) {
                throw new Error("Could not find user")
            }
            else {
                return ('Password changed successfully');
            }
    }
}