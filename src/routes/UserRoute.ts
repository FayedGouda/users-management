import express from "express";
import { RouteBase } from "./RouteBase";
import { UserCon } from '../controllers/users';
import { Auth } from '../middlewares/auth';
let userAuth = new Auth();
let userController = new UserCon();
export class UserRoute implements RouteBase {
    routeName: string;
    routeObject: express.Router;
    constructor() {
        this.routeName = '/api/users';
        this.routeObject = express.Router();
        this.initRoutes();
    }
    initRoutes() {
        this.routeObject.post('/signup', userController.signup);
        this.routeObject.post('/login', userController.login);
        this.routeObject.get('/activate', userController.activate);
        this.routeObject.put('/forgetpassword', userController.forgetPass);
        this.routeObject.put('/changepassword', userAuth.isAuth, userController.changePass);
    }
}