import express from 'express';
import { RouteBase } from "./routes/RouteBase";
import { UserRoute } from './routes/UserRoute';
import { DBConnect } from './db/db';
import errorMiddleWare from './middlewares/errorMiddleware';
import errors from './helpers/errors';
import { logger } from './helpers/logger';
const bodyParser = require('body-parser');
export class App {

    app: express.Application;
    private db: DBConnect;
    constructor() {
        //Load configurations from .env file to process.env
        require('dotenv').config();

        //Database connectoin
        this.db = new DBConnect();
        this.app = express();

        // create application/x-www-form-urlencoded parser
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));

        this.initMiddelWars();
    }

    listen() {
        const PORT = process.env.PORT || 3000;
        this.app.listen(PORT, () => {
            logger.info('Listining on port:' + PORT);
        });
    }
    initMiddelWars() {
        this.db.initial();

        // this.app.use(morgan('combined'));
        errors();
        const routes: RouteBase[] = [
            new UserRoute(),
        ];
        routes.forEach(route => {
            this.app.use(route.routeName, route.routeObject);
        });
        this.app.use('*', errorMiddleWare);
    }
}