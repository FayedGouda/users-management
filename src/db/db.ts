import { logger } from "../helpers/logger";
const mongoose = require('mongoose');

export class DBConnect {
    // mongoDB_URI: string;
    initial() {
        const mongoDB_URI = process.env.DATABASE_URI;
        console.log(mongoDB_URI);
        mongoose.connect(mongoDB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
            .then(() => {
                logger.debug('Connected to mongoDB');
            });
    }
}