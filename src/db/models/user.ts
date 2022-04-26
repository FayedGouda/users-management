import mongoose from 'mongoose';
import { ModelBase } from './ModelBase';
import bcrypt from 'bcrypt';
export interface User {
    isAdmin: Boolean,
    username: String,
    password: String,
    email: String,
    signupDate: Date,
    activated: Boolean,
}
export class UserModel extends ModelBase {
    name: string = 'User';
    model: mongoose.Model<any>;
    private static instance: UserModel;
    attributes: mongoose.Schema = new mongoose.Schema<User>({
        isAdmin: {
            type: Boolean,
            default: false
        },
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            lowercase: true,
            required: true,
            unique: true,
        },
        signupDate: {
            type: Date,
            default: Date.now
        },
        activated: {
            type: Boolean,
            default: false
        }
    });
    private constructor() {
        super();
        this.model = this.define();
    }
    define() {
        return mongoose.model<User>(this.name, this.attributes)
    }
    strongPassword(password: string): Boolean {
        console.log(password);
        const strongRegex = new RegExp(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,30})'
        );
        const result = strongRegex.test(password);
        // console.log(result);
        return result;
    }
    comparePassword(pass1: string, pass2: string) {
        return bcrypt.compare(pass1, pass2);

    }

    //Singleton approache
    static getInstance(): UserModel {
        if (!UserModel.instance) {
            UserModel.instance = new UserModel();
        }
        return UserModel.instance;
    }

}