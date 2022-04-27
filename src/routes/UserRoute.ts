import {Request, Response, Router} from "express";
import { RouteBase } from "./RouteBase";
import { UserController } from '../controllers/users';
import { Auth } from '../middlewares/auth';
import { UserModel } from "../db/models/user";
export class UserRoute implements RouteBase {
    routeName: string;
    routeObject: Router;
    userAuth = new Auth();
    userController: UserController = new UserController(UserModel.getInstance());
    constructor() {
        this.routeName = '/api/users';
        this.routeObject = Router();
        this.initRoutes();
    }
    initRoutes() {
        this.routeObject.post('/signup', this.signup);
        this.routeObject.post('/login', this.login);
        this.routeObject.get('/activate', this.activate);
        this.routeObject.put('/changepassword', this.userAuth.isAuth, this.changepassword);

    }
    

    signup = async (req: Request, res: Response) => {
        try {
            const resMessage = await this.userController.signup(req.body);
            res.status(201).json({ success: true, message: resMessage });
        } catch (error: any) {
            console.log('error', error);
            res.status(400).json({ success: false, message: error.message });
        }
    }
    activate = async (req: Request, res: Response) => {
        try {
            const resMessage = await this.userController.activate(req.query.token);
            res.json({ success: true, message: resMessage });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
    login = async (req: Request, res: Response) => {
        try {
            const resMessage = await this.userController.login(req.body);
            res.header('x-auth-token', resMessage);
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
    changepassword = async (req:Request, res:Response) => {
        try {
            const resMessage = await this.userController.changePass(req);
            res.json({ success: true, message: resMessage });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}